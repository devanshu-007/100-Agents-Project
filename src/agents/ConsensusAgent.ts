import Groq from 'groq-sdk';
import { TavilyClient } from 'tavily';

// Define the structure for a response from an AI model
interface ModelResponse {
  content: string;
  model: string;
  timestamp: Date;
  sources?: any[]; // To hold Tavily search results
}

// Configuration for a specific language model
interface LanguageModelConfig {
  modelName: string;
  temperature: number;
  maxTokens: number;
}

// Configuration for the ConsensusAgent itself
interface ConsensusAgentConfig {
  primaryModel: LanguageModelConfig;
  secondaryModel: LanguageModelConfig;
  fallbackModel: LanguageModelConfig; // New fallback option
  similarityThreshold: number; // e.g., 0.5 for 50% similarity
}

class ConsensusAgent {
  private groqClient: Groq;
  private tavilyClient: TavilyClient;
  private config: ConsensusAgentConfig;

  constructor(config: ConsensusAgentConfig) {
    const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || 'YOUR_GROQ_API_KEY';
    const tavilyApiKey = import.meta.env.VITE_TAVILY_API_KEY || 'YOUR_TAVILY_API_KEY';
    
    this.groqClient = new Groq({ apiKey: groqApiKey, dangerouslyAllowBrowser: true });
    this.tavilyClient = new TavilyClient({ apiKey: tavilyApiKey });
    this.config = config;
  }

  private async queryLanguageModel(
    modelConfig: LanguageModelConfig,
    prompt: string
  ): Promise<ModelResponse> {
    try {
      const chatCompletion = await this.groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: modelConfig.modelName,
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.maxTokens,
      });

      return {
        content: chatCompletion.choices[0]?.message?.content || '',
        model: modelConfig.modelName,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(`Error querying ${modelConfig.modelName}:`, error);
      throw new Error(`Failed to get response from ${modelConfig.modelName}.`);
    }
  }

  private calculateSimilarity(textA: string, textB: string): number {
    const setA = new Set(textA.toLowerCase().split(/\s+/));
    const setB = new Set(textB.toLowerCase().split(/\s+/));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size === 0 ? 1 : intersection.size / union.size;
  }

  private selectBestResponse(
    primary: ModelResponse,
    secondary: ModelResponse
  ): ModelResponse {
    const similarity = this.calculateSimilarity(primary.content, secondary.content);

    if (similarity >= this.config.similarityThreshold) {
      // If responses are similar enough, prefer the primary model's response.
      return primary;
    }

    // If responses are too different, combine them to show both perspectives.
    return {
      content: `---
      \n**Perspective 1 (${primary.model}):**\n${primary.content}
      \n---\n
      \n**Perspective 2 (${secondary.model}):**\n${secondary.content}`,
      model: `${primary.model} + ${secondary.model}`,
      timestamp: new Date(),
    };
  }

  private createPromptWithContext(prompt: string, context: any[]): string {
    const contextString = context.map((item, index) => `[${index + 1}] ${item.title}: ${item.snippet}`).join('\n');
    return `Based on the following search results:\n\n${contextString}\n\nPlease provide a comprehensive answer to the user's question: "${prompt}"`;
  }

  private async queryLanguageModelWithFallback(
    modelConfig: LanguageModelConfig,
    prompt: string,
    isFallback: boolean = false
  ): Promise<ModelResponse> {
    try {
      return await this.queryLanguageModel(modelConfig, prompt);
    } catch (error) {
      if (!isFallback) {
        console.warn(`Primary model ${modelConfig.modelName} failed, trying fallback...`);
        return await this.queryLanguageModelWithFallback(this.config.fallbackModel, prompt, true);
      }
      console.error(`Fallback model also failed:`, error);
      throw new Error(`Both primary and fallback models failed for ${modelConfig.modelName}.`);
    }
  }

  public async generateConsensusResponse(prompt: string): Promise<ModelResponse> {
    try {
      // Step 1: Perform a web search for context
      const searchContext = await this.tavilyClient.search({ query: prompt, max_results: 5 });

      // Step 2: Create a new prompt that includes the search context
      const contextualPrompt = this.createPromptWithContext(prompt, searchContext.results);

      // Step 3: Query the models with the enhanced prompt (with fallback)
      const [primaryResponse, secondaryResponse] = await Promise.all([
        this.queryLanguageModelWithFallback(this.config.primaryModel, contextualPrompt),
        this.queryLanguageModelWithFallback(this.config.secondaryModel, contextualPrompt),
      ]);

      const finalResponse = this.selectBestResponse(primaryResponse, secondaryResponse);
      finalResponse.sources = searchContext.results; // Attach sources to the final response
      return finalResponse;

    } catch (error) {
      console.error('Error generating consensus response:', error);
      throw new Error('Failed to generate a consensus response from the models.');
    }
  }

  public async *generateConsensusResponseStream(
    prompt: string,
    onToken?: (token: string) => void
  ): AsyncGenerator<string, ModelResponse> {
    try {
      // Step 1: Perform a web search for context
      const searchContext = await this.tavilyClient.search({ query: prompt, max_results: 5 });

      // Step 2: Create a new prompt that includes the search context
      const contextualPrompt = this.createPromptWithContext(prompt, searchContext.results);

      // Step 3: Use primary model for streaming (fallback to secondary if needed)
      let fullContent = '';
      try {
        const chatCompletion = await this.groqClient.chat.completions.create({
          messages: [{ role: 'user', content: contextualPrompt }],
          model: this.config.primaryModel.modelName,
          temperature: this.config.primaryModel.temperature,
          max_tokens: this.config.primaryModel.maxTokens,
          stream: true,
        });

        for await (const chunk of chatCompletion) {
          const token = chunk.choices[0]?.delta?.content || '';
          if (token) {
            fullContent += token;
            onToken?.(token);
            yield token;
          }
        }

        return {
          content: fullContent,
          model: this.config.primaryModel.modelName,
          timestamp: new Date(),
          sources: searchContext.results,
        };

      } catch (error) {
        console.warn('Streaming failed, falling back to regular response...');
        return await this.generateConsensusResponse(prompt);
      }

    } catch (error) {
      console.error('Error generating streaming response:', error);
      throw new Error('Failed to generate a streaming response.');
    }
  }
}

export default ConsensusAgent; 