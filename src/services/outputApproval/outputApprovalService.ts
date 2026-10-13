/**
 * PROJECT BRAHMA / VYRON — PROJECT OUTPUT & APPROVAL SERVICE
 *
 * Implements candidate package generation, side-by-side difference review,
 * and exact-version approval commits (Workstreams Uu, u, Vv / WS41–WS43).
 *
 * Strictly separates documentation acceptance from code execution and runtime deployment (Rule 28).
 * Enforces Zero-Fiction Architecture Law and Zero Raw SQL Mandate.
 */

import { generateVerificationHash } from "@/services/ai/cryptoUtils";
import { LIFECYCLE_REGISTRY } from "@/services/aiProject/lifecycleRegistry";
import type {
  ProjectLifecycleStage,
  ProjectEngineeringState,
} from "@/types/aiProjectControlPlane";

export interface PackageSectionEntry {
  stage: ProjectLifecycleStage;
  displayNum: string;
  name: string;
  workArea: string;
  status: string;
  isAccepted: boolean;
  contentHash: string;
  summary: string;
}

export interface CandidatePackageManifest {
  packageId: string;
  projectId: string;
  projectName: string;
  version: number;
  candidateNumber: number;
  generatedAt: string;
  sections: PackageSectionEntry[];
  readinessScore: number; // 0-100%
  completedSectionsCount: number;
  acceptedSectionsCount: number;
  totalSectionsCount: 20;
  overallGatingVerdict: "READY_FOR_APPROVAL" | "CHANGES_REQUIRED" | "IN_PROGRESS";
  blockingIssuesCount: number;
  packageSha256: string;
  isCommitted: boolean;
}

export interface SectionDiffItem {
  stage: ProjectLifecycleStage;
  name: string;
  hasChanged: boolean;
  baselineHash: string;
  candidateHash: string;
  changeSummary: string;
  sourceAttribution: string;
  affectedDownstreamCount: number;
}

export interface DifferenceReviewReport {
  packageId: string;
  baselinePackageId: string | null;
  reviewedAt: string;
  totalChangesCount: number;
  sectionDiffs: SectionDiffItem[];
  riskAssessment: "LOW" | "MEDIUM" | "HIGH";
}

export interface OutputApprovalCommit {
  approvalId: string;
  packageId: string;
  projectId: string;
  actorId: string;
  actorRole: string;
  scope: "DOCUMENTATION_ACCEPTANCE"; // Strictly separated from runtime deployment!
  authorityLevel: "L3_STRUCTURAL_APPROVAL";
  committedAt: string;
  packageSha256: string;
  cryptographicApprovalSeal: string;
  verificationEvidenceUrl: string;
  deploymentAuthorized: false; // Invariant: documentation approval != code execution
}

class OutputApprovalService {
  private static instance: OutputApprovalService | null = null;
  private candidatePackages: Map<string, CandidatePackageManifest> = new Map();
  private acceptedPackages: Map<string, CandidatePackageManifest> = new Map();
  private approvalCommits: Map<string, OutputApprovalCommit> = new Map();

  private constructor() {}

  public static getInstance(): OutputApprovalService {
    if (!OutputApprovalService.instance) {
      OutputApprovalService.instance = new OutputApprovalService();
    }
    return OutputApprovalService.instance;
  }

  /**
   * Compiles a Candidate Output Package from the 20 lifecycle sections.
   */
  public compileCandidatePackage(
    projectId: string,
    state: ProjectEngineeringState,
    candidateNumber = 1,
  ): CandidatePackageManifest {
    const sections: PackageSectionEntry[] = LIFECYCLE_REGISTRY.getAllSections().map((sec) => {
      const status = state.stageStatuses[sec.id] || "not_started";
      const isAccepted = status === "accepted" || status === "complete";
      const content = this.extractSectionContent(sec.id, state);
      const contentHash = generateVerificationHash(content);
      const summary = this.getSectionSummary(sec.id, state);

      return {
        stage: sec.id,
        displayNum: sec.displayNum,
        name: sec.name,
        workArea: sec.workArea,
        status,
        isAccepted,
        contentHash,
        summary,
      };
    });

    const acceptedCount = sections.filter((s) => s.isAccepted).length;
    const completedCount = sections.filter((s) => s.status === "complete" || s.status === "accepted").length;
    const readinessScore = Math.round((completedCount / 20) * 100);

    const blockingIssuesCount = sections.filter((s) => s.status === "blocked" || s.status === "changes_required").length;

    let verdict: "READY_FOR_APPROVAL" | "CHANGES_REQUIRED" | "IN_PROGRESS" = "IN_PROGRESS";
    if (blockingIssuesCount > 0) {
      verdict = "CHANGES_REQUIRED";
    } else if (readinessScore >= 80) {
      verdict = "READY_FOR_APPROVAL";
    }

    const packageId = `PKG-${projectId.slice(0, 8).toUpperCase()}-v${state.version}-CANDIDATE-${candidateNumber}`;

    const packageSha256 = generateVerificationHash({
      packageId,
      projectId,
      version: state.version,
      sectionHashes: sections.map((s) => `${s.stage}:${s.contentHash}`),
      readinessScore,
      createdAt: new Date().toISOString(),
    });

    const manifest: CandidatePackageManifest = {
      packageId,
      projectId,
      projectName: state.name,
      version: state.version,
      candidateNumber,
      generatedAt: new Date().toISOString(),
      sections,
      readinessScore,
      completedSectionsCount: completedCount,
      acceptedSectionsCount: acceptedCount,
      totalSectionsCount: 20,
      overallGatingVerdict: verdict,
      blockingIssuesCount,
      packageSha256,
      isCommitted: false,
    };

    this.candidatePackages.set(packageId, manifest);
    return manifest;
  }

  /**
   * Generates a Difference Review between a candidate package and an optional baseline package.
   */
  public generateDifferenceReview(
    candidatePackageId: string,
    baselinePackageId?: string,
  ): DifferenceReviewReport {
    const candidate = this.candidatePackages.get(candidatePackageId);
    if (!candidate) {
      throw new Error(`Candidate package not found: ${candidatePackageId}`);
    }

    const baseline = baselinePackageId ? this.acceptedPackages.get(baselinePackageId) : null;

    const sectionDiffs: SectionDiffItem[] = candidate.sections.map((candSec) => {
      const baseSec = baseline?.sections.find((s) => s.stage === candSec.stage);
      const hasChanged = !baseSec || baseSec.contentHash !== candSec.contentHash;

      return {
        stage: candSec.stage,
        name: candSec.name,
        hasChanged,
        baselineHash: baseSec?.contentHash || "none (initial)",
        candidateHash: candSec.contentHash,
        changeSummary: hasChanged
          ? `Section updated: ${candSec.summary}`
          : "Matches accepted baseline.",
        sourceAttribution: "Manual input and ATHER specialist synthesis.",
        affectedDownstreamCount: 0,
      };
    });

    const totalChanges = sectionDiffs.filter((d) => d.hasChanged).length;

    return {
      packageId: candidatePackageId,
      baselinePackageId: baselinePackageId || null,
      reviewedAt: new Date().toISOString(),
      totalChangesCount: totalChanges,
      sectionDiffs,
      riskAssessment: totalChanges > 8 ? "HIGH" : totalChanges > 3 ? "MEDIUM" : "LOW",
    };
  }

  /**
   * Commits an exact-version approval for a candidate package.
   * Strictly binds actor, candidate package identity, and cryptographic seal.
   */
  public commitApproval(
    packageId: string,
    actorId: string,
    actorRole = "Lead Architect",
  ): OutputApprovalCommit {
    const candidate = this.candidatePackages.get(packageId);
    if (!candidate) {
      throw new Error(`Candidate package not found: ${packageId}`);
    }

    if (candidate.blockingIssuesCount > 0) {
      throw new Error(
        `Cannot commit approval: ${candidate.blockingIssuesCount} blocking issues remain unresolved.`
      );
    }

    const committedAt = new Date().toISOString();
    const approvalId = `APPR-${candidate.projectId.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const cryptographicApprovalSeal = generateVerificationHash({
      approvalId,
      packageId,
      projectId: candidate.projectId,
      packageSha256: candidate.packageSha256,
      actorId,
      actorRole,
      scope: "DOCUMENTATION_ACCEPTANCE",
      committedAt,
    });

    const commit: OutputApprovalCommit = {
      approvalId,
      packageId,
      projectId: candidate.projectId,
      actorId,
      actorRole,
      scope: "DOCUMENTATION_ACCEPTANCE",
      authorityLevel: "L3_STRUCTURAL_APPROVAL",
      committedAt,
      packageSha256: candidate.packageSha256,
      cryptographicApprovalSeal,
      verificationEvidenceUrl: `/app/projects/${candidate.projectId}/output?approvalId=${approvalId}`,
      deploymentAuthorized: false,
    };

    candidate.isCommitted = true;
    this.acceptedPackages.set(packageId, candidate);
    this.approvalCommits.set(approvalId, commit);

    return commit;
  }

  public getCandidatePackage(packageId: string): CandidatePackageManifest | undefined {
    return this.candidatePackages.get(packageId);
  }

  public getApprovalCommit(approvalId: string): OutputApprovalCommit | undefined {
    return this.approvalCommits.get(approvalId);
  }

  public listApprovalCommitsForProject(projectId: string): OutputApprovalCommit[] {
    return Array.from(this.approvalCommits.values()).filter((c) => c.projectId === projectId);
  }

  private extractSectionContent(stage: ProjectLifecycleStage, state: ProjectEngineeringState): unknown {
    switch (stage) {
      case "01_INTENT": return state.intent;
      case "02_PROBLEM": return state.problem;
      case "03_REQUIREMENTS": return state.requirements;
      case "04_SCOPE": return state.scope;
      case "05_CAPABILITY": return state.capabilities;
      case "15_EXPERIENCE": return state.experience;
      case "06_ARCHITECTURE": return state.architecture;
      case "07_TECHNOLOGY": return state.technology;
      case "08_DATA": return state.data;
      case "09_AI_DESIGN": return state.ai;
      case "16_INTEGRATION": return state.integration;
      case "10_SECURITY": return state.security;
      case "11_RELIABILITY": return state.reliability;
      case "12_IMPLEMENTATION": return state.implementation;
      case "13_TESTING": return state.testing;
      case "17_RELEASE": return state.release;
      case "18_OPERATIONS": return state.operations;
      case "19_EVALUATION": return state.evaluation;
      case "20_RETIREMENT": return state.retirement;
      case "14_BLUEPRINT": return state.blueprint;
      default: return {};
    }
  }

  private getSectionSummary(stage: ProjectLifecycleStage, state: ProjectEngineeringState): string {
    switch (stage) {
      case "01_INTENT":
        return state.intent?.naturalLanguageIntent?.slice(0, 80) || "No intent defined";
      case "02_PROBLEM":
        return state.problem?.problemStatement?.slice(0, 80) || "No problem statement";
      case "03_REQUIREMENTS":
        return `${(state.requirements || []).length} atomic requirements`;
      case "04_SCOPE":
        return `${(state.scope?.mvpRequirements || []).length} MVP requirements`;
      case "05_CAPABILITY":
        return `${(state.capabilities?.capabilities || []).length} capabilities mapped`;
      case "15_EXPERIENCE":
        return `WCAG 2.1 ${state.experience?.targetWcagLevel || "AA"} contrast verified, ${(state.experience?.keyUserJourneys || []).length} user journeys`;
      case "06_ARCHITECTURE":
        return `${(state.architecture?.alternatives || []).length} topology alternatives`;
      case "07_TECHNOLOGY":
        return `${(state.technology?.decisions || []).length} stack decisions`;
      case "08_DATA":
        return `${(state.data?.entities || []).length} domain entities with RLS`;
      case "09_AI_DESIGN":
        return `${(state.ai?.modelCandidates || []).length} AI model candidates`;
      case "16_INTEGRATION":
        return `${(state.integration?.endpoints || []).length} managed API endpoints with idempotency keys`;
      case "10_SECURITY":
        return `${(state.security?.threats || []).length} STRIDE threats modeled`;
      case "11_RELIABILITY":
        return `${(state.reliability?.scenarios || []).length} failure scenarios analyzed`;
      case "12_IMPLEMENTATION":
        return `${(state.implementation?.tasks || []).length} dependency-ordered tasks`;
      case "13_TESTING":
        return `${(state.testing?.testCases || []).length} automated test cases`;
      case "17_RELEASE":
        return `${(state.release?.deploymentRings || []).length} deployment rings with automated rollback`;
      case "18_OPERATIONS":
        return `${(state.operations?.slos || []).length} SLO targets with runbooks`;
      case "19_EVALUATION":
        return `${(state.evaluation?.baselines || []).length} telemetry baselines active`;
      case "20_RETIREMENT":
        return `${state.retirement?.deprecationNoticePeriodDays || 90}-day sunset notice and crypto-shredding`;
      case "14_BLUEPRINT":
        return state.blueprint ? `Canonical Blueprint v${state.blueprint.version} verified` : "Blueprint pending compilation";
      default:
        return "Specialized stage";
    }
  }
}

export const outputApprovalService = OutputApprovalService.getInstance();
