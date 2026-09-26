/**
 * VYRON — CONNECTOR HEALTH & SLO ENGINE
 * GOD MODE vULTIMA vNEXT — Strictly ZERO SQL.
 * Calculates contractual freshness, event lag, rate limit headroom, and error budgets.
 */

import { VibeProviderId, ProviderHealthSlo, FreshnessState, IntegrationHealthStatus } from "./types";
import { vibeAdapterRegistry } from "./vibeAdapterSdk";

export class ConnectorHealthSloEngine {
  private static instance: ConnectorHealthSloEngine;
  private healthCache = new Map<VibeProviderId, ProviderHealthSlo>();

  private constructor() {}

  static getInstance(): ConnectorHealthSloEngine {
    if (!ConnectorHealthSloEngine.instance) {
      ConnectorHealthSloEngine.instance = new ConnectorHealthSloEngine();
    }
    return ConnectorHealthSloEngine.instance;
  }

  async evaluateAllProviders(): Promise<ProviderHealthSlo[]> {
    const adapters = vibeAdapterRegistry.getAll();
    const results: ProviderHealthSlo[] = [];

    for (const adapter of adapters) {
      const slo = await adapter.checkHealth();
      this.healthCache.set(adapter.providerId, slo);
      results.push(slo);
    }

    return results;
  }

  getHealthSlo(providerId: VibeProviderId): ProviderHealthSlo | undefined {
    return this.healthCache.get(providerId);
  }

  calculateAggregateHealth(): {
    overallScore: number;
    healthyCount: number;
    degradedCount: number;
    avgLatencyMs: number;
    minRateLimitPercent: number;
  } {
    const all = Array.from(this.healthCache.values());
    if (all.length === 0) {
      return { overallScore: 100, healthyCount: 0, degradedCount: 0, avgLatencyMs: 0, minRateLimitPercent: 100 };
    }

    const healthyCount = all.filter((s) => s.healthState === "HEALTHY").length;
    const degradedCount = all.filter((s) => s.healthState !== "HEALTHY").length;
    const avgLatency = Math.round(all.reduce((acc, s) => acc + s.latencyMs, 0) / all.length);
    const minRateLimit = Math.min(...all.map((s) => s.rateLimitRemainingPercent));
    const overallScore = Math.round((healthyCount / all.length) * 100);

    return {
      overallScore,
      healthyCount,
      degradedCount,
      avgLatencyMs: avgLatency,
      minRateLimitPercent: minRateLimit,
    };
  }
}

export const connectorHealthSloEngine = ConnectorHealthSloEngine.getInstance();
