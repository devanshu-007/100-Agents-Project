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
  tertiaryModel: LanguageModelConfig; // NEW: Third model for advanced consensus
  fallbackModel: LanguageModelConfig;
  similarityThreshold: number; // e.g., 0.5 for 50% similarity
}

class ConsensusAgent {
  private groqClient: Groq;
  private tavilyClient: TavilyClient;
  private config: ConsensusAgentConfig;

  constructor(config: ConsensusAgentConfig) {
    const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || 'demo-key';
    const tavilyApiKey = import.meta.env.VITE_TAVILY_API_KEY || 'demo-key';
    
    // Initialize with demo keys - will return mock responses if real keys not provided
    this.groqClient = new Groq({ apiKey: groqApiKey, dangerouslyAllowBrowser: true });
    this.tavilyClient = new TavilyClient({ apiKey: tavilyApiKey });
    this.config = config;

    // Log API status for debugging
    if (groqApiKey === 'demo-key' || groqApiKey === 'your_groq_api_key_here') {
      console.warn('⚠️ Veritas: No valid Groq API key found. AI responses will be in demo mode.');
    } else {
      console.info('✅ Veritas: Groq API key detected for AI models.');
    }

    if (tavilyApiKey === 'demo-key' || tavilyApiKey === 'your_tavily_api_key_here') {
      console.warn('⚠️ Veritas: No valid Tavily API key found. Web search will be in demo mode.');
    } else {
      console.info('✅ Veritas: Tavily API key detected for web search.');
    }

    if ((groqApiKey === 'demo-key' || groqApiKey === 'your_groq_api_key_here') || 
        (tavilyApiKey === 'demo-key' || tavilyApiKey === 'your_tavily_api_key_here')) {
      console.info('ℹ️ See API_SETUP.md for configuration instructions.');
    }
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

  // NEW: Advanced 3-model consensus logic
  private selectBestResponseFromThree(
    primary: ModelResponse,
    secondary: ModelResponse,
    tertiary: ModelResponse
  ): ModelResponse {
    // Calculate pairwise similarities
    const sim12 = this.calculateSimilarity(primary.content, secondary.content);
    const sim13 = this.calculateSimilarity(primary.content, tertiary.content);
    const sim23 = this.calculateSimilarity(secondary.content, tertiary.content);
    
    const threshold = this.config.similarityThreshold;
    
    // Check for 3-way consensus (all models agree)
    if (sim12 >= threshold && sim13 >= threshold && sim23 >= threshold) {
      return {
        ...primary,
        model: `${primary.model} + ${secondary.model} + ${tertiary.model} (High Consensus)`,
        content: primary.content // Use primary as base for high consensus
      };
    }
    
    // Check for 2-way consensus patterns
    if (sim12 >= threshold) {
      // Primary & Secondary agree
      return {
        content: `**🤖 Consensus View (${primary.model} + ${secondary.model}):**
${primary.content}

**🔍 Alternative Perspective (${tertiary.model}):**
${tertiary.content}`,
        model: `${primary.model} + ${secondary.model} vs ${tertiary.model}`,
        timestamp: new Date(),
      };
    }
    
    if (sim13 >= threshold) {
      // Primary & Tertiary agree
      return {
        content: `**🤖 Consensus View (${primary.model} + ${tertiary.model}):**
${primary.content}

**🔍 Alternative Perspective (${secondary.model}):**
${secondary.content}`,
        model: `${primary.model} + ${tertiary.model} vs ${secondary.model}`,
        timestamp: new Date(),
      };
    }
    
    if (sim23 >= threshold) {
      // Secondary & Tertiary agree
      return {
        content: `**🤖 Consensus View (${secondary.model} + ${tertiary.model}):**
${secondary.content}

**🔍 Alternative Perspective (${primary.model}):**
${primary.content}`,
        model: `${secondary.model} + ${tertiary.model} vs ${primary.model}`,
        timestamp: new Date(),
      };
    }
    
    // No consensus - show all three perspectives
    return {
      content: `**🎯 Multiple Expert Perspectives (No Consensus):**

**Perspective 1 (${primary.model}):**
${primary.content}

**Perspective 2 (${secondary.model}):**
${secondary.content}

**Perspective 3 (${tertiary.model}):**
${tertiary.content}`,
      model: `${primary.model} + ${secondary.model} + ${tertiary.model} (Diverse Views)`,
      timestamp: new Date(),
    };
  }

  // Removed unused selectBestResponse method

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
        return await this.queryLanguageModelWithFallback(this.config.fallbackModel, prompt, true);
      }
      throw new Error(`Both primary and fallback models failed for ${modelConfig.modelName}.`);
    }
  }

  public async generateConsensusResponse(prompt: string): Promise<ModelResponse> {
    try {
      // Step 1: Perform a web search for context (with fallback)
      let searchContext;
      try {
        searchContext = await this.tavilyClient.search({ query: prompt, max_results: 5 });
      } catch (error) {
        // Fallback: create mock search results
        searchContext = {
          results: [
            {
              title: `Research about: ${prompt}`,
              snippet: `This is a demo response for the query: "${prompt}". To get real results, please add your API keys to the .env file.`,
              url: 'https://example.com'
            }
          ]
        };
      }

      // Step 2: Create a new prompt that includes the search context
      const contextualPrompt = this.createPromptWithContext(prompt, searchContext.results);

      // Step 3: Query the models with the enhanced prompt (with fallback)
      try {
        const [primaryResponse, secondaryResponse, tertiaryResponse] = await Promise.all([
          this.queryLanguageModelWithFallback(this.config.primaryModel, contextualPrompt),
          this.queryLanguageModelWithFallback(this.config.secondaryModel, contextualPrompt),
          this.queryLanguageModelWithFallback(this.config.tertiaryModel, contextualPrompt),
        ]);

        const finalResponse = this.selectBestResponseFromThree(primaryResponse, secondaryResponse, tertiaryResponse);
        finalResponse.sources = searchContext.results;
        return finalResponse;
      } catch (error) {
        // Return mock response if API calls fail
        return {
          content: `I apologize, but I'm currently running in demo mode due to missing API keys. 

To get real AI responses, please:
1. Get a Groq API key from https://console.groq.com
2. Get a Tavily API key from https://tavily.com
3. Add them to your .env file:
   VITE_GROQ_API_KEY=your_key_here
   VITE_TAVILY_API_KEY=your_key_here

For now, here's a demo response about: "${prompt}"

This application uses advanced AI models to provide comprehensive, research-backed answers to your questions. It searches the web for current information and then uses multiple AI models to generate consensus responses.`,
          model: 'demo-mode',
          timestamp: new Date(),
          sources: searchContext.results,
        };
      }

    } catch (error) {
      return {
        content: 'Sorry, I encountered an error. Please try again.',
        model: 'system-error',
        timestamp: new Date(),
        sources: [],
      };
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
        return await this.generateConsensusResponse(prompt);
      }

    } catch (error) {
      throw new Error('Failed to generate a streaming response.');
    }
  }
}

export default ConsensusAgent; 