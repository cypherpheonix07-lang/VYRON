/**
 * VYRON — CLIENT PROVIDER REGISTRY (RELEASE 01 & 02)
 * Centralized client-side registry for OpenAI, OpenRouter, and Deterministic fallback providers.
 * Strictly ZERO Raw SQL.
 */

import type { IAIProviderClient, ClientAIProviderId } from "./clientProviderTypes.ts";
import { openAiClientProvider } from "./openAiClientProvider.ts";
import { openRouterClientProvider } from "./openRouterClientProvider.ts";

export class ClientProviderRegistry {
  private static instance: ClientProviderRegistry | null = null;
  private providers: Map<ClientAIProviderId, IAIProviderClient> = new Map();

  private constructor() {
    this.register(openAiClientProvider);
    this.register(openRouterClientProvider);
  }

  public static getInstance(): ClientProviderRegistry {
    if (!ClientProviderRegistry.instance) {
      ClientProviderRegistry.instance = new ClientProviderRegistry();
    }
    return ClientProviderRegistry.instance;
  }

  public register(provider: IAIProviderClient): void {
    this.providers.set(provider.id, provider);
  }

  public getProvider(id: ClientAIProviderId): IAIProviderClient | undefined {
    return this.providers.get(id);
  }

  public listProviders(): IAIProviderClient[] {
    return Array.from(this.providers.values());
  }

  public async getAvailableProviders(): Promise<ClientAIProviderId[]> {
    const available: ClientAIProviderId[] = [];
    for (const [id, provider] of this.providers.entries()) {
      const isAvail = await provider.isAvailable();
      if (isAvail) available.push(id);
    }
    return available;
  }
}

export const clientProviderRegistry = ClientProviderRegistry.getInstance();
