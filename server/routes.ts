import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { keywordSearchSchema, userLoginSchema, userRegisterSchema } from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(
    session({
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      secret: "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production" }
    })
  );

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = userRegisterSchema.parse(req.body);
      const user = await storage.createUser(userData);
      req.session.userId = user.id;
      res.json({ id: user.id, email: user.email });
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Registration failed" 
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = userLoginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);

      if (!user || !(await storage.validatePassword(user.password, password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.session.userId = user.id;
      res.json({ id: user.id, email: user.email });
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Login failed" 
      });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({ userId: req.session.userId });
  });

  // Keyword search route
  app.post("/api/keywords/search", async (req, res) => {
    try {
      const { query } = keywordSearchSchema.parse(req.body);
      await new Promise(resolve => setTimeout(resolve, 800));
      const results = await storage.searchKeywords(query, req.session.userId);
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