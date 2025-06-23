import Groq from "groq-sdk";

interface LlamaResponse {
  text: string;
  confidence: number;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  timestamp: Date;
}

interface LlamaConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
}

class GroqLlamaAgent {
  private client: Groq;
  private config: LlamaConfig;

  constructor(config: LlamaConfig) {
    this.config = {
      maxTokens: 1000,
      temperature: 0.7,
      topP: 1,
      stream: false,
      ...config
    };
    
    this.client = new Groq({
      apiKey: this.config.apiKey,
    });
  }

  private calculateConfidence(response: any): number {
    // Simple confidence calculation based on response characteristics
    const textLength = response.text?.length || 0;
    const hasStructure = response.text?.includes('\n') || false;
    
    let confidence = 0.7; // Base confidence
    
    if (textLength > 100) confidence += 0.1;
    if (textLength > 500) confidence += 0.1;
    if (hasStructure) confidence += 0.1;
    
    return Math.min(confidence, 0.95);
  }

  public async generateResponse(
    prompt: string,
    systemPrompt?: string,
    onStream?: (token: string) => void
  ): Promise<LlamaResponse> {
    try {
      const messages = [
        ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
        { role: "user" as const, content: prompt }
      ];

      const completion = await this.client.chat.completions.create({
        model: this.config.model,
        messages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        top_p: this.config.topP,
        stream: this.config.stream,
      });

      if (this.config.stream && onStream) {
        // Handle streaming response
        let fullText = '';
        for await (const chunk of completion as any) {
          const delta = chunk.choices[0]?.delta?.content || '';
          if (delta) {
            fullText += delta;
            onStream(delta);
          }
        }
        
        return {
          text: fullText,
          confidence: this.calculateConfidence({ text: fullText }),
          model: this.config.model,
          usage: {
            promptTokens: 0, // Not available in streaming
            completionTokens: 0,
            totalTokens: 0
          },
          timestamp: new Date()
        };
      } else {
        // Handle non-streaming response
        const response = completion as any;
        const text = response.choices[0]?.message?.content || '';
        
        return {
          text,
          confidence: this.calculateConfidence({ text }),
          model: this.config.model,
          usage: {
            promptTokens: response.usage?.prompt_tokens || 0,
            completionTokens: response.usage?.completion_tokens || 0,
            totalTokens: response.usage?.total_tokens || 0
          },
          timestamp: new Date()
        };
      }
    } catch (error: unknown) {
      console.error('Groq Llama error:', error);
      throw new Error(`Llama generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async generateStructuredResponse(
    prompt: string,
    schema: any,
    systemPrompt?: string
  ): Promise<LlamaResponse> {
    const structuredPrompt = `${prompt}\n\nPlease respond in the following JSON format:\n${JSON.stringify(schema, null, 2)}`;
    
    return this.generateResponse(structuredPrompt, systemPrompt);
  }

  public async analyzeText(
    text: string,
    analysisType: string,
    criteria?: string[]
  ): Promise<LlamaResponse> {
    const systemPrompt = `You are an expert text analyzer specializing in ${analysisType}. 
    ${criteria ? `Focus on these specific criteria: ${criteria.join(', ')}` : ''}
    Provide detailed, accurate analysis.`;
    
    const prompt = `Analyze the following text for ${analysisType}:\n\n"${text}"`;
    
    return this.generateResponse(prompt, systemPrompt);
  }

  public getModelInfo(): { name: string; provider: string; capabilities: string[] } {
    return {
      name: this.config.model,
      provider: "Groq",
      capabilities: ["text_generation", "analysis", "structured_output", "streaming"]
    };
  }
}

export { GroqLlamaAgent };
export type { LlamaConfig, LlamaResponse }; 