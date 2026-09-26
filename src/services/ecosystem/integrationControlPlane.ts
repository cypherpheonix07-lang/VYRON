/**
 * VYRON — UNIFIED INTEGRATION CONTROL PLANE
 * GOD MODE vULTIMA vNEXT — Strictly ZERO SQL.
 * Master facade governing the lifecycle, discovery, authorization, observation, and verification of external engineering ecosystems.
 */

import { identityGraphManager, CompleteLineageGraph } from "./identityGraph";
import { vibeAdapterRegistry, IVibeAdapter } from "./vibeAdapterSdk";
import { eventIngestionGateway, IngestionResult } from "./eventIngestionGateway";
import { reconciliationEngine, ReconciliationReport } from "./reconciliationEngine";
import { connectorHealthSloEngine } from "./connectorHealthSloEngine";
import { consentAuthLedger } from "./consentAuthLedger";
import {
  EnrolledRepositoryEntity,
  GitHubAccountEntity,
  VibePlatformProjectEntity,
  VibeAgentRunEntity,
  ProviderHealthSlo,
  NormalizedEcosystemEvent,
  AutoConnectCandidate,
  ConsentAuthorizationRecord,
  VibeProviderId,
} from "./types";

export interface EcosystemOverviewSummary {
  accountsCount: number;
  enrolledRepositoriesCount: number;
  connectedVibePlatformsCount: number;
  totalAgentRunsCount: number;
  aggregateHealthScore: number;
  pendingConsentCount: number;
  recentEventsCount: number;
  lastReconciliationAt?: string | undefined;
}

export class EcosystemControlPlane {
  private static instance: EcosystemControlPlane;

  private constructor() {}

  static getInstance(): EcosystemControlPlane {
    if (!EcosystemControlPlane.instance) {
      EcosystemControlPlane.instance = new EcosystemControlPlane();
    }
    return EcosystemControlPlane.instance;
  }

  // --- Read Models for UI Surfaces ---

  getAccounts(): GitHubAccountEntity[] {
    return identityGraphManager.getAccounts();
  }

  getEnrolledRepositories(): EnrolledRepositoryEntity[] {
    return identityGraphManager.getEnrolledRepositories();
  }

  getEnrolledRepository(fullName: string): EnrolledRepositoryEntity | undefined {
    return identityGraphManager.getEnrolledRepository(fullName);
  }

  getVibeProjects(): VibePlatformProjectEntity[] {
    return identityGraphManager.getVibeProjects();
  }

  getRecentAgentRuns(): VibeAgentRunEntity[] {
    return identityGraphManager.getRecentAgentRuns();
  }

  async getHealthSlos(): Promise<ProviderHealthSlo[]> {
    return connectorHealthSloEngine.evaluateAllProviders();
  }

  getRecentEvents(limit = 25): NormalizedEcosystemEvent[] {
    return eventIngestionGateway.getRecentEvents(limit);
  }

  getPendingCandidates(): AutoConnectCandidate[] {
    return consentAuthLedger.getPendingReviewCandidates();
  }

  getAllCandidates(): AutoConnectCandidate[] {
    return consentAuthLedger.getAllCandidates();
  }

  getAuthorizationRecords(): ConsentAuthorizationRecord[] {
    return consentAuthLedger.getAuthorizationRecords();
  }

  getLineageGraph(): CompleteLineageGraph {
    return identityGraphManager.buildLineageDAG();
  }

  async getOverviewSummary(): Promise<EcosystemOverviewSummary> {
    const repos = identityGraphManager.getEnrolledRepositories();
    const accounts = identityGraphManager.getAccounts();
    const projects = identityGraphManager.getVibeProjects();
    const runs = identityGraphManager.getRecentAgentRuns();
    const pending = consentAuthLedger.getPendingReviewCandidates();
    const events = eventIngestionGateway.getRecentEvents(50);
    const health = connectorHealthSloEngine.calculateAggregateHealth();
    const lastRecon = reconciliationEngine.getLastReport()?.reconciledAt;

    return {
      accountsCount: accounts.length,
      enrolledRepositoriesCount: repos.length,
      connectedVibePlatformsCount: projects.length,
      totalAgentRunsCount: runs.length,
      aggregateHealthScore: health.overallScore,
      pendingConsentCount: pending.length,
      recentEventsCount: events.length,
      lastReconciliationAt: lastRecon,
    };
  }

  // --- Mutative Lifecycle Actions with Full Provenance ---

  async autoEnrollRepository(fullName: string): Promise<EnrolledRepositoryEntity> {
    const [owner, name] = fullName.split("/");
    const repo: EnrolledRepositoryEntity = {
      id: `repo-${fullName}`,
      githubRepoId: Math.floor(Math.random() * 900000 + 100000),
      owner: owner || "cypherpheonix07-lang",
      name: name || "new-repo",
      fullName,
      defaultBranch: "main",
      isPrivate: false,
      isArchived: false,
      isFork: false,
      htmlUrl: `https://github.com/${fullName}`,
      cloneUrl: `https://github.com/${fullName}.git`,
      description: "Auto-enrolled via VYRON Ecosystem Control Plane",
      topics: ["engineering-portfolio", "auto-enrolled"],
      starsCount: 0,
      forksCount: 0,
      openIssuesCount: 0,
      healthScore: 96,
      enrollmentStatus: "ENROLLED",
      connectedVibePlatforms: ["github"],
      freshness: "LIVE",
      lastEventAt: new Date().toISOString(),
      lastReconciledAt: new Date().toISOString(),
      astDriftScore: 0,
    };

    identityGraphManager.enrollRepository(repo);

    // Trigger candidate discovery
    consentAuthLedger.detectCandidatesForRepo(repo);

    // Ingest enrollment event
    eventIngestionGateway.ingest("github", "INSTALLATION_REPOS_ADDED", {
      repositories_added: [{ id: repo.githubRepoId, full_name: repo.fullName, name: repo.name }],
    });

    return repo;
  }

  async offboardRepository(fullName: string): Promise<void> {
    identityGraphManager.offboardRepository(fullName);

    eventIngestionGateway.ingest("github", "INSTALLATION_REPOS_REMOVED", {
      repositories_removed: [{ full_name: fullName }],
    });
  }

  async authorizeVibeCandidate(candidateId: string, userId = "priya.nair@brahma.dev"): Promise<ConsentAuthorizationRecord> {
    const record = consentAuthLedger.authorizeCandidate(candidateId, userId);

    // Automatically trigger initial project and agent run synchronization
    const cand = consentAuthLedger.getAllCandidates().find((c) => c.candidateId === candidateId);
    if (cand) {
      await identityGraphManager.refreshVibeDiscoveryForRepo(cand.associatedRepoFullName);
    }

    return record;
  }

  revokeVibeAuthorization(provider: VibeProviderId, userId = "priya.nair@brahma.dev"): boolean {
    return consentAuthLedger.revokeAuthorization(provider, userId);
  }

  async triggerReconciliation(): Promise<ReconciliationReport> {
    return reconciliationEngine.runReconciliation();
  }

  ingestExternalEvent(
    provider: VibeProviderId,
    eventType: NormalizedEcosystemEvent["eventType"],
    payload: Record<string, unknown>
  ): IngestionResult {
    return eventIngestionGateway.ingest(provider, eventType, payload);
  }
}

export const ecosystemControlPlane = EcosystemControlPlane.getInstance();
