import { TavilyClient } from 'tavily';

class SearchAgent {
  private tavilyClient: TavilyClient;

  constructor() {
    // IMPORTANT: Replace with your actual Tavily API key
    // You should use environment variables for this in a real application
    const tavilyApiKey = import.meta.env.VITE_TAVILY_API_KEY || 'YOUR_TAVILY_API_KEY';
    this.tavilyClient = new TavilyClient({ apiKey: tavilyApiKey });
  }

  /**
   * Performs a basic search using the Tavily API.
   * @param query The search query.
   * @returns The search results.
   */
  public async search(query: string) {
    try {
      const searchResponse = await this.tavilyClient.search({
        query: query,
        max_results: 5,
      });
      return searchResponse;
    } catch (error) {
      console.error('Error during Tavily search:', error);
      throw new Error('Failed to perform search.');
    }
  }
}

export const researchAgent = new SearchAgent(); 