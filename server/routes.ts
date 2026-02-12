import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, updateLeadSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/leads", async (req, res) => {
    const leads = await storage.getLeads();
    res.json(leads);
  });

  app.get("/api/leads/:id", async (req, res) => {
    const lead = await storage.getLead(parseInt(req.params.id));
    if (!lead) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }
    res.json(lead);
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const lead = insertLeadSchema.parse(req.body);
      const created = await storage.createLead(lead);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ message: "Invalid lead data", errors: err.errors });
        return;
      }
      throw err;
    }
  });

  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const update = updateLeadSchema.parse(req.body);
      const updated = await storage.updateLead(parseInt(req.params.id), update);
      res.json(updated);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ message: "Invalid update data", errors: err.errors });
        return;
      }
      throw err;
    }
  });

  app.get("/api/leads/export/csv", async (req, res) => {
    const csv = await storage.exportLeads();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
    res.send(csv);
  });

  const httpServer = createServer(app);
  return httpServer;
}
