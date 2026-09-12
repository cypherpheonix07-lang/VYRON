/**
 * PROJECT BRAHMA — 12-STAGE LIVE ANALYSIS STATE STORE
 * Manages full lifecycle of pipeline executions, telemetry, and live findings.
 * Works symmetrically in NORMAL mode (production data) and DEMO mode (isolated datasets).
 */

import { AppMode } from "../mode/modeStore";

export type AnalysisStatus =
  | "IDLE"
  | "CREATED"
  | "QUEUED"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "PARTIAL";

export type StageId =
  | 1 // Data Acquisition
  | 2 // Schema Validation
  | 3 // Normalization
  | 4 // Feature Preparation
  | 5 // Anomaly Detection
  | 6 // Graph Analysis
  | 7 // Risk Scoring
  | 8 // Cross Correlation
  | 9 // Explainability
  | 10 // Recommendation Synthesis
  | 11 // Dashboard Synthesis
  | 12; // Report Finalization

export type StageStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "SKIPPED";

export interface AnalysisStageState {
  id: StageId;
  name: string;
  category: "INGESTION" | "CORE_ANALYTICS" | "SYNTHESIS";
  status: StageStatus;
  progressPercent: number;
  durationMs: number;
  summary: string;
  metrics: Record<string, string | number | boolean>;
  error?: string | undefined;
}

export type FindingSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export interface Finding {
  id: string;
  stageId: StageId;
  title: string;
  description: string;
  severity: FindingSeverity;
  score: number; // 0 to 100
  entityId?: string | undefined;
  timestamp: string;
  evidence: Record<string, unknown>;
  remediation?: string | undefined;
}

export interface AnalysisTelemetry {
  startTime: string | null;
  endTime: string | null;
  totalDurationMs: number;
  recordsProcessed: number;
  eventsPerSecond: number;
  anomaliesDetected: number;
  highRiskEntities: number;
  overallRiskScore: number;
  verificationHash: string | null;
}

export interface AnalysisRun {
  id: string;
  targetDatasetId: string;
  targetDatasetName: string;
  mode: AppMode;
  status: AnalysisStatus;
  stages: AnalysisStageState[];
  currentStageId: StageId | null;
  telemetry: AnalysisTelemetry;
  findings: Finding[];
  logs: Array<{
    timestamp: string;
    level: "INFO" | "WARN" | "ERROR";
    message: string;
    stageId?: StageId | undefined;
  }>;
}

export const PIPELINE_STAGES: ReadonlyArray<{
  id: StageId;
  name: string;
  category: AnalysisStageState["category"];
}> = [
  { id: 1, name: "Data Acquisition & Ingestion", category: "INGESTION" },
  { id: 2, name: "Schema Validation & Quality Contracts", category: "INGESTION" },
  { id: 3, name: "Normalization & Canonical Mapping", category: "INGESTION" },
  { id: 4, name: "Feature Preparation & Vector Encoding", category: "CORE_ANALYTICS" },
  { id: 5, name: "Anomaly Detection (IQR + Isolation Forest)", category: "CORE_ANALYTICS" },
  { id: 6, name: "Graph Analysis & Entity Centrality", category: "CORE_ANALYTICS" },
  { id: 7, name: "Multi-Factor Composite Risk Scoring", category: "CORE_ANALYTICS" },
  { id: 8, name: "Cross-Factor Correlation & Trend Linkage", category: "CORE_ANALYTICS" },
  { id: 9, name: "Attribution & SHAP Explainability", category: "SYNTHESIS" },
  { id: 10, name: "Actionable Recommendation Synthesis", category: "SYNTHESIS" },
  { id: 11, name: "Dashboard Metric & Time-Series Synthesis", category: "SYNTHESIS" },
  { id: 12, name: "Cryptographic Audit & Report Finalization", category: "SYNTHESIS" },
];

function createDefaultStages(): AnalysisStageState[] {
  return PIPELINE_STAGES.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    status: "PENDING",
    progressPercent: 0,
    durationMs: 0,
    summary: "Awaiting execution",
    metrics: {},
  }));
}

type AnalysisListener = (run: AnalysisRun) => void;

class AnalysisStore {
  private run: AnalysisRun;
  private listeners: Set<AnalysisListener> = new Set();
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.run = {
      id: "run_initial",
      targetDatasetId: "ieee_fraud_benchmark",
      targetDatasetName: "IEEE-CIS Credit Card Fraud Benchmark",
      mode: "NORMAL",
      status: "IDLE",
      stages: createDefaultStages(),
      currentStageId: null,
      telemetry: {
        startTime: null,
        endTime: null,
        totalDurationMs: 0,
        recordsProcessed: 0,
        eventsPerSecond: 0,
        anomaliesDetected: 0,
        highRiskEntities: 0,
        overallRiskScore: 0,
        verificationHash: null,
      },
      findings: [],
      logs: [],
    };
  }

  public getRun(): AnalysisRun {
    return this.run;
  }

  public subscribe(listener: AnalysisListener): () => void {
    this.listeners.add(listener);
    listener(this.run);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    this.listeners.forEach((listener) => listener(this.run));
  }

  public initRun(datasetId: string, datasetName: string, mode: AppMode): string {
    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.run = {
      id: runId,
      targetDatasetId: datasetId,
      targetDatasetName: datasetName,
      mode,
      status: "CREATED",
      stages: createDefaultStages(),
      currentStageId: 1,
      telemetry: {
        startTime: new Date().toISOString(),
        endTime: null,
        totalDurationMs: 0,
        recordsProcessed: 0,
        eventsPerSecond: 0,
        anomaliesDetected: 0,
        highRiskEntities: 0,
        overallRiskScore: 0,
        verificationHash: null,
      },
      findings: [],
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: "INFO",
          message: `Analysis execution initialized for dataset: ${datasetName} [${mode} MODE]`,
          stageId: 1,
        },
      ],
    };
    this.emit();
    return runId;
  }

  public setStatus(status: AnalysisStatus) {
    this.run.status = status;
    if (status === "COMPLETED" || status === "FAILED" || status === "CANCELLED") {
      this.run.telemetry.endTime = new Date().toISOString();
      if (this.run.telemetry.startTime) {
        this.run.telemetry.totalDurationMs =
          new Date(this.run.telemetry.endTime).getTime() -
          new Date(this.run.telemetry.startTime).getTime();
      }
    }
    this.emit();
  }

  public updateStage(
    stageId: StageId,
    updates: Partial<Omit<AnalysisStageState, "id" | "name" | "category">>,
  ) {
    const stage = this.run.stages.find((s) => s.id === stageId);
    if (!stage) return;

    Object.assign(stage, updates);
    if (updates.status === "RUNNING") {
      this.run.currentStageId = stageId;
    }
    this.emit();
  }

  public updateTelemetry(updates: Partial<AnalysisTelemetry>) {
    Object.assign(this.run.telemetry, updates);
    this.emit();
  }

  public addFinding(finding: Omit<Finding, "id" | "timestamp">) {
    const newFinding: Finding = {
      ...finding,
      id: `fnd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.run.findings.unshift(newFinding);
    if (finding.severity === "CRITICAL" || finding.severity === "HIGH") {
      this.run.telemetry.anomaliesDetected += 1;
      this.run.telemetry.highRiskEntities += 1;
    }
    this.emit();
  }

  public addLog(level: "INFO" | "WARN" | "ERROR", message: string, stageId?: StageId) {
    this.run.logs.push({
      timestamp: new Date().toISOString(),
      level,
      message,
      stageId: stageId ?? this.run.currentStageId ?? undefined,
    });
    this.emit();
  }

  public reset() {
    this.run = {
      id: "run_idle",
      targetDatasetId: "ieee_fraud_benchmark",
      targetDatasetName: "IEEE-CIS Credit Card Fraud Benchmark",
      mode: "NORMAL",
      status: "IDLE",
      stages: createDefaultStages(),
      currentStageId: null,
      telemetry: {
        startTime: null,
        endTime: null,
        totalDurationMs: 0,
        recordsProcessed: 0,
        eventsPerSecond: 0,
        anomaliesDetected: 0,
        highRiskEntities: 0,
        overallRiskScore: 0,
        verificationHash: null,
      },
      findings: [],
      logs: [],
    };
    this.emit();
  }
}

export const analysisStore = new AnalysisStore();
