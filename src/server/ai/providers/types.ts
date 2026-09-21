/**
 * VYRON — DUAL-PROVIDER AI AGENT ENGINEERING CONTROL PLANE (RELEASE 01)
 * Provider-neutral interface and request/response contracts for OpenAI & OpenRouter.
 * Strictly ZERO Raw SQL.
 */

import {
  InferenceRequest,
  InferenceResponse,
  ProviderHealth,
  ModelCapability,
  TokenUsage,
  ToolCallInvocation,
  AIProvider,
} from "../types";

export interface AIStreamChunk {
  delta: string;
  isComplete: boolean;
  toolCallDelta?: Partial<ToolCallInvocation> | undefined;
  usage?: TokenUsage | undefined;
}

export interface ProviderCapabilities {
  providerId: AIProvider;
  name: string;
  streaming: boolean;
  toolCalling: boolean;
  structuredOutput: boolean;
  multimodal: boolean;
  defaultModel: string;
  fallbackProvider: AIProvider | "deterministic";
  supportedModels: string[];
}

export interface IAIProvider {
  readonly id: AIProvider;
  readonly name: string;

  isConfigured(): boolean;
  getCapabilities(): ProviderCapabilities;
  healthCheck(): Promise<ProviderHealth>;
  generate(request: InferenceRequest): Promise<InferenceResponse>;
  generateStructured<T>(
    request: InferenceRequest,
    schema: Record<string, unknown>,
  ): Promise<InferenceResponse<T>>;
  stream?(
    request: InferenceRequest,
    onChunk: (chunk: AIStreamChunk) => void,
  ): Promise<InferenceResponse>;
}
