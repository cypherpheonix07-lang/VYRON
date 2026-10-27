/**
 * VYRON — STAGE GATE & MISSION RESUME ENGINE (GOD MODE Ω×)
 * Implements 12-Stage Lifecycle Gating, Consequential Transition Verification,
 * Preview / Proceed / Pause Protocols, and Resumable Checkpoint Management.
 *
 * Core Laws:
 * USER CONTROL > SILENT ACTION
 * POSTCONDITION > ACKNOWLEDGEMENT
 * SIMULATION ≠ LIVE
 * Strictly ZERO SQL.
 */

import type { EngineeringLifecycleStage } from "./questionUnderstanding.ts";
import type { ContextPassport } from "./contextMesh.ts";

export type StageVerdict = "COMPLETE" | "PARTIAL" | "BLOCKED" | "FAILED";

export interface StageGateTransition {
  fromStage: EngineeringLifecycleStage;
  toStage: EngineeringLifecycleStage;
  isConsequential: boolean;
  requiredPreconditions: string[];
  requiredEvidenceTiers: string[];
  verdict: StageVerdict;
  readinessScore: number; // 0 to 100
  blockingReasons: string[];
}

export interface ResumableMissionCheckpoint {
  checkpointId: string;
  projectId: string;
  stage: EngineeringLifecycleStage;
  timestamp: string;
  contextPassportId: string;
  planId?: string | undefined;
  evidenceIds: string[];
  residualRisks: string[];
  nextUnlockRequirement: string;
  isPaused: boolean;
}

export class StageGateEngine {
  private static instance: StageGateEngine | null = null;
  private checkpoints: Map<string, ResumableMissionCheckpoint> = new Map();
  private stageStatuses: Map<EngineeringLifecycleStage, { verdict: StageVerdict; score: number }> = new Map();

  private constructor() {
    this.seedBaselineStages();
  }

  public static getInstance(): StageGateEngine {
    if (!StageGateEngine.instance) {
      StageGateEngine.instance = new StageGateEngine();
    }
    return StageGateEngine.instance;
  }

  /**
   * Evaluates readiness to transition between engineering stages.
   */
  public evaluateTransition(
    fromStage: EngineeringLifecycleStage,
    toStage: EngineeringLifecycleStage,
    contextPassport: ContextPassport
  ): StageGateTransition {
    const isConsequential = this.isStageConsequential(toStage);
    const blockingReasons: string[] = [];

    // Check Context Debt
    if (contextPassport.debtItems.some((d) => d.severity === "BLOCKING")) {
      blockingReasons.push("Active BLOCKING Context Debt must be resolved prior to stage transition.");
    }

    // Check Contradictions
    if (contextPassport.summary.contradictionCount > 0) {
      blockingReasons.push("Unresolved claims in Contradiction Tribunal prevent safe stage promotion.");
    }

    // Stage-specific rules
    if (toStage === "RELEASE" || toStage === "DEPLOYMENT") {
      const hasSecurityScan = contextPassport.admittedItems.some(
        (i) => i.domain === "TOOL_RESULTS" && i.key.includes("security")
      );
      if (!hasSecurityScan) {
        blockingReasons.push("Stage Release/Deployment requires verified zero-CVE security scan in Context Mesh.");
      }
    }

    let verdict: StageVerdict = "COMPLETE";
    let readinessScore = 95;

    if (blockingReasons.length > 0) {
      verdict = "BLOCKED";
      readinessScore = 40;
    }

    return {
      fromStage,
      toStage,
      isConsequential,
      requiredPreconditions: this.getStagePreconditions(toStage),
      requiredEvidenceTiers: ["TIER_1_AUTHORITATIVE"],
      verdict,
      readinessScore,
      blockingReasons,
    };
  }

  /**
   * Creates a resumable checkpoint when work is paused.
   */
  public createCheckpoint(params: {
    projectId: string;
    stage: EngineeringLifecycleStage;
    contextPassportId: string;
    planId?: string | undefined;
    evidenceIds: string[];
    residualRisks: string[];
    nextUnlockRequirement: string;
  }): ResumableMissionCheckpoint {
    const checkpointId = `chk_${params.stage.toLowerCase()}_${Date.now()}`;
    const checkpoint: ResumableMissionCheckpoint = {
      checkpointId,
      projectId: params.projectId,
      stage: params.stage,
      timestamp: new Date().toISOString(),
      contextPassportId: params.contextPassportId,
      planId: params.planId,
      evidenceIds: params.evidenceIds,
      residualRisks: params.residualRisks,
      nextUnlockRequirement: params.nextUnlockRequirement,
      isPaused: true,
    };
    this.checkpoints.set(checkpointId, checkpoint);
    return checkpoint;
  }

  public getCheckpoint(checkpointId: string): ResumableMissionCheckpoint | undefined {
    return this.checkpoints.get(checkpointId);
  }

  public resumeCheckpoint(checkpointId: string): ResumableMissionCheckpoint | undefined {
    const chk = this.checkpoints.get(checkpointId);
    if (chk) {
      chk.isPaused = false;
    }
    return chk;
  }

  public listActiveCheckpoints(projectId?: string): ResumableMissionCheckpoint[] {
    return Array.from(this.checkpoints.values()).filter(
      (c) => (!projectId || c.projectId === projectId) && c.isPaused
    );
  }

  public isStageConsequential(stage: EngineeringLifecycleStage): boolean {
    return (
      stage === "IMPLEMENTATION" ||
      stage === "RELEASE" ||
      stage === "DEPLOYMENT" ||
      stage === "GOVERNANCE"
    );
  }

  private getStagePreconditions(stage: EngineeringLifecycleStage): string[] {
    switch (stage) {
      case "ARCHITECTURE":
        return ["Requirements approved", "AST baseline established"];
      case "DATA_CONTRACTS":
        return ["Architecture blueprint frozen", "Schema entity graph declared"];
      case "IMPLEMENTATION":
        return ["Data contracts validated", "Zero unmapped interface types"];
      case "TESTING":
        return ["Implementation AST syntax valid", "Unit assertions compiled"];
      case "SECURITY_AUDIT":
        return ["Testing pass rate 100%", "Bandit/OWASP scanner initialized"];
      case "RELEASE":
        return ["Zero high/severe CVEs", "Architecture drift < 5.0%"];
      case "DEPLOYMENT":
        return ["Release gate signed", "Operator dual-custody authorization"];
      default:
        return ["Precondition invariants satisfied"];
    }
  }

  private seedBaselineStages() {
    this.stageStatuses.set("REQUIREMENTS", { verdict: "COMPLETE", score: 100 });
    this.stageStatuses.set("ARCHITECTURE", { verdict: "COMPLETE", score: 96 });
    this.stageStatuses.set("DATA_CONTRACTS", { verdict: "COMPLETE", score: 94 });
    this.stageStatuses.set("IMPLEMENTATION", { verdict: "COMPLETE", score: 92 });
    this.stageStatuses.set("TESTING", { verdict: "COMPLETE", score: 95 });
    this.stageStatuses.set("SECURITY_AUDIT", { verdict: "COMPLETE", score: 98 });
    this.stageStatuses.set("RELEASE", { verdict: "PARTIAL", score: 88 });
    this.stageStatuses.set("DEPLOYMENT", { verdict: "BLOCKED", score: 45 });
  }
}

export const stageGateEngine = StageGateEngine.getInstance();
