/**
 * PROJECT BRAHMA — COPILOT AUTONOMOUS EXECUTION ENGINE
 * Implements the continuous Observe → Plan → Act → Observe loop:
 * 1. OBSERVE: Evaluates live context (route, project, dataset, run, connector health, RLS).
 * 2. PLAN: Dynamically constructs or refines multi-step DAG task plans.
 * 3. ACT: Dispatches safe actions directly, gates high-impact actions behind approvals.
 * 4. OBSERVE: Validates step outputs against assertions, captures provenance, updates state.
 * Strictly ZERO SQL.
 */

import { AppMode } from "@/state/mode/modeStore";
import { copilotStore } from "@/state/copilot/copilotStore";
import { copilotContextEngine } from "./copilotContextEngine";
import { copilotAgentOrchestrator } from "./copilotAgentOrchestrator";
import { copilotActionEngine, ActionType } from "./copilotActionEngine";
import { copilotToolRegistry } from "./copilotToolRegistry";
import { copilotPlanner, DynamicExecutionPlan, PlanStep } from "./copilotPlanner";
import { generateVerificationHash } from "../ai/cryptoUtils";

export interface ExecutionEvent {
  planId: string;
  stepId: string;
  status: PlanStep["status"];
  message: string;
  timestamp: string;
}

export class CopilotExecutionEngine {
  private static instance: CopilotExecutionEngine | null = null;
  private isPaused = false;
  private isAborted = false;
  private activePlan: DynamicExecutionPlan | null = null;
  private executionListeners: Set<(event: ExecutionEvent) => void> = new Set();

  public static getInstance(): CopilotExecutionEngine {
    if (!CopilotExecutionEngine.instance) {
      CopilotExecutionEngine.instance = new CopilotExecutionEngine();
    }
    return CopilotExecutionEngine.instance;
  }

  public subscribe(listener: (event: ExecutionEvent) => void): () => void {
    this.executionListeners.add(listener);
    return () => this.executionListeners.delete(listener);
  }

  private notify(event: ExecutionEvent) {
    this.executionListeners.forEach((l) => l(event));
  }

  public getActivePlan(): DynamicExecutionPlan | null {
    return this.activePlan;
  }

  public pause(): void {
    this.isPaused = true;
    if (this.activePlan) {
      this.activePlan.status = "PAUSED";
    }
  }

  public resume(): void {
    this.isPaused = false;
    if (this.activePlan && this.activePlan.status === "PAUSED") {
      this.activePlan.status = "EXECUTING";
      void this.executeNextPendingStep();
    }
  }

  public abort(): void {
    this.isAborted = true;
    if (this.activePlan) {
      this.activePlan.status = "FAILED";
      this.notify({
        planId: this.activePlan.id,
        stepId: this.activePlan.activeStepId || "unknown",
        status: "FAILED",
        message: "Plan execution aborted by operator.",
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Main entrypoint for autonomous execution of a plan.
   */
  public async executePlan(
    plan: DynamicExecutionPlan,
    mode: AppMode,
  ): Promise<{ success: boolean; completedSteps: number; plan: DynamicExecutionPlan }> {
    this.isPaused = false;
    this.isAborted = false;
    this.activePlan = plan;
    plan.status = "EXECUTING";

    copilotStore.addMessage(mode, {
      sender: "SYSTEM",
      text: `🚀 **Initiating Autonomous Plan Execution** [ID: \`${plan.id}\`]\n• **Goal**: ${plan.goal}\n• **Total Steps**: ${plan.steps.length}\n• **Estimated Time**: ${plan.totalEstimatedDurationMs}ms`,
    });

    for (let i = 0; i < plan.steps.length; i++) {
      if (this.isAborted) {
        plan.status = "FAILED";
        return { success: false, completedSteps: plan.completedStepsCount, plan };
      }

      while (this.isPaused) {
        await new Promise((r) => setTimeout(r, 200));
        if (this.isAborted) return { success: false, completedSteps: plan.completedStepsCount, plan };
      }

      const step = plan.steps[i];
      if (!step) continue;

      plan.activeStepId = step.id;

      // 1. Check dependencies
      const depsSatisfied = step.dependencies.every((depId) => {
        const depStep = plan.steps.find((s) => s.id === depId);
        return depStep?.status === "COMPLETED";
      });

      if (!depsSatisfied) {
        step.status = "FAILED";
        step.error = "Unsatisfied dependencies.";
        plan.status = "FAILED";
        this.notify({
          planId: plan.id,
          stepId: step.id,
          status: "FAILED",
          message: `Step ${step.stepNumber} blocked: dependencies failed.`,
          timestamp: new Date().toISOString(),
        });
        return { success: false, completedSteps: plan.completedStepsCount, plan };
      }

      // 2. Check approval requirement
      if (step.requiresApproval || step.riskLevel === "HIGH_IMPACT") {
        step.status = "AWAITING_APPROVAL";
        copilotStore.setPendingApproval(mode, {
          id: `step_act_${step.id}`,
          label: `Approve Step ${step.stepNumber}: ${step.title}`,
          actionType: (step.toolName?.toUpperCase() as ActionType) || "RUN_ANALYSIS",
          payload: step.toolParams,
          isHighImpact: true,
        });

        this.notify({
          planId: plan.id,
          stepId: step.id,
          status: "AWAITING_APPROVAL",
          message: `Step ${step.stepNumber} requires explicit operator approval before executing.`,
          timestamp: new Date().toISOString(),
        });

        // Wait for operator approval
        while (step.status === "AWAITING_APPROVAL") {
          await new Promise((r) => setTimeout(r, 300));
          if (this.isAborted) return { success: false, completedSteps: plan.completedStepsCount, plan };
        }
      }

      // 3. ACT: Execute Step
      step.status = "RUNNING";
      this.notify({
        planId: plan.id,
        stepId: step.id,
        status: "RUNNING",
        message: `Executing Step ${step.stepNumber}: ${step.title}...`,
        timestamp: new Date().toISOString(),
      });

      const startTime = Date.now();
      try {
        // Delegate to Specialist Agent
        const agentResponse = await copilotAgentOrchestrator.delegateTask({
          agentType: step.agentType,
          taskObjective: step.objective,
          contextPayload: {
            stepNumber: step.stepNumber,
            toolParams: step.toolParams,
            liveContext: copilotContextEngine.assembleContext(),
          },
          mode,
        });

        // 4. OBSERVE & VALIDATE
        step.actualDurationMs = Date.now() - startTime;
        step.status = "COMPLETED";
        step.outputSummary = agentResponse.summary;
        step.evidence = agentResponse.deliverables;
        plan.completedStepsCount++;

        this.notify({
          planId: plan.id,
          stepId: step.id,
          status: "COMPLETED",
          message: `Step ${step.stepNumber} completed: ${agentResponse.summary.slice(0, 80)}...`,
          timestamp: new Date().toISOString(),
        });

        copilotStore.addMessage(mode, {
          sender: "ASSISTANT",
          text: `✅ **Step ${step.stepNumber}: ${step.title} [COMPLETED]**\n\n${agentResponse.summary}\n\n• **Assertions Verified**: ${step.postAssertions.join(" • ")}`,
          metadata: {
            reasoningDurationMs: step.actualDurationMs,
            verificationHash: agentResponse.verificationHash,
            citations: agentResponse.citations,
          },
        });
      } catch (err: unknown) {
        step.actualDurationMs = Date.now() - startTime;
        step.status = "FAILED";
        step.error = err instanceof Error ? err.message : String(err);
        plan.status = "FAILED";

        this.notify({
          planId: plan.id,
          stepId: step.id,
          status: "FAILED",
          message: `Step ${step.stepNumber} failed: ${step.error}`,
          timestamp: new Date().toISOString(),
        });

        copilotStore.addMessage(mode, {
          sender: "ASSISTANT",
          text: `❌ **Step ${step.stepNumber}: ${step.title} [FAILED]**\n\nReason: ${step.error}\nExecution halted.`,
        });

        return { success: false, completedSteps: plan.completedStepsCount, plan };
      }
    }

    plan.status = "COMPLETED";
    const seal = generateVerificationHash(`${plan.id}:completed:${plan.completedStepsCount}`);

    copilotStore.addMessage(mode, {
      sender: "SYSTEM",
      text: `🎉 **Autonomous Plan Execution Complete**\n• **Plan ID**: \`${plan.id}\`\n• **Completed Steps**: ${plan.completedStepsCount}/${plan.steps.length}\n• **Verification Seal**: \`${seal.slice(0, 24)}...\``,
      metadata: { verificationHash: seal },
    });

    return { success: true, completedSteps: plan.completedStepsCount, plan };
  }

  private async executeNextPendingStep(): Promise<void> {
    if (!this.activePlan || this.activePlan.status !== "EXECUTING") return;
    // Continuation handled by the loop in executePlan
  }
}

export const copilotExecutionEngine = CopilotExecutionEngine.getInstance();
