/**
 * PROJECT BRAHMA / VYRON — ENGINEERING INVESTIGATION ENGINE (PHASE 07)
 * Orchestrates root-cause investigation cases for critical security vulnerabilities,
 * performance regressions, and pipeline anomalies.
 *
 * Investigation Lifecycle Representation:
 * QUESTION → OBSERVATIONS → EVIDENCE → HYPOTHESES → ANALYSES → TESTS → ACTIONS → CONCLUSION → UNRESOLVED QUESTIONS
 *
 * Strictly ZERO SQL.
 */

import { generateVerificationHash } from "@/services/ai/cryptoUtils";

export interface InvestigationEvidenceItem {
  id: string;
  source: string;
  type: "AST_CODE" | "RUNTIME_LOG" | "GRAPH_CLUSTER" | "SPECIFICATION" | "CONNECTOR";
  content: string;
  timestamp: string;
  hash: string;
}

export interface RootCauseHypothesis {
  id: string;
  description: string;
  likelihood: "CONFIRMED" | "PROBABLE" | "UNLIKELY";
  confidence: number; // 0 to 1
  supportingEvidenceIds: string[];
}

export interface EngineeringInvestigation {
  id: string;
  findingId: string;
  title: string;
  question?: string | undefined;
  observations?: string[] | undefined;
  status: "OPEN" | "INVESTIGATING" | "CONCLUDED";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  affectedSystems: string[];
  evidenceChain: InvestigationEvidenceItem[];
  hypotheses: RootCauseHypothesis[];
  executedTests?: string[] | undefined;
  actionsTaken?: string[] | undefined;
  conclusion?: string | undefined;
  unresolvedQuestions?: string[] | undefined;
  recommendedRemediations: string[];
  assignedSpecialist: string;
  createdAt: string;
  concludedAt?: string | undefined;
  verificationHash?: string | undefined;
}

export class InvestigationEngine {
  private static instance: InvestigationEngine | null = null;
  private investigations: EngineeringInvestigation[] = [];

  private constructor() {
    this.seedBaselineInvestigations();
  }

  public static getInstance(): InvestigationEngine {
    if (!InvestigationEngine.instance) {
      InvestigationEngine.instance = new InvestigationEngine();
    }
    return InvestigationEngine.instance;
  }

  public createInvestigation(params: {
    findingId: string;
    title: string;
    question?: string | undefined;
    observations?: string[] | undefined;
    severity?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | undefined;
    affectedSystems?: string[] | undefined;
    assignedSpecialist?: string | undefined;
  }): EngineeringInvestigation {
    const id = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const inv: EngineeringInvestigation = {
      id,
      findingId: params.findingId,
      title: params.title,
      question: params.question || `What is the root cause of finding '${params.title}'?`,
      observations: params.observations || ["AST static code scanner flagged high-risk vulnerability."],
      status: "OPEN",
      severity: params.severity || "HIGH",
      affectedSystems: params.affectedSystems || ["srv-settlement", "services/billing/query.ts"],
      evidenceChain: [],
      hypotheses: [],
      executedTests: [],
      actionsTaken: [],
      unresolvedQuestions: ["Are there secondary downstream replicas affected?"],
      recommendedRemediations: [],
      assignedSpecialist: params.assignedSpecialist || "Security Sentinel",
      createdAt: now,
    };

    this.investigations.unshift(inv);
    return inv;
  }

  public addEvidence(
    investigationId: string,
    evidence: Omit<InvestigationEvidenceItem, "id" | "timestamp" | "hash">,
  ): InvestigationEvidenceItem {
    const inv = this.investigations.find((i) => i.id === investigationId);
    if (!inv) throw new Error(`Investigation ${investigationId} not found.`);

    const now = new Date().toISOString();
    const id = `ev_${Date.now()}`;
    const hash = generateVerificationHash(`${id}:${evidence.source}:${evidence.content}:${now}`);

    const item: InvestigationEvidenceItem = {
      ...evidence,
      id,
      timestamp: now,
      hash,
    };

    inv.evidenceChain.push(item);
    return item;
  }

  public addHypothesis(
    investigationId: string,
    hypothesis: Omit<RootCauseHypothesis, "id">,
  ): RootCauseHypothesis {
    const inv = this.investigations.find((i) => i.id === investigationId);
    if (!inv) throw new Error(`Investigation ${investigationId} not found.`);

    const id = `hyp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const item: RootCauseHypothesis = {
      ...hypothesis,
      id,
    };

    inv.hypotheses.push(item);
    return item;
  }

  public concludeInvestigation(
    investigationId: string,
    conclusion: string,
    remediations: string[],
    unresolved?: string[],
  ): EngineeringInvestigation {
    const inv = this.investigations.find((i) => i.id === investigationId);
    if (!inv) throw new Error(`Investigation ${investigationId} not found.`);

    const now = new Date().toISOString();
    inv.status = "CONCLUDED";
    inv.conclusion = conclusion;
    inv.recommendedRemediations = remediations;
    if (unresolved) inv.unresolvedQuestions = unresolved;
    inv.concludedAt = now;
    inv.verificationHash = generateVerificationHash(`${investigationId}:${conclusion}:${now}`);

    return inv;
  }

  public listInvestigations(): EngineeringInvestigation[] {
    return [...this.investigations];
  }

  public getInvestigations(): EngineeringInvestigation[] {
    return this.listInvestigations();
  }

  public getInvestigation(id: string): EngineeringInvestigation | undefined {
    return this.investigations.find((i) => i.id === id);
  }

  private seedBaselineInvestigations(): void {
    const baselineId = "inv_sec_cwe89";
    this.investigations = [
      {
        id: baselineId,
        findingId: "f1",
        title: "Root Cause Investigation: CWE-89 Dynamic Query Parameter Concatenation",
        question: "How did dynamic SQL concatenation penetrate the settlement DAO layer?",
        observations: [
          "services/billing/query.ts line 42 contains raw string template concatenation.",
          "AST complexity score in settlement router is CCN 18.",
        ],
        status: "CONCLUDED",
        severity: "HIGH",
        affectedSystems: ["srv-settlement", "services/billing/query.ts", "aurora-db-postgres"],
        evidenceChain: [
          {
            id: "ev_01",
            source: "Static AST Analyzer (Bandit Rule B608)",
            type: "AST_CODE",
            content: "const query = `SELECT * FROM settlements WHERE account_id = '${input.accountId}'`;",
            timestamp: "2026-09-12T10:01:00Z",
            hash: "c29d...5184",
          },
        ],
        hypotheses: [
          {
            id: "hyp_01",
            description: "Developer bypassed DAO wrapper to execute dynamic filtering under sprint deadline.",
            likelihood: "CONFIRMED",
            confidence: 0.95,
            supportingEvidenceIds: ["ev_01"],
          },
        ],
        executedTests: ["bandit -r services/billing", "tests/unit/test_settlement_dao.ts"],
        actionsTaken: ["Generated AST Parameterized Query Patch in copilotActionEngine"],
        conclusion: "Confirmed CWE-89 injection risk caused by direct string template query interpolation bypassing DAO abstraction.",
        unresolvedQuestions: ["Are there legacy microservice forks using the deprecated query pattern?"],
        recommendedRemediations: [
          "Refactor services/billing/query.ts to use parameterized query placeholder ($1, $2)",
          "Enforce ESLint no-raw-sql rule across billing codebase",
          "Record Architecture Decision ADR-001 re-affirming DAO parameter isolation",
        ],
        assignedSpecialist: "Security Analyst Sentinel",
        createdAt: "2026-09-12T10:00:30Z",
        concludedAt: "2026-09-12T10:03:45Z",
        verificationHash: generateVerificationHash("inv_sec_cwe89:CONCLUDED"),
      },
    ];
  }
}

export const investigationEngine = InvestigationEngine.getInstance();
