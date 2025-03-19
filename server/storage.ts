import { keywords, type KeywordResponse, type User, type UserRegister } from "@shared/schema";
import { hash, compare } from "bcrypt";

export interface IStorage {
  searchKeywords(query: string, userId?: number): Promise<KeywordResponse[]>;
  createUser(user: UserRegister): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  validatePassword(storedPassword: string, inputPassword: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private currentUserId: number;

  constructor() {
    this.users = new Map();
    this.currentUserId = 1;
  }

  async searchKeywords(query: string, userId?: number): Promise<KeywordResponse[]> {
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
}

export const storage = new MemStorage();