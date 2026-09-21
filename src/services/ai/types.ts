/**
 * PROJECT BRAHMA — AI SERVICE LAYER CONTRACTS
 * Provider-neutral interfaces for Anthropic Claude, Moonshot Kimi, OpenAI, and Deterministic Mock engines.
 */

import { AIModelType } from "../../state/copilot/copilotStore";

export type AITaskType =
  | "REASONING" // Complex logic, architecture, tool-calls (Claude preferred)
  | "LONG_CONTEXT_RAG" // Large dataset schema comprehension, bulk docs (Kimi K3 MoE preferred)
  | "STRUCTURED_EXTRACTION" // JSON-schema strict conformity (GPT-4o or Claude)
  | "EXPLAINABILITY" // Natural language SHAP/risk attribution (Claude / Kimi)
  | "DEMO_SIMULATION"; // Deterministic fast responses for demos

export interface AIProviderMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<
      string,
      {
        type: string;
        description: string;
        enum?: string[];
      }
    >;
    required?: string[];
  };
}

export interface AIToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface AICompletionRequest {
  taskType: AITaskType;
  modelOverride?: AIModelType | undefined;
  messages: AIProviderMessage[];
  systemPrompt?: string | undefined;
  tools?: AIToolDefinition[] | undefined;
  temperature?: number | undefined;
  maxTokens?: number | undefined;
  contextData?: Record<string, unknown> | undefined;
}

export interface AICompletionResponse {
  model: AIModelType;
  provider: "ANTHROPIC" | "MOONSHOT" | "OPENAI" | "OPENROUTER" | "MOCK";
  text: string;
  toolCalls?: AIToolCall[] | undefined;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  durationMs: number;
  verificationHash: string;
  rawResponse?: unknown | undefined;
}

export interface AIAdapter {
  id: AIModelType;
  providerName: "ANTHROPIC" | "MOONSHOT" | "OPENAI" | "OPENROUTER" | "MOCK";
  isAvailable(): boolean;
  complete(request: AICompletionRequest): Promise<AICompletionResponse>;
}
