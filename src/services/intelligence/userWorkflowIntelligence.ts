/**
 * VYRON — P05: TARGET USERS & WORKFLOW INTELLIGENCE
 * Canonical persona definitions, primary workflows, failure modes,
 * and measurable outcomes for each engineering stakeholder role.
 * Strictly ZERO operational raw SQL.
 */

import type { UserAuthority } from "@/types/engineeringEntity";

export interface EngineeringPersona {
  role: UserAuthority;
  title: string;
  focusArea: string;
  primaryWorkflows: string[];
  failureModesGuardedAgainst: string[];
  governanceActionAllowance: string[];
  measurableOutcomeKpi: string;
}

export class UserWorkflowIntelligenceEngine {
  private static instance: UserWorkflowIntelligenceEngine | null = null;

  private personas: EngineeringPersona[] = [
    {
      role: "CHIEF_ARCHITECT",
      title: "Chief Systems Architect",
      focusArea: "System Topology, Boundary Enforcement, ADRs, Architectural Fitness Functions",
      primaryWorkflows: [
        "Reviewing and approving architectural mutation proposals",
        "Evaluating architecture drift reports against declared system graphs",
        "Defining architectural fitness functions and release gates",
      ],
      failureModesGuardedAgainst: [
        "Unapproved architectural drift",
        "Circular dependency creation across microservices",
        "Unchecked schema migrations",
      ],
      governanceActionAllowance: ["READ", "ANALYZE", "RECOMMEND", "SIMULATE", "MODIFY", "DEPLOY", "APPROVE", "ADMINISTER"],
      measurableOutcomeKpi: "0 Unmapped Architectural Boundary Violations in production",
    },
    {
      role: "SECURITY_LEAD",
      title: "Chief Information Security Officer / Security Lead",
      focusArea: "STRIDE Threat Modeling, CWE AST Scans, Prompt Injection Resistance, Secret Isolation",
      primaryWorkflows: [
        "Auditing specialist agent CAN vs CANNOT boundaries",
        "Executing adversarial security penetration suites",
        "Verifying zero raw SQL and client key protection",
      ],
      failureModesGuardedAgainst: [
        "Credential leakage to browser clients",
        "Prompt injection model jailbreaks",
        "Unauthorized privilege escalation via API manipulation",
      ],
      governanceActionAllowance: ["READ", "ANALYZE", "RECOMMEND", "SIMULATE", "MODIFY", "APPROVE"],
      measurableOutcomeKpi: "100% of exposed endpoints free from raw SQL and IDOR vulnerabilities",
    },
    {
      role: "SRE_LEAD",
      title: "Site Reliability Engineer / Platform Operations Lead",
      focusArea: "WorkPulse Realtime Observability, Latency SLOs, Stream Partitioning, Fault Recovery",
      primaryWorkflows: [
        "Monitoring realtime event broadcast latency (<2s target)",
        "Inspecting virtualized event partitioning (1,000 events in <50ms)",
        "Verifying circuit breaker fallback to in-memory fixtures",
      ],
      failureModesGuardedAgainst: [
        "Cascading telemetry buffer overflows",
        "Desynchronization between SQL aggregates and UI cards",
        "Unhandled third-party service outage crashes",
      ],
      governanceActionAllowance: ["READ", "ANALYZE", "RECOMMEND", "SIMULATE", "MODIFY"],
      measurableOutcomeKpi: "99.99% event delivery with <50ms partitioning latency",
    },
    {
      role: "STAFF_ENGINEER",
      title: "Staff Software Engineer / Tech Lead",
      focusArea: "Code Complexity, Lizard CCN Benchmarks, Refactoring Proposals, AST Consistency",
      primaryWorkflows: [
        "Decomposing complex engineering questions with Copilot Thinking Engine",
        "Authoring custom skills via 9-stage validation sandbox into safe DRAFT",
        "Analyzing code health trends across repository modules",
      ],
      failureModesGuardedAgainst: [
        "God class proliferation",
        "Silent execution of unvetted custom AI skills",
        "High cyclomatic complexity in payment and risk engines",
      ],
      governanceActionAllowance: ["READ", "ANALYZE", "RECOMMEND", "SIMULATE", "MODIFY"],
      measurableOutcomeKpi: "CCN < 15 across all mission-critical transaction modules",
    },
    {
      role: "DEVELOPER",
      title: "Software Developer",
      focusArea: "Feature Delivery, Test Execution, Dataset Schema Validation, Safe Prototyping",
      primaryWorkflows: [
        "Executing automated analysis pipelines across code and datasets",
        "Using Copilot Exact Answer for quick technical lookups (<think> sanitized)",
        "Switching to Demo Mode for deterministic experimentation without production mutation",
      ],
      failureModesGuardedAgainst: [
        "Accidental production mutations during local testing",
        "Hallucinated API documentation citations",
        "Unvalidated dataset schemas breaking ingestion pipelines",
      ],
      governanceActionAllowance: ["READ", "ANALYZE", "RECOMMEND", "SIMULATE"],
      measurableOutcomeKpi: "Zero production data contamination during local/demo sessions",
    },
  ];

  private constructor() {}

  public static getInstance(): UserWorkflowIntelligenceEngine {
    if (!UserWorkflowIntelligenceEngine.instance) {
      UserWorkflowIntelligenceEngine.instance = new UserWorkflowIntelligenceEngine();
    }
    return UserWorkflowIntelligenceEngine.instance;
  }

  public static getAllPersonas(): EngineeringPersona[] {
    return UserWorkflowIntelligenceEngine.getInstance().getPersonas();
  }

  public static evaluatePersonaJourney(role: UserAuthority): { hasPersona: boolean; coverageScore: number } {
    const persona = UserWorkflowIntelligenceEngine.getInstance().getPersonaByRole(role);
    return {
      hasPersona: Boolean(persona),
      coverageScore: persona ? 100 : 0
    };
  }

  public getPersonas(): EngineeringPersona[] {
    return this.personas;
  }

  public getPersonaByRole(role: UserAuthority): EngineeringPersona | undefined {
    return this.personas.find((p) => p.role === role);
  }
}

export const userWorkflowIntelligenceEngine = UserWorkflowIntelligenceEngine.getInstance();
