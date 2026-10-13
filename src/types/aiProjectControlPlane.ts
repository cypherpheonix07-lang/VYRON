/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Canonical Type Definitions & Contracts (Phases 01–14)
 * Strictly ZERO Raw SQL.
 */

export type ProjectLifecycleStage =
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
  | "14_BLUEPRINT"
  | "15_EXPERIENCE"
  | "16_INTEGRATION"
  | "17_RELEASE"
  | "18_OPERATIONS"
  | "19_EVALUATION"
  | "20_RETIREMENT"
  | "21_VALUE"
  | "22_GOVERNANCE"
  | "23_DEPENDENCY_ASSURANCE"
  | "24_DELIVERY"
  | "25_COMPLIANCE"
  | "26_DOCUMENTATION";

export type StageStatus =
  | "not_started"
  | "in_progress"
  | "needs_review"
  | "stale"
  | "blocked"
  | "complete"
  | "draft"
  | "ready_for_inspection"
  | "inspecting"
  | "changes_required"
  | "awaiting_decision"
  | "accepted"
  | "needs_reinspection"
  | "archived";

export type ProjectMaturity =
  "IDEA" | "UNDERSTOOD" | "DEFINED" | "DESIGNED" | "VALIDATED" | "READY" | "INITIALIZED";

export type MutationSensitivityLevel =
  | "L0_INFORMATIONAL"
  | "L1_DRAFT"
  | "L2_PROJECT_MODIFICATION"
  | "L3_STRUCTURAL_APPROVAL"
  | "L4_CRITICAL";

export type CopilotMode = "GUIDE" | "ANALYZE" | "BUILD" | "CHALLENGE" | "EXPLAIN" | "VALIDATE";

export type AgentRole =
  | "DiscoveryAgent"
  | "ProblemAnalystAgent"
  | "RequirementsEngineerAgent"
  | "ScopeEngineerAgent"
  | "CapabilityArchitectAgent"
  | "ExperienceArchitectAgent"
  | "SolutionArchitectAgent"
  | "TechnologyArchitectAgent"
  | "DataArchitectAgent"
  | "AiArchitectAgent"
  | "IntegrationArchitectAgent"
  | "SecurityArchitectAgent"
  | "ReliabilityEngineerAgent"
  | "ImplementationPlannerAgent"
  | "TestEngineerAgent"
  | "ReleaseEngineerAgent"
  | "OperationsEngineerAgent"
  | "EvaluationEngineerAgent"
  | "RetirementPlannerAgent"
  | "FinancialAnalystAgent"
  | "GovernanceAuditorAgent"
  | "SupplierAssuranceAgent"
  | "DeliveryCoordinatorAgent"
  | "ComplianceOfficerAgent"
  | "TechnicalWriterAgent"
  | "RedTeamAgent"
  | "BlueprintCompilerAgent";

// ---------------------------------------------------------------------------
// STAGE 01: Project Intent & Intent Model
// ---------------------------------------------------------------------------
export interface ProjectIntentModel {
  projectName: string;
  slug: string;
  naturalLanguageIntent: string;
  projectType: "web" | "mobile" | "api" | "cloud_native" | "ai_system" | "hybrid";
  domain: string;
  secondaryDomains: string[];
  experienceLevel: "startup" | "growth" | "enterprise";
  detectedEntities: string[];
  goals: string[];
  targetUsers: Array<{
    id: string;
    label: string;
    category: string;
    priority: number;
    custom: boolean;
  }>;
  constraints: string[];
  technicalSignals: string[];
  unknowns: string[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Project Understanding Object & Progressive Discovery
// ---------------------------------------------------------------------------
export interface ProjectUnderstanding {
  problemClarity: number; // 0-100
  userDefinition: number; // 0-100
  requirementsClarity: number; // 0-100
  scopeStability: number; // 0-100
  architectureIntegrity: number; // 0-100
  securityPosture: number; // 0-100
  completeness: number; // Structural specification %
  confidence: number; // System certainty %
  readiness: number; // Implementation safety %
  knownCount: number;
  assumptionsCount: number;
  unknownsCount: number;
  conflictsCount: number;
  explanations: Record<string, string>;
}

export interface DiscoveryQuestion {
  id: string;
  text: string;
  context: string;
  impactScore: number; // 1-10
  uncertaintyScore: number; // 1-10
  dependencyImportance: number; // 1-10
  priority: number; // impact * uncertainty * dependency
  status: "open" | "answered" | "dismissed";
  answer?: string;
  suggestedOptions?: string[];
}

// ---------------------------------------------------------------------------
// STAGE 02: Problem Engineering & Root Cause
// ---------------------------------------------------------------------------
export interface WhyNode {
  level: number; // 1 to 5
  question: string;
  answer: string;
  evidence?: string;
}

export interface ProblemModel {
  problemStatement: string;
  currentState: string;
  painPoints: string[];
  actors: string[];
  affectedUsers: string[];
  rootCauseTree: WhyNode[];
  rootProblem: string;
  existingAlternatives: string[];
  limitations: string[];
  desiredFutureState: string;
  outcome: string;
  successCriteria: string[];
}

// ---------------------------------------------------------------------------
// STAGE 03: Requirements Engineering & Quality Scoring
// ---------------------------------------------------------------------------
export type RequirementType =
  | "functional"
  | "non_functional"
  | "business"
  | "technical"
  | "security"
  | "data"
  | "ai_ml"
  | "integration"
  | "compliance"
  | "observability"
  | "testing"
  | "deployment";

export interface RequirementQualityScore {
  clarity: number; // 0-100
  completeness: number; // 0-100
  testability: number; // 0-100
  atomicity: number; // 0-100
  traceability: number; // 0-100
  scoreTotal: number; // 0-100
  feedback?: string;
}

export interface RequirementItem {
  id: string;
  code: string; // e.g. FR-001, NFR-002, SEC-001
  title: string;
  description: string;
  type: RequirementType;
  priority: "P0" | "P1" | "P2" | "P3";
  source: "USER" | "AI" | "IMPORTED" | "SYSTEM" | "COMBINED";
  status: "draft" | "approved" | "deprecated" | "stale";
  confidence: number; // 0-100
  qualityScore: RequirementQualityScore;
  acceptanceCriteria: string[];
  dependencies: string[]; // requirement IDs
  conflictsWith: string[]; // conflicting requirement IDs
  relatedComponents: string[];
}

// ---------------------------------------------------------------------------
// STAGE 04: Scope Engineering & Creep Detection
// ---------------------------------------------------------------------------
export interface ScopeDriftWarning {
  id: string;
  rule: string;
  originalObjective: string;
  divergentFeature: string;
  impactSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  affectedAreas: string[];
  suggestedAction: "keep" | "defer" | "remove" | "separate_module" | "redefine_project";
  resolved: boolean;
}

export interface ScopeModel {
  coreProblem: string;
  mvpRequirements: string[]; // requirement IDs
  v1Requirements: string[];
  v2Requirements: string[];
  outOfScope: string[];
  driftWarnings: ScopeDriftWarning[];
  scopeStabilityScore: number;
}

// ---------------------------------------------------------------------------
// STAGE 05: Capability Model
// ---------------------------------------------------------------------------
export interface CapabilityNode {
  id: string;
  name: string;
  description: string;
  category: string;
  subCapabilities: string[];
  satisfiesRequirementIds: string[];
}

export interface CapabilityModel {
  capabilities: CapabilityNode[];
}

// ---------------------------------------------------------------------------
// STAGE 06: System Architecture & Alternatives
// ---------------------------------------------------------------------------
export type ArchitectureTopologyType = "modular_monolith" | "microservices" | "event_driven";

export interface ArchitectureComponent {
  id: string;
  name: string;
  layer: "presentation" | "application" | "domain" | "ai" | "data" | "infrastructure" | "security";
  description: string;
  responsibilities: string[];
  apis: string[];
  dependencies: string[];
}

export interface ArchitectureAlternative {
  id: string;
  type: ArchitectureTopologyType;
  name: string;
  description: string;
  components: ArchitectureComponent[];
  tradeOffs: {
    complexityScore: number; // 1-10
    estimatedCostScore: number; // 1-10
    scalabilityScore: number; // 1-10
    timeToMvpWeeks: number;
    operationalBurdenScore: number; // 1-10
  };
  pros: string[];
  cons: string[];
  isProposedBaseline: boolean;
}

export interface ArchitectureModel {
  alternatives: ArchitectureAlternative[];
  selectedAlternativeId: string;
  consistencyScore: number;
}

// ---------------------------------------------------------------------------
// STAGE 07: Technology Stack & Trade-Offs
// ---------------------------------------------------------------------------
export interface TechStackDecision {
  category: "frontend" | "backend" | "database" | "cache" | "queue" | "search" | "ai_inference";
  primaryOption: string;
  alternativeOption: string;
  rationale: string;
  tradeOffs: string;
  migrationImplications: string;
  selectedOption: string;
}

export interface TechnologyModel {
  decisions: TechStackDecision[];
  stackFitScore: number;
}

// ---------------------------------------------------------------------------
// STAGE 08: Data Architecture & Governance
// ---------------------------------------------------------------------------
export interface DataEntityField {
  name: string;
  type: string;
  isPrimary: boolean;
  isNullable: boolean;
  description: string;
}

export interface DataEntity {
  id: string;
  name: string;
  description: string;
  ownerModule: string;
  fields: DataEntityField[];
  relationships: Array<{
    targetEntity: string;
    type: "one-to-one" | "one-to-many" | "many-to-many";
  }>;
  sensitivity: "public" | "internal" | "confidential" | "restricted_pii";
  retentionPeriod: "90d" | "1y" | "7y" | "permanent";
  auditRequired: boolean;
}

export interface DataArchitectureModel {
  entities: DataEntity[];
  governanceRules: string[];
}

// ---------------------------------------------------------------------------
// STAGE 09: AI/ML Engineering (Conditional)
// ---------------------------------------------------------------------------
export interface AiModelCandidate {
  id: string;
  name: string;
  provider: string;
  purpose: string;
  costPer1kTokens: number;
  expectedLatencyMs: number;
  knownLimitations: string[];
  selected: boolean;
}

export interface AiEngineeringModel {
  isActive: boolean;
  objective: string;
  modelCandidates: AiModelCandidate[];
  inferencePipeline: {
    inputValidation: string[];
    featureExtraction: string;
    modelRouting: string;
    outputValidation: string[];
    fallbackStrategy: string;
  };
  governanceContract: {
    promptInjectionSafeguards: boolean;
    dataRetentionDays: number;
    auditLevel: string;
  };
}

// ---------------------------------------------------------------------------
// STAGE 10: Security Engineering & STRIDE Threat Modeling
// ---------------------------------------------------------------------------
export interface ThreatItem {
  id: string;
  category:
    | "Spoofing"
    | "Tampering"
    | "Repudiation"
    | "Information Disclosure"
    | "Denial of Service"
    | "Elevation of Privilege";
  threat: string;
  targetAsset: string;
  entryPoint: string;
  mitigation: string;
  residualRisk: "LOW" | "MEDIUM" | "HIGH";
}

export interface SecurityModel {
  trustBoundaries: string[];
  entryPoints: string[];
  threats: ThreatItem[];
  promptInjectionDefense: boolean;
  authStrategy: "supabase_auth" | "oauth2" | "jwt_stateless" | "mfa_strict";
  securityPostureScore: number;
}

// ---------------------------------------------------------------------------
// STAGE 11: Reliability Engineering & Failure Modeling
// ---------------------------------------------------------------------------
export interface ComponentFailureScenario {
  componentName: string;
  failureScenario: string;
  timeoutMs: number;
  retryCount: number;
  circuitBreakerThreshold: number;
  fallbackStrategy: string;
  idempotencyRequired: boolean;
}

export interface ReliabilityModel {
  scenarios: ComponentFailureScenario[];
  overallResilienceScore: number;
}

// ---------------------------------------------------------------------------
// STAGE 12: Implementation Architecture & DAG Tasks
// ---------------------------------------------------------------------------
export interface ApiContractItem {
  id: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  description: string;
  authRequired: boolean;
  rateLimitPerMin: number;
  satisfiesRequirementCode: string;
}

export interface ImplementationTask {
  id: string;
  code: string;
  title: string;
  area: "frontend" | "backend" | "database" | "security" | "ai" | "infrastructure";
  capabilityId: string;
  requirementCode: string;
  dependsOn: string[]; // task IDs
  acceptanceCriteria: string[];
  status: "pending" | "ready" | "in_progress" | "complete";
}

export interface ImplementationModel {
  modules: string[];
  apiContracts: ApiContractItem[];
  tasks: ImplementationTask[];
  milestones: Array<{ id: string; name: string; targetWeek: number; taskIds: string[] }>;
}

// ---------------------------------------------------------------------------
// STAGE 13: Test Engineering & Traceability Matrix
// ---------------------------------------------------------------------------
export interface TestCaseItem {
  id: string;
  code: string;
  type: "unit" | "integration" | "api" | "e2e" | "security" | "ai_eval";
  title: string;
  targetRequirementCode: string;
  targetTaskCode: string;
  assertion: string;
}

export interface TestModel {
  testCases: TestCaseItem[];
  traceabilityMatrix: Array<{
    requirementCode: string;
    hasTestCase: boolean;
    testCaseCodes: string[];
    isCovered: boolean;
  }>;
}

// ---------------------------------------------------------------------------
// STAGE 14: AI Red Team & Canonical 26-Section Blueprint
// ---------------------------------------------------------------------------
export interface RedTeamFinding {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: "requirement" | "architecture" | "security" | "scalability" | "cost" | "ai_failure";
  affectedElement: string;
  evidence: string;
  whyItMatters: string;
  potentialConsequence: string;
  suggestedMitigation: string;
  status: "open" | "resolved" | "accepted_risk";
}

export interface CanonicalBlueprintSection {
  index: number;
  title: string;
  content: string;
  verified: boolean;
}

export interface ProjectBlueprint {
  id: string;
  projectId: string;
  projectName: string;
  version: number;
  compiledAt: string;
  sha256: string;
  sections: CanonicalBlueprintSection[];
  isConsistencyVerified: boolean;
  initializationReady: boolean;
}

// ---------------------------------------------------------------------------
// Proposals, Mutations & Governance Controls
// ---------------------------------------------------------------------------
export interface ProjectDiffSummary {
  added: string[];
  modified: string[];
  removed: string[];
  stale: string[];
}

export interface AiProposal {
  id: string;
  agentRole: AgentRole;
  stage: ProjectLifecycleStage;
  title: string;
  description: string;
  sensitivityLevel: MutationSensitivityLevel;
  proposedChanges: Partial<ProjectEngineeringState>;
  diffSummary: ProjectDiffSummary;
  directlyAffectedCount: number;
  indirectlyAffectedCount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface AiMutation {
  id: string;
  proposalId: string;
  stage: ProjectLifecycleStage;
  mutationLevel: MutationSensitivityLevel;
  appliedBy: string;
  appliedAt: string;
  snapshotHash: string;
}

// ---------------------------------------------------------------------------
// NEW LIFECYCLE DOMAIN MODELS (Stages 15 through 20)
// ---------------------------------------------------------------------------

// STAGE 15 (Display 06): Experience & Accessibility
export interface ExperiencePersona {
  id: string;
  name: string;
  role: string;
  accessibilityNeeds: string[];
  primaryDevice: string;
}

export interface ExperienceModel {
  targetWcagLevel: "A" | "AA" | "AAA";
  colorContrastRatioMin: number;
  screenReaderOptimized: boolean;
  keyboardNavigable: boolean;
  designSystemTokens: string[];
  supportedBreakpoints: string[];
  personas: ExperiencePersona[];
  keyUserJourneys: Array<{
    id: string;
    title: string;
    stepsCount: number;
    criticalPath: boolean;
  }>;
  createdAt: string;
}

// STAGE 16 (Display 11): Integration & Interoperability
export interface IntegrationEndpoint {
  id: string;
  name: string;
  type: "REST" | "GraphQL" | "gRPC" | "Webhook" | "MessageQueue";
  direction: "inbound" | "outbound" | "bidirectional";
  authMethod: "OAuth2" | "APIKey" | "mTLS" | "HMAC";
  rateLimitPerSec: number;
  retryPolicy: string;
  idempotencyGuaranteed: boolean;
}

export interface IntegrationModel {
  endpoints: IntegrationEndpoint[];
  dataExchangeFormats: string[];
  schemaTranslationEngines: string[];
  circuitBreakerEnabled: boolean;
  createdAt: string;
}

// STAGE 17 (Display 16): Release & Migration
export interface DeploymentRing {
  ring: number;
  name: string;
  targetAudience: string;
  soakTimeHours: number;
}

export interface ReleaseMigrationModel {
  versioningStrategy: "SemVer" | "CalVer";
  migrationScriptsCount: number;
  rollbackAutomated: boolean;
  deploymentRings: DeploymentRing[];
  zeroDowntimeVerified: boolean;
  featureFlagsCount: number;
  createdAt: string;
}

// STAGE 18 (Display 17): Operations & Incident Response
export interface SloTarget {
  name: string;
  sliMetric: string;
  targetPercentage: number;
  alertThresholdPercentage: number;
}

export interface OperationsModel {
  slos: SloTarget[];
  runbooksCount: number;
  onCallRotationConfigured: boolean;
  incidentSeverityMatrix: Array<{
    severity: "SEV1" | "SEV2" | "SEV3" | "SEV4";
    responseTtlMinutes: number;
    escalationPath: string;
  }>;
  healthCheckEndpoints: string[];
  createdAt: string;
}

// STAGE 19 (Display 18): Evaluation & Improvement
export interface MetricBaseline {
  metric: string;
  currentBaseline: number;
  targetGoal: number;
  unit: string;
}

export interface EvaluationModel {
  telemetryEnabled: boolean;
  feedbackLoopCadenceDays: number;
  baselines: MetricBaseline[];
  errorBudgetPercentage: number;
  userSatisfactionScoreTarget: number;
  createdAt: string;
}

// STAGE 20 (Display 25, Workstream Y): Retirement & Transition
export interface RetirementModel {
  deprecationNoticePeriodDays: number;
  dataRetentionYears: number;
  customerOffboardingPath: string;
  dataDestructionMethod: "CryptoShredding" | "MultiPassOverwrite" | "StoragePurge";
  archiveStorageTier: "Glacier" | "Coldline" | "DeepArchive";
  decommissionChecklist: string[];
  createdAt: string;
}

// STAGE 21 (Display 03, Workstream C): Business Value & Financial Viability
export interface ValueModel {
  estimatedDevelopmentHours: number;
  estimatedMonthlyCloudCost: number;
  estimatedMonthlyAiCost: number;
  roiMultiplier: number;
  pricingTiers: Array<{
    name: string;
    targetUsers: string;
    monthlyPrice: number;
  }>;
  valueAssumptions: string[];
  costSensitivityDrivers: string[];
  createdAt: string;
}

// STAGE 22 (Display 07, Workstream G): Governance & Decision Accountability
export interface GovernanceModel {
  projectOwner: string;
  decisionMakers: Array<{
    role: string;
    scope: string;
    delegatedTo?: string;
  }>;
  reviewPolicies: Array<{
    name: string;
    requiresApproval: boolean;
    escalationThreshold: string;
  }>;
  exceptionsRegister: Array<{
    id: string;
    reason: string;
    approvedBy: string;
    expiryDate: string;
  }>;
  auditRetentionDays: number;
  createdAt: string;
}

// STAGE 23 (Display 11, Workstream K): Dependency & Supplier Assurance
export interface DependencyAssuranceModel {
  qualifiedSuppliers: Array<{
    name: string;
    category: "cloud" | "ai_provider" | "database" | "library" | "saas";
    status: "qualified" | "pending" | "deprecated";
    fallbackStrategy: string;
  }>;
  aiProviders: Array<{
    provider: string;
    model: string;
    dataExposureRisk: "low" | "medium" | "high";
    slaAvailability: number;
  }>;
  concentrationRiskRating: "low" | "medium" | "high";
  licenseComplianceVerified: boolean;
  createdAt: string;
}

// STAGE 24 (Display 22, Workstream V): Delivery Planning & Coordination
export interface DeliveryPlanningModel {
  workPackagesCount: number;
  criticalPathTasks: string[];
  milestones: Array<{
    id: string;
    title: string;
    targetDate: string;
    status: "pending" | "in_progress" | "completed";
  }>;
  estimatedDeliveryWeeks: number;
  blockersCount: number;
  contingencyBufferPercentage: number;
  createdAt: string;
}

// STAGE 25 (Display 23, Workstream W): Compliance & Data Stewardship
export interface ComplianceModel {
  dataClassifications: Array<{
    category: string;
    dataTypes: string[];
    retentionYears: number;
    encryptionRequired: boolean;
  }>;
  regulatoryObligations: Array<{
    standard: "SOC2" | "HIPAA" | "GDPR" | "ISO27001" | "CCPA";
    status: "compliant" | "in_progress" | "not_applicable";
    controlsCount: number;
  }>;
  auditTrailImmutable: boolean;
  exportFormatSupported: "JSON" | "CSV" | "EncryptedZip";
  createdAt: string;
}

// STAGE 26 (Display 24, Workstream X): Documentation, Training & Knowledge Transfer
export interface DocumentationModel {
  guidesCount: number;
  studentGuideReady: boolean;
  facultyGuideReady: boolean;
  professionalGuideReady: boolean;
  apiRunbooksCount: number;
  trainingMaterialsCount: number;
  handoverPackageReady: boolean;
  lastAuditedAt: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Complete Unified Project Engineering State
// ---------------------------------------------------------------------------
export interface ProjectEngineeringState {
  // Identity & Control Plane metadata
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  version: number;
  activeStage: ProjectLifecycleStage;
  maturity: ProjectMaturity;
  stageStatuses: Record<ProjectLifecycleStage, StageStatus>;

  // Intelligence Subsystems (All 26 Lifecycle Stages)
  intent: ProjectIntentModel;
  understanding: ProjectUnderstanding;
  discoveryQuestions: DiscoveryQuestion[];
  problem: ProblemModel;
  value: ValueModel;
  requirements: RequirementItem[];
  scope: ScopeModel;
  capabilities: CapabilityModel;
  governance: GovernanceModel;
  experience: ExperienceModel;
  architecture: ArchitectureModel;
  technology: TechnologyModel;
  dependencyAssurance: DependencyAssuranceModel;
  data: DataArchitectureModel;
  ai: AiEngineeringModel;
  integration: IntegrationModel;
  security: SecurityModel;
  reliability: ReliabilityModel;
  implementation: ImplementationModel;
  testing: TestModel;
  release: ReleaseMigrationModel;
  operations: OperationsModel;
  evaluation: EvaluationModel;
  delivery: DeliveryPlanningModel;
  compliance: ComplianceModel;
  documentation: DocumentationModel;
  retirement: RetirementModel;
  redTeamFindings: RedTeamFinding[];
  blueprint: ProjectBlueprint | null;

  // Governance & Change Engine
  pendingProposals: AiProposal[];
  mutationAuditTrail: AiMutation[];
  staleNodes: string[];
  updatedAt: string;
}

export {
  LIFECYCLE_26_SECTIONS,
  LIFECYCLE_20_SECTIONS,
  LIFECYCLE_REGISTRY,
  ORIGINAL_14_STAGE_IDS,
  NEW_6_STAGE_IDS,
  ADDITIONAL_6_STAGE_IDS,
  ALL_26_STAGE_IDS,
  SAAS_15_TECHNICAL_AREAS,
  type LifecycleSectionDefinition,
  type WorkAreaCategory,
  type SaasTechnicalAreaMapping,
} from "../services/aiProject/lifecycleRegistry.ts";


