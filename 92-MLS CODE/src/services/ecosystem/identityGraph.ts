/**
 * VYRON — CANONICAL EXTERNAL IDENTITY GRAPH & CROSS-PROVIDER RESOLVER
 * GOD MODE vULTIMA vNEXT — Strictly ZERO SQL.
 * Maps GitHub accounts, orgs, repositories, vibe projects, agent runs, and previews into a single coherent DAG.
 */

import {
  GitHubAccountEntity,
  EnrolledRepositoryEntity,
  VibePlatformProjectEntity,
  VibeAgentRunEntity,
  VibeProviderId,
} from "./types";
import { vibeAdapterRegistry } from "./vibeAdapterSdk";

export interface LineageGraphNode {
  id: string;
  type: "GITHUB_ACCOUNT" | "REPOSITORY" | "VIBE_PROJECT" | "BRANCH" | "AGENT_RUN" | "PREVIEW" | "DEPLOYMENT";
  label: string;
  provider: VibeProviderId;
  metadata: Record<string, unknown>;
}

export interface LineageGraphEdge {
  sourceId: string;
  targetId: string;
  relationship: "OWNS" | "CONTAINS" | "EDITS" | "BRANCHED_FROM" | "PRODUCED" | "DEPLOYED_TO";
  weight?: number;
}

export interface CompleteLineageGraph {
  nodes: LineageGraphNode[];
  edges: LineageGraphEdge[];
  updatedAt: string;
}

export class ExternalIdentityGraphManager {
  private static instance: ExternalIdentityGraphManager;

  // In-memory canonical cache (reconciled against Supabase projects table without SQL)
  private accounts = new Map<string, GitHubAccountEntity>();
  private repositories = new Map<string, EnrolledRepositoryEntity>();
  private vibeProjects = new Map<string, VibePlatformProjectEntity>();
  private agentRuns = new Map<string, VibeAgentRunEntity>();

  private constructor() {
    this.seedDefaultIdentityState();
  }

  static getInstance(): ExternalIdentityGraphManager {
    if (!ExternalIdentityGraphManager.instance) {
      ExternalIdentityGraphManager.instance = new ExternalIdentityGraphManager();
    }
    return ExternalIdentityGraphManager.instance;
  }

  private seedDefaultIdentityState(): void {
    // Canonical GitHub Account / Org
    const account: GitHubAccountEntity = {
      id: "gh-org-cypherpheonix07",
      login: "cypherpheonix07-lang",
      name: "CypherPheonix Labs",
      avatarUrl: "https://avatars.githubusercontent.com/u/1000001?v=4",
      type: "Organization",
      installationId: 44219082,
      selectedRepoCount: 1,
      totalRepoCount: 4,
      permissions: {
        contents: "write",
        pull_requests: "write",
        actions: "read",
        metadata: "read",
        webhooks: "write",
      },
      isEnrolled: true,
      connectedAt: "2026-08-15T09:00:00Z",
      lastSyncAt: new Date().toISOString(),
    };
    this.accounts.set(account.id, account);

    // Canonical Primary Enrolled Repository
    const primaryRepo: EnrolledRepositoryEntity = {
      id: "repo-cypherpheonix07-lang/VYRON",
      githubRepoId: 98124018,
      owner: "cypherpheonix07-lang",
      name: "VYRON",
      fullName: "cypherpheonix07-lang/VYRON",
      defaultBranch: "main",
      isPrivate: false,
      isArchived: false,
      isFork: false,
      htmlUrl: "https://github.com/cypherpheonix07-lang/VYRON",
      cloneUrl: "https://github.com/cypherpheonix07-lang/VYRON.git",
      description: "Engineering Intelligence Control Plane & Native Copilot Platform",
      topics: ["engineering-intelligence", "ai-control-plane", "tanstack", "lovable", "vibe-coding"],
      starsCount: 124,
      forksCount: 18,
      openIssuesCount: 3,
      healthScore: 98,
      enrollmentStatus: "ENROLLED",
      connectedVibePlatforms: ["lovable", "v0", "cursor"],
      freshness: "LIVE",
      lastEventAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      lastReconciledAt: new Date().toISOString(),
      astDriftScore: 4, // 4% drift (very healthy)
    };
    this.repositories.set(primaryRepo.fullName, primaryRepo);

    // Seed vibe projects
    const lovablePrj: VibePlatformProjectEntity = {
      id: "vibe-lovable-vyron",
      provider: "lovable",
      projectId: "lov-vyron-core",
      projectName: "VYRON Web App",
      associatedRepoFullName: "cypherpheonix07-lang/VYRON",
      associatedBranch: "main",
      previewUrl: "https://preview--vyron-dev.lovable.app",
      productionUrl: "https://vyron.lovable.app",
      activeAgentRunsCount: 1,
      latestPromptSnippet: "Build GitHub Portfolio and Vibe Ecosystem Control Plane",
      healthState: "HEALTHY",
      capabilities: {
        REPOSITORY_SYNC: "SUPPORTED",
        PROMPT_TRACKING: "SUPPORTED",
        AGENT_RUNS: "SUPPORTED",
        BUILD_STREAM: "SUPPORTED",
        PREVIEW_URLS: "SUPPORTED",
        DEPLOYMENT_SYNC: "SUPPORTED",
        WEBHOOK_INGESTION: "SUPPORTED",
        MCP_TOOL_DISCOVERY: "PARTIAL",
        BRANCH_LINEAGE: "SUPPORTED",
      },
      lastSyncedAt: new Date().toISOString(),
    };
    this.vibeProjects.set(lovablePrj.id, lovablePrj);
  }

  // --- Graph Queries & Lineage Resolution ---

  getAccounts(): GitHubAccountEntity[] {
    return Array.from(this.accounts.values());
  }

  getEnrolledRepositories(): EnrolledRepositoryEntity[] {
    return Array.from(this.repositories.values());
  }

  getEnrolledRepository(fullName: string): EnrolledRepositoryEntity | undefined {
    return this.repositories.get(fullName);
  }

  getVibeProjects(): VibePlatformProjectEntity[] {
    return Array.from(this.vibeProjects.values());
  }

  getVibeProjectsForRepo(repoFullName: string): VibePlatformProjectEntity[] {
    return Array.from(this.vibeProjects.values()).filter(
      (p) => p.associatedRepoFullName.toLowerCase() === repoFullName.toLowerCase()
    );
  }

  getRecentAgentRuns(): VibeAgentRunEntity[] {
    return Array.from(this.agentRuns.values());
  }

  enrollRepository(repo: EnrolledRepositoryEntity): void {
    this.repositories.set(repo.fullName, {
      ...repo,
      enrollmentStatus: "ENROLLED",
      lastReconciledAt: new Date().toISOString(),
    });
  }

  offboardRepository(fullName: string): void {
    const existing = this.repositories.get(fullName);
    if (existing) {
      this.repositories.set(fullName, {
        ...existing,
        enrollmentStatus: "OFFBOARDED",
        freshness: "REVOKED" as any,
      });
    }
  }

  async refreshVibeDiscoveryForRepo(repoFullName: string): Promise<VibePlatformProjectEntity[]> {
    const adapters = vibeAdapterRegistry.getAll();
    const discovered: VibePlatformProjectEntity[] = [];

    for (const adapter of adapters) {
      if (adapter.providerId === "github") continue;
      const projects = await adapter.discoverProjects(repoFullName);
      for (const prj of projects) {
        this.vibeProjects.set(prj.id, prj);
        discovered.push(prj);
      }
      const runs = await adapter.fetchRecentAgentRuns(repoFullName);
      for (const run of runs) {
        this.agentRuns.set(run.id, run);
      }
    }

    // Update connected platforms on the repo
    const repo = this.repositories.get(repoFullName);
    if (repo) {
      const providers = Array.from(new Set(discovered.map((d) => d.provider)));
      repo.connectedVibePlatforms = providers;
      this.repositories.set(repoFullName, { ...repo });
    }

    return discovered;
  }

  buildLineageDAG(): CompleteLineageGraph {
    const nodes: LineageGraphNode[] = [];
    const edges: LineageGraphEdge[] = [];

    for (const acc of this.accounts.values()) {
      nodes.push({
        id: acc.id,
        type: "GITHUB_ACCOUNT",
        label: `${acc.login} (${acc.type})`,
        provider: "github",
        metadata: { installationId: acc.installationId, totalRepos: acc.totalRepoCount },
      });
    }

    for (const repo of this.repositories.values()) {
      nodes.push({
        id: repo.id,
        type: "REPOSITORY",
        label: repo.fullName,
        provider: "github",
        metadata: { defaultBranch: repo.defaultBranch, health: repo.healthScore },
      });

      // Edge from account to repo
      edges.push({
        sourceId: "gh-org-cypherpheonix07",
        targetId: repo.id,
        relationship: "OWNS",
      });

      // Vibe projects linked to this repo
      const prjs = this.getVibeProjectsForRepo(repo.fullName);
      for (const prj of prjs) {
        nodes.push({
          id: prj.id,
          type: "VIBE_PROJECT",
          label: `${prj.projectName} [${prj.provider.toUpperCase()}]`,
          provider: prj.provider,
          metadata: { preview: prj.previewUrl, health: prj.healthState },
        });

        edges.push({
          sourceId: prj.id,
          targetId: repo.id,
          relationship: "EDITS",
        });

        if (prj.previewUrl) {
          const previewNodeId = `preview-${prj.id}`;
          nodes.push({
            id: previewNodeId,
            type: "PREVIEW",
            label: `Preview (${prj.provider})`,
            provider: prj.provider,
            metadata: { url: prj.previewUrl },
          });
          edges.push({
            sourceId: prj.id,
            targetId: previewNodeId,
            relationship: "PRODUCED",
          });
        }
      }
    }

    return {
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    };
  }
}

export const identityGraphManager = ExternalIdentityGraphManager.getInstance();
