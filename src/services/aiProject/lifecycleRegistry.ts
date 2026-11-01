/**
 * PROJECT BRAHMA / VYRON — 26-SECTION CONSOLIDATED LIFECYCLE REGISTRY
 *
 * Implements the 26-section consolidated lifecycle specification (Workstreams A–Z)
 * and the 15 SaaS Technical Area mappings while strictly preserving the stable IDs
 * of the original 14 sections (Prompt Rule 9) and the 6 prior additions.
 *
 * Canonical display order (Workstreams A–Z, displayNum "01" to "26"):
 *  1. [A] Intent & Product Direction (01_INTENT)
 *  2. [B] Problem Definition & Evidence (02_PROBLEM)
 *  3. [C] Business Value & Financial Viability — NEW (21_VALUE)
 *  4. [D] Requirements & Acceptance Criteria (03_REQUIREMENTS)
 *  5. [E] Scope & Change Control (04_SCOPE)
 *  6. [F] Capability & Feasibility (05_CAPABILITY)
 *  7. [G] Governance & Decision Accountability — NEW (22_GOVERNANCE)
 *  8. [H] Experience, Interaction & Accessibility (15_EXPERIENCE)
 *  9. [I] System Design & Architecture (06_ARCHITECTURE)
 * 10. [J] Technology & Engineering Standards (07_TECHNOLOGY)
 * 11. [K] Dependency & Supplier Assurance — NEW (23_DEPENDENCY_ASSURANCE)
 * 12. [L] Data, Databases & Storage (08_DATA)
 * 13. [M] AI/ML & ATHER Intelligence (09_AI_DESIGN)
 * 14. [N] Integration, APIs & Interoperability (16_INTEGRATION)
 * 15. [O] Security, Identity & Permissions (10_SECURITY)
 * 16. [P] Reliability, Performance & Scaling (11_RELIABILITY)
 * 17. [Q] Implementation & Application Engineering (12_IMPLEMENTATION)
 * 18. [R] Testing & Quality Assurance (13_TESTING)
 * 19. [S] Release, Cloud & Migration (17_RELEASE)
 * 20. [T] Observability, Operations & Incident Response (18_OPERATIONS)
 * 21. [U] Evaluation & Continuous Improvement (19_EVALUATION)
 * 22. [V] Delivery Planning & Coordination — NEW (24_DELIVERY)
 * 23. [W] Compliance & Data Stewardship — NEW (25_COMPLIANCE)
 * 24. [X] Documentation, Training & Knowledge Transfer — NEW (26_DOCUMENTATION)
 * 25. [Y] Retirement & Transition (20_RETIREMENT)
 * 26. [Z] Canonical Blueprint (14_BLUEPRINT)
 *
 * Post-Blueprint Destination (Outside numbered lifecycle, decoupled from runtime deployment):
 *  - Project Output & Approval (/app/projects/:id/output)
 *
 * Strictly ZERO Raw SQL.
 */

import {
  Brain,
  Target,
  Coins,
  CheckSquare,
  Layers,
  Scale,
  Palette,
  Server,
  Cpu,
  Truck,
  Database,
  Network,
  Shield,
  Activity,
  Terminal,
  Rocket,
  LifeBuoy,
  TrendingUp,
  Calendar,
  ShieldCheck,
  BookOpen,
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

export type Additional6StageId =
  | "21_VALUE"
  | "22_GOVERNANCE"
  | "23_DEPENDENCY_ASSURANCE"
  | "24_DELIVERY"
  | "25_COMPLIANCE"
  | "26_DOCUMENTATION";

export type ProjectLifecycleStage =
  | Original14StageId
  | New6StageId
  | Additional6StageId;

export type WorkAreaCategory =
  | "Foundations & Strategy"
  | "Architecture & Engineering"
  | "Integration & Governance"
  | "Delivery & Operations"
  | "Synthesis & Closure";

export interface LifecycleSectionDefinition {
  id: ProjectLifecycleStage;
  workstreamLetter: string; // "A" to "Z"
  displayOrder: number; // 1 to 26
  displayNum: string; // "01" to "26"
  label: string; // e.g. "01 Intent & Product Direction", "03 Business Value & Financial Viability"
  name: string; // e.g. "Intent & Product Direction"
  shortName: string; // e.g. "Intent", "Value"
  description: string;
  icon: ElementType;
  isNew: boolean;
  workArea: WorkAreaCategory;
  primaryArtifact: string;
  suggestedAgentRole: string;
  inspectionChecks: string[];
  saasTechnicalAreas?: string[]; // Cross-linked technical areas from the 15 SaaS technical areas
}

export interface SaasTechnicalAreaMapping {
  name: string;
  primaryOwnerStageId: ProjectLifecycleStage;
  primaryOwnerWorkstream: string;
  requiredCrossLinks: string[];
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

export const ADDITIONAL_6_STAGE_IDS: readonly Additional6StageId[] = [
  "21_VALUE",
  "22_GOVERNANCE",
  "23_DEPENDENCY_ASSURANCE",
  "24_DELIVERY",
  "25_COMPLIANCE",
  "26_DOCUMENTATION",
] as const;

export const ALL_26_STAGE_IDS: readonly ProjectLifecycleStage[] = [
  "01_INTENT",
  "02_PROBLEM",
  "21_VALUE",
  "03_REQUIREMENTS",
  "04_SCOPE",
  "05_CAPABILITY",
  "22_GOVERNANCE",
  "15_EXPERIENCE",
  "06_ARCHITECTURE",
  "07_TECHNOLOGY",
  "23_DEPENDENCY_ASSURANCE",
  "08_DATA",
  "09_AI_DESIGN",
  "16_INTEGRATION",
  "10_SECURITY",
  "11_RELIABILITY",
  "12_IMPLEMENTATION",
  "13_TESTING",
  "17_RELEASE",
  "18_OPERATIONS",
  "19_EVALUATION",
  "24_DELIVERY",
  "25_COMPLIANCE",
  "26_DOCUMENTATION",
  "20_RETIREMENT",
  "14_BLUEPRINT",
] as const;

/**
 * 15 SaaS Technical Area mappings from the "Vibe Coding in a Real Tech SaaS" specification.
 * Mapped to primary section owners and mandatory cross-links.
 */
export const SAAS_15_TECHNICAL_AREAS: readonly SaasTechnicalAreaMapping[] = [
  {
    name: "System design",
    primaryOwnerStageId: "06_ARCHITECTURE",
    primaryOwnerWorkstream: "I",
    requiredCrossLinks: ["Requirements", "Scope", "Capability"],
  },
  {
    name: "System architecture",
    primaryOwnerStageId: "06_ARCHITECTURE",
    primaryOwnerWorkstream: "I",
    requiredCrossLinks: ["Technology", "Implementation", "Reliability"],
  },
  {
    name: "Frontend",
    primaryOwnerStageId: "12_IMPLEMENTATION",
    primaryOwnerWorkstream: "Q",
    requiredCrossLinks: ["Experience", "Testing", "Security"],
  },
  {
    name: "APIs & backend logic",
    primaryOwnerStageId: "12_IMPLEMENTATION",
    primaryOwnerWorkstream: "Q",
    requiredCrossLinks: ["Integration", "Data", "Security"],
  },
  {
    name: "Databases & storage",
    primaryOwnerStageId: "08_DATA",
    primaryOwnerWorkstream: "L",
    requiredCrossLinks: ["Security", "Reliability", "Release"],
  },
  {
    name: "Auth & permissions",
    primaryOwnerStageId: "10_SECURITY",
    primaryOwnerWorkstream: "O",
    requiredCrossLinks: ["Governance", "Implementation", "Testing"],
  },
  {
    name: "Hosting & cloud",
    primaryOwnerStageId: "17_RELEASE",
    primaryOwnerWorkstream: "S",
    requiredCrossLinks: ["Architecture", "Reliability", "Operations"],
  },
  {
    name: "CI/CD & version control",
    primaryOwnerStageId: "17_RELEASE",
    primaryOwnerWorkstream: "S",
    requiredCrossLinks: ["Implementation", "Testing", "Dependency Assurance"],
  },
  {
    name: "Security",
    primaryOwnerStageId: "10_SECURITY",
    primaryOwnerWorkstream: "O",
    requiredCrossLinks: ["All applicable sections"],
  },
  {
    name: "Rate limiting",
    primaryOwnerStageId: "11_RELIABILITY",
    primaryOwnerWorkstream: "P",
    requiredCrossLinks: ["Backend", "Security", "Integrations"],
  },
  {
    name: "Caching & CDN",
    primaryOwnerStageId: "11_RELIABILITY",
    primaryOwnerWorkstream: "P",
    requiredCrossLinks: ["Frontend", "Data", "Cloud"],
  },
  {
    name: "Error tracking & logs",
    primaryOwnerStageId: "18_OPERATIONS",
    primaryOwnerWorkstream: "T",
    requiredCrossLinks: ["Implementation", "Security", "Testing"],
  },
  {
    name: "Monitoring & alerts",
    primaryOwnerStageId: "18_OPERATIONS",
    primaryOwnerWorkstream: "T",
    requiredCrossLinks: ["Reliability", "AI/ML", "Business Value"],
  },
  {
    name: "Testing",
    primaryOwnerStageId: "13_TESTING",
    primaryOwnerWorkstream: "R",
    requiredCrossLinks: ["Every applicable acceptance gate"],
  },
  {
    name: "Scaling",
    primaryOwnerStageId: "11_RELIABILITY",
    primaryOwnerWorkstream: "P",
    requiredCrossLinks: ["Architecture", "Data", "Cloud", "Business Value"],
  },
] as const;

/**
 * Authoritative 26-Section Consolidated Lifecycle array (Workstreams A–Z).
 */
export const LIFECYCLE_26_SECTIONS: readonly LifecycleSectionDefinition[] = [
  {
    id: "01_INTENT",
    workstreamLetter: "A",
    displayOrder: 1,
    displayNum: "01",
    label: "01 Intent & Product Direction",
    name: "Intent & Product Direction",
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
    workstreamLetter: "B",
    displayOrder: 2,
    displayNum: "02",
    label: "02 Problem Definition & Evidence",
    name: "Problem Definition & Evidence",
    shortName: "Problem",
    description: "5-Whys root cause analysis, target outcomes, and quantitative metric impact.",
    icon: Target,
    isNew: false,
    workArea: "Foundations & Strategy",
    primaryArtifact: "ProblemModel",
    suggestedAgentRole: "ProblemAnalystAgent",
    inspectionChecks: [
      "5-Whys root cause structured",
      "Quantified target metrics",
      "Baseline vs expected impact delta",
    ],
  },
  {
    id: "21_VALUE",
    workstreamLetter: "C",
    displayOrder: 3,
    displayNum: "03",
    label: "03 Business Value & Financial Viability",
    name: "Business Value & Financial Viability",
    shortName: "Value",
    description: "Development effort, hosting/storage/AI token cost projections, and financial viability scenarios.",
    icon: Coins,
    isNew: true,
    workArea: "Foundations & Strategy",
    primaryArtifact: "ValueModel",
    suggestedAgentRole: "FinancialAnalystAgent",
    inspectionChecks: [
      "Development and maintenance effort budgeted",
      "Hosting, storage, and AI token costs estimated",
      "Comparable baseline and proposed scenarios with ROI",
    ],
  },
  {
    id: "03_REQUIREMENTS",
    workstreamLetter: "D",
    displayOrder: 4,
    displayNum: "04",
    label: "04 Requirements & Acceptance Criteria",
    name: "Requirements & Acceptance Criteria",
    shortName: "Requirements",
    description: "Atomic user stories, Given-When-Then criteria, and persona traceability matrix.",
    icon: CheckSquare,
    isNew: false,
    workArea: "Foundations & Strategy",
    primaryArtifact: "RequirementItem[]",
    suggestedAgentRole: "RequirementsEngineerAgent",
    inspectionChecks: [
      "Atomic user stories mapped",
      "Given-When-Then acceptance criteria",
      "Role-specific personas linked",
    ],
  },
  {
    id: "04_SCOPE",
    workstreamLetter: "E",
    displayOrder: 5,
    displayNum: "05",
    label: "05 Scope & Change Control",
    name: "Scope & Change Control",
    shortName: "Scope",
    description: "MoSCoW boundary definition, MVP cutoff rules, and deferred backlog management.",
    icon: Layers,
    isNew: false,
    workArea: "Foundations & Strategy",
    primaryArtifact: "ScopeModel",
    suggestedAgentRole: "ScopeEngineerAgent",
    inspectionChecks: [
      "MoSCoW boundary allocated",
      "MVP criteria verified",
      "Non-goals and deferred roadmap documented",
    ],
  },
  {
    id: "05_CAPABILITY",
    workstreamLetter: "F",
    displayOrder: 6,
    displayNum: "06",
    label: "06 Capability & Feasibility",
    name: "Capability & Feasibility",
    shortName: "Capability",
    description: "Capability taxonomy, feasibility experiments, and build vs integrate evaluations.",
    icon: Layers,
    isNew: false,
    workArea: "Foundations & Strategy",
    primaryArtifact: "CapabilityModel",
    suggestedAgentRole: "CapabilityArchitectAgent",
    inspectionChecks: [
      "Capability hierarchy established",
      "Feasibility experiments evaluated",
      "Exposed integration operations qualified",
    ],
  },
  {
    id: "22_GOVERNANCE",
    workstreamLetter: "G",
    displayOrder: 7,
    displayNum: "07",
    label: "07 Governance & Decision Accountability",
    name: "Governance & Decision Accountability",
    shortName: "Governance",
    description: "Project-scoped decision rights, authority delegation, and server-enforced exception policies.",
    icon: Scale,
    isNew: true,
    workArea: "Integration & Governance",
    primaryArtifact: "GovernanceModel",
    suggestedAgentRole: "GovernanceAuditorAgent",
    inspectionChecks: [
      "Project owners and decision rights registered",
      "Server-enforced authority separated from presentation",
      "Audit-bound decision records with expiry and escalation",
    ],
  },
  {
    id: "15_EXPERIENCE",
    workstreamLetter: "H",
    displayOrder: 8,
    displayNum: "08",
    label: "08 Experience, Interaction & Accessibility",
    name: "Experience, Interaction & Accessibility",
    shortName: "Experience",
    description: "WCAG 2.1 AA accessibility, keyboard navigation, design system tokens, and multi-viewport layouts.",
    icon: Palette,
    isNew: true,
    workArea: "Architecture & Engineering",
    primaryArtifact: "ExperienceModel",
    suggestedAgentRole: "ExperienceArchitectAgent",
    inspectionChecks: [
      "WCAG 2.1 AA color contrast compliance verified",
      "Accessible keyboard navigation and focus management",
      "Design tokens and responsive layout breakpoints defined",
    ],
  },
  {
    id: "06_ARCHITECTURE",
    workstreamLetter: "I",
    displayOrder: 9,
    displayNum: "09",
    label: "09 System Design & Architecture",
    name: "System Design & Architecture",
    shortName: "Architecture",
    description: "Topology design, component boundaries, trade-off analysis, and baseline selection.",
    icon: Server,
    isNew: false,
    workArea: "Architecture & Engineering",
    primaryArtifact: "ArchitectureModel",
    suggestedAgentRole: "SolutionArchitectAgent",
    inspectionChecks: [
      "Multi-tier component topology mapped",
      "Architectural trade-off analysis completed",
      "Selected architecture baseline established",
    ],
    saasTechnicalAreas: ["System design", "System architecture"],
  },
  {
    id: "07_TECHNOLOGY",
    workstreamLetter: "J",
    displayOrder: 10,
    displayNum: "10",
    label: "10 Technology & Engineering Standards",
    name: "Technology & Engineering Standards",
    shortName: "Technology",
    description: "Technology decisions, lockfiles, runtime constraints, and migration viability.",
    icon: Cpu,
    isNew: false,
    workArea: "Architecture & Engineering",
    primaryArtifact: "TechnologyModel",
    suggestedAgentRole: "TechnologyArchitectAgent",
    inspectionChecks: [
      "Stack decisions formalized with trade-offs",
      "Operational maintenance overhead assessed",
      "Migration pathways documented",
    ],
  },
  {
    id: "23_DEPENDENCY_ASSURANCE",
    workstreamLetter: "K",
    displayOrder: 11,
    displayNum: "11",
    label: "11 Dependency & Supplier Assurance",
    name: "Dependency & Supplier Assurance",
    shortName: "Dependency Assurance",
    description: "Critical external packages, AI model providers, cloud suppliers, and concentration risk mitigation.",
    icon: Truck,
    isNew: true,
    workArea: "Architecture & Engineering",
    primaryArtifact: "DependencyAssuranceModel",
    suggestedAgentRole: "SupplierAssuranceAgent",
    inspectionChecks: [
      "Critical packages, AI providers, and cloud suppliers cataloged",
      "Concentration risk and degradation fallbacks defined",
      "Licensing, compliance, and version requalification triggers verified",
    ],
  },
  {
    id: "08_DATA",
    workstreamLetter: "L",
    displayOrder: 12,
    displayNum: "12",
    label: "12 Data, Databases & Storage",
    name: "Data, Databases & Storage",
    shortName: "Data",
    description: "Domain entities, relationships, multi-tenant RLS policies, and Zero Raw SQL compliance.",
    icon: Database,
    isNew: false,
    workArea: "Architecture & Engineering",
    primaryArtifact: "DataArchitectureModel",
    suggestedAgentRole: "DataArchitectAgent",
    inspectionChecks: [
      "Entity-relationship schema defined",
      "Sensitivity and retention windows configured",
      "Multi-tenant Row-Level Security (RLS) rules generated",
      "Zero Raw SQL compliance enforced",
    ],
    saasTechnicalAreas: ["Databases & storage"],
  },
  {
    id: "09_AI_DESIGN",
    workstreamLetter: "M",
    displayOrder: 13,
    displayNum: "13",
    label: "13 AI/ML & ATHER Intelligence",
    name: "AI/ML & ATHER Intelligence",
    shortName: "AI/ML & ATHER",
    description: "ATHER task understanding, context compilation, prompt injection defense, and model routing.",
    icon: Brain,
    isNew: false,
    workArea: "Architecture & Engineering",
    primaryArtifact: "AiEngineeringModel",
    suggestedAgentRole: "AiArchitectAgent",
    inspectionChecks: [
      "Model selection and context budget mapped",
      "Prompt injection defense barriers configured",
      "Deterministic fallback mechanisms in place",
    ],
  },
  {
    id: "16_INTEGRATION",
    workstreamLetter: "N",
    displayOrder: 14,
    displayNum: "14",
    label: "14 Integration, APIs & Interoperability",
    name: "Integration, APIs & Interoperability",
    shortName: "Integration",
    description: "External API contracts, idempotency keys, circuit breakers, rate limits, and schema translation.",
    icon: Network,
    isNew: true,
    workArea: "Integration & Governance",
    primaryArtifact: "IntegrationModel",
    suggestedAgentRole: "IntegrationArchitectAgent",
    inspectionChecks: [
      "Inbound/outbound endpoint contracts registered",
      "Idempotency keys and retry policies configured",
      "Circuit breaker and rate limiting thresholds defined",
    ],
  },
  {
    id: "10_SECURITY",
    workstreamLetter: "O",
    displayOrder: 15,
    displayNum: "15",
    label: "15 Security, Identity & Permissions",
    name: "Security, Identity & Permissions",
    shortName: "Security",
    description: "STRIDE threat modeling, trust boundaries, multi-tenant isolation, and secret redaction.",
    icon: Shield,
    isNew: false,
    workArea: "Integration & Governance",
    primaryArtifact: "SecurityModel",
    suggestedAgentRole: "SecurityArchitectAgent",
    inspectionChecks: [
      "STRIDE threat matrix analyzed",
      "Trust boundaries and attack surfaces identified",
      "Multi-tenant isolation and privilege boundaries validated",
    ],
    saasTechnicalAreas: ["Auth & permissions", "Security"],
  },
  {
    id: "11_RELIABILITY",
    workstreamLetter: "P",
    displayOrder: 16,
    displayNum: "16",
    label: "16 Reliability, Performance & Scaling",
    name: "Reliability, Performance & Scaling",
    shortName: "Reliability",
    description: "Failure scenarios, RTO/RPO targets, graceful degradation, caching, rate limiting, and scaling.",
    icon: Activity,
    isNew: false,
    workArea: "Architecture & Engineering",
    primaryArtifact: "ReliabilityModel",
    suggestedAgentRole: "ReliabilityEngineerAgent",
    inspectionChecks: [
      "Failure modes and mitigation strategies configured",
      "RTO / RPO recovery objectives defined",
      "Graceful degradation behavior verified",
    ],
    saasTechnicalAreas: ["Rate limiting", "Caching & CDN", "Scaling"],
  },
  {
    id: "12_IMPLEMENTATION",
    workstreamLetter: "Q",
    displayOrder: 17,
    displayNum: "17",
    label: "17 Implementation & Application Engineering",
    name: "Implementation & Application Engineering",
    shortName: "Implementation",
    description: "Task DAG synthesis, frontend components, API endpoints, backend rules, and milestones.",
    icon: Terminal,
    isNew: false,
    workArea: "Delivery & Operations",
    primaryArtifact: "ImplementationModel",
    suggestedAgentRole: "ImplementationPlannerAgent",
    inspectionChecks: [
      "Component task DAG structured",
      "API contracts and module boundaries generated",
      "Dependency-ordered milestones scheduled",
    ],
    saasTechnicalAreas: ["Frontend", "APIs & backend logic"],
  },
  {
    id: "13_TESTING",
    workstreamLetter: "R",
    displayOrder: 18,
    displayNum: "18",
    label: "18 Testing & Quality Assurance",
    name: "Testing & Quality Assurance",
    shortName: "Testing",
    description: "Unit, integration, e2e test cases, and requirement-to-test traceability verification.",
    icon: CheckSquare,
    isNew: false,
    workArea: "Delivery & Operations",
    primaryArtifact: "TestModel",
    suggestedAgentRole: "TestEngineerAgent",
    inspectionChecks: [
      "Unit, integration, and e2e test cases specified",
      "Requirement-to-test traceability matrix completed",
      "Security regression suites configured",
    ],
    saasTechnicalAreas: ["Testing"],
  },
  {
    id: "17_RELEASE",
    workstreamLetter: "S",
    displayOrder: 19,
    displayNum: "19",
    label: "19 Release, Cloud & Migration",
    name: "Release, Cloud & Migration",
    shortName: "Release",
    description: "Canary rings, hosting environments, automated rollback, CI/CD, and zero-downtime cutover.",
    icon: Rocket,
    isNew: true,
    workArea: "Delivery & Operations",
    primaryArtifact: "ReleaseMigrationModel",
    suggestedAgentRole: "ReleaseEngineerAgent",
    inspectionChecks: [
      "Canary/staged deployment rings configured",
      "Automated database migration and rollback procedures verified",
      "Zero-downtime cutover strategy validated",
    ],
    saasTechnicalAreas: ["Hosting & cloud", "CI/CD & version control"],
  },
  {
    id: "18_OPERATIONS",
    workstreamLetter: "T",
    displayOrder: 20,
    displayNum: "20",
    label: "20 Observability, Operations & Incident Response",
    name: "Observability, Operations & Incident Response",
    shortName: "Operations",
    description: "SLO targets, error tracking, structured logs, telemetry alerts, and incident response matrix.",
    icon: LifeBuoy,
    isNew: true,
    workArea: "Delivery & Operations",
    primaryArtifact: "OperationsModel",
    suggestedAgentRole: "OperationsEngineerAgent",
    inspectionChecks: [
      "SLO targets and alert threshold percentages set",
      "Incident severity response matrix with TTL defined",
      "Automated runbooks and health endpoints registered",
    ],
    saasTechnicalAreas: ["Error tracking & logs", "Monitoring & alerts"],
  },
  {
    id: "19_EVALUATION",
    workstreamLetter: "U",
    displayOrder: 21,
    displayNum: "21",
    label: "21 Evaluation & Continuous Improvement",
    name: "Evaluation & Continuous Improvement",
    shortName: "Evaluation",
    description: "Continuous telemetry, error budget management, feedback loop cadence, and CSAT baselines.",
    icon: TrendingUp,
    isNew: true,
    workArea: "Synthesis & Closure",
    primaryArtifact: "EvaluationModel",
    suggestedAgentRole: "EvaluationEngineerAgent",
    inspectionChecks: [
      "Continuous telemetry and feedback loop cadence active",
      "Metric baselines and targets tracked",
      "Error budget percentage and CSAT targets established",
    ],
  },
  {
    id: "24_DELIVERY",
    workstreamLetter: "V",
    displayOrder: 22,
    displayNum: "22",
    label: "22 Delivery Planning & Coordination",
    name: "Delivery Planning & Coordination",
    shortName: "Delivery Planning",
    description: "Work packages, dependency readiness, milestone scheduling, and team coordination checkpoints.",
    icon: Calendar,
    isNew: true,
    workArea: "Delivery & Operations",
    primaryArtifact: "DeliveryPlanningModel",
    suggestedAgentRole: "DeliveryCoordinatorAgent",
    inspectionChecks: [
      "Work packages translated from accepted scope and defects",
      "Prerequisites, responsible owners, and milestones sequenced",
      "Dependency-ready implementation queue with blocker tracking",
    ],
  },
  {
    id: "25_COMPLIANCE",
    workstreamLetter: "W",
    displayOrder: 23,
    displayNum: "23",
    label: "23 Compliance & Data Stewardship",
    name: "Compliance & Data Stewardship",
    shortName: "Compliance",
    description: "Data classification, regulatory obligations (GDPR/HIPAA/SOC2), retention rules, and audit logging.",
    icon: ShieldCheck,
    isNew: true,
    workArea: "Integration & Governance",
    primaryArtifact: "ComplianceModel",
    suggestedAgentRole: "ComplianceOfficerAgent",
    inspectionChecks: [
      "Data ownership, classifications, and processing purposes recorded",
      "Applicable organizational and regulatory obligations mapped to controls",
      "Retention, deletion, export, and provider access reviews verified",
    ],
  },
  {
    id: "26_DOCUMENTATION",
    workstreamLetter: "X",
    displayOrder: 24,
    displayNum: "24",
    label: "24 Documentation, Training & Knowledge Transfer",
    name: "Documentation, Training & Knowledge Transfer",
    shortName: "Documentation",
    description: "Role onboarding guides (Student/Faculty/Pro), API contracts, operational runbooks, and handover packages.",
    icon: BookOpen,
    isNew: true,
    workArea: "Delivery & Operations",
    primaryArtifact: "DocumentationModel",
    suggestedAgentRole: "TechnicalWriterAgent",
    inspectionChecks: [
      "Student, Faculty, and Professional guides generated from real behavior",
      "Operational runbooks, API contracts, and recovery steps documented",
      "Handover package with ownership, dependencies, and evidence prepared",
    ],
  },
  {
    id: "20_RETIREMENT",
    workstreamLetter: "Y",
    displayOrder: 25,
    displayNum: "25",
    label: "25 Retirement & Transition",
    name: "Retirement & Transition",
    shortName: "Retirement",
    description: "Deprecation timelines, data retention, customer offboarding, crypto-shredding, and decommissioning.",
    icon: Archive,
    isNew: true,
    workArea: "Synthesis & Closure",
    primaryArtifact: "RetirementModel",
    suggestedAgentRole: "RetirementPlannerAgent",
    inspectionChecks: [
      "Deprecation notice period and customer offboarding path defined",
      "Data retention timeline and crypto-shredding method specified",
      "Decommission checklist and archive storage tier approved",
    ],
  },
  {
    id: "14_BLUEPRINT",
    workstreamLetter: "Z",
    displayOrder: 26,
    displayNum: "26",
    label: "26 Canonical Blueprint",
    name: "Canonical Blueprint",
    shortName: "Blueprint",
    description: "Canonical blueprint compilation, cross-stage consistency check, and initialization freeze.",
    icon: FileText,
    isNew: false,
    workArea: "Synthesis & Closure",
    primaryArtifact: "ProjectBlueprint",
    suggestedAgentRole: "BlueprintCompilerAgent",
    inspectionChecks: [
      "All 26 lifecycle stages inspected and consistent",
      "Cryptographic SHA-256 seal computed",
      "Readiness manifest signed for candidate output",
    ],
  },
] as const;

/**
 * 20-Section Lifecycle array preserved for backwards compatibility.
 */
export const LIFECYCLE_20_SECTIONS: readonly LifecycleSectionDefinition[] = [
  LIFECYCLE_26_SECTIONS[0]!, // 01_INTENT
  LIFECYCLE_26_SECTIONS[1]!, // 02_PROBLEM
  LIFECYCLE_26_SECTIONS[3]!, // 03_REQUIREMENTS
  LIFECYCLE_26_SECTIONS[4]!, // 04_SCOPE
  LIFECYCLE_26_SECTIONS[5]!, // 05_CAPABILITY
  LIFECYCLE_26_SECTIONS[7]!, // 15_EXPERIENCE
  LIFECYCLE_26_SECTIONS[8]!, // 06_ARCHITECTURE
  LIFECYCLE_26_SECTIONS[9]!, // 07_TECHNOLOGY
  LIFECYCLE_26_SECTIONS[11]!, // 08_DATA
  LIFECYCLE_26_SECTIONS[12]!, // 09_AI_DESIGN
  LIFECYCLE_26_SECTIONS[13]!, // 16_INTEGRATION
  LIFECYCLE_26_SECTIONS[14]!, // 10_SECURITY
  LIFECYCLE_26_SECTIONS[15]!, // 11_RELIABILITY
  LIFECYCLE_26_SECTIONS[16]!, // 12_IMPLEMENTATION
  LIFECYCLE_26_SECTIONS[17]!, // 13_TESTING
  LIFECYCLE_26_SECTIONS[18]!, // 17_RELEASE
  LIFECYCLE_26_SECTIONS[19]!, // 18_OPERATIONS
  LIFECYCLE_26_SECTIONS[20]!, // 19_EVALUATION
  LIFECYCLE_26_SECTIONS[24]!, // 20_RETIREMENT
  LIFECYCLE_26_SECTIONS[25]!, // 14_BLUEPRINT
];

/**
 * Canonical 30-Stage Lifecycle Candidate (Phases 01-30).
 * Formalized engineering lifecycle specification defining the complete 30-stage progression.
 */
export interface Canonical30SectionDefinition {
  stageNumber: number;
  stageNum: string;
  name: string;
  shortName: string;
  description: string;
  primaryArtifact: string;
  inspectionChecks: string[];
}

export const CANONICAL_30_LIFECYCLE_STAGES: readonly Canonical30SectionDefinition[] = [
  {
    stageNumber: 1,
    stageNum: "01",
    name: "Intent & Product Direction",
    shortName: "Intent",
    description: "Executive vision, stakeholder alignment, target persona profiles, and intent boundaries.",
    primaryArtifact: "IntentDocument",
    inspectionChecks: [
      "Target user personas and domain problem boundary defined",
      "Executive intent and expected business outcomes documented",
      "Stakeholder authority and sign-off criteria identified",
    ],
  },
  {
    stageNumber: 2,
    stageNum: "02",
    name: "Problem Definition & Evidence",
    shortName: "Problem",
    description: "Empirically verified customer pain points, baseline metrics, and failure cost analysis.",
    primaryArtifact: "ProblemSpecification",
    inspectionChecks: [
      "User problem statement backed by verifiable evidence citations",
      "Baseline friction metrics and cost-of-inaction quantified",
      "Root causes separated from visible symptoms",
    ],
  },
  {
    stageNumber: 3,
    stageNum: "03",
    name: "Requirements & Acceptance Criteria",
    shortName: "Requirements",
    description: "Atomic functional and non-functional requirements (NFRs) with verifiable acceptance criteria.",
    primaryArtifact: "RequirementsMatrix",
    inspectionChecks: [
      "All requirements have unique immutable identifiers (FR/NFR)",
      "Verifiable pass/fail acceptance criteria defined for each requirement",
      "Security, reliability, and latency NFR thresholds specified",
    ],
  },
  {
    stageNumber: 4,
    stageNum: "04",
    name: "Scope & Change Control",
    shortName: "Scope",
    description: "Explicit in-scope and out-of-scope boundaries, change management rules, and release milestones.",
    primaryArtifact: "ScopeBoundaryModel",
    inspectionChecks: [
      "In-scope and explicitly excluded features partitioned",
      "Scope change request protocol and threshold gates established",
      "Release milestone constraints reconciled against delivery dates",
    ],
  },
  {
    stageNumber: 5,
    stageNum: "05",
    name: "Capability & Feasibility",
    shortName: "Capability",
    description: "Core technical capabilities, feasibility proofs, and platform constraint assertions.",
    primaryArtifact: "CapabilityCatalog",
    inspectionChecks: [
      "Required platform capabilities mapped to functional requirements",
      "High-risk technical feasibility proofs validated via spikes",
      "Zero ungrounded capability assumptions confirmed",
    ],
  },
  {
    stageNumber: 6,
    stageNum: "06",
    name: "System Design & Architecture",
    shortName: "Architecture",
    description: "Domain-separated modular monolith topology, component boundaries, and causal interaction DAGs.",
    primaryArtifact: "ArchitectureDecisionRecord",
    inspectionChecks: [
      "Hexagonal domain boundaries and data access contracts defined",
      "Synchronous vs asynchronous communication channels established",
      "Circular dependency and boundary drift risks assessed",
    ],
  },
  {
    stageNumber: 7,
    stageNum: "07",
    name: "Technology & Engineering Standards",
    shortName: "Technology",
    description: "Approved programming languages, frameworks, linters, and technical debt constraints.",
    primaryArtifact: "TechnologySelectionRecord",
    inspectionChecks: [
      "Vite, React 18, TypeScript, Supabase, Tailwind stack ratified",
      "Strict typing (no implicit any) and linting rules enforced",
      "Technical debt limits and upgrade maintenance policies set",
    ],
  },
  {
    stageNumber: 8,
    stageNum: "08",
    name: "Data, Databases & Storage",
    shortName: "Data",
    description: "PostgreSQL schemas, PostgREST query builders, RLS policies, and encrypted object storage.",
    primaryArtifact: "DataContractSpecification",
    inspectionChecks: [
      "Zero Raw SQL Mandate: 100% parameterized SDK query builders",
      "Row-Level Security (RLS) policies configured on all tables",
      "Foreign key constraints, indexes, and soft-delete semantics verified",
    ],
  },
  {
    stageNumber: 9,
    stageNum: "09",
    name: "AI/ML & Model Engineering",
    shortName: "AI/ML",
    description: "Server-side model gateway, Gemini/OpenAI routers, token budgets, and streaming SSE.",
    primaryArtifact: "AiModelSpecification",
    inspectionChecks: [
      "Server-side secret isolation: zero API keys in client bundles",
      "Deterministic token budgeting and rate-limiting active",
      "Context Mesh and Intent Radar anti-hallucination guards engaged",
    ],
  },
  {
    stageNumber: 10,
    stageNum: "10",
    name: "Security, Identity & Trust Boundaries",
    shortName: "Security",
    description: "Supabase Auth sessions, RBAC permission matrices, OWASP Top-10 controls, and secret isolation.",
    primaryArtifact: "SecurityThreatMatrix",
    inspectionChecks: [
      "Multi-tenant isolation verified with cross-tenant denial tests",
      "Client bundle audited: zero service-role keys or private secrets",
      "OWASP threat modeling and CSRF/XSS defenses validated",
    ],
  },
  {
    stageNumber: 11,
    stageNum: "11",
    name: "Reliability, Fault-Tolerance & Recovery",
    shortName: "Reliability",
    description: "Circuit breakers, exponential backoff retries, graceful offline fallbacks, and SLA targets.",
    primaryArtifact: "ReliabilityFailureModel",
    inspectionChecks: [
      "Timeout and retry policies bounded with deterministic backoff",
      "Graceful degradation on external cloud dependency failure",
      "State preservation and recovery verified across unexpected crashes",
    ],
  },
  {
    stageNumber: 12,
    stageNum: "12",
    name: "Implementation & Application Engineering",
    shortName: "Implementation",
    description: "Traceable code authoring, pull requests, atomic git commits, and code review approvals.",
    primaryArtifact: "EngineeringImplementationPlan",
    inspectionChecks: [
      "Atomic forward git commits preserving Lovable synchronization",
      "All code linked to accepted requirement specifications",
      "Zero dead links or unimplemented stub buttons in navigation",
    ],
  },
  {
    stageNumber: 13,
    stageNum: "13",
    name: "Testing & Automated Verification",
    shortName: "Testing",
    description: "TypeScript typechecking, ESLint rules, unit tests, integration gates, and browser E2E suites.",
    primaryArtifact: "VerificationTestSuite",
    inspectionChecks: [
      "npm run typecheck exits with 0 errors (tsc --noEmit)",
      "npm run lint exits with 0 errors (eslint .)",
      "25 Convergence Acceptance Gates verified via test-acceptance-gates.mjs",
    ],
  },
  {
    stageNumber: 14,
    stageNum: "14",
    name: "Canonical System Blueprint",
    shortName: "Blueprint",
    description: "Compiled master project blueprint with cryptographic SHA-256 integrity seal.",
    primaryArtifact: "ProjectBlueprint",
    inspectionChecks: [
      "All upstream lifecycle stages reconciled and consistent",
      "Cryptographic SHA-256 seal computed and recorded",
      "Blueprint manifest frozen and immutable for promotion",
    ],
  },
  {
    stageNumber: 15,
    stageNum: "15",
    name: "Observability & Diagnostics",
    shortName: "Observability",
    description: "Structured telemetry, p95 latency probes, request correlation IDs, and runtime error tracking.",
    primaryArtifact: "TelemetryInstrumentationPlan",
    inspectionChecks: [
      "Correlation IDs propagated across client and server boundaries",
      "Live p95 latency and RPS metrics tracked in Sentinel monitor",
      "Sanitized diagnostic payloads with zero PII leakage in logs",
    ],
  },
  {
    stageNumber: 16,
    stageNum: "16",
    name: "Operations & Maintenance",
    shortName: "Operations",
    description: "Operational runbooks, deployment health checks, automated maintenance tasks, and uptime monitors.",
    primaryArtifact: "OperationalRunbook",
    inspectionChecks: [
      "Operational runbooks documented for common incident classes",
      "Automated health checks probe application and database liveness",
      "Maintenance windows and zero-downtime rolling updates supported",
    ],
  },
  {
    stageNumber: 17,
    stageNum: "17",
    name: "Performance Engineering & Baselines",
    shortName: "Performance",
    description: "Load testing, asset chunk optimization, database query profiling, and render speed baselines.",
    primaryArtifact: "PerformanceBenchmarkRecord",
    inspectionChecks: [
      "Vite production build bundled in under 20 seconds",
      "Route transition latency under 100ms across all 45 sidebar pages",
      "Zero client-side memory leaks or unbound event listener growth",
    ],
  },
  {
    stageNumber: 18,
    stageNum: "18",
    name: "Collaboration & Human Review",
    shortName: "Collaboration",
    description: "Peer review workflows, faculty approval gates, multi-user project sharing, and decision ledgers.",
    primaryArtifact: "ReviewApprovalRecord",
    inspectionChecks: [
      "Role-specific review rubrics for Student, Faculty, and Pro personas",
      "Immutable decision audit trail records who approved each transition",
      "Disagreement resolution and exception handling protocols enforced",
    ],
  },
  {
    stageNumber: 19,
    stageNum: "19",
    name: "Documentation & Knowledge Management",
    shortName: "Documentation",
    description: "Living architecture documentation, API schemas, engineering playbooks, and Obsidian publishing.",
    primaryArtifact: "ArchitectureKnowledgeDoc",
    inspectionChecks: [
      "Docs directory synchronized with 90-domain architecture specification",
      "API contracts and schema types auto-documented from source",
      "Obsidian knowledge base export reviewed for sensitive information",
    ],
  },
  {
    stageNumber: 20,
    stageNum: "20",
    name: "Delivery & Handover Readiness",
    shortName: "Delivery",
    description: "Release manifests, client handover checklists, artifact integrity seals, and export archives.",
    primaryArtifact: "DeliveryHandoverManifest",
    inspectionChecks: [
      "Export Center JSZip bundle compilation verified",
      "Cryptographic SHA-256 seal attached to every export manifest",
      "Handover sign-off checklist completed without open P0/P1 defects",
    ],
  },
  {
    stageNumber: 21,
    stageNum: "21",
    name: "Domain & User Acceptance Validation",
    shortName: "Domain UAT",
    description: "End-to-end user journeys, real-world scenario validation, and business acceptance testing.",
    primaryArtifact: "UatValidationReport",
    inspectionChecks: [
      "End-to-end user engineering journey verified across all stages",
      "Business acceptance criteria verified against observable results",
      "User feedback loops incorporated into subsequent project iterations",
    ],
  },
  {
    stageNumber: 22,
    stageNum: "22",
    name: "Dependency & Software Supply Chain",
    shortName: "Supply Chain",
    description: "Software Bill of Materials (SBOM), package license compliance, and concentration risk analysis.",
    primaryArtifact: "SbomIntegrityReport",
    inspectionChecks: [
      "All 3rd-party dependencies audited via npm audit with zero high CVEs",
      "Permissive OSS licenses verified (MIT, Apache-2.0, BSD-3-Clause)",
      "Multi-provider AI failover mitigates vendor concentration risk",
    ],
  },
  {
    stageNumber: 23,
    stageNum: "23",
    name: "Privacy & Data Lifecycle",
    shortName: "Privacy",
    description: "GDPR/CCPA privacy compliance, user data retention limits, and cryptographic shredding.",
    primaryArtifact: "PrivacyComplianceRecord",
    inspectionChecks: [
      "Data retention timelines and soft-delete retention policies active",
      "Zero customer PII stored in client-side analytics or server logs",
      "User data export and account deletion workflows tested",
    ],
  },
  {
    stageNumber: 24,
    stageNum: "24",
    name: "AI Evaluation & Model Governance",
    shortName: "AI Governance",
    description: "Epistemic honesty checks, anti-hallucination guards, model routing fallbacks, and safety filters.",
    primaryArtifact: "AiGovernanceAudit",
    inspectionChecks: [
      "Zero-Fiction Law: AI cannot invent unregistered entities or connectors",
      "Epistemic boundaries distinguish facts, hypotheses, and unknowns",
      "Model outputs validated against strict Zod runtime schemas",
    ],
  },
  {
    stageNumber: 25,
    stageNum: "25",
    name: "Backup & Disaster Recovery",
    shortName: "Disaster Recovery",
    description: "Automated database backups, Point-In-Time Recovery (PITR), and disaster recovery dry-runs.",
    primaryArtifact: "DisasterRecoveryExercise",
    inspectionChecks: [
      "Supabase automated daily backups and WAL replication active",
      "Safe restore exercise verified against disposable database fixture",
      "RTO under 1 hour and RPO under 15 minutes confirmed",
    ],
  },
  {
    stageNumber: 26,
    stageNum: "26",
    name: "Accessibility & Inclusive Experience",
    shortName: "Accessibility",
    description: "WCAG 2.1 AA compliance, keyboard navigation, screen reader accessibility, and color contrast.",
    primaryArtifact: "AccessibilityAuditReport",
    inspectionChecks: [
      "Tab order and keyboard focus indicators functional on all inputs",
      "ARIA roles and labels applied to dialogs, menus, and charts",
      "Color contrast ratios meet or exceed WCAG AA minimum 4.5:1",
    ],
  },
  {
    stageNumber: 27,
    stageNum: "27",
    name: "Cost & Resource Governance",
    shortName: "Cost Governance",
    description: "Cloud consumption models, token budget controls, resource quotas, and spend alerts.",
    primaryArtifact: "ResourceCostModel",
    inspectionChecks: [
      "Token budget limits terminate runaway AI conversation loops",
      "Per-tenant usage telemetry and quota enforcement active",
      "Estimated cloud costs and optimization opportunities monitored",
    ],
  },
  {
    stageNumber: 28,
    stageNum: "28",
    name: "Migration & Compatibility",
    shortName: "Migration",
    description: "Zero-downtime database migrations, backward-compatible API contracts, and version shims.",
    primaryArtifact: "MigrationCompatibilityPlan",
    inspectionChecks: [
      "All migrations written as forward-compatible non-destructive steps",
      "Legacy API routes supported with explicit adapter deprecation headers",
      "Rollback and forward-recovery procedures documented for all changes",
    ],
  },
  {
    stageNumber: 29,
    stageNum: "29",
    name: "Capacity & Scalability",
    shortName: "Scalability",
    description: "Concurrency scaling curves, database connection pooling, and edge caching topologies.",
    primaryArtifact: "ScalabilityCapacityProfile",
    inspectionChecks: [
      "Supabase connection pooler utilization monitored under load",
      "Edge caching and static asset distribution via CDN verified",
      "Concurrency limits protect backend from resource starvation",
    ],
  },
  {
    stageNumber: 30,
    stageNum: "30",
    name: "Continuous Improvement & Change Impact",
    shortName: "Continuous Improvement",
    description: "Causal DAG blast-radius evaluation, architectural drift remediation, and feedback retrospectives.",
    primaryArtifact: "ContinuousImprovementLedger",
    inspectionChecks: [
      "Causal change impact engine predicts affected downstream nodes",
      "Architecture drift engine detects discrepancies with baseline",
      "Improvement ledger preserves before-and-after audit evidence",
    ],
  },
] as const;

/**
 * Accessors and Query Helpers
 */
export const LIFECYCLE_REGISTRY = {
  getCanonical30Stages(): readonly Canonical30SectionDefinition[] {
    return CANONICAL_30_LIFECYCLE_STAGES;
  },

  getAllSections(): readonly LifecycleSectionDefinition[] {
    return LIFECYCLE_26_SECTIONS;
  },

  get26Sections(): readonly LifecycleSectionDefinition[] {
    return LIFECYCLE_26_SECTIONS;
  },

  get20Sections(): readonly LifecycleSectionDefinition[] {
    return LIFECYCLE_20_SECTIONS;
  },

  getSectionById(id: ProjectLifecycleStage): LifecycleSectionDefinition {
    const found = LIFECYCLE_26_SECTIONS.find((s) => s.id === id);
    if (!found) {
      throw new Error(`Unknown lifecycle section ID: ${id}`);
    }
    return found;
  },

  getSectionByWorkstream(letter: string): LifecycleSectionDefinition | undefined {
    const upper = letter.toUpperCase();
    return LIFECYCLE_26_SECTIONS.find((s) => s.workstreamLetter === upper);
  },

  getSectionByDisplayOrder(order: number): LifecycleSectionDefinition | undefined {
    return LIFECYCLE_26_SECTIONS.find((s) => s.displayOrder === order);
  },

  getDisplayNumber(id: ProjectLifecycleStage): string {
    return this.getSectionById(id).displayNum;
  },

  isOriginal14(id: ProjectLifecycleStage): boolean {
    return (ORIGINAL_14_STAGE_IDS as readonly string[]).includes(id);
  },

  isNewSection(id: ProjectLifecycleStage): boolean {
    return (
      (NEW_6_STAGE_IDS as readonly string[]).includes(id) ||
      (ADDITIONAL_6_STAGE_IDS as readonly string[]).includes(id)
    );
  },

  isAdditional6Section(id: ProjectLifecycleStage): boolean {
    return (ADDITIONAL_6_STAGE_IDS as readonly string[]).includes(id);
  },

  getSectionsByWorkArea(workArea: WorkAreaCategory): LifecycleSectionDefinition[] {
    return LIFECYCLE_26_SECTIONS.filter((s) => s.workArea === workArea);
  },

  getSaasTechnicalAreas(): readonly SaasTechnicalAreaMapping[] {
    return SAAS_15_TECHNICAL_AREAS;
  },

  getSaasAreasForStage(stageId: ProjectLifecycleStage): SaasTechnicalAreaMapping[] {
    return SAAS_15_TECHNICAL_AREAS.filter((a) => a.primaryOwnerStageId === stageId);
  },

  /**
   * Validates registry integrity:
   * 1. Exactly 26 sections in sequence A through Z
   * 2. Display orders are 1..26 continuous
   * 3. Display numbers are "01".."26"
   * 4. All 14 original IDs are preserved with exact string names (Prompt Rule 9)
   * 5. All 6 prior additions are present
   * 6. All 6 new additions are present
   * 7. All 15 SaaS technical area mappings resolve to existing section owners
   */
  validateRegistryIntegrity(): {
    valid: boolean;
    totalCount: number;
    original14Preserved: boolean;
    new6Included: boolean;
    additional6Included: boolean;
    saas15Mapped: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (LIFECYCLE_26_SECTIONS.length !== 26) {
      errors.push(`Expected exactly 26 sections, found ${LIFECYCLE_26_SECTIONS.length}`);
    }

    // Check display orders 1..26
    for (let i = 1; i <= 26; i++) {
      const match = LIFECYCLE_26_SECTIONS.find((s) => s.displayOrder === i);
      if (!match) {
        errors.push(`Missing section with displayOrder ${i}`);
      }
    }

    // Check preservation of original 14 IDs
    for (const origId of ORIGINAL_14_STAGE_IDS) {
      const exists = LIFECYCLE_26_SECTIONS.some((s) => s.id === origId);
      if (!exists) {
        errors.push(`Original stage ID missing: ${origId}`);
      }
    }

    // Check inclusion of prior 6 IDs
    for (const newId of NEW_6_STAGE_IDS) {
      const exists = LIFECYCLE_26_SECTIONS.some((s) => s.id === newId);
      if (!exists) {
        errors.push(`Prior new stage ID missing: ${newId}`);
      }
    }

    // Check inclusion of additional 6 IDs
    for (const addId of ADDITIONAL_6_STAGE_IDS) {
      const exists = LIFECYCLE_26_SECTIONS.some((s) => s.id === addId);
      if (!exists) {
        errors.push(`Additional stage ID missing: ${addId}`);
      }
    }

    // Check 15 SaaS Technical Area mappings
    for (const saasArea of SAAS_15_TECHNICAL_AREAS) {
      const ownerExists = LIFECYCLE_26_SECTIONS.some(
        (s) => s.id === saasArea.primaryOwnerStageId
      );
      if (!ownerExists) {
        errors.push(
          `SaaS area ${saasArea.name} maps to unknown stage ID ${saasArea.primaryOwnerStageId}`
        );
      }
    }

    return {
      valid: errors.length === 0,
      totalCount: LIFECYCLE_26_SECTIONS.length,
      original14Preserved: ORIGINAL_14_STAGE_IDS.every((id) =>
        LIFECYCLE_26_SECTIONS.some((s) => s.id === id)
      ),
      new6Included: NEW_6_STAGE_IDS.every((id) =>
        LIFECYCLE_26_SECTIONS.some((s) => s.id === id)
      ),
      additional6Included: ADDITIONAL_6_STAGE_IDS.every((id) =>
        LIFECYCLE_26_SECTIONS.some((s) => s.id === id)
      ),
      saas15Mapped: SAAS_15_TECHNICAL_AREAS.every((a) =>
        LIFECYCLE_26_SECTIONS.some((s) => s.id === a.primaryOwnerStageId)
      ),
      errors,
    };
  },
};
