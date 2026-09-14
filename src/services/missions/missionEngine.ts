/**
 * PROJECT BRAHMA — ENGINEERING MISSION ENGINE
 * High-level goal-oriented autonomous execution units.
 * Organizes multi-step plans, specialist agent assignments, collected evidence,
 * human approvals, and cryptographic audit seals.
 * Strictly ZERO SQL.
 */

import { generateVerificationHash } from "@/services/ai/cryptoUtils";
import { SpecialistAgentType } from "@/services/copilot/copilotAgentOrchestrator";

export type MissionStatus =
  | "PLANNING"
  | "IN_PROGRESS"
  | "PAUSED"
  | "AWAITING_APPROVAL"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";

export interface MissionTaskStep {
  id: string;
  title: string;
  assignedAgent: SpecialistAgentType;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "SKIPPED";
  durationMs?: number | undefined;
  resultSummary?: string | undefined;
  evidenceRef?: string | undefined;
}

export interface EngineeringMission {
  id: string;
  title: string;
  objective: string;
  status: MissionStatus;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  projectId: string;
  creator: string;
  steps: MissionTaskStep[];
  currentStepIndex: number;
  evidence: Array<{ id: string; title: string; hash: string }>;
  findings: Array<{ id: string; description: string; severity: string }>;
  artifacts: Array<{ id: string; name: string; type: string; url: string }>;
  verificationHash?: string | undefined;
  startedAt: string;
  completedAt?: string | undefined;
}

export class MissionEngine {
  private static instance: MissionEngine | null = null;
  private missions: EngineeringMission[] = [];
  private listeners: Set<(missions: EngineeringMission[]) => void> = new Set();

  private constructor() {
    this.seedBaselineMissions();
  }

  public static getInstance(): MissionEngine {
    if (!MissionEngine.instance) {
      MissionEngine.instance = new MissionEngine();
    }
    return MissionEngine.instance;
  }

  public createMission(params: {
    title: string;
    objective: string;
    priority?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | undefined;
    projectId?: string | undefined;
    creator?: string | undefined;
    steps?: MissionTaskStep[] | undefined;
  }): EngineeringMission {
    const id = `msn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const defaultSteps: MissionTaskStep[] = params.steps || [
      {
        id: "step-1",
        title: "Scan Architecture & Detect Drift",
        assignedAgent: "DATA_QUALITY",
        status: "PENDING",
      },
      {
        id: "step-2",
        title: "Analyze Security CWEs & AST Findings",
        assignedAgent: "SECURITY_ANALYST",
        status: "PENDING",
      },
      {
        id: "step-3",
        title: "Synthesize Verification Report & Integrity Seal",
        assignedAgent: "REPORT_GENERATOR",
        status: "PENDING",
      },
    ];

    const mission: EngineeringMission = {
      id,
      title: params.title,
      objective: params.objective,
      status: "PLANNING",
      priority: params.priority || "HIGH",
      projectId: params.projectId || "proj-brahma",
      creator: params.creator || "AI Copilot Orchestrator",
      steps: defaultSteps,
      currentStepIndex: 0,
      evidence: [],
      findings: [],
      artifacts: [],
      startedAt: now,
    };

    this.missions.unshift(mission);
    this.notify();
    return mission;
  }

  public startMission(missionId: string): void {
    const mission = this.missions.find((m) => m.id === missionId);
    if (!mission) return;

    mission.status = "IN_PROGRESS";
    const firstStep = mission.steps[0];
    if (firstStep && firstStep.status === "PENDING") {
      firstStep.status = "RUNNING";
    }
    this.notify();
  }

  public pauseMission(missionId: string): void {
    const mission = this.missions.find((m) => m.id === missionId);
    if (!mission || mission.status !== "IN_PROGRESS") return;

    mission.status = "PAUSED";
    this.notify();
  }

  public resumeMission(missionId: string): void {
    const mission = this.missions.find((m) => m.id === missionId);
    if (!mission || mission.status !== "PAUSED") return;

    mission.status = "IN_PROGRESS";
    this.notify();
  }

  public cancelMission(missionId: string): void {
    const mission = this.missions.find((m) => m.id === missionId);
    if (!mission) return;

    mission.status = "CANCELLED";
    mission.completedAt = new Date().toISOString();
    this.notify();
  }

  public advanceStep(
    missionId: string,
    resultSummary: string,
    evidenceTitle?: string,
  ): void {
    const mission = this.missions.find((m) => m.id === missionId);
    if (!mission || mission.status !== "IN_PROGRESS") return;

    const cur = mission.steps[mission.currentStepIndex];
    if (cur) {
      cur.status = "COMPLETED";
      cur.resultSummary = resultSummary;
      cur.durationMs = 1250;
    }

    if (evidenceTitle) {
      const hash = generateVerificationHash(`${missionId}:${cur?.id}:${evidenceTitle}:${Date.now()}`);
      mission.evidence.push({ id: `ev_${Date.now()}`, title: evidenceTitle, hash });
    }

    if (mission.currentStepIndex + 1 < mission.steps.length) {
      mission.currentStepIndex++;
      const nextStep = mission.steps[mission.currentStepIndex];
      if (nextStep) {
        nextStep.status = "RUNNING";
      }
    } else {
      mission.status = "COMPLETED";
      mission.completedAt = new Date().toISOString();
      mission.verificationHash = generateVerificationHash(`${mission.id}:COMPLETED:${Date.now()}`);
      mission.artifacts.push({
        id: `art_${mission.id}`,
        name: `Mission Report — ${mission.title}`,
        type: "PDF",
        url: `/app/reports/${mission.id}`,
      });
    }

    this.notify();
  }

  public listMissions(): EngineeringMission[] {
    return [...this.missions];
  }

  public getMissions(): EngineeringMission[] {
    return this.listMissions();
  }

  public executeNextStep(missionId: string): EngineeringMission | undefined {
    this.advanceStep(missionId, "Step executed autonomously");
    return this.getMission(missionId);
  }

  public getMission(id: string): EngineeringMission | undefined {
    return this.missions.find((m) => m.id === id);
  }

  public subscribe(listener: (missions: EngineeringMission[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.missions]);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const copy = [...this.missions];
    this.listeners.forEach((l) => l(copy));
  }

  private seedBaselineMissions(): void {
    this.missions = [
      {
        id: "msn_001",
        title: "Autonomous Production Release Gate Audit",
        objective: "Verify PCI DSS data tokenization contracts, audit AST CWE findings, and validate 12-stage pipeline.",
        status: "COMPLETED",
        priority: "CRITICAL",
        projectId: "proj-brahma",
        creator: "Chief Architect (Puli Phanindhra)",
        currentStepIndex: 2,
        startedAt: "2026-09-12T10:00:00Z",
        completedAt: "2026-09-12T10:04:15Z",
        verificationHash: generateVerificationHash("msn_001:COMPLETED"),
        steps: [
          {
            id: "s1",
            title: "Check EARS Requirements & Idempotency Constraints",
            assignedAgent: "DATA_QUALITY",
            status: "COMPLETED",
            durationMs: 820,
            resultSummary: "Verified FR-01 and FR-02 requirement constraints.",
          },
          {
            id: "s2",
            title: "Audit Static AST for SQL Injection and Secret Leakage",
            assignedAgent: "SECURITY_ANALYST",
            status: "COMPLETED",
            durationMs: 1420,
            resultSummary: "Identified 1 high CWE-89 finding in query builder.",
          },
          {
            id: "s3",
            title: "Compile Cryptographic Release Seal",
            assignedAgent: "REPORT_GENERATOR",
            status: "COMPLETED",
            durationMs: 510,
            resultSummary: "Sealed executive audit summary with SHA-256.",
          },
        ],
        evidence: [
          { id: "ev_1", title: "AST CWE-89 Scanner Audit", hash: "a8f3...b912" },
          { id: "ev_2", title: "Idempotency Contract Validation Log", hash: "99c1...2410" },
        ],
        findings: [
          { id: "f1", description: "Dynamic query builder parameter concatenation risk in services/billing/query.ts", severity: "HIGH" },
        ],
        artifacts: [
          { id: "art_1", name: "Release Gate Certification PDF", type: "PDF", url: "/app/reports/msn_001" },
        ],
      },
      {
        id: "msn_002",
        title: "Kaggle Benchmark Ingestion & Anomaly Baseline",
        objective: "Ingest IEEE-CIS fraud detection benchmark, compute IQR numeric bounds, and map entity hubs.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        projectId: "proj-brahma",
        creator: "Copilot Autonomous Engine",
        currentStepIndex: 1,
        startedAt: new Date().toISOString(),
        steps: [
          {
            id: "s1",
            title: "Verify Dataset Integrity & Schema Conformity",
            assignedAgent: "DATA_ANALYST",
            status: "COMPLETED",
            durationMs: 910,
            resultSummary: "12,480 rows validated. Null rate: 0.002.",
          },
          {
            id: "s2",
            title: "Run IQR Outlier Detection on Transaction Amounts",
            assignedAgent: "ANOMALY_INVESTIGATOR",
            status: "RUNNING",
          },
          {
            id: "s3",
            title: "Formulate Graph Degree Centrality Clusters",
            assignedAgent: "ANOMALY_INVESTIGATOR",
            status: "PENDING",
          },
        ],
        evidence: [
          { id: "ev_3", title: "Kaggle Dataset Partition Log", hash: "55e2...1044" },
        ],
        findings: [],
        artifacts: [],
      },
    ];
  }
}

export const missionEngine = MissionEngine.getInstance();
