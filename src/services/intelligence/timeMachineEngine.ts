/**
 * PROJECT BRAHMA — ENGINEERING TIME MACHINE ENGINE
 * Historical architecture, requirements, and health snapshot comparator.
 * Answers temporal regression questions: "Why did health drop?", "When did drift begin?".
 * Strictly ZERO SQL.
 */

import { generateVerificationHash } from "@/services/ai/cryptoUtils";

export interface SystemSnapshot {
  id: string;
  versionTag: string;
  timestamp: string;
  healthScore: number;
  activeFindingsCount: number;
  driftCount: number;
  totalRequirements: number;
  totalServices: number;
  commitsAhead: number;
  verificationHash: string;
}

export interface TimeMachineComparison {
  baseSnapshot: SystemSnapshot;
  targetSnapshot: SystemSnapshot;
  healthDelta: number;
  findingsDelta: number;
  driftDelta: number;
  rootCauses: string[];
  timelineExplanation: string;
}

export class TimeMachineEngine {
  private static instance: TimeMachineEngine | null = null;
  private snapshots: SystemSnapshot[] = [];

  private constructor() {
    this.seedHistoricalSnapshots();
  }

  public static getInstance(): TimeMachineEngine {
    if (!TimeMachineEngine.instance) {
      TimeMachineEngine.instance = new TimeMachineEngine();
    }
    return TimeMachineEngine.instance;
  }

  public captureSnapshot(params: {
    versionTag: string;
    healthScore: number;
    activeFindingsCount: number;
    driftCount: number;
    totalRequirements?: number | undefined;
    totalServices?: number | undefined;
  }): SystemSnapshot {
    const id = `snap_${Date.now()}`;
    const now = new Date().toISOString();
    const hash = generateVerificationHash(`${id}:${params.versionTag}:${params.healthScore}:${now}`);

    const snap: SystemSnapshot = {
      id,
      versionTag: params.versionTag,
      timestamp: now,
      healthScore: params.healthScore,
      activeFindingsCount: params.activeFindingsCount,
      driftCount: params.driftCount,
      totalRequirements: params.totalRequirements || 18,
      totalServices: params.totalServices || 6,
      commitsAhead: 0,
      verificationHash: hash,
    };

    this.snapshots.unshift(snap);
    return snap;
  }

  public compareSnapshots(baseId: string, targetId: string): TimeMachineComparison {
    const base = this.snapshots.find((s) => s.id === baseId);
    const target = this.snapshots.find((s) => s.id === targetId);

    if (!base || !target) {
      throw new Error(`One or both snapshots (${baseId}, ${targetId}) not found in Time Machine.`);
    }

    const healthDelta = target.healthScore - base.healthScore;
    const findingsDelta = target.activeFindingsCount - base.activeFindingsCount;
    const driftDelta = target.driftCount - base.driftCount;

    const rootCauses: string[] = [];
    if (healthDelta < 0) {
      rootCauses.push(`Composite health score declined by ${Math.abs(healthDelta)} points.`);
    }
    if (driftDelta > 0) {
      rootCauses.push(`Introduced ${driftDelta} new architecture boundary divergence(s).`);
    }
    if (findingsDelta > 0) {
      rootCauses.push(`${findingsDelta} new unmitigated vulnerability finding(s) detected.`);
    }

    const explanation =
      healthDelta < 0
        ? `Regression detected between ${base.versionTag} and ${target.versionTag}: Health dropped from ${base.healthScore} to ${target.healthScore} due to ${rootCauses.join(" ")}`
        : `Stability improvement between ${base.versionTag} and ${target.versionTag}: Health rose by ${healthDelta} points.`;

    return {
      baseSnapshot: base,
      targetSnapshot: target,
      healthDelta,
      findingsDelta,
      driftDelta,
      rootCauses,
      timelineExplanation: explanation,
    };
  }

  public listSnapshots(): SystemSnapshot[] {
    return [...this.snapshots];
  }

  private seedHistoricalSnapshots(): void {
    this.snapshots = [
      {
        id: "snap_v240_curr",
        versionTag: "v2.4.0 (Current)",
        timestamp: "2026-09-13T12:00:00Z",
        healthScore: 91,
        activeFindingsCount: 1,
        driftCount: 1,
        totalRequirements: 18,
        totalServices: 6,
        commitsAhead: 4,
        verificationHash: generateVerificationHash("v2.4.0:snap"),
      },
      {
        id: "snap_v239_last",
        versionTag: "v2.3.9 (Previous Release)",
        timestamp: "2026-08-30T10:00:00Z",
        healthScore: 95,
        activeFindingsCount: 0,
        driftCount: 0,
        totalRequirements: 18,
        totalServices: 6,
        commitsAhead: 0,
        verificationHash: generateVerificationHash("v2.3.9:snap"),
      },
      {
        id: "snap_v230_base",
        versionTag: "v2.3.0 (Milestone 1 Baseline)",
        timestamp: "2026-08-15T09:00:00Z",
        healthScore: 84,
        activeFindingsCount: 4,
        driftCount: 3,
        totalRequirements: 14,
        totalServices: 5,
        commitsAhead: 0,
        verificationHash: generateVerificationHash("v2.3.0:snap"),
      },
    ];
  }
}

export const timeMachineEngine = TimeMachineEngine.getInstance();
