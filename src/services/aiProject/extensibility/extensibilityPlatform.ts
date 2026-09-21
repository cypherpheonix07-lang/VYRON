/**
 * VYRON — POST-GA EXTENSIBILITY PLATFORM (RELEASE 13)
 * Dynamic extension points for registering future AI providers, custom model families,
 * specialist engineering agents, and domain-specific validation tools.
 * Strictly ZERO Raw SQL.
 */

import { IAIProviderClient } from "@/services/ai/providers/clientProviderTypes";
import { clientProviderRegistry } from "@/services/ai/providers/clientProviderRegistry";
import { toolRegistry, ToolDefinition } from "../runtime/toolRegistry";

export interface CustomAgentExtension {
  id: string;
  name: string;
  targetStage: string;
  systemDirective: string;
  allowedTools: string[];
}

export class ExtensibilityPlatform {
  private static instance: ExtensibilityPlatform | null = null;
  private customAgents: Map<string, CustomAgentExtension> = new Map();
  private registeredProviders: string[] = ["openai", "openrouter", "deterministic"];

  private constructor() {}

  public static getInstance(): ExtensibilityPlatform {
    if (!ExtensibilityPlatform.instance) {
      ExtensibilityPlatform.instance = new ExtensibilityPlatform();
    }
    return ExtensibilityPlatform.instance;
  }

  /**
   * Registers a new AI Provider into the client gateway (e.g. Anthropic Direct, Google Vertex, Ollama).
   */
  public registerProvider(provider: IAIProviderClient): void {
    clientProviderRegistry.register(provider);
    if (!this.registeredProviders.includes(provider.id)) {
      this.registeredProviders.push(provider.id);
    }
  }

  /**
   * Registers a custom specialist engineering agent.
   */
  public registerAgent(agent: CustomAgentExtension): void {
    this.customAgents.set(agent.id, agent);
  }

  /**
   * Registers a custom engineering tool into the Tool Registry.
   */
  public registerTool(tool: ToolDefinition): void {
    toolRegistry.register(tool);
  }

  public listRegisteredProviders(): string[] {
    return [...this.registeredProviders];
  }

  public listCustomAgents(): CustomAgentExtension[] {
    return Array.from(this.customAgents.values());
  }
}

export const extensibilityPlatform = ExtensibilityPlatform.getInstance();
