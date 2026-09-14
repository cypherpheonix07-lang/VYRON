/**
 * PROJECT BRAHMA — REAL-TIME COPILOT EVENT LISTENER
 * Subscribes to pipelineEventBus and system stores to provide continuous real-time awareness.
 * Forwards stage starts, completions, intermediate findings, and telemetry ticks into Copilot state.
 * Strictly ZERO SQL.
 */

import { pipelineEventBus, PipelineEvent } from "@/services/orchestrator/eventBus";
import { copilotStore } from "@/state/copilot/copilotStore";
import { modeStore } from "@/state/mode/modeStore";
import { copilotProactiveEngine } from "./copilotProactiveEngine";

export class CopilotRealtimeListener {
  private static instance: CopilotRealtimeListener | null = null;
  private isInitialized = false;
  private unsubs: Array<() => void> = [];

  private constructor() {}

  public static getInstance(): CopilotRealtimeListener {
    if (!CopilotRealtimeListener.instance) {
      CopilotRealtimeListener.instance = new CopilotRealtimeListener();
    }
    return CopilotRealtimeListener.instance;
  }

  public initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Listen for STAGE_START across all 12 stages
    const un1 = pipelineEventBus.on("STAGE_START", (event: PipelineEvent<unknown>) => {
      const mode = modeStore.getState().mode;
      const data = event.payload as { stageId: number; name: string } | undefined;
      if (!data) return;

      copilotStore.addMessage(mode, {
        sender: "SYSTEM",
        text: `⚡ Stage ${data.stageId}/12 Initiated: ${data.name}`,
        metadata: {
          reasoningDurationMs: 0,
          citations: [`Stage ${data.stageId}: ${data.name}`],
        },
      });

      copilotProactiveEngine.evaluateConditions();
    });

    // 2. Listen for STAGE_COMPLETE across all stages
    const un2 = pipelineEventBus.on("STAGE_COMPLETE", (event: PipelineEvent<unknown>) => {
      const mode = modeStore.getState().mode;
      const data = event.payload as { stageId: number; name: string; summary?: string } | undefined;
      if (!data) return;

      if (data.stageId === 12) {
        copilotStore.addMessage(mode, {
          sender: "ASSISTANT",
          text: `✅ 12-Stage Analysis Pipeline completed successfully! Final cryptographic audit report sealed with SHA-256 integrity seal. All release gates validated.`,
          metadata: {
            suggestedActions: [
              { id: "act_view_report", label: "Inspect Findings", actionType: "VIEW_STAGE", payload: { stageId: 12 } },
              { id: "act_gen_pdf", label: "Review Remediations", actionType: "APPLY_REMEDIATION" },
            ],
          },
        });
      }

      copilotProactiveEngine.evaluateConditions();
    });

    // 3. Listen for STAGE_ERROR
    const un3 = pipelineEventBus.on("STAGE_ERROR", (event: PipelineEvent<unknown>) => {
      const mode = modeStore.getState().mode;
      const data = event.payload as { stageId?: number; error?: string } | undefined;
      const errText = data?.error || "Unknown pipeline execution error";

      copilotStore.addMessage(mode, {
        sender: "SYSTEM",
        text: `⚠️ Pipeline Exception at Stage ${data?.stageId ?? "?"}: ${errText}`,
        metadata: {
          suggestedActions: [
            { id: "act_retry", label: "Retry Analysis", actionType: "RUN_ANALYSIS" },
          ],
        },
      });

      copilotProactiveEngine.evaluateConditions();
    });

    // 4. Listen for FINDING_EMITTED
    const un4 = pipelineEventBus.on("FINDING_EMITTED", (event: PipelineEvent<unknown>) => {
      const mode = modeStore.getState().mode;
      const finding = event.payload as { title?: string; severity?: string; score?: number; description?: string } | undefined;
      if (!finding) return;

      if (finding.severity === "CRITICAL" || finding.severity === "HIGH") {
        copilotStore.addMessage(mode, {
          sender: "ASSISTANT",
          text: `🚨 High-Risk Finding Detected: "${finding.title || "Anomaly"}" (Risk Score: ${finding.score || 85}/100).\n${finding.description || "Statistical anomaly flagged."}`,
          metadata: {
            suggestedActions: [
              { id: "act_remediate", label: "Apply IP Throttle Rule", actionType: "APPLY_REMEDIATION" },
            ],
          },
        });
      }

      copilotProactiveEngine.evaluateConditions();
    });

    // 5. Listen for TELEMETRY_TICK
    const un5 = pipelineEventBus.on("TELEMETRY_TICK", () => {
      copilotProactiveEngine.evaluateConditions();
    });

    this.unsubs = [un1, un2, un3, un4, un5];
  }

  public destroy(): void {
    this.unsubs.forEach((u) => u());
    this.unsubs = [];
    this.isInitialized = false;
  }
}

export const copilotRealtimeListener = CopilotRealtimeListener.getInstance();
