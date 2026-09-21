/**
 * VYRON — AI OBSERVABILITY & TRACE PIPELINE (RELEASE 11)
 * Real-time monitoring of AI requests, latencies, tokens, spend, and fallback circuit events.
 * Strictly ZERO Raw SQL.
 */

export interface AIObservabilityTrace {
  id: string;
  timestamp: string;
  agentRole: string;
  stage: string;
  provider: string;
  model: string;
  tokensUsed: number;
  estimatedCostUsd: number;
  latencyMs: number;
  fallbackUsed: boolean;
  success: boolean;
  error?: string;
}

export interface ObservabilitySummary {
  totalRequests: number;
  totalTokens: number;
  totalEstimatedCostUsd: number;
  averageLatencyMs: number;
  fallbackRatePercentage: number;
  providerDistribution: Record<string, number>;
  recentTraces: AIObservabilityTrace[];
}

export class AiObservabilityEngine {
  private static instance: AiObservabilityEngine | null = null;
  private traces: AIObservabilityTrace[] = [];
  private maxTraces = 100;

  private constructor() {}

  public static getInstance(): AiObservabilityEngine {
    if (!AiObservabilityEngine.instance) {
      AiObservabilityEngine.instance = new AiObservabilityEngine();
    }
    return AiObservabilityEngine.instance;
  }

  public recordTrace(trace: Omit<AIObservabilityTrace, "id" | "timestamp">): AIObservabilityTrace {
    const fullTrace: AIObservabilityTrace = {
      ...trace,
      id: `trace-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    this.traces.unshift(fullTrace);
    if (this.traces.length > this.maxTraces) {
      this.traces.pop();
    }

    return fullTrace;
  }

  public getSummary(): ObservabilitySummary {
    const totalRequests = this.traces.length;
    if (totalRequests === 0) {
      return {
        totalRequests: 0,
        totalTokens: 0,
        totalEstimatedCostUsd: 0,
        averageLatencyMs: 0,
        fallbackRatePercentage: 0,
        providerDistribution: {},
        recentTraces: [],
      };
    }

    let totalTokens = 0;
    let totalCost = 0;
    let totalLatency = 0;
    let fallbacks = 0;
    const providerDist: Record<string, number> = {};

    for (const t of this.traces) {
      totalTokens += t.tokensUsed;
      totalCost += t.estimatedCostUsd;
      totalLatency += t.latencyMs;
      if (t.fallbackUsed) fallbacks++;
      providerDist[t.provider] = (providerDist[t.provider] || 0) + 1;
    }

    return {
      totalRequests,
      totalTokens,
      totalEstimatedCostUsd: Number(totalCost.toFixed(4)),
      averageLatencyMs: Math.round(totalLatency / totalRequests),
      fallbackRatePercentage: Number(((fallbacks / totalRequests) * 100).toFixed(1)),
      providerDistribution: providerDist,
      recentTraces: this.traces.slice(0, 10),
    };
  }

  public clear(): void {
    this.traces = [];
  }
}

export const aiObservabilityEngine = AiObservabilityEngine.getInstance();
