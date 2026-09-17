/**
 * VYRON — DUAL-PROVIDER CLIENT CONTRACTS (RELEASE 01)
 * Client-side provider-neutral interfaces for OpenRouter and OpenAI.
 * Strict Zero API Key exposure in browser.
 * Strictly ZERO Raw SQL.
 */

import { TaskCategory } from "@/server/ai/types";

export type ClientAIProviderId = "openai" | "openrouter" | "deterministic";

export interface ClientAIRequest {
  task: TaskCategory | string;
  messages: Array<{ role: "system" | "user" | "assistant" | "tool"; content: string }>;
  systemPrompt?: string;
  modelOverride?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: Array<{ name: string; description: string; parameters: Record<string, unknown> }>;
  structuredOutputSchema?: Record<string, unknown>;
  projectId?: string;
}

export interface ClientAIResponse<T = unknown> {
  ok: boolean;
  text: string;
  structuredData?: T | undefined;
  provider: ClientAIProviderId | string;
  model: string;
  usage?: {
    totalTokens: number;
    estimatedCostUsd?: number | undefined;
  } | undefined;
  latencyMs: number;
  fallbackUsed: boolean;
  sha256?: string | undefined;
  error?: {
    code: string;
    message: string;
  } | undefined;
}

export interface IAIProviderClient {
  readonly id: ClientAIProviderId;
  readonly name: string;
  isAvailable(): Promise<boolean>;
  generate(request: ClientAIRequest): Promise<ClientAIResponse>;
  generateStructured<T>(
    request: ClientAIRequest,
    schema: Record<string, unknown>,
  ): Promise<ClientAIResponse<T>>;
}
