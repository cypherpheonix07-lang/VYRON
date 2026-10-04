import { pgTable, text, timestamp, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createId } from "../cuid2.ts";

export const tenantPlanEnum = pgEnum("tenant_plan", ["starter", "pro", "enterprise"]);

export const tenants = pgTable("tenants", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: tenantPlanEnum("plan").default("starter").notNull(),
  enabledFeatures: jsonb("enabled_features").$type<string[]>().default([]).notNull(),
  quotaAiRequestsMonthly: text("quota_ai_requests_monthly").default("1000").notNull(),
  usedAiRequestsCurrentMonth: text("used_ai_requests_current_month").default("0").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
