import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const zones = pgTable("zones", {
  id: text("id").primaryKey(), // e.g., "A1", "B2", etc.
  name: text("name").notNull(),
  status: text("status").notNull(), // "healthy", "warning", "critical"
  soilMoisture: integer("soil_moisture"), // percentage
  temperature: integer("temperature"), // celsius
  humidity: integer("humidity"), // percentage
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  zoneId: text("zone_id").notNull(),
  type: text("type").notNull(), // "irrigation", "pest", "disease", "soil", "weather", "equipment"
  criticality: text("criticality").notNull(), // "low", "medium", "high"
  title: text("title").notNull(),
  description: text("description").notNull(),
  emoji: text("emoji").notNull(),
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const feedbackReports = pgTable("feedback_reports", {
  id: serial("id").primaryKey(),
  zoneId: text("zone_id").notNull(),
  issueType: text("issue_type").notNull(),
  criticality: text("criticality").notNull(),
  description: text("description").notNull(),
  desiredAction: text("desired_action").notNull(),
  urgency: text("urgency").notNull(),
  status: text("status").default("pending"), // "pending", "in_progress", "resolved"
  createdAt: timestamp("created_at").defaultNow(),
});

export const solutions = pgTable("solutions", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id").notNull(),
  steps: text("steps").array().notNull(),
  resources: text("resources").notNull(), // JSON string
  alternatives: text("alternatives").array().notNull(),
  estimatedCost: integer("estimated_cost"), // in cents
  estimatedTime: integer("estimated_time"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertZoneSchema = createInsertSchema(zones);
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, createdAt: true });
export const insertFeedbackReportSchema = createInsertSchema(feedbackReports).omit({ id: true, createdAt: true, status: true });
export const insertSolutionSchema = createInsertSchema(solutions).omit({ id: true, createdAt: true });

export type Zone = typeof zones.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
export type FeedbackReport = typeof feedbackReports.$inferSelect;
export type Solution = typeof solutions.$inferSelect;
export type InsertZone = z.infer<typeof insertZoneSchema>;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type InsertFeedbackReport = z.infer<typeof insertFeedbackReportSchema>;
export type InsertSolution = z.infer<typeof insertSolutionSchema>;
