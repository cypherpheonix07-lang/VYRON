/**
 * PROJECT BRAHMA — PLUGIN REGISTRY TYPES (PHASE A.1)
 * MCP-equivalent In-Process Plugin Boundary Contracts.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type JSONSchemaType = "string" | "number" | "integer" | "boolean" | "object" | "array" | "null";

export interface JSONSchemaProperty {
  type: JSONSchemaType;
  description?: string;
  items?: JSONSchemaProperty;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  enum?: string[];
  default?: unknown;
}

export interface JSONSchema {
  type: "object";
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
  [key: string]: unknown;
}

export interface ArgDef {
  name: string;
  description: string;
  required: boolean;
}

export type ContentBlockType = "text" | "code" | "artifact" | "citation";

export interface ContentBlock {
  type: ContentBlockType;
  value: string;
  metadata?: Record<string, unknown>;
}

export interface ToolResult {
  content: ContentBlock[];
  isError: boolean;
}

export interface DemoEngine {
  match(userMessage: string, context?: Record<string, unknown>): {
    text: string;
    intentCategory?: string;
    confidence?: number;
    action?: string;
    citations?: Array<{ sha256: string; label: string; source: string }>;
    artifacts?: Array<{ type: string; content: string; title?: string; language?: string }>;
  };
}

export interface PluginContext {
  userId: string;
  projectId?: string;
  isDemo: boolean;
  supabase: SupabaseClient;
  demoEngine?: DemoEngine;
}

export interface PluginTool {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  handler: (args: unknown, ctx: PluginContext) => Promise<ToolResult>;
}

export interface PluginResource {
  uri: string;
  name: string;
  mimeType: string;
  read: (ctx: PluginContext) => Promise<string | Uint8Array>;
}

export interface PluginPrompt {
  name: string;
  description: string;
  arguments: ArgDef[];
  render: (args: Record<string, string>) => string;
}
