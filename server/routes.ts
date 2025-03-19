import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { keywordSearchSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/keywords/search", async (req, res) => {
    try {
      const { query } = keywordSearchSchema.parse(req.body);
      
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const results = await storage.searchKeywords(query);
      res.json(results);
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Invalid request" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
