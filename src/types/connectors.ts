// ============================================================================
// src/types/connectors.ts — Complete S27–S29 Contracts & Realtime Events
// ============================================================================

export type ProviderId =
  | 'github'
  | 'jira'
  | 'linear'
  | 'slack'
  | 'datadog'
  | 'sentry'
  | 'figma'
  | 'kaggle'
  | 'custom_webhook';

// Resolves missing LockReason referenced in SectionState<T>
export type LockReason =
  | { code: 'phase_gate_blocked'; gateId: string; requiredPhase: string }
  | { code: 'missing_permission'; requiredRole: string }
  | { code: 'provider_disconnected'; provider: ProviderId }
  | { code: 'no_project_selected' };

// Differentiated UI states required by Part G Section 3.1
export type ConnectorConnectionStatus =
  | 'unconnected'
  | 'connecting'
  | 'connected'
  | 'syncing'
  | 'stale'
  | 'limited_scope'
  | 'permission_denied'
  | 'failed';

export interface SectionError {
  code: string;
  message: string;
  retryable: boolean;
  retryAfter?: number;
  context?: Record<string, unknown>;
}

export type SectionState<T> =
  | { status: 'idle' }
  | { status: 'loading'; progress?: number; stage?: string }
  | { status: 'streaming'; partialData: Partial<T>; model: string }
  | { status: 'success'; data: T; analyzedAt: string }
  | { status: 'stale'; data: T; staleSince: string }
  | { status: 'error'; error: SectionError; data?: T }
  | { status: 'locked'; reason: LockReason }
  | { status: 'no_data'; cta: string };

// ----------------------------------------------------------------------------
// S27: GitHub Connector Hub Models (S27.1–S27.8)
// ----------------------------------------------------------------------------
export interface BoundRepository {
  id: string;
  projectId: string;
  githubRepoId: number;
  fullName: string;
  defaultBranch: string;
  isPrivate: boolean;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'stale' | 'error';
  issueSyncEnabled: boolean;
  issueSyncDirection: 'vyron_to_github' | 'bidirectional';
  branchProtection: {
    protected: boolean;
    requiredApprovals: number;
    requireStatusChecks: boolean;
    allowForcePushes: boolean;
  };
  lastCommitSha?: string;
  lastSyncedAt?: string;
}

export interface PullRequestAnalysis {
  prNumber: number;
  title: string;
  author: string;
  changedFiles: number;
  additions: number;
  deletions: number;
  riskScore: number; // 0–100
  reviewTimeHours: number;
  hasMergeConflicts: boolean;
}

export interface CommitScanFinding {
  commitSha: string;
  message: string;
  conventionalValid: boolean;
  secretDetected: boolean;
  secretType?: string; // e.g., 'AWS_KEY' — raw secret value NEVER transmitted
  filePath?: string;
  lineNumber?: number;
}

// ----------------------------------------------------------------------------
// S28: Integrations Marketplace Models (S28.1–S28.8)
// ----------------------------------------------------------------------------
export interface MarketplaceIntegration {
  id: string;
  provider: Exclude<ProviderId, 'github' | 'kaggle'>;
  name: string;
  category: 'issue_tracking' | 'messaging' | 'observability' | 'design' | 'webhook';
  implemented: boolean; // Prevents advertising unbuilt connectors as live
  connectionStatus: ConnectorConnectionStatus;
  accessMode: 'read' | 'read_write';
  grantedScopes: string[];
  lastSyncedAt?: string;
  configSummary?: Record<string, string>;
}

// ----------------------------------------------------------------------------
// S29: Dataset Manager Models (S29.1–S29.8)
// ----------------------------------------------------------------------------
export interface DatasetColumnSchema {
  name: string;
  dataType: 'string' | 'number' | 'boolean' | 'datetime' | 'json';
  nullable: boolean;
  nullPercentage: number;
  sampleValues: Array<string | number | boolean | null>;
}

export interface ProjectDataset {
  id: string;
  projectId: string;
  name: string;
  provenanceType: 'kaggle' | 'upload' | 'synthetic';
  sourceRef?: string;
  isSynthetic: boolean;
  fileFormat: 'csv' | 'json' | 'xlsx' | 'parquet';
  sizeBytes: number;
  rowCount: number;
  scanStatus: 'pending' | 'clean' | 'quarantined' | 'failed';
  version: number;
  schema: DatasetColumnSchema[];
  qualityReport: {
    inspectionMethod: 'full_scan' | 'sample_scan';
    inspectedRows: number;
    missingCellRate: number;
    outlierCount: number;
    typeMismatchCount: number;
  };
  boundModules: string[];
  updatedAt: string;
}

// ----------------------------------------------------------------------------
// Supabase Realtime Channel Contracts (Closes Gap 6)
// ----------------------------------------------------------------------------
export type ConnectorRealtimeEvent =
  | {
      type: 'connector.status_changed';
      provider: ProviderId;
      status: ConnectorConnectionStatus;
      timestamp: string;
    }
  | {
      type: 'github.push_correlated';
      repoFullName: string;
      commitSha: string;
      affectedSections: Array<'code_health' | 'security_reviewer' | 'test_coverage' | 'bundle_analyzer'>;
      debounceMs: 2000;
    }
  | {
      type: 'dataset.ingestion_updated';
      datasetId: string;
      scanStatus: ProjectDataset['scanStatus'];
      rowCount?: number;
    };
