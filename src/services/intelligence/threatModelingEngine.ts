/**
 * VYRON — P16: THREAT MODELING & SECURITY INTELLIGENCE ENGINE
 * STRIDE threat modeling, CWE mapping, prompt injection defense,
 * and zero operational raw SQL compliance verification.
 * Strictly ZERO operational raw SQL.
 */

export type StrideCategory = 
  | "SPOOFING"
  | "TAMPERING"
  | "REPUDIATION"
  | "INFORMATION_DISCLOSURE"
  | "DENIAL_OF_SERVICE"
  | "ELEVATION_OF_PRIVILEGE";

export interface StrideThreatDefinition {
  id: string;
  category: StrideCategory;
  name: string;
  cweId: string;
  mitigationStrategy: string;
  automatedTestGate: string;
  isNeutralized: boolean;
}

export interface SecurityEvaluationResult {
  isSecure: boolean;
  detectedThreats: StrideCategory[];
  cwesFlagged: string[];
  findings: string[];
  evaluatedAt: string;
}

export class ThreatModelingEngine {
  private static readonly THREAT_REGISTRY: StrideThreatDefinition[] = [
    {
      id: "THREAT-01",
      category: "SPOOFING",
      name: "Agent Identity Forgery",
      cweId: "CWE-287",
      mitigationStrategy: "Cryptographic signature validation on all agent dispatch tokens",
      automatedTestGate: "test-adversarial-security.mjs",
      isNeutralized: true
    },
    {
      id: "THREAT-02",
      category: "TAMPERING",
      name: "Evidence Fabric Hash Mutation",
      cweId: "CWE-345",
      mitigationStrategy: "Content-addressed SHA-256 parent lineage DAG validation",
      automatedTestGate: "test-macro-batch-1.mjs",
      isNeutralized: true
    },
    {
      id: "THREAT-03",
      category: "REPUDIATION",
      name: "Unlogged Architectural Action",
      cweId: "CWE-778",
      mitigationStrategy: "Immutable append-only audit ledger recording every action",
      automatedTestGate: "test-godmode-40steps.mjs",
      isNeutralized: true
    },
    {
      id: "THREAT-04",
      category: "INFORMATION_DISCLOSURE",
      name: "Browser Supabase Secret Exposure",
      cweId: "CWE-200",
      mitigationStrategy: "Service role key strictly withheld from client bundles; local mock fallback",
      automatedTestGate: "test-supabase-skill-verification.mjs",
      isNeutralized: true
    },
    {
      id: "THREAT-05",
      category: "DENIAL_OF_SERVICE",
      name: "WorkPulse Event Buffer Overflow",
      cweId: "CWE-400",
      mitigationStrategy: "Bounded ring buffer with <50ms 1,000-event partitioning",
      automatedTestGate: "verify-activity-workpulse.mjs",
      isNeutralized: true
    },
    {
      id: "THREAT-06",
      category: "ELEVATION_OF_PRIVILEGE",
      name: "Bypass Action Authority Fence",
      cweId: "CWE-285",
      mitigationStrategy: "Tier 4 absolute prohibition for destructive production operations",
      automatedTestGate: "test-acceptance-gates.mjs",
      isNeutralized: true
    }
  ];

  public static getThreatMatrix(): StrideThreatDefinition[] {
    return this.THREAT_REGISTRY;
  }

  public static evaluateInputPayload(text: string): SecurityEvaluationResult {
    const threats: StrideCategory[] = [];
    const cwes: string[] = [];
    const findings: string[] = [];

    // Prompt injection heuristic
    const promptInjectionPatterns = [
      /ignore all previous instructions/i,
      /system override/i,
      /disregard safety protocols/i,
      /reveal api key/i
    ];
    for (const pattern of promptInjectionPatterns) {
      if (pattern.test(text)) {
        threats.push("ELEVATION_OF_PRIVILEGE");
        cwes.push("CWE-74"); // Injection
        findings.push("Suspected adversarial prompt injection attempt detected.");
        break;
      }
    }

    // Raw SQL heuristic check
    const rawSqlPatterns = [
      /DROP\s+TABLE/i,
      /UNION\s+SELECT/i,
      /INSERT\s+INTO.+VALUES/i,
      /DELETE\s+FROM.+WHERE/i
    ];
    for (const pattern of rawSqlPatterns) {
      if (pattern.test(text)) {
        threats.push("TAMPERING");
        cwes.push("CWE-89"); // SQL Injection
        findings.push("Unparameterized raw SQL pattern detected in payload.");
        break;
      }
    }

    return {
      isSecure: threats.length === 0,
      detectedThreats: threats,
      cwesFlagged: cwes,
      findings,
      evaluatedAt: new Date().toISOString()
    };
  }
}
