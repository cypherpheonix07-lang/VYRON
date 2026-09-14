/**
 * PROJECT BRAHMA — ENGINEERING INVESTIGATION ENGINE
 * Orchestrates root-cause investigation cases for critical security vulnerabilities,
 * performance regressions, and pipeline anomalies.
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
  status: "OPEN" | "INVESTIGATING" | "CONCLUDED";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  affectedSystems: string[];
  evidenceChain: InvestigationEvidenceItem[];
  hypotheses: RootCauseHypothesis[];
  conclusion?: string | undefined;
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
      status: "OPEN",
      severity: params.severity || "HIGH",
      affectedSystems: params.affectedSystems || ["srv-settlement", "services/billing/query.ts"],
      evidenceChain: [],
      hypotheses: [],
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
    if (inv.status === "OPEN") inv.status = "INVESTIGATING";
    return item;
  }

  public addHypothesis(
    investigationId: string,
    hypothesis: Omit<RootCauseHypothesis, "id">,
  ): RootCauseHypothesis {
    const inv = this.investigations.find((i) => i.id === investigationId);
    if (!inv) throw new Error(`Investigation ${investigationId} not found.`);

    const id = `hyp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const fullHyp: RootCauseHypothesis = {
      ...hypothesis,
      id,
    };
    inv.hypotheses.push(fullHyp);
    return fullHyp;
  }

  public concludeInvestigation(
    investigationId: string,
    conclusion: string,
    remediations: string[],
  ): EngineeringInvestigation {
    const inv = this.investigations.find((i) => i.id === investigationId);
    if (!inv) throw new Error(`Investigation ${investigationId} not found.`);

    const now = new Date().toISOString();
    inv.status = "CONCLUDED";
    inv.conclusion = conclusion;
    inv.recommendedRemediations = remediations;
    inv.concludedAt = now;
    inv.verificationHash = generateVerificationHash(`${inv.id}:${conclusion}:${now}`);

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
    this.investigations = [
      {
        id: "inv_001",
        findingId: "SEC-GH-101",
        title: "Dynamic SQL Parameter Concatenation in Billing Query Builder",
        status: "CONCLUDED",
        severity: "HIGH",
        affectedSystems: ["srv-settlement", "services/billing/query.ts"],
        assignedSpecialist: "Security Sentinel",
        createdAt: "2026-09-11T14:30:00Z",
        concludedAt: "2026-09-11T14:48:22Z",
        conclusion: "Confirmed CWE-89 injection vulnerability caused by raw template literal string concatenation inside merchant transaction filter builder.",
        verificationHash: generateVerificationHash("inv_001:CWE-89:CONCLUDED"),
        evidenceChain: [
          {
            id: "ev_101",
            source: "services/billing/query.ts:42",
            type: "AST_CODE",
            content: "const query = `SELECT * FROM settlements WHERE merchant_id = '${merchantId}'`;",
            timestamp: "2026-09-11T14:31:00Z",
            hash: "c23a...1109",
          },
          {
            id: "ev_102",
            source: "Bandit AST Security Scanner",
            type: "RUNTIME_LOG",
            content: "Flagged AST node ast.BinOp (Formatted string query builder) with confidence HIGH.",
            timestamp: "2026-09-11T14:32:15Z",
            hash: "9102...fa81",
          },
        ],
        hypotheses: [
          {
            id: "hyp_1",
            description: "Merchant ID variable is not sanitized or parameterized before query construction.",
            likelihood: "CONFIRMED",
            confidence: 0.98,
            supportingEvidenceIds: ["ev_101", "ev_102"],
          },
        ],
        recommendedRemediations: [
          "Refactor query builder to use parameterized placeholders ($1, $2) or Supabase typed SDK.",
          "Add automated pre-commit hook scanning for unparameterized SQL template literals.",
        ],
      },
    ];
  }
}

export const investigationEngine = InvestigationEngine.getInstance();
