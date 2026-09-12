/**
 * PROJECT BRAHMA — DEMO STAGE RUNNER (PHASE L.1, FL-01-D)
 * Simulates the 8-stage analysis pipeline with realistic async progress ticks,
 * log emission, incremental finding discoveries, and gate evaluations.
 */

import { DEMO_SCAN_FINDINGS, CodeFinding } from "@/data/demo/demoScanResults";
import { DEMO_GATE_RESULTS } from "@/data/demo/demoGateResults";
import { GateResultData } from "@/components/ui/GateCard";
import { getLogsForStage } from "@/components/analysis/StageLogSimulator";
import { LogEntry } from "@/components/analysis/AnalysisLogStream";
import { PipelineStage } from "@/components/connectors/PhaseProgressBar";

export interface PipelineEventCallbacks {
  onStageChange: (stage: PipelineStage, percent: number, message: string) => void;
  onLog: (logs: LogEntry[]) => void;
  onFinding: (finding: CodeFinding) => void;
  onGateEvaluated: (gate: GateResultData) => void;
  onComplete: () => void;
}

export class DemoStageRunner {
  private isCancelled = false;

  public cancel(): void {
    this.isCancelled = true;
  }

  public async run(callbacks: PipelineEventCallbacks): Promise<void> {
    this.isCancelled = false;

    // Stage 1: Cloning (0% - 20%)
    callbacks.onStageChange("Cloning", 5, "Connecting to GitHub repository and cloning tree...");
    callbacks.onLog(getLogsForStage("Cloning"));
    await this.delay(800);
    if (this.isCancelled) return;

    callbacks.onStageChange("Cloning", 18, "Repository cloned successfully. Validating integrity...");
    await this.delay(600);
    if (this.isCancelled) return;

    // Stage 2: AST Scan (20% - 50%)
    callbacks.onStageChange("AST Scan", 25, "Building AST grammar trees and computing cyclomatic complexity...");
    callbacks.onLog(getLogsForStage("AST Scan"));
    await this.delay(800);
    if (this.isCancelled) return;

    // Emit first batch of complexity findings
    const complexityFindings = DEMO_SCAN_FINDINGS.filter((f) => f.category === "Complexity");
    for (let i = 0; i < Math.min(5, complexityFindings.length); i++) {
      const finding = complexityFindings[i];
      if (finding) callbacks.onFinding(finding);
      await this.delay(200);
      if (this.isCancelled) return;
    }

    callbacks.onStageChange("AST Scan", 48, "AST token analysis complete. Max CCN 34 detected.");
    await this.delay(500);
    if (this.isCancelled) return;

    // Stage 3: Security Scan (50% - 75%)
    callbacks.onStageChange("Security", 55, "Executing Bandit static security rules and CWE mapping...");
    callbacks.onLog(getLogsForStage("Security"));
    await this.delay(800);
    if (this.isCancelled) return;

    // Emit security findings
    const secFindings = DEMO_SCAN_FINDINGS.filter((f) => f.category === "Security");
    for (let i = 0; i < Math.min(8, secFindings.length); i++) {
      const finding = secFindings[i];
      if (finding) callbacks.onFinding(finding);
      await this.delay(180);
      if (this.isCancelled) return;
    }

    callbacks.onStageChange("Security", 72, "Security audit complete: 8 HIGH severity issues discovered.");
    await this.delay(500);
    if (this.isCancelled) return;

    // Stage 4: Gate Evaluation (75% - 95%)
    callbacks.onStageChange("Gates", 78, "Evaluating 7 architectural release gates against compliance thresholds...");
    callbacks.onLog(getLogsForStage("Gates"));
    await this.delay(600);
    if (this.isCancelled) return;

    // Sequentially evaluate each gate
    for (const gate of DEMO_GATE_RESULTS) {
      callbacks.onGateEvaluated(gate);
      await this.delay(250);
      if (this.isCancelled) return;
    }

    callbacks.onStageChange("Gates", 95, "Gate evaluation finished. Release is BLOCKED.");
    await this.delay(600);
    if (this.isCancelled) return;

    // Stage 5: Complete (100%)
    callbacks.onStageChange("Complete", 100, "Analysis complete. Release blocked by Gate 1 and Gate 2.");
    callbacks.onLog(getLogsForStage("Complete"));
    callbacks.onComplete();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
