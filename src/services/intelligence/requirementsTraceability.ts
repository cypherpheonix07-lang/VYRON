/**
 * VYRON — P15: REQUIREMENTS, SPECIFICATIONS & TRACEABILITY ENGINE
 * Bidirectional traceability matrix linking product requirements,
 * architectural components, test suites, and cryptographic evidence.
 * Strictly ZERO operational raw SQL.
 */

export interface SystemRequirement {
  id: string; // e.g. "REQ-PULSE-01"
  title: string;
  category: "FUNCTIONAL" | "NON_FUNCTIONAL" | "SECURITY" | "OBSERVABILITY";
  mandate: string;
  mappedComponents: string[];
  verifyingTests: string[];
  evidenceIds: string[];
  isVerified: boolean;
}

export interface TraceabilityReport {
  totalRequirements: number;
  verifiedRequirements: number;
  coverageRatio: number;
  uncoveredRequirementIds: string[];
  generatedAt: string;
}

export class RequirementsTraceabilityEngine {
  private static readonly REQUIREMENTS_STORE: Map<string, SystemRequirement> = new Map([
    [
      "REQ-CORE-01",
      {
        id: "REQ-CORE-01",
        title: "Zero Operational Raw SQL",
        category: "SECURITY",
        mandate: "All state mutations and queries must execute via typed SDKs or deterministic stores with 0 raw SQL.",
        mappedComponents: ["src/services/supabaseClient.ts", "src/services/mockDatabase.ts"],
        verifyingTests: ["test-adversarial-security.mjs", "qa-adversarial-master.mjs"],
        evidenceIds: ["ev_sql_clean_proof"],
        isVerified: true
      }
    ],
    [
      "REQ-PULSE-01",
      {
        id: "REQ-PULSE-01",
        title: "WorkPulse Realtime Broadcast Latency",
        category: "OBSERVABILITY",
        mandate: "Realtime activity stream events must broadcast within <2s and partition in <50ms.",
        mappedComponents: ["src/services/workpulseEngine.ts", "src/hooks/useActivityPulse.ts"],
        verifyingTests: ["verify-activity-workpulse.mjs"],
        evidenceIds: ["ev_pulse_benchmark_proof"],
        isVerified: true
      }
    ],
    [
      "REQ-DEMO-01",
      {
        id: "REQ-DEMO-01",
        title: "Deterministic Demo/Live Isolation",
        category: "FUNCTIONAL",
        mandate: "Demo workspace operations must never mutate or leak into live database state.",
        mappedComponents: ["src/store/demoStore.ts", "src/services/demoEngine.ts"],
        verifyingTests: ["test-godmode-40steps.mjs"],
        evidenceIds: ["ev_demo_isolation_proof"],
        isVerified: true
      }
    ],
    [
      "REQ-EPISTEMIC-01",
      {
        id: "REQ-EPISTEMIC-01",
        title: "Epistemic Certainty Action Gate",
        category: "FUNCTIONAL",
        mandate: "Refuse autonomous action execution if certainty score falls below 0.75.",
        mappedComponents: ["src/services/intelligence/epistemicTruthEngine.ts"],
        verifyingTests: ["test-macro-batch-1.mjs"],
        evidenceIds: ["ev_epistemic_gate_proof"],
        isVerified: true
      }
    ]
  ]);

  public static getRequirement(id: string): SystemRequirement | undefined {
    return this.REQUIREMENTS_STORE.get(id);
  }

  public static getAllRequirements(): SystemRequirement[] {
    return Array.from(this.REQUIREMENTS_STORE.values());
  }

  public static generateTraceabilityReport(): TraceabilityReport {
    const all = Array.from(this.REQUIREMENTS_STORE.values());
    const verified = all.filter((r) => r.isVerified && r.verifyingTests.length > 0 && r.evidenceIds.length > 0);
    const uncovered = all.filter((r) => !r.isVerified || r.verifyingTests.length === 0).map((r) => r.id);

    return {
      totalRequirements: all.length,
      verifiedRequirements: verified.length,
      coverageRatio: all.length > 0 ? Math.round((verified.length / all.length) * 100) / 100 : 1,
      uncoveredRequirementIds: uncovered,
      generatedAt: new Date().toISOString()
    };
  }
}
