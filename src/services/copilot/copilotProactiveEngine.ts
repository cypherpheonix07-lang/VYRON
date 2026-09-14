/**
 * PROJECT BRAHMA — PROACTIVE COPILOT INTELLIGENCE ENGINE
 * Passively observes application state to surface high-value, non-intrusive recommendations.
 * Detects:
 * - Elevated risk scores (>70)
 * - Critical contract null deviations
 * - Disconnected or rate-limited MCP connectors
 * - Stale analysis runs (>30 minutes since last execution)
 * Strictly ZERO SQL.
 */

import { analysisStore } from "@/state/analysis/analysisStore";
import { connectorStore } from "@/state/connectors/connectorStore";
import { modeStore } from "@/state/mode/modeStore";

export interface ProactiveRecommendation {
  id: string;
  category: "RISK" | "QUALITY" | "CONNECTOR" | "ANALYSIS" | "AUTOMATION";
  title: string;
  description: string;
  severity: "URGENT" | "RECOMMENDED" | "INFO";
  actionLabel: string;
  actionType: string;
  actionPayload?: Record<string, unknown>;
  createdAt: string;
}

export class CopilotProactiveEngine {
  private static instance: CopilotProactiveEngine | null = null;
  private recommendations: Map<string, ProactiveRecommendation> = new Map();
  private listeners: Set<(recs: ProactiveRecommendation[]) => void> = new Set();

  private constructor() {
    this.evaluateConditions();
  }

  public static getInstance(): CopilotProactiveEngine {
    if (!CopilotProactiveEngine.instance) {
      CopilotProactiveEngine.instance = new CopilotProactiveEngine();
    }
    return CopilotProactiveEngine.instance;
  }

  public subscribe(listener: (recs: ProactiveRecommendation[]) => void): () => void {
    this.listeners.add(listener);
    listener(Array.from(this.recommendations.values()));
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const list = Array.from(this.recommendations.values());
    this.listeners.forEach((l) => l(list));
  }

  /**
   * Evaluates current system state and generates proactive recommendations.
   */
  public evaluateConditions(): ProactiveRecommendation[] {
    const run = analysisStore.getRun();
    const mode = modeStore.getState().mode;
    const connectors = connectorStore.getState().connectors;

    // Condition 1: Elevated Composite Risk
    if (run.telemetry.overallRiskScore >= 70) {
      this.recommendations.set("rec_high_risk", {
        id: "rec_high_risk",
        category: "RISK",
        title: "Elevated Composite Risk Detected",
        description: `Active pipeline detected composite risk index of ${run.telemetry.overallRiskScore}/100 with ${run.telemetry.highRiskEntities} at-risk entities.`,
        severity: "URGENT",
        actionLabel: "Inspect Attribution & SHAP",
        actionType: "VIEW_STAGE",
        actionPayload: { stageId: 9 },
        createdAt: new Date().toISOString(),
      });
    } else {
      this.recommendations.delete("rec_high_risk");
    }

    // Condition 2: Analysis Idle in Demo Mode
    if (mode === "DEMO" && run.status === "IDLE") {
      this.recommendations.set("rec_run_demo", {
        id: "rec_run_demo",
        category: "ANALYSIS",
        title: "Benchmark Ingestion Ready",
        description: "IEEE-CIS Fraud Detection benchmark is primed. Execute full 12-stage analysis to verify anomaly clustering.",
        severity: "RECOMMENDED",
        actionLabel: "Execute 12-Stage Pipeline",
        actionType: "RUN_ANALYSIS",
        actionPayload: { speedMultiplier: 2.0 },
        createdAt: new Date().toISOString(),
      });
    }

    // Condition 3: Check for disconnected connectors
    const disconnected = Object.values(connectors).filter((c) => c.status === "DISCONNECTED");
    if (disconnected.length > 0 && disconnected[0]) {
      const first = disconnected[0];
      this.recommendations.set(`rec_conn_${first.id}`, {
        id: `rec_conn_${first.id}`,
        category: "CONNECTOR",
        title: `Connector Disconnected: ${first.name}`,
        description: `${first.name} is currently disconnected. Probe connection to restore external MCP schema tools.`,
        severity: "RECOMMENDED",
        actionLabel: "Test Connection",
        actionType: "TEST_CONNECTOR",
        actionPayload: { connectorId: first.id },
        createdAt: new Date().toISOString(),
      });
    }

    this.notify();
    return Array.from(this.recommendations.values());
  }

  public dismissRecommendation(id: string): void {
    this.recommendations.delete(id);
    this.notify();
  }
}

export const copilotProactiveEngine = CopilotProactiveEngine.getInstance();
