/**
 * PROJECT BRAHMA / VYRON — COPILOT DYNAMIC MISSION PLANNER (PHASE 09)
 * Decomposes complex engineering & analytical objectives into structured,
 * inspectable, resumable DAG execution plans.
 * Binds specialist agents, typed tools, capability models, and verification assertions.
 *
 * Pipeline:
 * INTENT → OBJECTIVE → CONSTRAINTS → REQUIRED EVIDENCE → PLAN → TASK GRAPH
 *
 * Strictly ZERO SQL.
 */

import { AppMode } from "@/state/mode/modeStore";
import { SpecialistAgentType } from "./copilotAgentOrchestrator";
import { ToolRiskLevel, ToolCapability } from "./copilotToolRegistry";
import { generateVerificationHash } from "../ai/cryptoUtils";
import { CopilotIntentType } from "./copilotIntentGateway";

export type StepExecutionStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "AWAITING_APPROVAL" | "SKIPPED";

export interface PlanStep {
  id: string;
  stepNumber: number;
  title: string;
  objective: string;
  agentType: SpecialistAgentType;
  toolName?: string | undefined;
  capability?: ToolCapability | undefined;
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
  intent?: CopilotIntentType | undefined;
  constraints?: string[] | undefined;
  requiredEvidence?: string[] | undefined;
  timeBudgetMs?: number | undefined;
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
   * Synthesize a structured execution plan tailored to the user's objective, intent, and live context.
   */
  public formulatePlan(
    goal: string,
    mode: AppMode,
    datasetName?: string,
    options?: {
      intent?: CopilotIntentType;
      constraints?: string[];
      requiredEvidence?: string[];
    },
  ): DynamicExecutionPlan {
    const planId = `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const lower = goal.toLowerCase();
    const steps: PlanStep[] = [];
    const dsName = datasetName || (mode === "DEMO" ? "IEEE-CIS Fraud Benchmark" : "Production Partition");

    const constraints = options?.constraints || [
      "Strict zero raw SQL discipline",
      "Air-gapped execution if running in DEMO mode",
      "Cryptographic integrity seal required on final step",
    ];

    const requiredEvidence = options?.requiredEvidence || [
      "AST complexity scan proof",
      "Bandit CWE security report",
      "SHA-256 signed audit receipt",
    ];

    if (lower.includes("drift") || lower.includes("ast") || lower.includes("boundary")) {
      // ARCHITECTURE DRIFT & AST AUDIT PLAN
      steps.push({
        id: `${planId}_s1`,
        stepNumber: 1,
        title: "AST Grammar Parsing & Tokenization",
        objective: "Traverse codebase AST and evaluate cyclomatic complexity distribution.",
        agentType: "ARCHITECTURE_ANALYST",
        toolName: "detect_architecture_drift",
        capability: "ANALYZE",
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
        capability: "RETRIEVE",
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
        agentType: "RISK_ANALYST",
        toolName: "recommend_policy_remediation",
        capability: "RECOMMEND",
        riskLevel: "SAFE",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s2`],
        expectedDurationMs: 300,
        postAssertions: ["Blocking policy flags checked", "Gate compliance matrix generated"],
      });

      steps.push({
        id: `${planId}_s4`,
        stepNumber: 4,
        title: "Compile Cryptographic Audit Report",
        objective: "Generate tamper-evident summary digest with SHA-256 seal.",
        agentType: "REPORT_GENERATOR",
        toolName: "prepare_adr_draft",
        capability: "PREPARE_MUTATION",
        riskLevel: "SAFE",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s3`],
        expectedDurationMs: 250,
        postAssertions: ["SHA-256 hash sealed", "Report exported to workspace"],
      });
    } else if (lower.includes("release") || lower.includes("policy") || lower.includes("deploy")) {
      // RELEASE VERIFICATION & BLAST RADIUS AUDIT
      steps.push({
        id: `${planId}_s1`,
        stepNumber: 1,
        title: "Evaluate 7 Core Release Questions",
        objective: "Inspect changeset, dependencies, unknowns, and policy exemptions.",
        agentType: "RISK_ANALYST",
        toolName: "get_system_health",
        capability: "OBSERVE",
        riskLevel: "SAFE",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [],
        expectedDurationMs: 300,
        postAssertions: ["Policy matrix evaluated", "Blockers isolated"],
      });

      steps.push({
        id: `${planId}_s2`,
        stepNumber: 2,
        title: "Transitive Impact & Blast Radius Calculation",
        objective: "Traverse ATLAS knowledge graph to calculate affected downstream services.",
        agentType: "ARCHITECTURE_ANALYST",
        toolName: "get_architecture_graph",
        capability: "RETRIEVE",
        riskLevel: "SAFE",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s1`],
        expectedDurationMs: 400,
        postAssertions: ["Blast radius computed", "Critical paths highlighted"],
      });

      steps.push({
        id: `${planId}_s3`,
        stepNumber: 3,
        title: "Release Authorization Review",
        objective: "Request operator sign-off from authorized CISO / Release Captain role.",
        agentType: "SECURITY_ANALYST",
        toolName: "grant_policy_exception",
        capability: "ADMINISTER",
        riskLevel: "HIGH_IMPACT",
        requiresApproval: true,
        status: "PENDING",
        dependencies: [`${planId}_s2`],
        expectedDurationMs: 500,
        postAssertions: ["Sign-off recorded in audit log"],
      });
    } else {
      // DEFAULT COMPREHENSIVE 12-STAGE PIPELINE RUN PLAN
      steps.push({
        id: `${planId}_s1`,
        stepNumber: 1,
        title: "Schema Contract & Partition Validation",
        objective: `Audit schema boundaries and null tolerance for ${dsName}.`,
        agentType: "DATA_QUALITY",
        toolName: "validate_dataset_schema",
        capability: "ANALYZE",
        riskLevel: "SAFE",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [],
        expectedDurationMs: 300,
        postAssertions: ["Zero null-tolerant violations", "Schema contracts locked"],
      });

      steps.push({
        id: `${planId}_s2`,
        stepNumber: 2,
        title: "Statistical Velocity & IQR Anomaly Scoring",
        objective: "Detect numerical outliers and transaction bursts across partition.",
        agentType: "DATA_ANALYST",
        toolName: "run_analysis_pipeline",
        capability: "ANALYZE",
        riskLevel: "READ_ONLY",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s1`],
        expectedDurationMs: 500,
        postAssertions: ["IQR thresholds evaluated", "Anomaly clusters formed"],
      });

      steps.push({
        id: `${planId}_s3`,
        stepNumber: 3,
        title: "Static Security AST Scan & CWE Audit",
        objective: "Audit code health, Bandit security CWEs, and cyclomatic complexity.",
        agentType: "SECURITY_ANALYST",
        toolName: "detect_architecture_drift",
        capability: "ANALYZE",
        riskLevel: "READ_ONLY",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s2`],
        expectedDurationMs: 400,
        postAssertions: ["CWE vulnerabilities evaluated", "Lizard CCN calculated"],
      });

      steps.push({
        id: `${planId}_s4`,
        stepNumber: 4,
        title: "Integrity Seal & Executive Brief Compilation",
        objective: "Assemble verified audit brief and record cryptographic seal.",
        agentType: "REPORT_GENERATOR",
        toolName: "prepare_adr_draft",
        capability: "PREPARE_MUTATION",
        riskLevel: "SAFE",
        requiresApproval: false,
        status: "PENDING",
        dependencies: [`${planId}_s3`],
        expectedDurationMs: 300,
        postAssertions: ["SHA-256 seal verified", "Report archived in state"],
      });
    }

    const totalDuration = steps.reduce((acc, s) => acc + s.expectedDurationMs, 0);
    const planHash = generateVerificationHash(`${planId}:${goal}:${steps.length}:${mode}`);

    return {
      id: planId,
      goal,
      intent: options?.intent || "MISSION",
      constraints,
      requiredEvidence,
      timeBudgetMs: totalDuration * 2,
      mode,
      createdAt: new Date().toISOString(),
      status: "READY",
      steps,
      totalEstimatedDurationMs: totalDuration,
      planHash,
      completedStepsCount: 0,
    };
  }
}

export const copilotPlanner = CopilotPlanner.getInstance();
