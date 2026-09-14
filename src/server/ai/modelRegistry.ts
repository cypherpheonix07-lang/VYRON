/**
 * PROJECT BRAHMA — MODEL CAPABILITY REGISTRY
 * Authoritative registry of all configured models across OpenAI and OpenRouter.
 * Exposes granular capability flags, pricing, latency class, and task allocations.
 * Strictly ZERO SQL.
 */

import { ModelCapability, TaskCategory, AIProvider } from "./types";

export class ModelRegistry {
  private static instance: ModelRegistry | null = null;
  private models: Map<string, ModelCapability> = new Map();

  private constructor() {
    this.registerBuiltinModels();
  }

  public static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  private registerBuiltinModels(): void {
    // ─── 1. OpenAI Models ───────────────────────────────────────────────────
    this.registerModel({
      id: "gpt-4o",
      provider: "openai",
      name: "OpenAI GPT-4o (Omni)",
      contextWindow: 128000,
      reasoningCapability: "expert",
      toolCapability: true,
      streamingCapability: true,
      structuredOutputCapability: true,
      multimodalCapability: true,
      relativeLatencyMs: 800,
      costPer1kPromptUsd: 0.0025,
      costPer1kCompletionUsd: 0.01,
      recommendedTasks: [
        "architecture_review",
        "deep_analysis",
        "mission_planning",
        "security_analysis",
        "agent_orchestration",
        "multimodal_analysis",
      ],
      fallbackCandidates: ["gpt-4o-mini", "anthropic/claude-3.5-sonnet"],
      status: "active",
    });

    this.registerModel({
      id: "gpt-4o-mini",
      provider: "openai",
      name: "OpenAI GPT-4o Mini",
      contextWindow: 128000,
      reasoningCapability: "advanced",
      toolCapability: true,
      streamingCapability: true,
      structuredOutputCapability: true,
      multimodalCapability: true,
      relativeLatencyMs: 350,
      costPer1kPromptUsd: 0.00015,
      costPer1kCompletionUsd: 0.0006,
      recommendedTasks: [
        "lightweight_chat",
        "code_review",
        "requirement_analysis",
        "dataset_reasoning",
        "investigation",
        "copilot",
      ],
      fallbackCandidates: ["openai/gpt-4o-mini", "meta-llama/llama-3.3-70b-instruct"],
      status: "active",
    });

    this.registerModel({
      id: "o3-mini",
      provider: "openai",
      name: "OpenAI o3-mini (Reasoning)",
      contextWindow: 200000,
      reasoningCapability: "expert",
      toolCapability: true,
      streamingCapability: true,
      structuredOutputCapability: true,
      multimodalCapability: false,
      relativeLatencyMs: 1400,
      costPer1kPromptUsd: 0.0011,
      costPer1kCompletionUsd: 0.0044,
      recommendedTasks: [
        "deep_analysis",
        "security_analysis",
        "architecture_review",
        "investigation",
      ],
      fallbackCandidates: ["gpt-4o", "anthropic/claude-3.5-sonnet"],
      status: "active",
    });

    // ─── 2. OpenRouter Models ───────────────────────────────────────────────
    this.registerModel({
      id: "anthropic/claude-3.5-sonnet",
      provider: "openrouter",
      name: "Claude 3.5 Sonnet (via OpenRouter)",
      contextWindow: 200000,
      reasoningCapability: "expert",
      toolCapability: true,
      streamingCapability: true,
      structuredOutputCapability: true,
      multimodalCapability: true,
      relativeLatencyMs: 1100,
      costPer1kPromptUsd: 0.003,
      costPer1kCompletionUsd: 0.015,
      recommendedTasks: [
        "architecture_review",
        "deep_analysis",
        "report_synthesis",
        "release_intelligence",
        "mission_planning",
      ],
      fallbackCandidates: ["gpt-4o", "openai/gpt-4o", "meta-llama/llama-3.3-70b-instruct"],
      status: "active",
    });

    this.registerModel({
      id: "openai/gpt-4o-mini",
      provider: "openrouter",
      name: "GPT-4o Mini (via OpenRouter)",
      contextWindow: 128000,
      reasoningCapability: "advanced",
      toolCapability: true,
      streamingCapability: true,
      structuredOutputCapability: true,
      multimodalCapability: true,
      relativeLatencyMs: 400,
      costPer1kPromptUsd: 0.00015,
      costPer1kCompletionUsd: 0.0006,
      recommendedTasks: [
        "lightweight_chat",
        "code_review",
        "requirement_analysis",
        "copilot",
      ],
      fallbackCandidates: ["gpt-4o-mini", "meta-llama/llama-3.3-70b-instruct"],
      status: "active",
    });

    this.registerModel({
      id: "meta-llama/llama-3.3-70b-instruct",
      provider: "openrouter",
      name: "Llama 3.3 70B Instruct (via OpenRouter)",
      contextWindow: 128000,
      reasoningCapability: "advanced",
      toolCapability: true,
      streamingCapability: true,
      structuredOutputCapability: true,
      multimodalCapability: false,
      relativeLatencyMs: 650,
      costPer1kPromptUsd: 0.0004,
      costPer1kCompletionUsd: 0.0004,
      recommendedTasks: [
        "code_review",
        "dataset_reasoning",
        "requirement_analysis",
        "investigation",
      ],
      fallbackCandidates: ["openai/gpt-4o-mini", "google/gemini-2.0-flash-001"],
      status: "active",
    });

    this.registerModel({
      id: "google/gemini-2.0-flash-001",
      provider: "openrouter",
      name: "Gemini 2.0 Flash (via OpenRouter)",
      contextWindow: 1000000,
      reasoningCapability: "advanced",
      toolCapability: true,
      streamingCapability: true,
      structuredOutputCapability: true,
      multimodalCapability: true,
      relativeLatencyMs: 300,
      costPer1kPromptUsd: 0.0001,
      costPer1kCompletionUsd: 0.0004,
      recommendedTasks: [
        "dataset_reasoning",
        "lightweight_chat",
        "demo_narration",
        "copilot",
      ],
      fallbackCandidates: ["openai/gpt-4o-mini"],
      status: "active",
    });

    this.registerModel({
      id: "meta-llama/llama-3.1-8b-instruct:free",
      provider: "openrouter",
      name: "Llama 3.1 8B Free Tier (via OpenRouter)",
      contextWindow: 128000,
      reasoningCapability: "basic",
      toolCapability: false,
      streamingCapability: true,
      structuredOutputCapability: false,
      multimodalCapability: false,
      relativeLatencyMs: 500,
      costPer1kPromptUsd: 0.0,
      costPer1kCompletionUsd: 0.0,
      recommendedTasks: ["lightweight_chat", "demo_narration"],
      fallbackCandidates: ["deterministic-engine"],
      status: "active",
    });
  }

  public registerModel(model: ModelCapability): void {
    this.models.set(model.id, model);
  }

  public getModel(id: string): ModelCapability | undefined {
    return this.models.get(id);
  }

  public listModels(filter?: { provider?: AIProvider; status?: string }): ModelCapability[] {
    let list = Array.from(this.models.values());
    if (filter?.provider) {
      list = list.filter((m) => m.provider === filter.provider);
    }
    if (filter?.status) {
      list = list.filter((m) => m.status === filter.status);
    }
    return list;
  }

  public getRecommendedModelForTask(
    task: TaskCategory | string,
    preferredProvider?: AIProvider,
  ): ModelCapability {
    const all = Array.from(this.models.values()).filter((m) => m.status === "active");

    if (preferredProvider) {
      const providerModels = all.filter((m) => m.provider === preferredProvider);
      const match = providerModels.find((m) => m.recommendedTasks.includes(task as TaskCategory));
      if (match) return match;
      const first = providerModels[0];
      if (first) return first;
    }

    const taskMatch = all.find((m) => m.recommendedTasks.includes(task as TaskCategory));
    if (taskMatch) return taskMatch;

    const defaultModel =
      this.models.get("gpt-4o-mini") ||
      this.models.get("openai/gpt-4o-mini") ||
      all[0];

    if (defaultModel) return defaultModel;

    return {
      id: "gpt-4o-mini",
      provider: "openai",
      name: "OpenAI GPT-4o Mini",
      contextWindow: 128000,
      reasoningCapability: "advanced",
      toolCapability: true,
      streamingCapability: true,
      structuredOutputCapability: true,
      multimodalCapability: true,
      relativeLatencyMs: 350,
      costPer1kPromptUsd: 0.00015,
      costPer1kCompletionUsd: 0.0006,
      recommendedTasks: ["copilot", "lightweight_chat"],
      fallbackCandidates: ["openai/gpt-4o-mini"],
      status: "active",
    };
  }
}

export const modelRegistry = ModelRegistry.getInstance();
