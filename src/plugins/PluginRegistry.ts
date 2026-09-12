/**
 * PROJECT BRAHMA — PLUGIN REGISTRY SINGLETON (PHASE A.2, A.3, A.4)
 * In-process MCP-equivalent execution boundary.
 * Enforces typed tools, readable resources, and transparent capability execution.
 */

import {
  PluginTool,
  PluginResource,
  PluginContext,
  ToolResult,
} from "./types";
import { BrahmaIntelligenceError } from "@/lib/errors/brahmaErrors";

export class PluginRegistry {
  private static instance: PluginRegistry | null = null;
  private tools: Map<string, PluginTool> = new Map();
  private resources: Map<string, PluginResource> = new Map();

  private constructor() {}

  public static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry();
    }
    return PluginRegistry.instance;
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
    ctx: PluginContext
  ): Promise<ToolResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      const available = Array.from(this.tools.keys()).join(", ");
      throw new BrahmaIntelligenceError(
        "BRA-601",
        `Tool '${name}' not found in PluginRegistry. Available tools: [${available}]`
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
            `Tool '${name}' execution timed out after ${timeoutMs}ms.`
          )
        );
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([tool.handler(args, ctx), timeoutPromise]);
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
    ctx: PluginContext
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
  }
}

export const pluginRegistry = PluginRegistry.getInstance();
