import Groq from "groq-sdk";

interface MixtralResponse {
  text: string;
  confidence: number;
  model: string;
  reasoning?: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  timestamp: Date;
}

interface MixtralConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
  enableReasoning?: boolean;
}

class GroqMixtralAgent {
  private client: Groq;
  private config: MixtralConfig;

  constructor(config: MixtralConfig) {
    this.config = {
      maxTokens: 1000,
      temperature: 0.7,
      topP: 1,
      stream: false,
      enableReasoning: false,
      ...config
    };
    
    this.client = new Groq({
      apiKey: this.config.apiKey,
    });
  }

  private calculateConfidence(response: any): number {
    // Enhanced confidence calculation for Mixtral
    const textLength = response.text?.length || 0;
    const hasStructure = response.text?.includes('\n') || false;
    const hasReasoning = response.reasoning?.length > 0;
    
    let confidence = 0.75; // Higher base confidence for Mixtral
    
    if (textLength > 100) confidence += 0.1;
    if (textLength > 500) confidence += 0.05;
    if (hasStructure) confidence += 0.05;
    if (hasReasoning) confidence += 0.05;
    
    return Math.min(confidence, 0.98);
  }

  public async generateResponse(
    prompt: string,
    systemPrompt?: string,
    onStream?: (token: string) => void
  ): Promise<MixtralResponse> {
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
      console.error('Groq Mixtral error:', error);
      throw new Error(`Mixtral generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async generateWithReasoning(
    prompt: string,
    systemPrompt?: string
  ): Promise<MixtralResponse> {
    const reasoningPrompt = `${prompt}\n\nPlease provide your reasoning process before giving your final answer. Format your response as:

REASONING: [Your step-by-step reasoning]

ANSWER: [Your final answer]`;

    const response = await this.generateResponse(reasoningPrompt, systemPrompt);
    
    // Extract reasoning and answer
    const parts = response.text.split('ANSWER:');
    const reasoning = parts[0]?.replace('REASONING:', '').trim();
    const answer = parts[1]?.trim() || response.text;
    
    return {
      ...response,
      text: answer,
      reasoning,
      confidence: this.calculateConfidence({ text: answer, reasoning })
    };
  }

  public async compareAndContrast(
    topic: string,
    options: string[],
    criteria?: string[]
  ): Promise<MixtralResponse> {
    const systemPrompt = `You are an expert analyst skilled at comparing and contrasting different options objectively.
    ${criteria ? `Focus on these criteria: ${criteria.join(', ')}` : ''}
    Provide balanced analysis with pros and cons for each option.`;
    
    const prompt = `Compare and contrast the following options for ${topic}:
    ${options.map((option, index) => `${index + 1}. ${option}`).join('\n')}
    
    Provide a detailed comparison highlighting key differences, advantages, and disadvantages.`;
    
    return this.generateResponse(prompt, systemPrompt);
  }

  public async synthesizeInformation(
    sources: string[],
    question: string
  ): Promise<MixtralResponse> {
    const systemPrompt = `You are an expert information synthesizer. Your job is to analyze multiple sources and provide a comprehensive, well-reasoned answer that combines insights from all sources while noting any contradictions or gaps.`;
    
    const prompt = `Question: ${question}

Sources to synthesize:
${sources.map((source, index) => `Source ${index + 1}: ${source}`).join('\n\n')}

Please synthesize this information to provide a comprehensive answer to the question.`;
    
    return this.generateWithReasoning(prompt, systemPrompt);
  }

  public getModelInfo(): { name: string; provider: string; capabilities: string[] } {
    return {
      name: this.config.model,
      provider: "Groq",
      capabilities: ["text_generation", "reasoning", "comparison", "synthesis", "streaming"]
    };
  }
}

export { GroqMixtralAgent };
export type { MixtralConfig, MixtralResponse }; 