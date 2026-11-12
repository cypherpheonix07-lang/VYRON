// ============================================================================
// FILE 3: src/components/connectors/github/GitHubConnectorHub.tsx
// MODULE S27 — Complete Implementation of Subcomponents S27.1 through S27.8
// ============================================================================
import React, { useState } from 'react';
import {
  ArrowLeftRight,
  GitCommit,
  GitPullRequest,
  Github,
  KeyRound,
  Link2,
  Search,
  ShieldCheck,
  Unlink,
  Webhook,
} from 'lucide-react';
import {
  GlassCard3D,
  ConnectionStatusPill,
  ProvenanceBadge,
  SectionStateBoundary,
} from '../ConnectorGlassPrimitives';
import type {
  BoundRepository,
  CommitScanFinding,
  ConnectorConnectionStatus,
  PullRequestAnalysis,
  SectionState,
} from '@/types/connectors';

interface GitHubHubPayload {
  account: {
    status: ConnectorConnectionStatus;
    login: string;
    scopes: string[];
    tokenExpiresAt: string;
  };
  availableRepos: Array<{
    githubRepoId: number;
    owner: string;
    name: string;
    fullName: string;
    defaultBranch: string;
    isPrivate: boolean;
  }>;
  boundRepos: BoundRepository[];
  pullRequests: PullRequestAnalysis[];
  commitFindings: CommitScanFinding[];
  webhook: {
    id: string;
    url: string;
    events: string[];
    signatureVerified: boolean;
    debounceMs: number;
    correlatedModules: string[];
    lastDeliveryId: string;
  };
}

export const GitHubConnectorHub: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [repoSearch, setRepoSearch] = useState('');
  const [state, setState] = useState<SectionState<GitHubHubPayload>>({
    status: 'success',
    analyzedAt: new Date().toISOString(),
    data: {
      account: {
        status: 'connected',
        login: 'phanindhra-dev',
        scopes: ['repo:status', 'read:org', 'admin:repo_hook'],
        tokenExpiresAt: '2026-12-15T00:00:00Z',
      },
      availableRepos: [
        {
          githubRepoId: 882104,
          owner: 'vyron-org',
          name: 'vyron-core-platform',
          fullName: 'vyron-org/vyron-core-platform',
          defaultBranch: 'main',
          isPrivate: true,
        },
        {
          githubRepoId: 882109,
          owner: 'vyron-org',
          name: 'brahma-analysis-workers',
          fullName: 'vyron-org/brahma-analysis-workers',
          defaultBranch: 'main',
          isPrivate: true,
        },
      ],
      boundRepos: [
        {
          id: 'bound_01',
          projectId,
          githubRepoId: 882104,
          fullName: 'vyron-org/vyron-core-platform',
          defaultBranch: 'main',
          isPrivate: true,
          syncStatus: 'synced',
          issueSyncEnabled: true,
          issueSyncDirection: 'bidirectional',
          branchProtection: {
            protected: true,
            requiredApprovals: 2,
            requireStatusChecks: true,
            allowForcePushes: false,
          },
          lastCommitSha: 'a94f21c',
          lastSyncedAt: '2 mins ago',
        },
      ],
      pullRequests: [
        {
          prNumber: 142,
          title: 'feat(tokens): migrate neon-glass variables to 18-shade volumetric palette',
          author: 'phanindhra-dev',
          changedFiles: 14,
          additions: 480,
          deletions: 195,
          riskScore: 24,
          reviewTimeHours: 1.8,
          hasMergeConflicts: false,
        },
        {
          prNumber: 139,
          title: 'refactor(api): enforce HMAC signature verification on webhook ingress',
          author: 'sec-ops-bot',
          changedFiles: 6,
          additions: 210,
          deletions: 44,
          riskScore: 68,
          reviewTimeHours: 6.4,
          hasMergeConflicts: true,
        },
      ],
      commitFindings: [
        {
          commitSha: 'a94f21c',
          message: 'feat(connectors): add S27–S29 schema contracts',
          conventionalValid: true,
          secretDetected: false,
        },
        {
          commitSha: '7c19e04',
          message: 'quick fix env config',
          conventionalValid: false,
          secretDetected: true,
          secretType: 'SUPABASE_SERVICE_ROLE_PATTERN (REDACTED)',
          filePath: 'scripts/local-seed.ts',
          lineNumber: 18,
        },
      ],
      webhook: {
        id: 'wh_gh_901',
        url: 'https://api.vyron.internal/api/v1/connectors/webhooks/github/wh_gh_901',
        events: ['push', 'pull_request', 'release'],
        signatureVerified: true,
        debounceMs: 2000,
        correlatedModules: ['code_health', 'security_reviewer', 'test_coverage', 'bundle_analyzer'],
        lastDeliveryId: '9f8e7d6c-5b4a-3210',
      },
    },
  });

  const handleBindRepo = (repo: GitHubHubPayload['availableRepos'][number]) => {
    if (state.status !== 'success') return;
    const alreadyBound = state.data.boundRepos.some((b) => b.githubRepoId === repo.githubRepoId);
    if (alreadyBound) return;

    const nextBound: BoundRepository = {
      id: `bound_${repo.githubRepoId}`,
      projectId,
      githubRepoId: repo.githubRepoId,
      fullName: repo.fullName,
      defaultBranch: repo.defaultBranch,
      isPrivate: repo.isPrivate,
      syncStatus: 'syncing',
      issueSyncEnabled: false,
      issueSyncDirection: 'vyron_to_github',
      branchProtection: {
        protected: true,
        requiredApprovals: 1,
        requireStatusChecks: true,
        allowForcePushes: false,
      },
      lastSyncedAt: 'Just now',
    };

    setState({
      ...state,
      data: {
        ...state.data,
        boundRepos: [...state.data.boundRepos, nextBound],
      },
    });
  };

  const handleUnbindRepo = (boundId: string) => {
    if (state.status !== 'success') return;
    setState({
      ...state,
      data: {
        ...state.data,
        boundRepos: state.data.boundRepos.filter((r) => r.id !== boundId),
      },
    });
  };

  const handleToggleIssueSync = (boundId: string) => {
    if (state.status !== 'success') return;
    setState({
      ...state,
      data: {
        ...state.data,
        boundRepos: state.data.boundRepos.map((r) =>
          r.id === boundId ? { ...r, issueSyncEnabled: !r.issueSyncEnabled } : r
        ),
      },
    });
  };

  return (
    <SectionStateBoundary state={state}>
      {(data) => {
        const filteredRepos = data.availableRepos.filter((r) =>
          r.fullName.toLowerCase().includes(repoSearch.toLowerCase())
        );

        return (
          <div className="space-y-6">
            {/* Row 1: S27.1 Account Connection + S27.8 Webhook Manager */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* S27.1 GithubAccountConnector */}
              <GlassCard3D family="teal">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-[#6DA5C0]/40 bg-[#05161A]/75 p-2.5">
                      <Github className="h-5 w-5 text-[#0F969C]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-[#6DA5C0]">S27.1</span>
                        <h3 className="text-base font-semibold text-[#FFFFFF]">
                          GitHub Account Connection
                        </h3>
                      </div>
                      <p className="mt-0.5 text-xs text-[#E2E8F0]">
                        Separate repository OAuth consent · Account: @{data.account.login}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <ConnectionStatusPill status={data.account.status} />
                    <ProvenanceBadge type="live_provider" />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] text-[#94A3B8]">Granted Scopes:</span>
                  {data.account.scopes.map((scope) => (
                    <span
                      key={scope}
                      className="rounded border border-[#6DA5C0]/35 bg-[#05161A]/70 px-2 py-0.5 font-mono text-[11px] text-[#6DA5C0]"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </GlassCard3D>

              {/* S27.8 WebhookManagerPanel */}
              <GlassCard3D family="slate">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-[#94A3B8]/35 bg-[#0F172A]/80 p-2.5">
                      <Webhook className="h-5 w-5 text-[#6DA5C0]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-[#6DA5C0]">S27.8</span>
                        <h3 className="text-base font-semibold text-[#FFFFFF]">
                          Webhook Manager & Push Correlation
                        </h3>
                      </div>
                      <p className="mt-0.5 font-mono text-[11px] text-[#94A3B8]">
                        HMAC-SHA256 Verified · {data.webhook.debounceMs}ms Debounce Window
                      </p>
                    </div>
                  </div>
                  <span className="rounded border border-[#0F969C]/50 bg-[#0C7075]/40 px-2 py-0.5 font-mono text-[10px] text-[#F8FAFC]">
                    DEDUP ACTIVE
                  </span>
                </div>

                <div className="mt-3 rounded-lg border border-[#334155] bg-[#0B0B0B]/70 p-2.5 font-mono text-[11px] text-[#E2E8F0]">
                  {data.webhook.url}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[11px] text-[#94A3B8]">
                    github.push → triggers:
                  </span>
                  {data.webhook.correlatedModules.map((mod) => (
                    <span
                      key={mod}
                      className="rounded bg-[#294D61]/55 px-2 py-0.5 font-mono text-[10px] text-[#F8FAFC]"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </GlassCard3D>
            </div>

            {/* Row 2: S27.2 Repository Browser + S27.3 Bound Repos & S27.7 Issue Sync */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* S27.2 RepositoryBrowserPanel */}
              <GlassCard3D family="obsidian">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-[11px] text-[#6DA5C0]">S27.2</span>
                    <h3 className="text-base font-semibold text-[#FFFFFF]">Repository Browser</h3>
                  </div>
                  <div className="relative w-56">
                    <Search className="pointer-events-none absolute top-2.5 left-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={repoSearch}
                      onChange={(e) => setRepoSearch(e.target.value)}
                      placeholder="Filter accessible repos..."
                      className="w-full rounded-lg border border-[#333333] bg-[#0B0B0B]/80 py-1.5 pr-3 pl-8 text-xs text-[#F8FAFC] placeholder-[#6B6B6B] focus:border-[#0F969C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  {filteredRepos.map((repo) => {
                    const isBound = data.boundRepos.some(
                      (b) => b.githubRepoId === repo.githubRepoId
                    );
                    return (
                      <div
                        key={repo.githubRepoId}
                        className="flex items-center justify-between rounded-lg border border-[#333333]/80 bg-[#1A1A1A]/75 px-3.5 py-2.5"
                      >
                        <div>
                          <p className="font-mono text-xs font-semibold text-[#F8FAFC]">
                            {repo.fullName}
                          </p>
                          <p className="font-mono text-[11px] text-[#94A3B8]">
                            branch: {repo.defaultBranch} · {repo.isPrivate ? 'private' : 'public'}
                          </p>
                        </div>
                        <button
                          disabled={isBound}
                          onClick={() => handleBindRepo(repo)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                            isBound
                              ? 'cursor-default border-[#334155] bg-[#1A1A1A] text-[#6B6B6B]'
                              : 'border-[#6DA5C0]/50 bg-[#0C7075]/65 text-[#FFFFFF] hover:bg-[#0F969C]/75'
                          }`}
                        >
                          <Link2 className="h-3.5 w-3.5" />
                          {isBound ? 'Bound' : 'Bind Project'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </GlassCard3D>

              {/* S27.3 BoundRepoList + S27.6 BranchProtectionAudit + S27.7 IssueSyncConfig */}
              <GlassCard3D family="slate">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[11px] text-[#6DA5C0]">
                      S27.3 · S27.6 · S27.7
                    </span>
                    <h3 className="text-base font-semibold text-[#FFFFFF]">
                      Bound Repositories, Branch Protection & Issue Sync
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {data.boundRepos.map((bound) => (
                    <div
                      key={bound.id}
                      className="space-y-3 rounded-lg border border-[#64748B]/40 bg-[#0F172A]/75 p-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono text-xs font-bold text-[#FFFFFF]">
                            {bound.fullName}
                          </p>
                          <p className="font-mono text-[11px] text-[#94A3B8]">
                            HEAD {bound.lastCommitSha ?? 'pending'} · synced {bound.lastSyncedAt}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-[#0C7075]/50 px-2 py-0.5 font-mono text-[10px] text-[#F8FAFC] uppercase">
                            {bound.syncStatus}
                          </span>
                          <button
                            onClick={() => handleUnbindRepo(bound.id)}
                            title="Unbind repository"
                            className="rounded border border-[#64748B]/40 p-1 text-[#94A3B8] hover:text-[#FFFFFF]"
                          >
                            <Unlink className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* S27.6 Branch Protection Summary */}
                      <div className="flex flex-wrap items-center gap-2 border-t border-[#334155]/80 pt-2.5 text-[11px]">
                        <ShieldCheck className="h-4 w-4 text-[#0F969C]" />
                        <span className="text-[#E2E8F0]">
                          Branch Protection ({bound.defaultBranch}):
                        </span>
                        <span className="rounded bg-[#334155]/70 px-2 py-0.5 font-mono text-[10px] text-[#F8FAFC]">
                          {bound.branchProtection.requiredApprovals} approvals req
                        </span>
                        <span className="rounded bg-[#334155]/70 px-2 py-0.5 font-mono text-[10px] text-[#F8FAFC]">
                          force-push:{' '}
                          {bound.branchProtection.allowForcePushes ? 'allowed' : 'blocked'}
                        </span>
                      </div>

                      {/* S27.7 Bi-Directional Issue Sync Control */}
                      <div className="flex items-center justify-between border-t border-[#334155]/80 pt-2.5">
                        <div className="flex items-center gap-2 text-xs text-[#E2E8F0]">
                          <ArrowLeftRight className="h-3.5 w-3.5 text-[#6DA5C0]" />
                          <span>Risk Flag ↔ GitHub Issues ({bound.issueSyncDirection})</span>
                        </div>
                        <button
                          onClick={() => handleToggleIssueSync(bound.id)}
                          className={`rounded-full border px-3 py-0.5 font-mono text-[10px] font-semibold transition-all ${
                            bound.issueSyncEnabled
                              ? 'border-[#0F969C] bg-[#0C7075]/60 text-[#FFFFFF]'
                              : 'border-[#64748B]/50 bg-[#1A1A1A] text-[#94A3B8]'
                          }`}
                        >
                          {bound.issueSyncEnabled ? 'SYNC ON' : 'SYNC OFF'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard3D>
            </div>

            {/* Row 3: S27.4 PR Analyzer + S27.5 Commit Scanner (Redacted Secrets) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* S27.4 PrAnalyzerPanel */}
              <GlassCard3D family="slate">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4 text-[#0F969C]" />
                  <span className="font-mono text-[11px] text-[#6DA5C0]">S27.4</span>
                  <h3 className="text-base font-semibold text-[#FFFFFF]">Pull Request Analyzer</h3>
                </div>

                <div className="mt-4 space-y-2.5">
                  {data.pullRequests.map((pr) => (
                    <div
                      key={pr.prNumber}
                      className="rounded-lg border border-[#334155] bg-[#0F172A]/80 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-[#F8FAFC]">
                          <span className="font-mono text-[#6DA5C0]">#{pr.prNumber}</span>{' '}
                          {pr.title}
                        </p>
                        <span
                          className={`shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                            pr.riskScore >= 60
                              ? 'bg-[#294D61] text-[#FFFFFF]'
                              : 'bg-[#0C7075]/50 text-[#E2E8F0]'
                          }`}
                        >
                          RISK {pr.riskScore}/100
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[11px] text-[#94A3B8]">
                        <span>@{pr.author}</span>
                        <span>{pr.changedFiles} files</span>
                        <span>
                          +{pr.additions} / -{pr.deletions}
                        </span>
                        <span>review: {pr.reviewTimeHours}h</span>
                        {pr.hasMergeConflicts && (
                          <span className="text-[#FFFFFF] underline">MERGE CONFLICT</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard3D>

              {/* S27.5 CommitScannerPanel */}
              <GlassCard3D family="obsidian">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitCommit className="h-4 w-4 text-[#6DA5C0]" />
                    <span className="font-mono text-[11px] text-[#6DA5C0]">S27.5</span>
                    <h3 className="text-base font-semibold text-[#FFFFFF]">
                      Commit & Secret Scanner
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-[#94A3B8]">
                    SECRET VALUES REDACTED
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {data.commitFindings.map((commit) => (
                    <div
                      key={commit.commitSha}
                      className="rounded-lg border border-[#333333] bg-[#1A1A1A]/80 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-[#6DA5C0]">
                          {commit.commitSha}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                              commit.conventionalValid
                                ? 'bg-[#0C7075]/45 text-[#E2E8F0]'
                                : 'bg-[#333333] text-[#D9D9D9]'
                            }`}
                          >
                            {commit.conventionalValid ? 'CONVENTIONAL OK' : 'NON-CONVENTIONAL'}
                          </span>
                          {commit.secretDetected && (
                            <span className="inline-flex items-center gap-1 rounded border border-[#D9D9D9]/50 bg-[#0B0B0B] px-2 py-0.5 font-mono text-[10px] font-bold text-[#FFFFFF]">
                              <KeyRound className="h-3 w-3" />
                              SECRET FLAGGED
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="mt-1.5 text-xs text-[#F8FAFC]">{commit.message}</p>
                      {commit.secretDetected && (
                        <p className="mt-1.5 font-mono text-[11px] text-[#D9D9D9]">
                          Type: {commit.secretType} · {commit.filePath}:{commit.lineNumber}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard3D>
            </div>
          </div>
        );
      }}
    </SectionStateBoundary>
  );
};
