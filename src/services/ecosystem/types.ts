/**
 * VYRON — GITHUB PORTFOLIO + VIBE-CODING ECOSYSTEM CONTROL PLANE
 * Canonical Domain Types, Status Models, and Contracts
 * GOD MODE vULTIMA vNEXT — Strictly ZERO SQL.
 */

// --- Standard Status Models (Sections 8 & 10) ---
export type ExecutionStatus =
  | "NOT_STARTED"
  | "WAITING"
  | "READY"
  | "RUNNING"
  | "VERIFYING"
  | "PASSED"
  | "PARTIAL"
  | "BLOCKED"
  | "FAILED"
  | "VERIFIED"
  | "STALE"
  | "INVALIDATED";

export type IntegrationHealthStatus =
  | "DISCOVERED"
  | "USER_REVIEW_REQUIRED"
  | "AUTHORIZING"
  | "CONNECTED"
  | "SYNCING"
  | "HEALTHY"
  | "DEGRADED"
  | "REVOKED";

export type FreshnessState =
  | "LIVE"
  | "FRESH"
  | "DELAYED"
  | "STALE"
  | "UNKNOWN"
  | "BLOCKED"
  | "FALLBACK";

// --- Epistemic Taxonomy ---
export type EpistemicClassification =
  | "FACT"
  | "OBSERVATION"
  | "DERIVED_FACT"
  | "INFERENCE"
  | "HYPOTHESIS"
  | "ASSUMPTION"
  | "PREDICTION"
  | "SIMULATION_RESULT"
  | "RECOMMENDATION"
  | "UNKNOWN"
  | "STALE"
  | "CONTRADICTED";

// --- Supported Ecosystem Providers ---
export type VibeProviderId =
  | "github"
  | "lovable"
  | "v0"
  | "bolt"
  | "replit"
  | "cursor"
  | "windsurf"
  | "devin"
  | "claude_code";

export type ProviderCapability =
  | "REPOSITORY_SYNC"
  | "PROMPT_TRACKING"
  | "AGENT_RUNS"
  | "BUILD_STREAM"
  | "PREVIEW_URLS"
  | "DEPLOYMENT_SYNC"
  | "WEBHOOK_INGESTION"
  | "MCP_TOOL_DISCOVERY"
  | "BRANCH_LINEAGE";

export type CapabilitySupportLevel =
  | "SUPPORTED"
  | "PARTIAL"
  | "UNSUPPORTED"
  | "UNAVAILABLE"
  | "UNKNOWN"
  | "DEPRECATED";

// --- Canonical Identity Graph Entities ---
export interface GitHubAccountEntity {
  id: string; // e.g. "gh-user-123456"
  login: string;
  name: string;
  avatarUrl: string;
  type: "User" | "Organization";
  installationId?: number;
  selectedRepoCount: number;
  totalRepoCount: number;
  permissions: Record<string, string>;
  isEnrolled: boolean;
  connectedAt: string;
  lastSyncAt: string;
}

export interface EnrolledRepositoryEntity {
  id: string; // e.g. "repo-owner/name"
  githubRepoId: number;
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string;
  isPrivate: boolean;
  isArchived: boolean;
  isFork: boolean;
  htmlUrl: string;
  cloneUrl: string;
  description: string;
  topics: string[];
  starsCount: number;
  forksCount: number;
  openIssuesCount: number;
  healthScore: number; // 0 - 100
  enrollmentStatus: "ENROLLED" | "PENDING_CONSENT" | "OFFBOARDED" | "ARCHIVED";
  connectedVibePlatforms: VibeProviderId[];
  freshness: FreshnessState;
  lastEventAt: string;
  lastReconciledAt: string;
  astDriftScore: number; // 0 - 100
}

export interface VibePlatformProjectEntity {
  id: string;
  provider: VibeProviderId;
  projectId: string;
  projectName: string;
  associatedRepoFullName: string;
  associatedBranch: string;
  previewUrl?: string;
  productionUrl?: string;
  activeAgentRunsCount: number;
  latestPromptSnippet?: string;
  healthState: IntegrationHealthStatus;
  capabilities: Record<ProviderCapability, CapabilitySupportLevel>;
  lastSyncedAt: string;
}

export interface VibeAgentRunEntity {
  id: string;
  provider: VibeProviderId;
  repoFullName: string;
  runIdentifier: string;
  agentName: string;
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  prompt: string;
  durationMs: number;
  filesModified: string[];
  commitSha?: string;
  previewUrl?: string;
  startedAt: string;
  completedAt?: string;
  epistemicState: EpistemicClassification;
}

// --- Provider Health & SLOs ---
export interface ProviderHealthSlo {
  provider: VibeProviderId;
  displayName: string;
  healthState: IntegrationHealthStatus;
  freshnessState: FreshnessState;
  latencyMs: number;
  lastAuthCheckAt: string;
  lastEventReceivedAt: string;
  eventLagMs: number;
  reconciliationAgeMinutes: number;
  rateLimitRemainingPercent: number;
  errorBudgetRemainingPercent: number;
  activeWarnings: string[];
}

// --- Event Gateway & Normalization ---
export interface NormalizedEcosystemEvent {
  eventId: string;
  correlationId: string;
  provider: VibeProviderId;
  eventType:
    | "INSTALLATION_REPOS_ADDED"
    | "INSTALLATION_REPOS_REMOVED"
    | "PUSH"
    | "PULL_REQUEST"
    | "WORKFLOW_RUN"
    | "DEPLOYMENT"
    | "AGENT_RUN_STARTED"
    | "AGENT_RUN_COMPLETED"
    | "VIBE_PREVIEW_GENERATED"
    | "SECURITY_ALERT";
  repoFullName?: string;
  actor: {
    login: string;
    avatarUrl?: string;
    isBot: boolean;
  };
  payload: Record<string, unknown>;
  sequenceWatermark: number;
  receivedAt: string;
  processedAt: string;
  isReplayed: boolean;
  sha256Proof: string;
}

// --- Consent & Auto-Connect ---
export interface AutoConnectCandidate {
  candidateId: string;
  provider: VibeProviderId;
  detectedVia: "GITHUB_TOPIC" | "PROVIDER_FILE" | "BOT_COMMIT" | "PREVIEW_DOMAIN" | "EXPLICIT_CONFIG";
  confidenceScore: number; // 0.0 to 1.0 (>= 0.8 eligible)
  evidenceDetails: string[];
  associatedRepoFullName: string;
  suggestedScopes: string[];
  consentStatus: "PENDING_USER_REVIEW" | "AUTHORIZED" | "SUPPRESSED";
  detectedAt: string;
}

export interface ConsentAuthorizationRecord {
  recordId: string;
  provider: VibeProviderId;
  authorizedByUserId: string;
  grantedScopes: string[];
  isRevoked: boolean;
  grantedAt: string;
  expiresAt?: string;
  revokedAt?: string;
  auditHash: string;
}
