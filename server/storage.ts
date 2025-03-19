import { keywords, type KeywordResponse, type User, type UserRegister, type SearchHistory } from "@shared/schema";
import { hash, compare } from "bcrypt";

export interface IStorage {
  searchKeywords(query: string, userId?: number): Promise<KeywordResponse[]>;
  createUser(user: UserRegister): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  validatePassword(storedPassword: string, inputPassword: string): Promise<boolean>;
  saveSearchHistory(userId: number, query: string): Promise<void>;
  getSearchHistory(userId: number): Promise<SearchHistory[]>;
  getAISuggestions(query: string): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private searchHistories: Map<number, SearchHistory[]>;
  private currentUserId: number;
  private currentHistoryId: number;

  constructor() {
    this.users = new Map();
    this.searchHistories = new Map();
    this.currentUserId = 1;
    this.currentHistoryId = 1;
  }

  async searchKeywords(query: string, userId?: number): Promise<KeywordResponse[]> {
    if (userId) {
      await this.saveSearchHistory(userId, query);
    }

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

  async createUser(userData: UserRegister): Promise<User> {
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await hash(userData.password, 10);
    const id = this.currentUserId++;
    const user: User = {
      id,
      email: userData.email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    this.users.set(id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async validatePassword(storedPassword: string, inputPassword: string): Promise<boolean> {
    return compare(inputPassword, storedPassword);
  }

  async saveSearchHistory(userId: number, query: string): Promise<void> {
    const userHistory = this.searchHistories.get(userId) || [];
    const newHistory: SearchHistory = {
      id: this.currentHistoryId++,
      userId,
      query,
      searchedAt: new Date(),
    };
    userHistory.push(newHistory);
    this.searchHistories.set(userId, userHistory);
  }

  async getSearchHistory(userId: number): Promise<SearchHistory[]> {
    return this.searchHistories.get(userId) || [];
  }

  async getAISuggestions(query: string): Promise<string[]> {
    // Mock AI suggestions for now
    return [
      `${query} trends 2024`,
      `${query} strategy`,
      `${query} optimization`,
      `${query} analytics`,
      `${query} best practices`,
    ];
  }
}

export const storage = new MemStorage();