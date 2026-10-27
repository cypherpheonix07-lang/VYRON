/**
 * Running-State Resolver — Canonical Runtime Truth Engine
 * 
 * NON-NEGOTIABLE LAWS:
 * 1. Never infer RUNNING from repository existence alone.
 * 2. Source-control repository is source truth, NOT runtime truth.
 * 3. Every status must be corroborated by authoritative provider evidence.
 */

export type CanonicalRunningStatus =
  | "UNKNOWN"
  | "DISCOVERED"
  | "READY"
  | "BUILDING"
  | "PREVIEW_READY"
  | "DEPLOYING"
  | "LIVE"
  | "RUNNING"
  | "DEGRADED"
  | "FAILED"
  | "STOPPED"
  | "STALE"
  | "BLOCKED"
  | "FALLBACK"
  | "SIMULATION";

export type AuthorityClass =
  | "PROVEN_RUNTIME"
  | "HEALTH_CHECK_ENDPOINT"
  | "DEPLOYMENT_SERVICE_API"
  | "BUILDER_WORKSPACE_API"
  | "CONTAINER_ORCHESTRATOR"
  | "TELEMETRY_STREAM"
  | "SIMULATED_PROBE"
  | "UNVERIFIED_INFERENCE";

export interface StatusAssertion {
  status: CanonicalRunningStatus;
  sourceProvider: "github" | "vercel" | "cloudflare" | "lovable" | "v0" | "bolt" | "replit" | "docker" | "kubernetes" | "custom_host";
  sourceResourceId: string;
  sourceUrl?: string;
  revision: string;
  environment: "production" | "staging" | "preview" | "ephemeral_sandbox" | "simulation";
  observedAt: string;
  freshnessSeconds: number;
  authorityClass: AuthorityClass;
  evidenceIds: string[];
  corroborationCount: number;
  expiryAt: string;
  invalidationReason?: string;
  metadata?: Record<string, unknown>;
}

export interface RunningStateResolutionResult {
  resolvedStatus: CanonicalRunningStatus;
  confidenceScore: number; // 0.0 to 1.0
  isAuthoritative: boolean;
  activeAssertion: StatusAssertion;
  corroboratingAssertions: StatusAssertion[];
  warnings: string[];
  lastVerifiedAt: string;
}

class RunningStateResolverEngine {
  private assertionsStore: Map<string, StatusAssertion[]> = new Map();

  /**
   * Register a new observed runtime assertion
   */
  public registerAssertion(projectId: string, assertion: StatusAssertion): void {
    const existing = this.assertionsStore.get(projectId) || [];
    // Keep last 50 assertions for audit trail
    this.assertionsStore.set(projectId, [assertion, ...existing].slice(0, 50));
  }

  /**
   * Resolve current true running state for a project
   */
  public resolveRunningState(projectId: string): RunningStateResolutionResult {
    const assertions = this.assertionsStore.get(projectId) || [];
    const now = Date.now();

    if (assertions.length === 0) {
      const defaultAssertion: StatusAssertion = {
        status: "UNKNOWN",
        sourceProvider: "github",
        sourceResourceId: `proj-${projectId}-untracked`,
        revision: "head",
        environment: "preview",
        observedAt: new Date().toISOString(),
        freshnessSeconds: 0,
        authorityClass: "UNVERIFIED_INFERENCE",
        evidenceIds: [],
        corroborationCount: 0,
        expiryAt: new Date(now + 60000).toISOString(),
        invalidationReason: "No runtime observation registered yet.",
      };

      return {
        resolvedStatus: "UNKNOWN",
        confidenceScore: 0.1,
        isAuthoritative: false,
        activeAssertion: defaultAssertion,
        corroboratingAssertions: [],
        warnings: ["No runtime health probes or deployment hooks received."],
        lastVerifiedAt: new Date().toISOString(),
      };
    }

    // Filter out expired assertions
    const validAssertions = assertions.filter(
      (a) => new Date(a.expiryAt).getTime() > now && !a.invalidationReason
    );

    if (validAssertions.length === 0) {
      const latest = assertions[0]!;
      return {
        resolvedStatus: "STALE",
        confidenceScore: 0.3,
        isAuthoritative: false,
        activeAssertion: {
          ...latest,
          status: "STALE",
          invalidationReason: "All recorded assertions have exceeded freshness TTL.",
        },
        corroboratingAssertions: [],
        warnings: ["Runtime assertion expired. Reverification required."],
        lastVerifiedAt: latest.observedAt,
      };
    }

    // Prioritize by Authority Class
    const authorityRank: Record<AuthorityClass, number> = {
      PROVEN_RUNTIME: 100,
      HEALTH_CHECK_ENDPOINT: 90,
      CONTAINER_ORCHESTRATOR: 85,
      DEPLOYMENT_SERVICE_API: 75,
      BUILDER_WORKSPACE_API: 60,
      TELEMETRY_STREAM: 50,
      SIMULATED_PROBE: 30,
      UNVERIFIED_INFERENCE: 10,
    };

    const sorted = [...validAssertions].sort((a, b) => {
      const rankDiff = authorityRank[b.authorityClass] - authorityRank[a.authorityClass];
      if (rankDiff !== 0) return rankDiff;
      return new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime();
    });

    const topAssertion = sorted[0]!;
    const corroborators = sorted.slice(1).filter((a) => a.status === topAssertion.status);
    const confidence = Math.min(
      1.0,
      (authorityRank[topAssertion.authorityClass] / 100) * 0.8 +
        Math.min(0.2, corroborators.length * 0.05)
    );

    return {
      resolvedStatus: topAssertion.status,
      confidenceScore: Math.round(confidence * 100) / 100,
      isAuthoritative: authorityRank[topAssertion.authorityClass] >= 75,
      activeAssertion: {
        ...topAssertion,
        corroborationCount: corroborators.length + 1,
      },
      corroboratingAssertions: corroborators,
      warnings:
        confidence < 0.7
          ? ["Status has low corroboration confidence. Consider probing health endpoint."]
          : [],
      lastVerifiedAt: topAssertion.observedAt,
    };
  }
}

export const runningStateResolver = new RunningStateResolverEngine();
