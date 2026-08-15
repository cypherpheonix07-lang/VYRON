/**
 * PROJECT BRAHMA — Executive Summary Report Type Definitions
 * Strict typing for compiled reports, metrics, chain-of-custody, and export formats.
 */

export interface TeamMember {
  name: string;
  regNo: string;
  role: string;
  email: string;
}

export interface InstitutionBlock {
  institution: string;
  department: string;
  course: string;
  cohort: string;
  academicYear: string;
  classification: string;
}

export interface ChainOfCustody {
  reportId: string;
  hashSha256: string;
  generatedAt: string;
  generatorId: string;
  generatorName: string;
  generatorRole: string;
  reviewerSignOff?: {
    reviewerName: string;
    reviewerRole: string;
    signedAt: string;
    verdict: "APPROVED" | "REJECTED" | "NEEDS_REVISION";
  };
}

export interface MetricDefinition {
  id: string;
  name: string;
  category: "Requirement" | "Architecture" | "Security" | "CodeHealth" | "Risk" | "Platform";
  target: string;
  achieved: string | null; // null if pending
  status: "ACHIEVED" | "TARGET" | "PENDING";
  selectorSource: string; // Explainability tooltip info (e.g. "Derived from AST Tree-sitter cyclomatic complexity v(G)")
  measurementPlan?: string; // Sourced in Appendix D if PENDING
}

export interface ComparativeTableRow {
  dimension: string;
  cohortTypical: string;
  brahmaPlatform: string;
  evidenceNotes: string;
}

export interface IndustryComparisonRow {
  dimension: string;
  aiBuilders: string; // Lovable, Bolt.new, v0
  inEditorAssistants: string; // Cursor, Copilot
  brahmaPlatform: string;
}

export interface SecurityPostureItem {
  layer: string;
  mechanism: string;
  implementationDetail: string;
  verificationEvidence: string;
}

export interface FutureScopeItem {
  id: string;
  title: string;
  description: string;
  technicalMilestone: string;
}

export interface ReportDocument {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  version: string;
  template: "Academic IEEE" | "Technical Executive" | "Executive Summary";
  status: "Generating" | "Completed" | "Failed";
  generatedAt: string;
  team: TeamMember[];
  institution: InstitutionBlock;
  chainOfCustody: ChainOfCustody;

  // Section Data
  executiveSummary: string;
  executiveSummaryWordCount: number;
  kpis: {
    projectsAnalyzed: number;
    blueprintsGenerated: number;
    findingsFlagged: number;
    avgHealthScore: number;
    publishBlockRate: string;
    signInCaptureRate: string;
  };
  charts: {
    weeklyAnalyses: { week: string; count: number }[];
    riskDistribution: { category: string; percentage: number; count: number }[];
  };
  problemStatement: string;
  systemArchitecture: {
    phase: string;
    moduleName: string;
    primaryEngine: string;
    outputArtifact: string;
  }[];
  coreInnovations: {
    title: string;
    what: string;
    why: string;
    how: string;
    evidence: string;
  }[];
  techStack: {
    layer: string;
    chosenTech: string;
    rejectedTech: string;
    justification: string;
  }[];
  metricsRegister: MetricDefinition[];
  comparativeAnalysis: {
    cohortMatrix: ComparativeTableRow[];
    industryMatrix: IndustryComparisonRow[];
    lineageTable: { milestone: string; year: string; contribution: string }[];
  };
  securityCompliance: SecurityPostureItem[];
  evaluationEvidence: {
    datasets: string;
    methodology: string;
    baselineComparison: string;
    susScore: number;
    likertScore: number;
    threatsToValidity: string;
  };
  publicationPlacement: {
    paperAngles: { title: string; targetVenue: string; coreFocus: string }[];
    roleFits: { member: string; targetRole: string; competencies: string }[];
  };
  futureScope: FutureScopeItem[];
  conclusionBullets: string[];
  closingRemarks: string;
  appendices: {
    aRouteMap: string[];
    bComponentInventory: string[];
    cSqlSchemaSummary: string;
    dEvidenceGaps: { metricName: string; plan: string }[];
  };
}
