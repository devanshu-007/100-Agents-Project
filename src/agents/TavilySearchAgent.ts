interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  publishedDate?: string;
}

interface TavilyResponse {
  results: SearchResult[];
  answer?: string;
  followUpQuestions?: string[];
  images?: string[];
  responseTime: number;
}

interface SearchConfig {
  apiKey: string;
  maxResults?: number;
  searchDepth?: "basic" | "advanced";
  includeAnswer?: boolean;
  includeImages?: boolean;
  includeDomains?: string[];
  excludeDomains?: string[];
}

class TavilySearchAgent {
  private config: SearchConfig; // Used in methods

  constructor(config: SearchConfig) {
    this.config = {
      maxResults: 5,
      searchDepth: "basic",
      includeAnswer: true,
      includeImages: false,
      ...config
    };
  }

  private sanitizeQuery(query: string): string {
    return query
      .replace(/[<>\"']/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 400);
  }

  private calculateRelevanceScore(result: any): number {
    const contentLength = result.content?.length || 0;
    const hasTitle = result.title && result.title.length > 0;
    const hasDate = result.published_date !== undefined;
    
    let score = 0.5;
    
    if (contentLength > 100) score += 0.2;
    if (contentLength > 500) score += 0.2;
    if (hasTitle) score += 0.1;
    if (hasDate) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  private formatResults(rawResults: any[]): SearchResult[] {
    return rawResults.map(result => ({
      title: result.title || 'Untitled',
      url: result.url || '',
      content: result.content || '',
      score: this.calculateRelevanceScore(result),
      publishedDate: result.published_date
    })).sort((a, b) => b.score - a.score);
  }

  public async search(query: string): Promise<TavilyResponse> {
    const startTime = Date.now();
    
    try {
      const sanitizedQuery = this.sanitizeQuery(query);
      
      if (!sanitizedQuery) {
        throw new Error("Invalid search query");
      }

      // Simulate search using environment variables and config
      const mockResults = Array.from({ length: this.config.maxResults || 5 }, (_, i) => ({
        title: `Research Results ${i + 1} for: ${sanitizedQuery}`,
        url: `https://example.com/search?q=${encodeURIComponent(sanitizedQuery)}&result=${i + 1}`,
        content: `This is mock search result ${i + 1} for the query: ${sanitizedQuery}. In a real implementation, this would connect to Tavily's API.`,
        published_date: new Date().toISOString()
      }));

      const formattedResults = this.formatResults(mockResults);
      
      return {
        results: formattedResults,
        answer: `Based on current research about "${sanitizedQuery}", here are the key findings...`,
        followUpQuestions: [
          `What are the latest developments in ${sanitizedQuery}?`,
          `How does ${sanitizedQuery} compare to alternatives?`
        ],
        images: [],
        responseTime: Date.now() - startTime
      };
      
    } catch (error: unknown) {
      console.error('Search error:', error);
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async searchWithContext(query: string, context?: string): Promise<TavilyResponse> {
    const contextualQuery = context 
      ? `${query} context: ${context}`
      : query;
    
    return this.search(contextualQuery);
  }

  public getSearchSummary(response: TavilyResponse): string {
    const topResults = response.results.slice(0, 3);
    const sources = topResults.map(r => `• ${r.title} (${r.url})`).join('\n');
    
    return `Search completed in ${response.responseTime}ms with ${response.results.length} results:\n\n${sources}`;
  }
}

export { TavilySearchAgent };
export type { SearchConfig, SearchResult, TavilyResponse }; 