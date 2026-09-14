/**
 * PROJECT BRAHMA — DECISION INTELLIGENCE ENGINE
 * Manages Architecture Decision Records (ADRs), connects trade-offs and options
 * to architecture nodes, and provides cryptographic audit seals.
 * Strictly ZERO SQL.
 */

import { generateVerificationHash } from "@/services/ai/cryptoUtils";

export type DecisionStatus = "DRAFT" | "PROPOSED" | "ACCEPTED" | "REJECTED" | "SUPERSEDED";

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  estimatedEffortHours: number;
}

export interface ArchitectureDecisionRecord {
  id: string;
  title: string;
  status: DecisionStatus;
  context: string;
  options: DecisionOption[];
  chosenOptionId?: string | undefined;
  rationale: string;
  affectedArchitectureNodes: string[];
  actor: string;
  verificationHash: string;
  createdAt: string;
  updatedAt: string;
}

export class DecisionEngine {
  private static instance: DecisionEngine | null = null;
  private decisions: ArchitectureDecisionRecord[] = [];

  private constructor() {
    this.seedBaselineDecisions();
  }

  public static getInstance(): DecisionEngine {
    if (!DecisionEngine.instance) {
      DecisionEngine.instance = new DecisionEngine();
    }
    return DecisionEngine.instance;
  }

  public recordDecision(params: {
    title: string;
    context: string;
    options: DecisionOption[];
    chosenOptionId: string;
    rationale: string;
    affectedArchitectureNodes?: string[] | undefined;
    actor?: string | undefined;
  }): ArchitectureDecisionRecord {
    const id = `ADR-${String(this.decisions.length + 1).padStart(3, "0")}`;
    const now = new Date().toISOString();
    const hash = generateVerificationHash(`${id}:${params.title}:${params.chosenOptionId}:${now}`);

    const record: ArchitectureDecisionRecord = {
      id,
      title: params.title,
      status: "ACCEPTED",
      context: params.context,
      options: params.options,
      chosenOptionId: params.chosenOptionId,
      rationale: params.rationale,
      affectedArchitectureNodes: params.affectedArchitectureNodes || ["srv-settlement"],
      actor: params.actor || "Puli Phanindhra (Lead Architect)",
      verificationHash: hash,
      createdAt: now,
      updatedAt: now,
    };

    this.decisions.unshift(record);
    return record;
  }

  public listDecisions(): ArchitectureDecisionRecord[] {
    return [...this.decisions];
  }

  public getDecision(id: string): ArchitectureDecisionRecord | undefined {
    return this.decisions.find((d) => d.id === id);
  }

  private seedBaselineDecisions(): void {
    const now = "2026-09-10T12:00:00Z";
    this.decisions = [
      {
        id: "ADR-001",
        title: "Use Redis-backed Idempotency Keys for Settlement Retries",
        status: "ACCEPTED",
        context: "Network partitions during bank card acquirer callbacks caused double settlement charges.",
        options: [
          {
            id: "opt-1",
            title: "Database Unique Constraints with Row Locks",
            description: "Rely solely on PostgreSQL table unique constraint on idempotency_key.",
            pros: ["Zero external dependency"],
            cons: ["High lock contention during traffic surges", "Database connection pool exhaustion"],
            estimatedEffortHours: 12,
          },
          {
            id: "opt-2",
            title: "Distributed Redis Token Bucket with Atomicity",
            description: "Pre-lock settlement idempotency key in Redis memory cluster with 120s TTL.",
            pros: ["Sub-millisecond latency", "Zero DB lock contention", "Strict replay prevention"],
            cons: ["Requires highly available Redis replica set"],
            estimatedEffortHours: 16,
          },
        ],
        chosenOptionId: "opt-2",
        rationale: "Selected Redis distributed locking to satisfy FR-02 high throughput requirement without database connection pool starvation.",
        affectedArchitectureNodes: ["srv-settlement", "req-idem-02"],
        actor: "Chief Architect (Puli Phanindhra)",
        verificationHash: generateVerificationHash("ADR-001:opt-2:ACCEPTED"),
        createdAt: now,
        updatedAt: now,
      },
    ];
  }
}

export const decisionEngine = DecisionEngine.getInstance();
