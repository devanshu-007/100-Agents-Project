import Groq from 'groq-sdk';
import { Jaccard } from 'natural';

// Define the structure for a response from an AI model
interface ModelResponse {
  content: string;
  model: string;
  timestamp: Date;
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
  similarityThreshold: number; // e.g., 0.5 for 50% similarity
}

class ConsensusAgent {
  private groqClient: Groq;
  private config: ConsensusAgentConfig;

  constructor(config: ConsensusAgentConfig) {
    const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || 'YOUR_GROQ_API_KEY';
    this.groqClient = new Groq({ apiKey: groqApiKey, dangerouslyAllowBrowser: true });
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
    return Jaccard.compare(textA.toLowerCase().split(/\s+/), textB.toLowerCase().split(/\s+/));
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

  public async generateConsensusResponse(prompt: string): Promise<ModelResponse> {
    try {
      const [primaryResponse, secondaryResponse] = await Promise.all([
        this.queryLanguageModel(this.config.primaryModel, prompt),
        this.queryLanguageModel(this.config.secondaryModel, prompt),
      ]);

      return this.selectBestResponse(primaryResponse, secondaryResponse);
    } catch (error) {
      console.error('Error generating consensus response:', error);
      // In a real app, you might want a fallback to a single model here.
      throw new Error('Failed to generate a consensus response from the models.');
    }
  }
}

export default ConsensusAgent; 