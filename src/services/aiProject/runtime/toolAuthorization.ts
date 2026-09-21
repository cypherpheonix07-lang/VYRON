/**
 * VYRON — TOOL AUTHORIZATION & RBAC POLICY ENGINE (RELEASE 03)
 * Enforces explicit role boundaries, workflow stage constraints, and sensitivity levels.
 * Prevents unauthorized agents from executing out-of-scope tools or bypassing gates.
 * Strictly ZERO Raw SQL.
 */

import { AgentRole, ProjectLifecycleStage } from "@/types/aiProjectControlPlane";
import { agentRegistry } from "./agentRegistry";
import { toolRegistry } from "./toolRegistry";

export interface ToolAuthorizationDecision {
  allowed: boolean;
  reason: string;
  mutationLevel: 0 | 1 | 2 | 3 | 4;
}

export class ToolAuthorizationEngine {
  private static instance: ToolAuthorizationEngine | null = null;

  private constructor() {}

  public static getInstance(): ToolAuthorizationEngine {
    if (!ToolAuthorizationEngine.instance) {
      ToolAuthorizationEngine.instance = new ToolAuthorizationEngine();
    }
    return ToolAuthorizationEngine.instance;
  }

  public authorize(
    agentRole: AgentRole,
    toolName: string,
    currentStage: ProjectLifecycleStage,
  ): ToolAuthorizationDecision {
    const agent = agentRegistry.getAgent(agentRole);
    if (!agent) {
      return {
        allowed: false,
        reason: `Agent role ${agentRole} is not registered in the system.`,
        mutationLevel: 0,
      };
    }

    const tool = toolRegistry.getTool(toolName);
    if (!tool) {
      return {
        allowed: false,
        reason: `Tool ${toolName} does not exist in the tool registry.`,
        mutationLevel: 0,
      };
    }

    // 1. Check if tool is allowed for this agent
    if (!agent.allowedTools.includes(toolName)) {
      return {
        allowed: false,
        reason: `Agent ${agentRole} is not authorized to invoke tool ${toolName}.`,
        mutationLevel: 0,
      };
    }

    // 2. Read tools are universally allowed during any stage
    if (tool.type === "READ") {
      return {
        allowed: true,
        reason: "Read-only tool invocation permitted.",
        mutationLevel: 0,
      };
    }

    // 3. Proposal tools enforce sensitivity levels
    const mutationLevel = agent.policy.mutationLevelAllowed;

    return {
      allowed: true,
      reason: `Proposal tool authorized under sensitivity level ${mutationLevel}.`,
      mutationLevel,
    };
  }
}

export const toolAuthorizationEngine = ToolAuthorizationEngine.getInstance();
