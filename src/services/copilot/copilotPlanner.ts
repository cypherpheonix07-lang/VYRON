/**
 * PROJECT BRAHMA — COPILOT DYNAMIC TASK PLANNER
 * Decomposes complex engineering & analytical objectives into structured,
 * inspectable, resumable DAG execution plans.
 * Binds specialist agents, typed tools, and verification assertions.
 * Strictly ZERO SQL.
 */

import { AppMode } from "@/state/mode/modeStore";
import { SpecialistAgentType } from "./copilotAgentOrchestrator";
import { ToolRiskLevel } from "./copilotToolRegistry";
import { generateVerificationHash } from "../ai/cryptoUtils";

export type StepExecutionStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "AWAITING_APPROVAL" | "SKIPPED";

export interface PlanStep {
  id: string;
  stepNumber: number;
  title: string;
  objective: string;
  agentType: SpecialistAgentType;
  toolName?: string | undefined;
  toolParams?: Record<string, unknown> | undefined;
  riskLevel: ToolRiskLevel;
  requiresApproval: boolean;
  status: StepExecutionStatus;
  dependencies: string[]; // Step IDs that must complete before this step
  expectedDurationMs: number;
  actualDurationMs?: number | undefined;
  postAssertions: string[];
  outputSummary?: string | undefined;
  evidence?: Record<string, unknown> | undefined;
  error?: string | undefined;
}

export interface DynamicExecutionPlan {
  id: string;
  goal: string;
  targetEntity?: string | undefined;
  mode: AppMode;
  createdAt: string;
  status: "PLANNING" | "READY" | "EXECUTING" | "PAUSED" | "COMPLETED" | "FAILED";
  steps: PlanStep[];
  totalEstimatedDurationMs: number;
  planHash: string;
  completedStepsCount: number;
  activeStepId?: string | undefined;
}

export class CopilotPlanner {
  private static instance: CopilotPlanner | null = null;

  public static getInstance(): CopilotPlanner {
    if (!CopilotPlanner.instance) {
      CopilotPlanner.instance = new CopilotPlanner();
    }
    return CopilotPlanner.instance;
  }

  /**
   * Determine if a user goal requires a multi-step structured plan vs a direct response.
   */
  public isComplexGoal(text: string): boolean {
    const lower = text.toLowerCase();
    const complexKeywords = [
      "plan",
      "execute",
      "investigate",
      "audit",
      "run analysis",
      "pipeline",
      "verify release",
      "check drift",
      "blast radius",
      "full review",
      "benchmark",
      "deep scan",
      "remediate",
      "mission",
    ];
    return complexKeywords.some((kw) => lower.includes(kw));
  }

  /**
   * Synthesize a structured execution plan tailored to the user's objective and live context.
   */
  public formulatePlan(goal: string, mode: AppMode, datasetName?: string): DynamicExecutionPlan {
    const planId = `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const lower = goal.toLowerCase();
    const steps: PlanStep[] = [];
    const dsName = datasetName || (mode === "DEMO" ? "IEEE-CIS Fraud Benchmark" : "Production Partition");

    if (lower.includes("drift") || lower.includes("ast") || lower.includes("boundary")) {
      // ARCHITECTURE DRIFT & AST AUDIT PLAN
      steps.push({
        id: `${planId}_s1`,
        stepNumber: 1,
        title: "AST Grammar Parsing & Tokenization",
        objective: "Traverse codebase AST and evaluate cyclomatic complexity distribution.",
        agentType: "ARCHITECTURE_ANALYST",
        toolName: "detect_architecture_drift",
        toolParams: { saveSnapshot: true },
        riskLevel: "READ_ONLY",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [],
        expectedDurationMs: 400,
        postAssertions: ["AST nodes parsed", "Complexity histogram generated"],
      });

      steps.push({
        id: `${planId}_s2`,
        stepNumber: 2,
        title: "Boundary Conformance & Dependency Graph",
        objective: "Identify undeclared package imports and illegal service-to-service calls.",
        agentType: "ARCHITECTURE_ANALYST",
        toolName: "get_architecture_graph",
        riskLevel: "READ_ONLY",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s1`],
        expectedDurationMs: 350,
        postAssertions: ["Circular dependencies checked", "Microservice DAG compiled"],
      });

      steps.push({
        id: `${planId}_s3`,
        stepNumber: 3,
        title: "Release Policy Compliance Evaluation",
        objective: "Evaluate 7 release gates against discovered drift violations.",
        agentType: "SECURITY_ANALYST",
        toolName: "evaluate_engineering_policies",
        riskLevel: "READ_ONLY",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s2`],
        expectedDurationMs: 300,
        postAssertions: ["Gate results generated", "Blocking gates identified"],
      });

      steps.push({
        id: `${planId}_s4`,
        stepNumber: 4,
        title: "Cryptographic Provenance Signing",
        objective: "Stamp drift audit findings with SHA-256 tamper-evident integrity digest.",
        agentType: "REPORT_GENERATOR",
        toolName: "record_architecture_decision",
        toolParams: { decision: "Architecture Drift Audit" },
        riskLevel: "SAFE",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s3`],
        expectedDurationMs: 250,
        postAssertions: ["SHA-256 seal computed", "Audit ledger entry recorded"],
      });
    } else if (lower.includes("anomaly") || lower.includes("outlier") || lower.includes("fraud") || lower.includes("usr-")) {
      // ANOMALY & GRAPH CENTRALITY INVESTIGATION PLAN
      steps.push({
        id: `${planId}_s1`,
        stepNumber: 1,
        title: "Data Acquisition & Schema Verification",
        objective: `Extract target transaction records from ${dsName} and verify column contracts.`,
        agentType: "DATA_QUALITY",
        toolName: "validate_dataset_schema",
        toolParams: { datasetName: dsName },
        riskLevel: "READ_ONLY",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [],
        expectedDurationMs: 350,
        postAssertions: ["Null fraction < 5%", "Required columns present"],
      });

      steps.push({
        id: `${planId}_s2`,
        stepNumber: 2,
        title: "Statistical IQR Outlier Extraction",
        objective: "Calculate Q1, Q3, and interquartile range thresholds on velocity and amount.",
        agentType: "DATA_ANALYST",
        toolName: "run_analysis_pipeline",
        toolParams: { stageFilter: 5 },
        riskLevel: "READ_ONLY",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s1`],
        expectedDurationMs: 500,
        postAssertions: ["Outlier bounds populated", "Deviation scores assigned"],
      });

      steps.push({
        id: `${planId}_s3`,
        stepNumber: 3,
        title: "Bipartite Interaction Graph & Proxy Clustering",
        objective: "Trace user-to-IP relationships and isolate high-fanout proxy nodes.",
        agentType: "ANOMALY_INVESTIGATOR",
        toolName: "investigate_anomaly",
        toolParams: { entityId: "USR-9921" },
        riskLevel: "READ_ONLY",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s2`],
        expectedDurationMs: 450,
        postAssertions: ["Node degree centrality computed", "Clusters detected"],
      });

      steps.push({
        id: `${planId}_s4`,
        stepNumber: 4,
        title: "SHAP Risk Attribution & Remediation Formulation",
        objective: "Decompose risk drivers for suspect entities and propose automated mitigation rules.",
        agentType: "RISK_ANALYST",
        toolName: "generate_audit_report",
        riskLevel: "SAFE",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s3`],
        expectedDurationMs: 400,
        postAssertions: ["SHAP waterfall computed", "Mitigation actions drafted"],
      });
    } else {
      // COMPREHENSIVE 12-STAGE ORCHESTRATION & GOVERNANCE PLAN
      steps.push({
        id: `${planId}_s1`,
        stepNumber: 1,
        title: "Ingestion & Contract Conformance",
        objective: `Ingest partition from ${dsName} and assert schema type fidelity.`,
        agentType: "DATA_QUALITY",
        toolName: "validate_dataset_schema",
        toolParams: { datasetName: dsName },
        riskLevel: "READ_ONLY",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [],
        expectedDurationMs: 300,
        postAssertions: ["Contract verified", "Partition buffer ready"],
      });

      steps.push({
        id: `${planId}_s2`,
        stepNumber: 2,
        title: "Statistical Feature Scaling & Outlier Detection",
        objective: "Compute z-score scales and execute IQR anomaly detection.",
        agentType: "DATA_ANALYST",
        toolName: "run_analysis_pipeline",
        toolParams: { mode },
        riskLevel: "READ_ONLY",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s1`],
        expectedDurationMs: 600,
        postAssertions: ["Features encoded", "Outlier count determined"],
      });

      steps.push({
        id: `${planId}_s3`,
        stepNumber: 3,
        title: "Composite Multi-Factor Risk Scoring",
        objective: "Weigh anomaly frequency, entity centrality, and transaction velocity.",
        agentType: "RISK_ANALYST",
        toolName: "run_analysis_pipeline",
        riskLevel: "READ_ONLY",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s2`],
        expectedDurationMs: 450,
        postAssertions: ["Risk tiers classified", "Top risk entities listed"],
      });

      steps.push({
        id: `${planId}_s4`,
        stepNumber: 4,
        title: "Cryptographic Provenance Seal Finalization",
        objective: "Sign complete execution telemetry with immutable SHA-256 seal.",
        agentType: "REPORT_GENERATOR",
        toolName: "generate_audit_report",
        riskLevel: "SAFE",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s3`],
        expectedDurationMs: 350,
        postAssertions: ["Tamper-evident digest emitted", "Provenance verified"],
      });
    }

    const totalEstimatedDurationMs = steps.reduce((sum, s) => sum + s.expectedDurationMs, 0);
    const planHash = generateVerificationHash(`${planId}:${steps.length}:${totalEstimatedDurationMs}`);

    return {
      id: planId,
      goal,
      targetEntity: dsName,
      mode,
      createdAt: new Date().toISOString(),
      status: "READY",
      steps,
      totalEstimatedDurationMs,
      planHash,
      completedStepsCount: 0,
      activeStepId: steps[0]?.id,
    };
  }
}

export const copilotPlanner = CopilotPlanner.getInstance();
