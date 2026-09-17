/**
 * VYRON — AGENT RUNTIME EXECUTION ENGINE (RELEASE 03)
 * Manages agent lifecycles, execution states, tool invocations, timeouts, and structured output validation.
 * Strictly ZERO Raw SQL.
 */

import { AgentRole, ProjectLifecycleStage } from "@/types/aiProjectControlPlane";
import { agentRegistry } from "./agentRegistry";
import { toolRegistry } from "./toolRegistry";
import { toolAuthorizationEngine } from "./toolAuthorization";
import { aiModelGateway, GatewayExecutionOptions } from "../gateway/aiModelGateway";
import { projectContextCompiler } from "../context/projectContextCompiler";
import { aiProjectStore } from "@/state/aiProject/aiProjectStore";

export interface AgentExecutionRequest {
  role: AgentRole;
  stage: ProjectLifecycleStage;
  customContext?: string | undefined;
  providerOverride?: "openai" | "openrouter" | undefined;
  timeoutMs?: number | undefined;
}

export interface AgentExecutionResponse<T = unknown> {
  success: boolean;
  role: AgentRole;
  data: T;
  latencyMs: number;
  tokensUsed: number;
  providerUsed: string;
  modelUsed: string;
  toolsInvoked: string[];
  error?: string | undefined;
}

export class AgentRuntime {
  private static instance: AgentRuntime | null = null;

  private constructor() {}

  public static getInstance(): AgentRuntime {
    if (!AgentRuntime.instance) {
      AgentRuntime.instance = new AgentRuntime();
    }
    return AgentRuntime.instance;
  }

  public async executeAgent<T>(
    request: AgentExecutionRequest,
    fallbackFactory: () => T,
  ): Promise<AgentExecutionResponse<T>> {
    const startTime = Date.now();
    const agent = agentRegistry.getAgent(request.role);

    if (!agent) {
      return {
        success: false,
        role: request.role,
        data: fallbackFactory(),
        latencyMs: 0,
        tokensUsed: 0,
        providerUsed: "none",
        modelUsed: "none",
        toolsInvoked: [],
        error: `Agent ${request.role} is not registered.`,
      };
    }

    // 1. Compile scoped L0-L7 task context
    const currentState = aiProjectStore.getState();
    const compiledContext = projectContextCompiler.compileContext(
      request.role,
      currentState,
      request.customContext || "",
    );

    const fullPayload = `${compiledContext.l0_system_policy}\n${compiledContext.l1_platform_rules}\n${compiledContext.l2_project_identity}\n${compiledContext.l5_task_scoped_state}\n${compiledContext.l7_user_directives}`;

    const toolsInvoked: string[] = [];

    // 2. Build execution options respecting exactOptionalPropertyTypes
    const gatewayOptions: GatewayExecutionOptions = {
      role: request.role,
      contextPayload: fullPayload,
      ...(request.providerOverride ? { provider: request.providerOverride } : {}),
    };

    // 3. Delegate to AI Model Gateway with fallback resilience
    const gatewayResult = await aiModelGateway.executeStructuredTask<T>(
      gatewayOptions,
      fallbackFactory,
    );

    const response: AgentExecutionResponse<T> = {
      success: gatewayResult.success,
      role: request.role,
      data: gatewayResult.data,
      latencyMs: Date.now() - startTime,
      tokensUsed: gatewayResult.tokensUsed,
      providerUsed: gatewayResult.providerUsed,
      modelUsed: gatewayResult.modelUsed,
      toolsInvoked,
      ...(gatewayResult.error ? { error: gatewayResult.error } : {}),
    };

    return response;
  }

  public async invokeAgentTool(
    agentRole: AgentRole,
    stage: ProjectLifecycleStage,
    toolName: string,
    args: Record<string, unknown>,
  ): Promise<{ success: boolean; result?: unknown | undefined; error?: string | undefined }> {
    const auth = toolAuthorizationEngine.authorize(agentRole, toolName, stage);
    if (!auth.allowed) {
      return { success: false, error: auth.reason };
    }

    try {
      const result = await toolRegistry.executeTool(toolName, args);
      return { success: true, result };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }
}

export const agentRuntime = AgentRuntime.getInstance();
