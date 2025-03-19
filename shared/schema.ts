import { pgTable, text, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const keywords = pgTable("keywords", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  searchVolume: integer("search_volume").notNull(),
  cpc: numeric("cpc", { precision: 10, scale: 2 }).notNull(),
  competition: numeric("competition", { precision: 3, scale: 2 }).notNull(),
  trend: integer("trend").notNull(),
  userId: integer("user_id").references(() => users.id),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  query: text("query").notNull(),
  searchedAt: timestamp("searched_at").notNull().defaultNow(),
});

export const keywordSearchSchema = z.object({
  query: z.string().min(1).max(100),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userRegisterSchema = userLoginSchema;

export const keywordResponseSchema = z.object({
  keyword: z.string(),
  searchVolume: z.number(),
  cpc: z.number(),
  competition: z.number(),
  trend: z.number(),
});

export const aiSuggestionsSchema = z.object({
  query: z.string().min(1).max(100),
});

export type KeywordResponse = z.infer<typeof keywordResponseSchema>;
export type KeywordSearch = z.infer<typeof keywordSearchSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserRegister = z.infer<typeof userRegisterSchema>;
export type User = typeof users.$inferSelect;
export type SearchHistory = typeof searchHistory.$inferSelect;