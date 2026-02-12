import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  caseType: text("case_type").notNull(),
  caseDetails: text("case_details").notNull(),
  urgency: text("urgency").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("new"),
  reviewed: boolean("reviewed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  name: true,
  email: true,
  phone: true,
  caseType: true,
  caseDetails: true,
  urgency: true,
  notes: true,
});

export const updateLeadSchema = z.object({
  status: z.string(),
  reviewed: z.boolean(),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type UpdateLead = z.infer<typeof updateLeadSchema>;
export type Lead = typeof leads.$inferSelect;
