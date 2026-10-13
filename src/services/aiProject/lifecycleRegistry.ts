/**
 * PROJECT BRAHMA / VYRON — 20-SECTION LIFECYCLE REGISTRY
 *
 * Implements the agreed twenty-section lifecycle order while strictly preserving
 * the stable IDs of the original fourteen sections (Prompt Rule 9).
 *
 * Agreed display order:
 *  1. Intent (01_INTENT)
 *  2. Problem (02_PROBLEM)
 *  3. Requirements (03_REQUIREMENTS)
 *  4. Scope (04_SCOPE)
 *  5. Capability (05_CAPABILITY)
 *  6. Experience & Accessibility — NEW (15_EXPERIENCE)
 *  7. Architecture (06_ARCHITECTURE)
 *  8. Technology (07_TECHNOLOGY)
 *  9. Data (08_DATA)
 * 10. AI/ML (09_AI_DESIGN)
 * 11. Integration & Interoperability — NEW (16_INTEGRATION)
 * 12. Security (10_SECURITY)
 * 13. Reliability (11_RELIABILITY)
 * 14. Implementation (12_IMPLEMENTATION)
 * 15. Testing (13_TESTING)
 * 16. Release & Migration — NEW (17_RELEASE)
 * 17. Operations & Incident Response — NEW (18_OPERATIONS)
 * 18. Evaluation & Improvement — NEW (19_EVALUATION)
 * 19. Retirement & Transition — NEW (20_RETIREMENT)
 * 20. Blueprint (14_BLUEPRINT)
 *
 * Strictly ZERO Raw SQL.
 */

import {
  Brain,
  Target,
  CheckSquare,
  Layers,
  Palette,
  Server,
  Cpu,
  Database,
  Network,
  Shield,
  Activity,
  Terminal,
  Rocket,
  LifeBuoy,
  TrendingUp,
  Archive,
  FileText,
} from "lucide-react";
import type { ElementType } from "react";

export type Original14StageId =
  | "01_INTENT"
  | "02_PROBLEM"
  | "03_REQUIREMENTS"
  | "04_SCOPE"
  | "05_CAPABILITY"
  | "06_ARCHITECTURE"
  | "07_TECHNOLOGY"
  | "08_DATA"
  | "09_AI_DESIGN"
  | "10_SECURITY"
  | "11_RELIABILITY"
  | "12_IMPLEMENTATION"
  | "13_TESTING"
  | "14_BLUEPRINT";

export type New6StageId =
  | "15_EXPERIENCE"
  | "16_INTEGRATION"
  | "17_RELEASE"
  | "18_OPERATIONS"
  | "19_EVALUATION"
  | "20_RETIREMENT";

export type ProjectLifecycleStage = Original14StageId | New6StageId;

export type WorkAreaCategory =
  | "Foundations & Strategy"
  | "Architecture & Engineering"
  | "Integration & Governance"
  | "Delivery & Operations"
  | "Synthesis & Closure";

export interface LifecycleSectionDefinition {
  id: ProjectLifecycleStage;
  displayOrder: number; // 1 to 20
  displayNum: string; // "01" to "20"
  label: string; // e.g. "01 Intent", "06 Experience & Accessibility"
  name: string; // e.g. "Intent", "Experience & Accessibility"
  shortName: string; // e.g. "Intent", "Experience"
  description: string;
  icon: ElementType;
  isNew: boolean;
  workArea: WorkAreaCategory;
  primaryArtifact: string;
  suggestedAgentRole: string;
  inspectionChecks: string[];
}

export const ORIGINAL_14_STAGE_IDS: readonly Original14StageId[] = [
  "01_INTENT",
  "02_PROBLEM",
  "03_REQUIREMENTS",
  "04_SCOPE",
  "05_CAPABILITY",
  "06_ARCHITECTURE",
  "07_TECHNOLOGY",
  "08_DATA",
  "09_AI_DESIGN",
  "10_SECURITY",
  "11_RELIABILITY",
  "12_IMPLEMENTATION",
  "13_TESTING",
  "14_BLUEPRINT",
] as const;

export const NEW_6_STAGE_IDS: readonly New6StageId[] = [
  "15_EXPERIENCE",
  "16_INTEGRATION",
  "17_RELEASE",
  "18_OPERATIONS",
  "19_EVALUATION",
  "20_RETIREMENT",
] as const;

/**
 * Authoritative 20-Section Lifecycle array in exact agreed display order.
 */
export const LIFECYCLE_20_SECTIONS: readonly LifecycleSectionDefinition[] = [
  {
    id: "01_INTENT",
    displayOrder: 1,
    displayNum: "01",
    label: "01 Intent",
    name: "Intent",
    shortName: "Intent",
    description: "Natural language intent synthesis, target persona profiling, and strategic goals.",
    icon: Brain,
    isNew: false,
    workArea: "Foundations & Strategy",
    primaryArtifact: "ProjectIntentModel",
    suggestedAgentRole: "DiscoveryAgent",
    inspectionChecks: [
      "Intent statement non-empty",
      "Identified primary user persona",
      "Boundary constraints registered",
    ],
  },
  {
    id: "02_PROBLEM",
    displayOrder: 2,
    displayNum: "02",
    label: "02 Problem",
    name: "Problem",
    shortName: "Problem",
    description: "5-Whys root cause analysis, target outcomes, and quantitative metric impact.",
    icon: Target,
    isNew: false,
    workArea: "Foundations & Strategy",
    primaryArtifact: "ProblemModel",
    suggestedAgentRole: "ProblemAnalystAgent",
    inspectionChecks: [
      "Root cause depth >= 3",
      "Impacted stakeholders enumerated",
      "Success metrics quantified",
    ],
  },
  {
    id: "03_REQUIREMENTS",
    displayOrder: 3,
    displayNum: "03",
    label: "03 Requirements",
    name: "Requirements",
    shortName: "Requirements",
    description: "Atomic functional, non-functional, and compliance requirements with testability criteria.",
    icon: CheckSquare,
    isNew: false,
    workArea: "Foundations & Strategy",
    primaryArtifact: "RequirementItem[]",
    suggestedAgentRole: "RequirementsEngineerAgent",
    inspectionChecks: [
      "All requirements atomic and assigned stable IDs",
      "Zero ungrounded assertions",
      "Acceptance criteria verifiable",
    ],
  },
  {
    id: "04_SCOPE",
    displayOrder: 4,
    displayNum: "04",
    label: "04 Scope",
    name: "Scope",
    shortName: "Scope",
    description: "MVP boundary allocation, explicit out-of-scope declarations, and drift guardrails.",
    icon: Layers,
    isNew: false,
    workArea: "Foundations & Strategy",
    primaryArtifact: "ScopeModel",
    suggestedAgentRole: "ScopeEngineerAgent",
    inspectionChecks: [
      "At least one requirement in MVP",
      "Explicit out-of-scope items defined",
      "Scope stability metric computed",
    ],
  },
  {
    id: "05_CAPABILITY",
    displayOrder: 5,
    displayNum: "05",
    label: "05 Capability",
    name: "Capability",
    shortName: "Capability",
    description: "Hierarchical business and system capability taxonomy decoupled from technology choice.",
    icon: Layers,
    isNew: false,
    workArea: "Foundations & Strategy",
    primaryArtifact: "CapabilityModel",
    suggestedAgentRole: "CapabilityArchitectAgent",
    inspectionChecks: [
      "System capabilities mapped to requirements",
      "Maturity rating assigned per capability",
      "Zero duplicate domain responsibilities",
    ],
  },
  {
    id: "15_EXPERIENCE",
    displayOrder: 6,
    displayNum: "06",
    label: "06 Experience & Accessibility",
    name: "Experience & Accessibility",
    shortName: "Experience",
    description: "Design system tokens, WCAG 2.1 AA/AAA compliance, user journeys, and keyboard accessibility.",
    icon: Palette,
    isNew: true,
    workArea: "Architecture & Engineering",
    primaryArtifact: "ExperienceModel",
    suggestedAgentRole: "ExperienceArchitectAgent",
    inspectionChecks: [
      "WCAG 2.1 AA contrast ratio verified (>= 4.5:1)",
      "Non-color visual status indicators present",
      "Keyboard navigation and focus order verified",
      "Responsive breakpoint matrix established",
    ],
  },
  {
    id: "06_ARCHITECTURE",
    displayOrder: 7,
    displayNum: "07",
    label: "07 Architecture",
    name: "Architecture",
    shortName: "Architecture",
    description: "System topology, service boundaries, architecture alternatives, and trade-off scoring.",
    icon: Server,
    isNew: false,
    workArea: "Architecture & Engineering",
    primaryArtifact: "ArchitectureModel",
    suggestedAgentRole: "SolutionArchitectAgent",
    inspectionChecks: [
      "Architecture baseline selected from alternatives",
      "Service boundary interactions documented",
      "Consistency score evaluated",
    ],
  },
  {
    id: "07_TECHNOLOGY",
    displayOrder: 8,
    displayNum: "08",
    label: "08 Technology",
    name: "Technology",
    shortName: "Technology",
    description: "Technology decisions, framework rationales, lock-in evaluation, and migration burdens.",
    icon: Cpu,
    isNew: false,
    workArea: "Architecture & Engineering",
    primaryArtifact: "TechnologyModel",
    suggestedAgentRole: "TechnologyArchitectAgent",
    inspectionChecks: [
      "Technology stack selections justified with alternatives",
      "Dependency operational burden scored",
      "Zero ungrounded runtime claims",
    ],
  },
  {
    id: "08_DATA",
    displayOrder: 9,
    displayNum: "09",
    label: "09 Data",
    name: "Data",
    shortName: "Data",
    description: "Domain entities, relationship models, data classifications, and multi-tenant RLS policies.",
    icon: Database,
    isNew: false,
    workArea: "Architecture & Engineering",
    primaryArtifact: "DataArchitectureModel",
    suggestedAgentRole: "DataArchitectAgent",
    inspectionChecks: [
      "Zero Raw SQL mandate verified",
      "Sensitivity levels assigned to all entities",
      "Multi-tenant RLS policy coverage 100%",
    ],
  },
  {
    id: "09_AI_DESIGN",
    displayOrder: 10,
    displayNum: "10",
    label: "10 AI/ML",
    name: "AI/ML",
    shortName: "AI/ML",
    description: "Inference pipelines, provider evaluation, prompt injection defense, and fallback strategies.",
    icon: Brain,
    isNew: false,
    workArea: "Architecture & Engineering",
    primaryArtifact: "AiEngineeringModel",
    suggestedAgentRole: "AiArchitectAgent",
    inspectionChecks: [
      "Prompt injection defense documented",
      "Token budget and latency SLA verified",
      "Deterministic non-AI fallback path available",
    ],
  },
  {
    id: "16_INTEGRATION",
    displayOrder: 11,
    displayNum: "11",
    label: "11 Integration & Interoperability",
    name: "Integration & Interoperability",
    shortName: "Integration",
    description: "External API contracts, protocols, webhook resilience, idempotency keys, and schema bridges.",
    icon: Network,
    isNew: true,
    workArea: "Integration & Governance",
    primaryArtifact: "IntegrationModel",
    suggestedAgentRole: "IntegrationArchitectAgent",
    inspectionChecks: [
      "External endpoint protocols and rate limits declared",
      "Idempotency keys and replay protection enforced",
      "Circuit breaker and backoff policies defined",
      "Schema translation contracts validated",
    ],
  },
  {
    id: "10_SECURITY",
    displayOrder: 12,
    displayNum: "12",
    label: "12 Security",
    name: "Security",
    shortName: "Security",
    description: "STRIDE threat modeling, trust boundaries, entry point hardening, and credential boundaries.",
    icon: Shield,
    isNew: false,
    workArea: "Integration & Governance",
    primaryArtifact: "SecurityModel",
    suggestedAgentRole: "SecurityArchitectAgent",
    inspectionChecks: [
      "Zero hardcoded credentials in source or config",
      "STRIDE threat coverage complete",
      "Server-side authorization enforced on all endpoints",
    ],
  },
  {
    id: "11_RELIABILITY",
    displayOrder: 13,
    displayNum: "13",
    label: "13 Reliability",
    name: "Reliability",
    shortName: "Reliability",
    description: "Failure scenarios, circuit breakers, timeout budgets, and graceful degradation paths.",
    icon: Activity,
    isNew: false,
    workArea: "Integration & Governance",
    primaryArtifact: "ReliabilityModel",
    suggestedAgentRole: "ReliabilityEngineerAgent",
    inspectionChecks: [
      "Component failure scenarios simulated",
      "Timeout budgets defined across all tiers",
      "Resilience score calculated",
    ],
  },
  {
    id: "12_IMPLEMENTATION",
    displayOrder: 14,
    displayNum: "14",
    label: "14 Implementation",
    name: "Implementation",
    shortName: "Implementation",
    description: "Dependency-aware tasks, milestone scheduling, API implementations, and architectural contracts.",
    icon: Terminal,
    isNew: false,
    workArea: "Delivery & Operations",
    primaryArtifact: "ImplementationModel",
    suggestedAgentRole: "ImplementationPlannerAgent",
    inspectionChecks: [
      "Task DAG acyclic and dependency-ordered",
      "Milestone criteria measurable",
      "Implementation complexity estimated",
    ],
  },
  {
    id: "13_TESTING",
    displayOrder: 15,
    displayNum: "15",
    label: "15 Testing",
    name: "Testing",
    shortName: "Testing",
    description: "Unit, integration, and security test automation with full requirement traceability matrix.",
    icon: CheckSquare,
    isNew: false,
    workArea: "Delivery & Operations",
    primaryArtifact: "TestModel",
    suggestedAgentRole: "TestEngineerAgent",
    inspectionChecks: [
      "Requirement-to-test traceability 100%",
      "Automated verification test suites executed",
      "Zero ungrounded passing test claims",
    ],
  },
  {
    id: "17_RELEASE",
    displayOrder: 16,
    displayNum: "16",
    label: "16 Release & Migration",
    name: "Release & Migration",
    shortName: "Release",
    description: "Version strategy, automated rollback routines, deployment rings, and schema migration plans.",
    icon: Rocket,
    isNew: true,
    workArea: "Delivery & Operations",
    primaryArtifact: "ReleaseMigrationModel",
    suggestedAgentRole: "ReleaseEngineerAgent",
    inspectionChecks: [
      "Zero-downtime database migration path verified",
      "Rollback script tested and automated",
      "Deployment ring progression defined",
      "Feature flags configured for sensitive transitions",
    ],
  },
  {
    id: "18_OPERATIONS",
    displayOrder: 17,
    displayNum: "17",
    label: "17 Operations & Incident Response",
    name: "Operations & Incident Response",
    shortName: "Operations",
    description: "SLAs/SLOs, runbook documentation, alerting thresholds, health checks, and severity matrices.",
    icon: LifeBuoy,
    isNew: true,
    workArea: "Delivery & Operations",
    primaryArtifact: "OperationsModel",
    suggestedAgentRole: "OperationsEngineerAgent",
    inspectionChecks: [
      "SLO targets defined with quantifiable SLI metrics",
      "Operational runbooks authored for critical alerts",
      "Incident severity matrix and escalation paths registered",
      "Liveness and readiness probes configured",
    ],
  },
  {
    id: "19_EVALUATION",
    displayOrder: 18,
    displayNum: "18",
    label: "18 Evaluation & Improvement",
    name: "Evaluation & Improvement",
    shortName: "Evaluation",
    description: "Performance baselines, error budgets, telemetry feedback loops, and optimization roadmaps.",
    icon: TrendingUp,
    isNew: true,
    workArea: "Synthesis & Closure",
    primaryArtifact: "EvaluationModel",
    suggestedAgentRole: "EvaluationEngineerAgent",
    inspectionChecks: [
      "Production telemetry baselines recorded",
      "Error budget calculation active",
      "Feedback loop cadence defined",
      "Measurable hypotheses linked to experiments",
    ],
  },
  {
    id: "20_RETIREMENT",
    displayOrder: 19,
    displayNum: "19",
    label: "19 Retirement & Transition",
    name: "Retirement & Transition",
    shortName: "Retirement",
    description: "Deprecation schedules, data retention/shredding procedures, customer offboarding, and sunset criteria.",
    icon: Archive,
    isNew: true,
    workArea: "Synthesis & Closure",
    primaryArtifact: "RetirementModel",
    suggestedAgentRole: "RetirementPlannerAgent",
    inspectionChecks: [
      "Deprecation notice period established",
      "Data retention and crypto-shredding protocol defined",
      "Customer migration and offboarding path verified",
      "Decommissioning safety checklist complete",
    ],
  },
  {
    id: "14_BLUEPRINT",
    displayOrder: 20,
    displayNum: "20",
    label: "20 Blueprint",
    name: "Blueprint",
    shortName: "Blueprint",
    description: "Canonical blueprint compilation, cross-stage consistency check, and initialization freeze.",
    icon: FileText,
    isNew: false,
    workArea: "Synthesis & Closure",
    primaryArtifact: "ProjectBlueprint",
    suggestedAgentRole: "BlueprintCompilerAgent",
    inspectionChecks: [
      "All 20 lifecycle stages inspected and consistent",
      "Cryptographic SHA-256 seal computed",
      "Readiness manifest signed for candidate output",
    ],
  },
] as const;

/**
 * Accessors and Query Helpers
 */
export const LIFECYCLE_REGISTRY = {
  getAllSections(): readonly LifecycleSectionDefinition[] {
    return LIFECYCLE_20_SECTIONS;
  },

  getSectionById(id: ProjectLifecycleStage): LifecycleSectionDefinition {
    const found = LIFECYCLE_20_SECTIONS.find((s) => s.id === id);
    if (!found) {
      throw new Error(`Unknown lifecycle section ID: ${id}`);
    }
    return found;
  },

  getSectionByDisplayOrder(order: number): LifecycleSectionDefinition | undefined {
    return LIFECYCLE_20_SECTIONS.find((s) => s.displayOrder === order);
  },

  getDisplayNumber(id: ProjectLifecycleStage): string {
    return this.getSectionById(id).displayNum;
  },

  isOriginal14(id: ProjectLifecycleStage): boolean {
    return (ORIGINAL_14_STAGE_IDS as readonly string[]).includes(id);
  },

  isNewSection(id: ProjectLifecycleStage): boolean {
    return (NEW_6_STAGE_IDS as readonly string[]).includes(id);
  },

  getSectionsByWorkArea(workArea: WorkAreaCategory): LifecycleSectionDefinition[] {
    return LIFECYCLE_20_SECTIONS.filter((s) => s.workArea === workArea);
  },

  /**
   * Validates registry integrity:
   * 1. Exactly 20 sections
   * 2. Display orders are 1..20 continuous
   * 3. Display numbers are "01".."20"
   * 4. All 14 original IDs are preserved with exact string names
   * 5. All 6 new IDs are present
   */
  validateRegistryIntegrity(): {
    valid: boolean;
    totalCount: number;
    original14Preserved: boolean;
    new6Included: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (LIFECYCLE_20_SECTIONS.length !== 20) {
      errors.push(`Expected exactly 20 sections, found ${LIFECYCLE_20_SECTIONS.length}`);
    }

    // Check display orders
    for (let i = 1; i <= 20; i++) {
      const match = LIFECYCLE_20_SECTIONS.find((s) => s.displayOrder === i);
      if (!match) {
        errors.push(`Missing section with displayOrder ${i}`);
      }
    }

    // Check preservation of original 14 IDs
    for (const origId of ORIGINAL_14_STAGE_IDS) {
      const exists = LIFECYCLE_20_SECTIONS.some((s) => s.id === origId);
      if (!exists) {
        errors.push(`Original stage ID missing: ${origId}`);
      }
    }

    // Check inclusion of new 6 IDs
    for (const newId of NEW_6_STAGE_IDS) {
      const exists = LIFECYCLE_20_SECTIONS.some((s) => s.id === newId);
      if (!exists) {
        errors.push(`New stage ID missing: ${newId}`);
      }
    }

    return {
      valid: errors.length === 0,
      totalCount: LIFECYCLE_20_SECTIONS.length,
      original14Preserved: ORIGINAL_14_STAGE_IDS.every((id) =>
        LIFECYCLE_20_SECTIONS.some((s) => s.id === id)
      ),
      new6Included: NEW_6_STAGE_IDS.every((id) =>
        LIFECYCLE_20_SECTIONS.some((s) => s.id === id)
      ),
      errors,
    };
  },
};
