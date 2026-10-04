import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createId } from "../cuid2.ts";
import { tenants } from "./tenants.ts";
import { users } from "./users.ts";

export const copilotSessions = pgTable("copilot_sessions", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").default("New Conversation").notNull(),
  messageCount: integer("message_count").default(0).notNull(),
  lastIntent: text("last_intent"),
  sessionMetadata: jsonb("session_metadata").default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type CopilotSession = typeof copilotSessions.$inferSelect;
export type NewCopilotSession = typeof copilotSessions.$inferInsert;
