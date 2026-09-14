/**
 * PROJECT BRAHMA — SERVER-SIDE AI GATEWAY 2.0 TYPE DEFINITIONS
 * Strict provider-neutral contracts, task categories, model capabilities, and telemetry interfaces.
 * ZERO SQL.
 */

export type AIProvider = "openai" | "openrouter" | "deterministic";

export type TaskCategory =
  | "lightweight_chat"
  | "deep_analysis"
  | "architecture_review"
  | "code_review"
  | "security_analysis"
  | "requirement_analysis"
  | "dataset_reasoning"
  | "investigation"
  | "mission_planning"
  | "agent_orchestration"
  | "report_synthesis"
  | "release_intelligence"
  | "demo_narration"
  | "tool_heavy"
  | "multimodal_analysis"
  | "copilot";

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string | undefined;
  tool_call_id?: string | undefined;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ToolCallInvocation {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

export interface InferenceRequest {
  task: TaskCategory | string;
  messages: ChatMessage[];
  systemPrompt?: string | undefined;
  providerOverride?: AIProvider | undefined;
  modelOverride?: string | undefined;
  temperature?: number | undefined;
  maxTokens?: number | undefined;
  stream?: boolean | undefined;
  tools?: ToolDefinition[] | undefined;
  structuredOutputSchema?: Record<string, unknown> | undefined;
  projectId?: string | undefined;
  mode?: ("NORMAL" | "DEMO") | undefined;
  userId?: string | undefined;
  userRole?: string | undefined;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface InferenceResponse<T = unknown> {
  ok: boolean;
  text: string;
  structuredData?: T | null | undefined;
  toolCalls?: ToolCallInvocation[] | undefined;
  provider: AIProvider | string;
  model: string;
  cacheHit: boolean;
  fallbackUsed: boolean;
  fallbackChain?: string[] | undefined;
  usage: TokenUsage;
  latencyMs: number;
  sha256: string;
  error?: {
    code: string;
    message: string;
    recoverable?: boolean | undefined;
  } | null | undefined;
}

export interface ModelCapability {
  id: string;
  provider: AIProvider;
  name: string;
  contextWindow: number;
  reasoningCapability: "basic" | "advanced" | "expert";
  toolCapability: boolean;
  streamingCapability: boolean;
  structuredOutputCapability: boolean;
  multimodalCapability: boolean;
  relativeLatencyMs: number;
  costPer1kPromptUsd: number;
  costPer1kCompletionUsd: number;
  recommendedTasks: TaskCategory[];
  restrictedTasks?: TaskCategory[] | undefined;
  fallbackCandidates: string[];
  status: "active" | "degraded" | "disabled";
}

export interface ProviderHealth {
  provider: AIProvider;
  isConfigured: boolean;
  isHealthy: boolean;
  lastChecked: string;
  latencyMs: number;
  errorMessage?: string | undefined;
  activeModelsCount: number;
}


export interface GatewayObservabilityMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  fallbackCount: number;
  cacheHits: number;
  totalSpendUsd: number;
  averageLatencyMs: number;
  recentRequests: Array<{
    id: string;
    timestamp: string;
    task: string;
    provider: string;
    model: string;
    latencyMs: number;
    tokens: number;
    costUsd: number;
    fallbackUsed: boolean;
    cacheHit: boolean;
    status: "OK" | "FAIL";
  }>;
}
