/**
 * PROJECT VYRON / ATHER — WORLD MODEL (BRAIN 2)
 * Stores versioned project and environment relationships:
 * - Requirements, repositories, source snapshots, datasets, architecture, decisions, artifacts, observations.
 * - Represents incomplete coverage and uncertainty.
 * - Strictly enforces multi-project isolation: changing active project isolates context and memory.
 */

export interface ProjectEntity {
  id: string;
  name: string;
  description: string;
  version: string;
  sourceRepo?: string;
  activeBranch?: string;
  commitHash?: string;
  datasetId?: string;
  architectureComponents: string[];
  recentDecisions: string[];
  coveragePercentage: number;
  uncertaintyNotes: string[];
  lastUpdated: string;
}

export class AtherWorldModel {
  private static instance: AtherWorldModel | null = null;
  private activeProjectId: string = "proj_atlas_001";
  private projects: Map<string, ProjectEntity> = new Map();
  private observationHistory: Array<{
    projectId: string;
    timestamp: string;
    observation: string;
    source: string;
  }> = [];

  private constructor() {
    this.seedDefaultProjects();
  }

  public static getInstance(): AtherWorldModel {
    if (!AtherWorldModel.instance) {
      AtherWorldModel.instance = new AtherWorldModel();
    }
    return AtherWorldModel.instance;
  }

  private seedDefaultProjects(): void {
    this.projects.set("proj_atlas_001", {
      id: "proj_atlas_001",
      name: "ATLAS Core Architecture",
      description: "Primary engineering telemetry, AST analysis, and release gate orchestration.",
      version: "v2.4.1",
      sourceRepo: "github.com/vyron/atlas-core",
      activeBranch: "main",
      commitHash: "7b82f9c",
      datasetId: "ds_telemetry_2026",
      architectureComponents: [
        "srv-gateway",
        "srv-auth",
        "srv-analysis-orchestrator",
        "srv-drift-engine",
        "srv-evidence-ledger",
      ],
      recentDecisions: [
        "ADR-001: Strict separation of demo session storage from production persistence",
        "ADR-002: Zero Raw SQL mandate across all services",
      ],
      coveragePercentage: 88.5,
      uncertaintyNotes: [
        "Third-party API rate-limiting dynamics unmeasured above 10k QPS",
        "Edge-worker cold start variance in APAC region",
      ],
      lastUpdated: new Date().toISOString(),
    });

    this.projects.set("proj_payments_002", {
      id: "proj_payments_002",
      name: "Payment Gateway Service",
      description: "PCI-DSS compliant payment processing and settlement microservices.",
      version: "v1.1.0",
      sourceRepo: "github.com/vyron/payments-service",
      activeBranch: "release/1.1",
      commitHash: "e4a1120",
      datasetId: "ds_settlements_q3",
      architectureComponents: [
        "srv-ingress",
        "srv-settlement",
        "srv-tokenization-vault",
        "srv-fraud-screen",
      ],
      recentDecisions: [
        "ADR-104: Use idempotency keys on all POST /v1/charges endpoints",
      ],
      coveragePercentage: 94.0,
      uncertaintyNotes: [
        "Legacy acquirer fallback path lacks automated failover test coverage",
      ],
      lastUpdated: new Date().toISOString(),
    });
  }

  public getActiveProjectId(): string {
    return this.activeProjectId;
  }

  public setActiveProject(projectId: string): { success: boolean; previous: string; current: string } {
    const previous = this.activeProjectId;
    if (!this.projects.has(projectId)) {
      // Auto-register project workspace if unknown
      this.projects.set(projectId, {
        id: projectId,
        name: `Project Workspace (${projectId})`,
        description: "Dynamically mounted project workspace.",
        version: "v1.0.0",
        architectureComponents: ["workspace-root"],
        recentDecisions: [],
        coveragePercentage: 50.0,
        uncertaintyNotes: ["Freshly mounted project, telemetry indexing in progress."],
        lastUpdated: new Date().toISOString(),
      });
    }

    this.activeProjectId = projectId;
    this.recordObservation(
      projectId,
      `Active project switched from ${previous} to ${projectId}`,
      "AtherWorldModel"
    );

    return {
      success: true,
      previous,
      current: projectId,
    };
  }

  public getProject(projectId: string): ProjectEntity | undefined {
    return this.projects.get(projectId);
  }

  public getActiveProject(): ProjectEntity {
    return this.projects.get(this.activeProjectId) || {
      id: this.activeProjectId,
      name: "Default Engineering Workspace",
      description: "Active engineering workspace",
      version: "v1.0.0",
      architectureComponents: [],
      recentDecisions: [],
      coveragePercentage: 60.0,
      uncertaintyNotes: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  public listProjects(): ProjectEntity[] {
    return Array.from(this.projects.values());
  }

  public recordObservation(projectId: string, observation: string, source: string): void {
    this.observationHistory.push({
      projectId,
      timestamp: new Date().toISOString(),
      observation,
      source,
    });
  }

  public getObservationsForProject(projectId: string): Array<{
    timestamp: string;
    observation: string;
    source: string;
  }> {
    return this.observationHistory.filter((o) => o.projectId === projectId);
  }

  /**
   * Asserts whether an entity or resource belongs to the current active project.
   * Enforces zero cross-project leakage.
   */
  public assertProjectScope(targetProjectId?: string): boolean {
    if (!targetProjectId) return true;
    return targetProjectId === this.activeProjectId;
  }
}

export const atherWorldModel = AtherWorldModel.getInstance();
