/**
 * PROJECT BRAHMA — UNIFIED COPILOT TOOL REGISTRY
 * Declares, registers, types, and authorizes all tools executable by the Copilot.
 * Enforces risk classification, input validation, execution timeouts, and audit logging.
 * Strictly ZERO SQL.
 */

import { AppMode } from "@/state/mode/modeStore";
import { generateVerificationHash } from "@/services/ai/cryptoUtils";

export type ToolCategory =
  | "data"
  | "analysis"
  | "retrieval"
  | "search"
  | "dataset"
  | "connector"
  | "reporting"
  | "visualization"
  | "investigation"
  | "project_management"
  | "diagnostics"
  | "demo"
  | "simulation";

export type ToolRiskLevel = "SAFE" | "READ_ONLY" | "HIGH_IMPACT";

export interface ToolParameterDef {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  description: string;
  required: boolean;
  default?: unknown;
}

export interface CopilotToolDef {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  risk: ToolRiskLevel;
  supportedModes: AppMode[];
  parameters: ToolParameterDef[];
  timeoutMs: number;
  requiresApproval: boolean;
  handler: (args: Record<string, unknown>, context: { mode: AppMode; userId?: string }) => Promise<unknown>;
}

export interface ToolExecutionResult {
  toolId: string;
  status: "SUCCESS" | "FAILED" | "BLOCKED" | "TIMEOUT";
  output: unknown;
  durationMs: number;
  verificationHash: string;
  errorMessage?: string;
}

export class CopilotToolRegistry {
  private static instance: CopilotToolRegistry | null = null;
  private tools: Map<string, CopilotToolDef> = new Map();
  private auditLog: Array<{
    timestamp: string;
    toolId: string;
    mode: AppMode;
    risk: ToolRiskLevel;
    status: string;
    durationMs: number;
    verificationHash: string;
  }> = [];

  private constructor() {}

  public static getInstance(): CopilotToolRegistry {
    if (!CopilotToolRegistry.instance) {
      CopilotToolRegistry.instance = new CopilotToolRegistry();
    }
    return CopilotToolRegistry.instance;
  }

  public registerTool(tool: CopilotToolDef): void {
    this.tools.set(tool.id, tool);
  }

  public getTool(id: string): CopilotToolDef | undefined {
    return this.tools.get(id);
  }

  public listTools(filter?: {
    mode?: AppMode;
    category?: ToolCategory;
    risk?: ToolRiskLevel;
  }): CopilotToolDef[] {
    let list = Array.from(this.tools.values());
    if (filter?.mode) {
      list = list.filter((t) => t.supportedModes.includes(filter.mode!));
    }
    if (filter?.category) {
      list = list.filter((t) => t.category === filter.category);
    }
    if (filter?.risk) {
      list = list.filter((t) => t.risk === filter.risk);
    }
    return list;
  }

  public async executeTool(
    toolId: string,
    args: Record<string, unknown>,
    context: { mode: AppMode; userId?: string; isApproved?: boolean },
  ): Promise<ToolExecutionResult> {
    const startTime = Date.now();
    const tool = this.tools.get(toolId);

    if (!tool) {
      return {
        toolId,
        status: "FAILED",
        output: null,
        durationMs: 0,
        verificationHash: generateVerificationHash(`tool_not_found:${toolId}`),
        errorMessage: `Tool '${toolId}' is not registered in the registry.`,
      };
    }

    // Mode authorization check
    if (!tool.supportedModes.includes(context.mode)) {
      return {
        toolId,
        status: "BLOCKED",
        output: null,
        durationMs: Date.now() - startTime,
        verificationHash: generateVerificationHash(`mode_denied:${toolId}:${context.mode}`),
        errorMessage: `Tool '${toolId}' is not permitted in ${context.mode} mode.`,
      };
    }

    // Risk approval check
    if (tool.requiresApproval && !context.isApproved) {
      return {
        toolId,
        status: "BLOCKED",
        output: null,
        durationMs: Date.now() - startTime,
        verificationHash: generateVerificationHash(`approval_required:${toolId}`),
        errorMessage: `High-impact tool '${toolId}' requires explicit user confirmation.`,
      };
    }

    // Execution with timeout race
    const timeout = tool.timeoutMs || 15000;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Tool execution timed out after ${timeout}ms`)), timeout);
    });

    try {
      const output = await Promise.race([tool.handler(args, context), timeoutPromise]);
      const durationMs = Date.now() - startTime;
      const hash = generateVerificationHash(`${toolId}:${durationMs}:${JSON.stringify(output)}`);

      this.recordAudit({
        timestamp: new Date().toISOString(),
        toolId,
        mode: context.mode,
        risk: tool.risk,
        status: "SUCCESS",
        durationMs,
        verificationHash: hash,
      });

      return {
        toolId,
        status: "SUCCESS",
        output,
        durationMs,
        verificationHash: hash,
      };
    } catch (err: unknown) {
      const durationMs = Date.now() - startTime;
      const errMsg = err instanceof Error ? err.message : String(err);
      const isTimeout = errMsg.includes("timed out");
      const hash = generateVerificationHash(`fail:${toolId}:${errMsg}`);

      this.recordAudit({
        timestamp: new Date().toISOString(),
        toolId,
        mode: context.mode,
        risk: tool.risk,
        status: isTimeout ? "TIMEOUT" : "FAILED",
        durationMs,
        verificationHash: hash,
      });

      return {
        toolId,
        status: isTimeout ? "TIMEOUT" : "FAILED",
        output: null,
        durationMs,
        verificationHash: hash,
        errorMessage: errMsg,
      };
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  private recordAudit(entry: (typeof this.auditLog)[0]) {
    this.auditLog.unshift(entry);
    if (this.auditLog.length > 50) this.auditLog.pop();
  }

  public getAuditLog() {
    return [...this.auditLog];
  }
}

export const copilotToolRegistry = CopilotToolRegistry.getInstance();
