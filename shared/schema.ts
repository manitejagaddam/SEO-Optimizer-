import { pgTable, text, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const keywords = pgTable("keywords", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  searchVolume: integer("search_volume").notNull(),
  cpc: numeric("cpc", { precision: 10, scale: 2 }).notNull(),
  competition: numeric("competition", { precision: 3, scale: 2 }).notNull(),
  trend: integer("trend").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const keywordSearchSchema = z.object({
  query: z.string().min(1).max(100),
});

export const keywordResponseSchema = z.object({
  keyword: z.string(),
  searchVolume: z.number(),
  cpc: z.number(),
  competition: z.number(),
  trend: z.number(),
});

export type KeywordResponse = z.infer<typeof keywordResponseSchema>;
export type KeywordSearch = z.infer<typeof keywordSearchSchema>;
