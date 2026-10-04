import { pgTable, text, timestamp, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createId } from "../cuid2.ts";
import { copilotSessions } from "./copilot-sessions.ts";

export const messageRoleEnum = pgEnum("message_role", ["user", "assistant", "system", "tool"]);

export const messages = pgTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  sessionId: text("session_id")
    .notNull()
    .references(() => copilotSessions.id, { onDelete: "cascade" }),
  role: messageRoleEnum("role").notNull(),
  content: text("content").notNull(),
  model: text("model"),
  promptTokens: integer("prompt_tokens").default(0).notNull(),
  completionTokens: integer("completion_tokens").default(0).notNull(),
  totalTokens: integer("total_tokens").default(0).notNull(),
  citations: jsonb("citations").$type<Array<{ id: number; title?: string; source?: string; excerpt?: string }>>().default([]).notNull(),
  telemetry: jsonb("telemetry").default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
