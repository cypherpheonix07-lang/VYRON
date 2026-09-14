/**
 * PROJECT BRAHMA — PLUGIN REGISTRY SINGLETON
 * In-process MCP-equivalent execution boundary.
 * Enforces typed tools, manifests, lifecycle states (ACTIVE/DISABLED), health, and transparent capability execution.
 * Strictly ZERO SQL.
 */

import {
  PluginTool,
  PluginResource,
  PluginContext,
  ToolResult,
  PluginManifest,
  PluginAuditEvent,
  PluginCategory,
  PluginLifecycleState,
} from "./types";
import { BrahmaIntelligenceError } from "@/lib/errors/brahmaErrors";
import { generateVerificationHash } from "@/services/ai/cryptoUtils";

type PluginRegistryListener = (manifests: PluginManifest[]) => void;

export class PluginRegistry {
  private static instance: PluginRegistry | null = null;
  private tools: Map<string, PluginTool> = new Map();
  private resources: Map<string, PluginResource> = new Map();
  private manifests: Map<string, PluginManifest> = new Map();
  private auditLog: PluginAuditEvent[] = [];
  private listeners: Set<PluginRegistryListener> = new Set();

  private constructor() {}

  public static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry();
    }
    return PluginRegistry.instance;
  }

  public subscribe(listener: PluginRegistryListener): () => void {
    this.listeners.add(listener);
    listener(this.listManifests());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const list = this.listManifests();
    this.listeners.forEach((l) => l(list));
  }

  public registerManifest(manifest: PluginManifest): void {
    this.manifests.set(manifest.id, { ...manifest });
    this.notify();
  }

  public getManifest(id: string): PluginManifest | undefined {
    return this.manifests.get(id);
  }

  public listManifests(filter?: {
    category?: PluginCategory;
    status?: PluginLifecycleState;
  }): PluginManifest[] {
    let list = Array.from(this.manifests.values());
    if (filter?.category) {
      list = list.filter((p) => p.category === filter.category);
    }
    if (filter?.status) {
      list = list.filter((p) => p.lifecycleState === filter.status);
    }
    return list;
  }

  public activatePlugin(id: string, userId = "operator"): void {
    const p = this.manifests.get(id);
    if (!p) throw new Error(`Plugin '${id}' not found in registry.`);
    p.lifecycleState = "ACTIVE";
    p.lastActiveAt = new Date().toISOString();
    this.recordAudit({
      id: `evt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      pluginId: id,
      action: "ACTIVATED",
      userId,
      details: `Plugin '${p.name}' activated.`,
      verificationHash: generateVerificationHash(`activate:${id}:${Date.now()}`),
    });
    this.notify();
  }

  public deactivatePlugin(id: string, userId = "operator"): void {
    const p = this.manifests.get(id);
    if (!p) throw new Error(`Plugin '${id}' not found in registry.`);
    p.lifecycleState = "DISABLED";
    this.recordAudit({
      id: `evt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      pluginId: id,
      action: "DEACTIVATED",
      userId,
      details: `Plugin '${p.name}' disabled.`,
      verificationHash: generateVerificationHash(`deactivate:${id}:${Date.now()}`),
    });
    this.notify();
  }

  public recordAudit(event: PluginAuditEvent): void {
    this.auditLog.unshift(event);
    if (this.auditLog.length > 50) this.auditLog.pop();
  }

  public getAuditLog(): PluginAuditEvent[] {
    return [...this.auditLog];
  }

  public registerTool(tool: PluginTool): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Duplicate tool registration: '${tool.name}' is already registered in PluginRegistry.`);
    }
    this.tools.set(tool.name, tool);
  }

  public registerResource(resource: PluginResource): void {
    this.resources.set(resource.uri, resource);
  }

  public async callTool(
    name: string,
    args: unknown,
    ctx: PluginContext,
  ): Promise<ToolResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      const available = Array.from(this.tools.keys()).join(", ");
      throw new BrahmaIntelligenceError(
        "BRA-601",
        `Tool '${name}' not found in PluginRegistry. Available tools: [${available}]`,
      );
    }

    // Wrap execution with 30s timeout enforcement (BRA-602)
    const timeoutMs = 30000;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(
          new BrahmaIntelligenceError(
            "BRA-602",
            `Tool '${name}' execution timed out after ${timeoutMs}ms.`,
          ),
        );
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([tool.handler(args, ctx), timeoutPromise]);
      this.recordAudit({
        id: `evt_${Date.now()}`,
        timestamp: new Date().toISOString(),
        pluginId: name,
        action: "TOOL_INVOKED",
        userId: ctx.userId,
        details: `Tool '${name}' invoked successfully.`,
        verificationHash: generateVerificationHash(`tool_call:${name}:${Date.now()}`),
      });
      return result;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  public listTools(): PluginTool[] {
    return Array.from(this.tools.values());
  }

  public async readResource(
    uri: string,
    ctx: PluginContext,
  ): Promise<string | Uint8Array> {
    const resource = this.resources.get(uri);
    if (!resource) {
      throw new Error(`Resource with URI '${uri}' not registered in PluginRegistry.`);
    }
    return resource.read(ctx);
  }

  public clear(): void {
    this.tools.clear();
    this.resources.clear();
    this.manifests.clear();
  }
}

export const pluginRegistry = PluginRegistry.getInstance();
