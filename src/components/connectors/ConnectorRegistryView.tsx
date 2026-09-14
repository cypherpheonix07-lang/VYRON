import React, { useState, useEffect, useCallback } from "react";
import {
  Plug,
  Shield,
  Lock,
  Unlock,
  Clock,
  Activity,
  FolderGit2,
  Trash2,
  ExternalLink,
  GitBranch,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  connectorStore,
  ConnectorState,
  AuditLogEntry,
} from "@/state/connectors/connectorStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { InlineCopilotAssistant } from "@/components/copilot/InlineCopilotAssistant";
import { GitHubConnectorCard } from "@/components/github/GitHubConnectorCard";
import {
  GitHubAccountSelector,
  type GitHubAccountItem,
} from "@/components/github/GitHubAccountSelector";
import { GitHubRepoSelector } from "@/components/github/GitHubRepoSelector";
import type { GitHubRepoItem } from "@/components/github/GitHubRepoCard";
import { fetchConnectedAccounts } from "@/lib/github/api";
import { initiateGitHubOAuth, revokeGitHubToken } from "@/lib/github/oauth";
import { useProjects, type Project } from "@/hooks/useProjects";
import { useRepoBinding } from "@/hooks/useRepoBinding";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface BoundRepoSummary {
  id: string;
  project_id: string;
  repo_full_name: string;
  default_branch: string;
  private: boolean;
  language: string | null;
  sync_status: string;
  last_synced_at: string | null;
}

export function ConnectorRegistryView({ className }: { className?: string }) {
  const [connectors, setConnectors] = useState<ConnectorState[]>(() =>
    connectorStore.getConnectors(),
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => connectorStore.getAuditLogs());
  const [selectedConnectorId, setSelectedConnectorId] = useState<string>("github");

  // GitHub Connector State
  const [accounts, setAccounts] = useState<GitHubAccountItem[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [linkedRepos, setLinkedRepos] = useState<BoundRepoSummary[]>([]);
  const [accountSelectorOpen, setAccountSelectorOpen] = useState(false);
  const [repoSelectorOpen, setRepoSelectorOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<GitHubAccountItem | null>(null);

  const { projects } = useProjects();
  const { link, unlink, isLinking, isUnlinking } = useRepoBinding();
  const { isDemo } = useDemoMode();

  // Selected project for linking (defaults to first project if available)
  const activeProject: Project | undefined = projects[0];

  useEffect(() => {
    return connectorStore.subscribe((state) => {
      setConnectors(Object.values(state.connectors));
      setAuditLogs([...state.auditLogs]);
    });
  }, []);

  const loadGitHubData = useCallback(async () => {
    setAccountsLoading(true);
    try {
      const accs = await fetchConnectedAccounts();
      setAccounts(accs);
      if (accs.length > 0 && !selectedAccount) {
        setSelectedAccount(accs[0] ?? null);
      }

      // Fetch linked repos
      const { data: repoData, error: repoErr } = await supabase
        .from("project_repos")
        .select("id, project_id, repo_full_name, default_branch, private, language, sync_status, last_synced_at")
        .order("created_at", { ascending: false });

      if (!repoErr && repoData) {
        setLinkedRepos(repoData as BoundRepoSummary[]);
      }
    } catch (err) {
      console.warn("Failed to load GitHub connector details:", err);
    } finally {
      setAccountsLoading(false);
    }
  }, [selectedAccount]);

  useEffect(() => {
    loadGitHubData();
  }, [loadGitHubData]);

  const selectedConnector = connectors.find((c) => c.id === selectedConnectorId) || connectors[0];

  const handleToggleConnector = (id: string, currentEnabled: boolean) => {
    connectorStore.toggleConnector(id, !currentEnabled);
  };

  const handleToggleToolAuth = (connectorId: string, toolName: string, currentAuth: boolean) => {
    connectorStore.setToolAuthorization(connectorId, toolName, !currentAuth);
  };

  const handleConnectGitHub = () => {
    initiateGitHubOAuth(window.location.pathname);
  };

  const handleDisconnectGitHub = async () => {
    try {
      await revokeGitHubToken();
      setAccounts([]);
      setSelectedAccount(null);
      setLinkedRepos([]);
      toast.info("GitHub account disconnected", {
        description: "Credentials revoked and local identity associations removed.",
      });
    } catch {
      toast.error("Failed to disconnect GitHub account");
    }
  };

  const handleAddRepositoryClick = () => {
    if (accounts.length === 0) {
      handleConnectGitHub();
      return;
    }
    if (accounts.length === 1) {
      setSelectedAccount(accounts[0] ?? null);
      setRepoSelectorOpen(true);
    } else {
      setAccountSelectorOpen(true);
    }
  };

  const handleAccountSelected = (acc: GitHubAccountItem) => {
    setSelectedAccount(acc);
    setAccountSelectorOpen(false);
    setRepoSelectorOpen(true);
  };

  const handleLinkRepositories = async (selectedRepos: GitHubRepoItem[]) => {
    const targetProjectId = activeProject?.id || "default-global-project";
    const targetAccountId = selectedAccount?.id || accounts[0]?.id || "default-account";

    await link(targetProjectId, targetAccountId, selectedRepos);
    setRepoSelectorOpen(false);
    await loadGitHubData();
  };

  const handleUnlinkRepo = async (repoId: string, repoName: string) => {
    try {
      await unlink(repoId);
      setLinkedRepos((prev) => prev.filter((r) => r.id !== repoId));
      toast.success(`Unlinked repository ${repoName}`);
    } catch (err) {
      toast.error(`Failed to unlink ${repoName}`, {
        description: (err as Error).message,
      });
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Plug className="size-5 text-primary" />
            <span>MCP Connector Registry & Authorization Governance</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage Model Context Protocol (MCP) integrations with granular READ/WRITE and
            SAFE/HIGH-IMPACT authorization controls
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDemo && (
            <Badge variant="outline" className="text-[10px] bg-amber-500/15 text-amber-400 border-amber-500/30 flex items-center gap-1 font-bold">
              <Sparkles className="size-3" />
              <span>SIMULATED SANDBOX</span>
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">Connected Services:</span>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/20 text-primary">
            {connectors.filter((c) => c.isEnabled).length} / {connectors.length} ACTIVE
          </span>
        </div>
      </div>

      {/* Embedded Contextual Copilot Intelligence */}
      <InlineCopilotAssistant pageContext="connectors" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Connector Cards */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            Registered Connectors
          </h3>
          {connectors.map((c) => {
            const isSelected = c.id === selectedConnectorId;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedConnectorId(c.id)}
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer space-y-2",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                    : "border-border/40 bg-card/50 hover:bg-card/80",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-secondary text-primary font-bold text-xs">
                      {c.type.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground">{c.name}</h4>
                        {isDemo && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
                            SIMULATED
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {c.tools.length} exposed MCP tools
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleConnector(c.id, c.isEnabled);
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-bold border transition-colors",
                      c.isEnabled
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : "bg-zinc-800 text-zinc-500 border-zinc-700",
                    )}
                  >
                    {c.isEnabled ? "ENABLED" : "DISABLED"}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">{c.description}</p>
              </div>
            );
          })}
        </div>

        {/* Right: Connector Hub Panel & Tool Permissions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active GitHub Connector First-Class Integration */}
          {selectedConnectorId === "github" && (
            <div className="space-y-4">
              <GitHubConnectorCard
                accounts={accounts}
                isLoading={accountsLoading}
                onConnectGitHub={handleConnectGitHub}
                onAddRepository={handleAddRepositoryClick}
                onDisconnect={handleDisconnectGitHub}
              />

              {/* Linked Repositories Overview */}
              {linkedRepos.length > 0 && (
                <div className="p-4 rounded-xl border border-border/50 bg-card/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="size-4 text-primary" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Bound Codebases ({linkedRepos.length})
                      </h4>
                    </div>
                    <Badge variant="outline" className="border-border text-[10px] font-mono">
                      Webhook Automated
                    </Badge>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {linkedRepos.map((repo) => (
                      <div
                        key={repo.id}
                        className="p-3 rounded-lg border border-border/40 bg-zinc-950/60 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground font-mono">
                              {repo.repo_full_name}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] font-mono",
                                repo.sync_status === "synced"
                                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                                  : "border-amber-500/30 text-amber-400 bg-amber-500/10",
                              )}
                            >
                              {repo.sync_status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                            <span className="flex items-center gap-1">
                              <GitBranch className="size-3 text-muted-foreground" />
                              {repo.default_branch || "main"}
                            </span>
                            {repo.language && (
                              <span className="text-primary">{repo.language}</span>
                            )}
                            {repo.last_synced_at && (
                              <span>Synced: {new Date(repo.last_synced_at).toLocaleTimeString()}</span>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isUnlinking}
                          onClick={() => handleUnlinkRepo(repo.id, repo.repo_full_name)}
                          className="text-muted-foreground hover:text-destructive h-8 px-2"
                          title="Unlink repository"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tool Permissions */}
          {selectedConnector && (
            <div className="p-5 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/30">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Shield className="size-4 text-primary" />
                    <span>Tool Authorizations: {selectedConnector.name}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Toggle fine-grained execution permission per tool
                  </p>
                </div>
              </div>

              <div className="divide-y divide-border/20">
                {selectedConnector.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">{tool.name}</span>
                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded text-[10px] font-bold font-mono",
                            tool.access === "READ"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-purple-500/20 text-purple-300 border border-purple-500/30",
                          )}
                        >
                          {tool.access}
                        </span>
                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded text-[10px] font-bold font-mono",
                            tool.impact === "SAFE"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30",
                          )}
                        >
                          {tool.impact}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">{tool.description}</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleToggleToolAuth(selectedConnector.id, tool.name, tool.isAuthorized)
                      }
                      className={cn(
                        "h-7 text-xs font-semibold shrink-0 gap-1",
                        tool.isAuthorized
                          ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                          : "border-zinc-700 text-zinc-500 hover:bg-zinc-800",
                      )}
                    >
                      {tool.isAuthorized ? (
                        <>
                          <Unlock className="size-3" /> Authorized
                        </>
                      ) : (
                        <>
                          <Lock className="size-3" /> Locked
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Logs */}
          <div className="p-5 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-border/30">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Connector Audit Trail</h3>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {auditLogs.length} logged calls
              </span>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No connector tool executions recorded yet.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg border border-border/30 bg-background/40 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">{log.toolName}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {log.connectorId}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        Hash:{" "}
                        {log.verificationHash ? log.verificationHash.slice(0, 16) + "..." : "none"}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {log.durationMs}ms
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded font-mono text-[10px] font-bold",
                          log.status === "SUCCESS"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30",
                        )}
                      >
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Selector Dialog */}
      <GitHubAccountSelector
        open={accountSelectorOpen}
        accounts={accounts}
        onSelect={handleAccountSelected}
        onClose={() => setAccountSelectorOpen(false)}
      />

      {/* Repository Selector Dialog */}
      {selectedAccount && (
        <GitHubRepoSelector
          open={repoSelectorOpen}
          account={selectedAccount}
          projectId={activeProject?.id || "default-global-project"}
          onLink={handleLinkRepositories}
          onClose={() => setRepoSelectorOpen(false)}
        />
      )}
    </div>
  );
}
