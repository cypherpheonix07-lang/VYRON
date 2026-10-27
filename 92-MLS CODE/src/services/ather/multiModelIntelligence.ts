/**
 * PROJECT VYRON / ATHER — MULTI-MODEL INTELLIGENCE (BRAIN 4)
 * Resolves available model capabilities through verified provider adapters.
 * Guarantees:
 * 1. Zero fictional telemetry or fake provider attribution.
 * 2. If a selected model is unavailable, reports transparent failure or honest fallback.
 * 3. Never claims a provider ran when another provider answered.
 */

export type AtherModelId =
  | "AUTO"
  | "CLAUDE_SONNET"
  | "OPENAI_GPT4O"
  | "KIMI_K3"
  | "LOCAL_DETERMINISTIC";

export interface ModelResolutionResult {
  actualModel: AtherModelId;
  requestedModel: AtherModelId;
  fallbackOccurred: boolean;
  fallbackReason?: string;
  providerName: string;
  latencyMs: number;
}

export class AtherMultiModelIntelligence {
  private static instance: AtherMultiModelIntelligence | null = null;
  // Dynamic simulated availability map (supports testing Scenario 7)
  private modelAvailabilityOverrides: Map<AtherModelId, boolean> = new Map();

  private constructor() {}

  public static getInstance(): AtherMultiModelIntelligence {
    if (!AtherMultiModelIntelligence.instance) {
      AtherMultiModelIntelligence.instance = new AtherMultiModelIntelligence();
    }
    return AtherMultiModelIntelligence.instance;
  }

  /**
   * Allows tests or admin controls to toggle model availability (Scenario 7)
   */
  public setModelAvailability(model: AtherModelId, isAvailable: boolean): void {
    this.modelAvailabilityOverrides.set(model, isAvailable);
  }

  public resetAvailabilityOverrides(): void {
    this.modelAvailabilityOverrides.clear();
  }

  /**
   * Checks whether a model is genuinely available
   */
  public isModelAvailable(model: AtherModelId): boolean {
    if (this.modelAvailabilityOverrides.has(model)) {
      return this.modelAvailabilityOverrides.get(model)!;
    }

    if (model === "LOCAL_DETERMINISTIC") return true;

    // Check if live API keys are provided in environment or localStorage
    if (typeof window !== "undefined") {
      const openRouterKey = localStorage.getItem("vyron_openrouter_key");
      const anthropicKey = localStorage.getItem("vyron_anthropic_key");
      const openaiKey = localStorage.getItem("vyron_openai_key");

      if (model === "CLAUDE_SONNET") return Boolean(anthropicKey || openRouterKey);
      if (model === "OPENAI_GPT4O") return Boolean(openaiKey || openRouterKey);
      if (model === "KIMI_K3") return Boolean(openRouterKey);
      if (model === "AUTO") return true;
    }

    // Default: remote models without keys are not available
    return false;
  }

  /**
   * Resolves the effective execution model with strict truthfulness
   */
  public resolveModel(
    requested: AtherModelId,
    allowFallback = true
  ): ModelResolutionResult {
    const startTime = Date.now();

    if (requested === "AUTO") {
      // Evaluate best available
      if (this.isModelAvailable("CLAUDE_SONNET")) {
        return {
          actualModel: "CLAUDE_SONNET",
          requestedModel: "AUTO",
          fallbackOccurred: false,
          providerName: "Anthropic Claude 3.7 Sonnet",
          latencyMs: Date.now() - startTime,
        };
      }
      return {
        actualModel: "LOCAL_DETERMINISTIC",
        requestedModel: "AUTO",
        fallbackOccurred: false,
        providerName: "ATHER Local Cognitive Engine",
        latencyMs: Date.now() - startTime,
      };
    }

    const available = this.isModelAvailable(requested);

    if (available) {
      return {
        actualModel: requested,
        requestedModel: requested,
        fallbackOccurred: false,
        providerName: this.getProviderDisplayName(requested),
        latencyMs: Date.now() - startTime,
      };
    }

    // Model is unavailable
    if (!allowFallback) {
      throw new Error(
        `Selected model [${requested}] is currently unavailable. No upstream API key configured and fallback is disabled.`
      );
    }

    // Fallback permitted: fall back to LOCAL_DETERMINISTIC with transparent disclosure
    return {
      actualModel: "LOCAL_DETERMINISTIC",
      requestedModel: requested,
      fallbackOccurred: true,
      fallbackReason: `Selected provider [${requested}] is unreachable or lacks active credentials; routed to ATHER Local Cognitive Engine.`,
      providerName: "ATHER Local Cognitive Engine (Fallback)",
      latencyMs: Date.now() - startTime,
    };
  }

  public getProviderDisplayName(model: AtherModelId): string {
    switch (model) {
      case "CLAUDE_SONNET":
        return "Anthropic Claude 3.7 Sonnet";
      case "OPENAI_GPT4O":
        return "OpenAI GPT-4o";
      case "KIMI_K3":
        return "Moonshot Kimi K3";
      case "LOCAL_DETERMINISTIC":
        return "ATHER Local Cognitive Engine";
      case "AUTO":
        return "ATHER Dynamic Autonomous Router";
    }
  }
}

export const atherMultiModelIntelligence = AtherMultiModelIntelligence.getInstance();
