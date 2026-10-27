/**
 * PROJECT BRAHMA — TASK-AWARE MODEL ROUTER
 * Intelligently maps tasks to the optimal provider and model based on capabilities, cost, latency, and health.
 * Calculates an ordered fallback chain to ensure continuous execution resilience.
 * Strictly ZERO SQL.
 */

import { TaskCategory, AIProvider, InferenceRequest } from "./types";
import { modelRegistry } from "./modelRegistry";
import { openAiServerAdapter } from "./adapters/openAiServerAdapter";
import { openRouterServerAdapter } from "./adapters/openRouterServerAdapter";

export interface RoutingDecision {
  primaryProvider: AIProvider;
  primaryModel: string;
  fallbackChain: Array<{ provider: AIProvider; model: string }>;
  requiresTools: boolean;
  requiresStructuredOutput: boolean;
  reason: string;
}

export class ModelRouter {
  private static instance: ModelRouter | null = null;
  private adminPolicyOverrides: Map<string, { provider: AIProvider; model: string }> = new Map();

  private constructor() {}

  public static getInstance(): ModelRouter {
    if (!ModelRouter.instance) {
      ModelRouter.instance = new ModelRouter();
    }
    return ModelRouter.instance;
  }

  public setAdminOverride(task: string, provider: AIProvider, model: string): void {
    this.adminPolicyOverrides.set(task, { provider, model });
  }

  public clearAdminOverride(task: string): void {
    this.adminPolicyOverrides.delete(task);
  }

  public route(request: InferenceRequest): RoutingDecision {
    const task = (request.task || "copilot") as TaskCategory;
    const mode = request.mode || "NORMAL";
    const openAiConfigured = openAiServerAdapter.isConfigured();
    const openRouterConfigured = openRouterServerAdapter.isConfigured();

    const requiresTools = Boolean(request.tools && request.tools.length > 0);
    const requiresStructuredOutput = Boolean(request.structuredOutputSchema);

    // 1. Check Admin Policy Override
    if (this.adminPolicyOverrides.has(task)) {
      const override = this.adminPolicyOverrides.get(task)!;
      return {
        primaryProvider: override.provider,
        primaryModel: override.model,
        fallbackChain: this.buildFallbackChain(override.provider, override.model, requiresTools),
        requiresTools,
        requiresStructuredOutput,
        reason: "Administrator policy override applied",
      };
    }

    // 2. Check User / Request Overrides
    if (request.providerOverride && request.modelOverride) {
      return {
        primaryProvider: request.providerOverride,
        primaryModel: request.modelOverride,
        fallbackChain: this.buildFallbackChain(
          request.providerOverride,
          request.modelOverride,
          requiresTools,
        ),
        requiresTools,
        requiresStructuredOutput,
        reason: "Explicit caller override specified",
      };
    }

    // 3. Fallback to Deterministic if no external providers are configured
    if (!openAiConfigured && !openRouterConfigured) {
      return {
        primaryProvider: "deterministic",
        primaryModel: `deterministic-${String(task).split("_")[0] || "engine"}`,
        fallbackChain: [],
        requiresTools,
        requiresStructuredOutput,
        reason: "Zero external credentials configured; routing to deterministic template engine",
      };
    }

    // 4. Task-Specific Optimal Routing Matrix
    let chosenProvider: AIProvider = "openai";
    let chosenModel = "gpt-4o-mini";
    let reason = "Default cost-efficient analytical routing";

    switch (task) {
      case "architecture_review":
      case "deep_analysis":
      case "mission_planning":
      case "security_analysis":
        // High-reasoning heavy tasks: prefer GPT-4o or Claude 3.5 Sonnet
        if (openAiConfigured) {
          chosenProvider = "openai";
          chosenModel = "gpt-4o";
          reason = "High-depth reasoning & security architecture verified with GPT-4o";
        } else if (openRouterConfigured) {
          chosenProvider = "openrouter";
          chosenModel = "anthropic/claude-3.5-sonnet";
          reason = "High-depth architectural reasoning routed to Claude 3.5 Sonnet via OpenRouter";
        }
        break;

      case "report_synthesis":
      case "release_intelligence":
        // Narrative synthesis & SRS reports: prefer Claude 3.5 Sonnet or GPT-4o
        if (openRouterConfigured) {
          chosenProvider = "openrouter";
          chosenModel = "anthropic/claude-3.5-sonnet";
          reason = "Executive prose synthesis routed to Claude 3.5 Sonnet";
        } else if (openAiConfigured) {
          chosenProvider = "openai";
          chosenModel = "gpt-4o";
          reason = "Report synthesis routed to GPT-4o";
        }
        break;

      case "dataset_reasoning":
        // Tabular schema inspection & 1M context: Gemini 2.0 Flash or GPT-4o-mini
        if (openRouterConfigured) {
          chosenProvider = "openrouter";
          chosenModel = "google/gemini-2.0-flash-001";
          reason = "Massive context dataset inspection routed to Gemini 2.0 Flash";
        } else if (openAiConfigured) {
          chosenProvider = "openai";
          chosenModel = "gpt-4o-mini";
          reason = "Dataset reasoning routed to GPT-4o-mini";
        }
        break;

      case "code_review":
      case "requirement_analysis":
      case "investigation":
      case "agent_orchestration":
      case "copilot":
      case "lightweight_chat":
      default:
        // High-speed, high-concurrency, low-latency tasks: prefer GPT-4o-mini
        if (openAiConfigured) {
          chosenProvider = "openai";
          chosenModel = "gpt-4o-mini";
          reason = "Sub-400ms interactive Copilot response with GPT-4o-mini";
        } else if (openRouterConfigured) {
          chosenProvider = "openrouter";
          chosenModel = "openai/gpt-4o-mini";
          reason = "Low-latency Copilot response via OpenRouter GPT-4o-mini";
        }
        break;
    }

    const fallbackChain = this.buildFallbackChain(chosenProvider, chosenModel, requiresTools);

    return {
      primaryProvider: chosenProvider,
      primaryModel: chosenModel,
      fallbackChain,
      requiresTools,
      requiresStructuredOutput,
      reason,
    };
  }

  private buildFallbackChain(
    primaryProvider: AIProvider,
    primaryModel: string,
    requiresTools: boolean,
  ): Array<{ provider: AIProvider; model: string }> {
    const chain: Array<{ provider: AIProvider; model: string }> = [];
    const openAiConfigured = openAiServerAdapter.isConfigured();
    const openRouterConfigured = openRouterServerAdapter.isConfigured();

    if (primaryProvider === "openai") {
      // 1. Within-provider downgrade (e.g. gpt-4o -> gpt-4o-mini)
      if (primaryModel === "gpt-4o" && openAiConfigured) {
        chain.push({ provider: "openai", model: "gpt-4o-mini" });
      }
      // 2. Cross-provider fallback to OpenRouter
      if (openRouterConfigured) {
        chain.push({ provider: "openrouter", model: "openai/gpt-4o-mini" });
        if (!requiresTools) {
          chain.push({ provider: "openrouter", model: "meta-llama/llama-3.1-8b-instruct:free" });
        }
      }
    } else if (primaryProvider === "openrouter") {
      // 1. Within-provider downgrade (e.g. claude -> gpt-4o-mini)
      if (primaryModel.includes("sonnet") && openRouterConfigured) {
        chain.push({ provider: "openrouter", model: "openai/gpt-4o-mini" });
      }
      // 2. Cross-provider fallback to direct OpenAI
      if (openAiConfigured) {
        chain.push({ provider: "openai", model: "gpt-4o-mini" });
      }
    }

    // 3. Ultimate deterministic safety net (zero external dependencies)
    chain.push({ provider: "deterministic", model: "deterministic-engine" });

    return chain;
  }
}

export const modelRouter = ModelRouter.getInstance();
