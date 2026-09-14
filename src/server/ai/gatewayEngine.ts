/**
 * PROJECT BRAHMA — CENTRAL AI GATEWAY 2.0 ENGINE
 * Authoritative single execution boundary for all AI inference.
 * Sanitization, Budget Governance, Semantic Caching, Routing, Fallback Circuits, and Provenance.
 * Strictly ZERO SQL.
 */

import crypto from "crypto";
import {
  InferenceRequest,
  InferenceResponse,
  ProviderHealth,
  GatewayObservabilityMetrics,
  AIProvider,
} from "./types";
import { openAiServerAdapter } from "./adapters/openAiServerAdapter";
import { openRouterServerAdapter } from "./adapters/openRouterServerAdapter";
import { deterministicServerAdapter } from "./adapters/deterministicServerAdapter";
import { modelRouter } from "./modelRouter";
import { semanticCache } from "./semanticCache";

function sanitizePayload(input: unknown): unknown {
  if (typeof input === "string") {
    let sanitized = input;
    sanitized = sanitized.replace(/sk-[A-Za-z0-9_\-]{20,}/g, "[REDACTED_API_KEY]");
    sanitized = sanitized.replace(/ghp_[A-Za-z0-9]{20,}/g, "[REDACTED_GH_TOKEN]");
    sanitized = sanitized.replace(
      /-----BEGIN[ A-Z0-9_-]+-----[\s\S]*?-----END[ A-Z0-9_-]+-----/g,
      "[REDACTED_PRIVATE_KEY]",
    );
    sanitized = sanitized.replace(
      /(?:[A-Z0-9_]{3,})\s*=\s*['"]?[A-Za-z0-9_\-\.]{16,}['"]?/g,
      "[REDACTED_ENV_SECRET]",
    );
    return sanitized;
  }
  if (Array.isArray(input)) return input.map(sanitizePayload);
  if (input !== null && typeof input === "object") {
    const res: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input)) res[k] = sanitizePayload(v);
    return res;
  }
  return input;
}

export class GatewayEngine {
  private static instance: GatewayEngine | null = null;
  private metrics: GatewayObservabilityMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    fallbackCount: 0,
    cacheHits: 0,
    totalSpendUsd: 0,
    averageLatencyMs: 0,
    recentRequests: [],
  };

  private dailySpendTracker: Map<string, { spendUsd: number; resetDate: string }> = new Map();
  private dailyBudgetCapUsd = 5.0;

  private constructor() {}

  public static getInstance(): GatewayEngine {
    if (!GatewayEngine.instance) {
      GatewayEngine.instance = new GatewayEngine();
    }
    return GatewayEngine.instance;
  }

  public async execute(rawRequest: InferenceRequest): Promise<InferenceResponse> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    // 1. Inbound Sanitization
    const sanitizedMessages = (rawRequest.messages || []).map((m) => ({
      ...m,
      content: sanitizePayload(m.content) as string,
    }));
    const sanitizedSystemPrompt = rawRequest.systemPrompt
      ? (sanitizePayload(rawRequest.systemPrompt) as string)
      : undefined;

    const request: InferenceRequest = {
      ...rawRequest,
      messages: sanitizedMessages,
      systemPrompt: sanitizedSystemPrompt,
    };

    const task = request.task || "copilot";
    const mode = request.mode || "NORMAL";
    const projectId = request.projectId || "global";
    const userId = request.userId || "anonymous";

    // 2. Daily Spend Quota Check
    const todayStr: string = new Date().toISOString().split("T")[0] ?? "2026-09-14";
    let userSpend = this.dailySpendTracker.get(userId);
    if (!userSpend || userSpend.resetDate !== todayStr) {
      userSpend = { spendUsd: 0, resetDate: todayStr };
      this.dailySpendTracker.set(userId, userSpend);
    }

    const isNearBudget = (userSpend?.spendUsd ?? 0) >= this.dailyBudgetCapUsd * 0.8;
    const isBudgetExhausted = (userSpend?.spendUsd ?? 0) >= this.dailyBudgetCapUsd;

    if (isBudgetExhausted && (task === "copilot" || task === "lightweight_chat")) {
      return {
        ok: false,
        text: "Daily AI spend budget cap reached ($5.00 USD). Non-critical AI operations paused until tomorrow.",
        provider: "gateway",
        model: "budget-governor",
        cacheHit: false,
        fallbackUsed: false,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCostUsd: 0 },
        latencyMs: Date.now() - startTime,
        sha256: "",
        error: {
          code: "BRA_429_BUDGET_CAP",
          message: "Daily spend threshold exceeded. Try again tomorrow or request admin quota increase.",
          recoverable: false,
        },
      };
    }

    // 3. Cache Lookup
    const cacheKey = semanticCache.computeKey(
      task,
      request.messages[request.messages.length - 1]?.content || "",
      projectId,
      mode,
    );

    const cached = semanticCache.get(cacheKey);
    if (cached) {
      this.metrics.cacheHits++;
      this.metrics.successfulRequests++;
      this.recordRecentRequest(task, cached.provider, cached.model, cached.latencyMs, 0, 0, false, true, "OK");
      return cached;
    }

    // 4. Task-Aware Model Routing
    const routingDecision = modelRouter.route(request);
    let activeProvider = routingDecision.primaryProvider;
    let activeModel = routingDecision.primaryModel;

    if (isNearBudget && activeModel.includes("gpt-4o") && !activeModel.includes("mini")) {
      activeModel = "gpt-4o-mini"; // Downgrade to save spend
    }

    // 5. Execution with Fallback Circuit Breaker
    const executionChain: Array<{ provider: AIProvider; model: string }> = [
      { provider: activeProvider, model: activeModel },
      ...routingDecision.fallbackChain,
    ];

    let finalResponse: InferenceResponse | null = null;
    let fallbackUsed = false;
    const attemptedChain: string[] = [];

    for (const step of executionChain) {
      attemptedChain.push(`${step.provider}:${step.model}`);

      try {
        const stepRequest: InferenceRequest = {
          ...request,
          providerOverride: step.provider,
          modelOverride: step.model,
        };

        if (step.provider === "openai") {
          finalResponse = await openAiServerAdapter.complete(stepRequest);
        } else if (step.provider === "openrouter") {
          finalResponse = await openRouterServerAdapter.complete(stepRequest);
        } else {
          finalResponse = await deterministicServerAdapter.complete(stepRequest);
        }

        if (finalResponse && finalResponse.ok) {
          break; // Success!
        }
      } catch (err) {
        console.warn(`[Gateway] Provider ${step.provider} (${step.model}) error, triggering next fallback:`, err);
      }

      fallbackUsed = true;
      this.metrics.fallbackCount++;
    }

    // If somehow everything failed, use deterministic fallback
    if (!finalResponse || !finalResponse.ok) {
      fallbackUsed = true;
      finalResponse = await deterministicServerAdapter.complete(request);
    }

    // 6. Post-Execution Accounting & Metering
    finalResponse.fallbackUsed = fallbackUsed;
    finalResponse.fallbackChain = attemptedChain;
    finalResponse.latencyMs = Date.now() - startTime;

    const cost = finalResponse.usage.estimatedCostUsd || 0;
    if (userSpend) {
      userSpend.spendUsd += cost;
    }
    this.metrics.totalSpendUsd += cost;

    if (finalResponse.ok) {
      this.metrics.successfulRequests++;
      // Store in cache
      semanticCache.set(cacheKey, finalResponse, 24, projectId, mode);
    } else {
      this.metrics.failedRequests++;
    }

    // Update rolling average latency
    const n = this.metrics.successfulRequests + this.metrics.failedRequests;
    this.metrics.averageLatencyMs = Math.round(
      (this.metrics.averageLatencyMs * (n - 1) + finalResponse.latencyMs) / n,
    );

    this.recordRecentRequest(
      task,
      finalResponse.provider,
      finalResponse.model,
      finalResponse.latencyMs,
      finalResponse.usage.totalTokens,
      cost,
      fallbackUsed,
      false,
      finalResponse.ok ? "OK" : "FAIL",
    );

    return finalResponse;
  }

  private recordRecentRequest(
    task: string,
    provider: string,
    model: string,
    latencyMs: number,
    tokens: number,
    costUsd: number,
    fallbackUsed: boolean,
    cacheHit: boolean,
    status: "OK" | "FAIL",
  ): void {
    const item = {
      id: crypto.randomUUID().substring(0, 8),
      timestamp: new Date().toISOString(),
      task,
      provider,
      model,
      latencyMs,
      tokens,
      costUsd,
      fallbackUsed,
      cacheHit,
      status,
    };
    this.metrics.recentRequests.unshift(item);
    if (this.metrics.recentRequests.length > 50) {
      this.metrics.recentRequests.pop();
    }
  }

  public async getHealth(): Promise<{
    status: "HEALTHY" | "DEGRADED" | "OFFLINE";
    gatewayVersion: string;
    providers: ProviderHealth[];
    cache: ReturnType<typeof semanticCache.getMetrics>;
  }> {
    const [openAiHealth, openRouterHealth, detHealth] = await Promise.all([
      openAiServerAdapter.healthCheck(),
      openRouterServerAdapter.healthCheck(),
      deterministicServerAdapter.healthCheck(),
    ]);

    const isAnyExternalHealthy = openAiHealth.isHealthy || openRouterHealth.isHealthy;
    const isBothExternalHealthy = openAiHealth.isHealthy && openRouterHealth.isHealthy;

    const status = isBothExternalHealthy
      ? "HEALTHY"
      : isAnyExternalHealthy
        ? "DEGRADED"
        : "OFFLINE";

    return {
      status,
      gatewayVersion: "2.0.0-LEVIATHAN",
      providers: [openAiHealth, openRouterHealth, detHealth],
      cache: semanticCache.getMetrics(),
    };
  }

  public getObservability(): GatewayObservabilityMetrics {
    return {
      ...this.metrics,
    };
  }
}

export const gatewayEngine = GatewayEngine.getInstance();
