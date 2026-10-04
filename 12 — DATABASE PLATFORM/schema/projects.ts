import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createId } from "../cuid2.ts";
import { tenants } from "./tenants.ts";
import { users } from "./users.ts";

export const projects = pgTable("projects", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("active").notNull(),
  healthScore: integer("health_score").default(100).notNull(),
  repoUrl: text("repo_url"),
  architectureSpecs: jsonb("architecture_specs").default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
