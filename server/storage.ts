import { keywords, type KeywordResponse } from "@shared/schema";

export interface IStorage {
  searchKeywords(query: string): Promise<KeywordResponse[]>;
}

export class MemStorage implements IStorage {
  async searchKeywords(query: string): Promise<KeywordResponse[]> {
    // Generate realistic looking mock data based on query
    const baseKeywords = [
      query,
      `${query} online`,
      `best ${query}`,
      `${query} tutorial`,
      `how to ${query}`,
      `${query} guide`,
      `${query} tips`,
      `${query} examples`,
      `${query} course`,
      `${query} software`
    ];

    return baseKeywords.map(keyword => ({
      keyword,
      searchVolume: Math.floor(Math.random() * 500000),
      cpc: Number((Math.random() * 10).toFixed(2)),
      competition: Number((Math.random()).toFixed(2)),
      trend: Math.floor(Math.random() * 100)
    }));
  }
}

export const storage = new MemStorage();
