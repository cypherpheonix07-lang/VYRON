/**
 * VYRON — P23: MULTI-MODEL AI GATEWAY & ROUTING FABRIC
 * Dynamic LLM model routing, capability tiers (Advanced Reasoning vs Low Latency),
 * cost attribution, and deterministic local engine circuit breaking.
 * Strictly ZERO operational raw SQL.
 */

export type ModelTier = "ADVANCED_REASONING" | "LOW_LATENCY_EXACT" | "LOCAL_DETERMINISTIC";

export interface ModelRouteDefinition {
  id: string;
  provider: "GOOGLE" | "ANTHROPIC" | "OPENAI" | "LOCAL_VYRON";
  modelName: string;
  tier: ModelTier;
  costPer1kTokens: number;
  maxContextTokens: number;
  isAvailable: boolean;
}

export interface RoutingDecision {
  selectedModel: ModelRouteDefinition;
  reason: string;
  estimatedCostUsd: number;
  routedAt: string;
}

export class AiGatewayRouter {
  private static readonly MODELS: ModelRouteDefinition[] = [
    {
      id: "gemini-2.5-pro",
      provider: "GOOGLE",
      modelName: "gemini-2.5-pro",
      tier: "ADVANCED_REASONING",
      costPer1kTokens: 0.00125,
      maxContextTokens: 1048576,
      isAvailable: true
    },
    {
      id: "gemini-2.5-flash",
      provider: "GOOGLE",
      modelName: "gemini-2.5-flash",
      tier: "LOW_LATENCY_EXACT",
      costPer1kTokens: 0.00015,
      maxContextTokens: 1048576,
      isAvailable: true
    },
    {
      id: "vyron-local-ast-engine",
      provider: "LOCAL_VYRON",
      modelName: "vyron-ast-rule-solver",
      tier: "LOCAL_DETERMINISTIC",
      costPer1kTokens: 0.0,
      maxContextTokens: 65536,
      isAvailable: true
    }
  ];

  public static routeTask(
    complexity: "HIGH_REASONING" | "FAST_LOOKUP" | "OFFLINE_DETERMINISTIC",
    estimatedTokens: number
  ): RoutingDecision {
    let targetTier: ModelTier = "LOW_LATENCY_EXACT";
    if (complexity === "HIGH_REASONING") targetTier = "ADVANCED_REASONING";
    if (complexity === "OFFLINE_DETERMINISTIC") targetTier = "LOCAL_DETERMINISTIC";

    const model = this.MODELS.find((m) => m.tier === targetTier && m.isAvailable) || this.MODELS[2]!;

    const estimatedCostUsd = Math.round(((estimatedTokens / 1000) * model.costPer1kTokens) * 10000) / 10000;

    return {
      selectedModel: model,
      reason: `Routed to ${model.modelName} based on required tier ${targetTier}.`,
      estimatedCostUsd,
      routedAt: new Date().toISOString()
    };
  }

  public static getModels(): ModelRouteDefinition[] {
    return this.MODELS;
  }
}
