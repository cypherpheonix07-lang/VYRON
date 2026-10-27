/**
 * VYRON — DUAL-PROVIDER REGISTRY (RELEASE 01)
 * Centralized registry for OpenRouter, OpenAI, and Deterministic fallback providers.
 * Strictly ZERO Raw SQL.
 */

import { AIProvider, ProviderHealth } from "./types";
import { IAIProvider, ProviderCapabilities } from "./providers/types";
import { openRouterServerAdapter } from "./adapters/openRouterServerAdapter";
import { openAiServerAdapter } from "./adapters/openAiServerAdapter";
import { deterministicServerAdapter } from "./adapters/deterministicServerAdapter";

export class ProviderRegistry {
  private static instance: ProviderRegistry | null = null;
  private providers: Map<AIProvider, IAIProvider> = new Map();

  private constructor() {
    this.register(openRouterServerAdapter as unknown as IAIProvider);
    this.register(openAiServerAdapter as unknown as IAIProvider);
    this.register(deterministicServerAdapter as unknown as IAIProvider);
  }

  public static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  public register(provider: IAIProvider): void {
    this.providers.set(provider.id, provider);
  }

  public getProvider(id: AIProvider): IAIProvider | undefined {
    return this.providers.get(id);
  }

  public listProviders(): Array<{
    id: AIProvider;
    name: string;
    isConfigured: boolean;
    capabilities: ProviderCapabilities;
  }> {
    const list: Array<{
      id: AIProvider;
      name: string;
      isConfigured: boolean;
      capabilities: ProviderCapabilities;
    }> = [];

    for (const provider of this.providers.values()) {
      list.push({
        id: provider.id,
        name: provider.name,
        isConfigured: provider.isConfigured(),
        capabilities: provider.getCapabilities(),
      });
    }

    return list;
  }

  public async checkAllHealth(): Promise<Record<AIProvider, ProviderHealth>> {
    const results: Partial<Record<AIProvider, ProviderHealth>> = {};

    for (const [id, provider] of this.providers.entries()) {
      try {
        results[id] = await provider.healthCheck();
      } catch (err: unknown) {
        results[id] = {
          provider: id,
          isConfigured: provider.isConfigured(),
          isHealthy: false,
          lastChecked: new Date().toISOString(),
          latencyMs: 0,
          errorMessage: (err as Error).message,
          activeModelsCount: 0,
        };
      }
    }

    return results as Record<AIProvider, ProviderHealth>;
  }
}

export const providerRegistry = ProviderRegistry.getInstance();
