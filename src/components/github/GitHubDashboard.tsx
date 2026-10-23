import { useState, useEffect, useCallback } from "react";
import {
  githubService,
  GitHubUserProfile,
  GitHubRepoItem,
  GitHubEventItem,
  GitHubOrgItem,
  RateLimitStatus,
} from "@/services/githubService";
import { GitHubOverview } from "./GitHubOverview";
import { GitHubRepoList } from "./GitHubRepoList";
import { GitHubRepoDetail } from "./GitHubRepoDetail";
import { GitHubActivityFeed } from "./GitHubActivityFeed";
import { authService } from "@/services/authService";
import {
  Github,
  LayoutDashboard,
  FolderGit2,
  Building,
  Activity,
  Star,
  RefreshCw,
  Clock,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Lock,
  Key,
  LogOut,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  FolderOpen,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MultiRepoSelectModal } from "./MultiRepoSelectModal";
import { WorkspaceFolderTree } from "./WorkspaceFolderTree";
import { workspaceRepoStore } from "@/state/workspace/workspaceRepoStore";
import { initiateGitHubOAuth } from "@/lib/github/oauth";

export function GitHubDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "repos" | "orgs" | "activity" | "starred" | "workspace-folders"
  >("workspace-folders");
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepoItem | null>(null);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [organizedCount, setOrganizedCount] = useState(() =>
    workspaceRepoStore.getTotalRepoCount(),
  );

  useEffect(() => {
    return workspaceRepoStore.subscribe(() => {
      setOrganizedCount(workspaceRepoStore.getTotalRepoCount());
    });
  }, []);

  const [now, setNow] = useState(() => Date.now());

  // Data States
  const [profile, setProfile] = useState<GitHubUserProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepoItem[]>([]);
  const [events, setEvents] = useState<GitHubEventItem[]>([]);
  const [orgs, setOrgs] = useState<GitHubOrgItem[]>([]);
  const [rateLimit, setRateLimit] = useState<RateLimitStatus>(githubService.getRateLimitStatus());

  // Loading & Sync States
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncCountdown, setSyncCountdown] = useState(30);
  const [isConnected, setIsConnected] = useState(false);

  // Direct PAT Connection States
  const [patInput, setPatInput] = useState("");
  const [isSavingPat, setIsSavingPat] = useState(false);
  const [showPatToken, setShowPatToken] = useState(false);
  const [connectionMode, setConnectionMode] = useState<"pat" | "oauth">("pat");

  // Sync data from GitHub
  const fetchData = useCallback(
    async (forceRefresh = false) => {
      try {
        setIsRefreshing(true);
        const hasToken = githubService.hasToken();
        if (!hasToken) {
          setIsConnected(false);
          setProfile(null);
          setRepos([]);
          setOrgs([]);
          setEvents([]);
          return;
        }

        const userProfile = await githubService.fetchUserProfile(forceRefresh);
        if (!userProfile) {
          setIsConnected(false);
          setProfile(null);
          setRepos([]);
          setOrgs([]);
          setEvents([]);
          return;
        }

        setProfile(userProfile);
        setIsConnected(true);

        const [repoList, orgList, eventList] = await Promise.all([
          githubService.fetchRepositories(1, 100, "updated", forceRefresh),
          githubService.fetchOrganizations(forceRefresh),
          githubService.fetchActivityEvents(userProfile.login, 30, forceRefresh),
        ]);

        setRepos(repoList || []);
        setOrgs(orgList || []);
        setEvents(eventList || []);
        setRateLimit(githubService.getRateLimitStatus());
      } catch (err: unknown) {
        console.warn("[GitHubDashboard] Sync error:", err);
        if (!profile) {
          setIsConnected(false);
        }
      } finally {
        setLoading(false);
        setIsRefreshing(false);
        setSyncCountdown(30);
      }
    },
    [profile],
  );

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // 30s Polling countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      setSyncCountdown((prev) => {
        if (prev <= 1) {
          if (isConnected && rateLimit.remaining > 100) {
            fetchData(true);
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, rateLimit.remaining, fetchData]);

  const handleConnectGitHub = async () => {
    const initiated = initiateGitHubOAuth();
    if (!initiated) {
      toast.info("Using Direct Token Connection mode", {
        description:
          "VITE_GITHUB_CLIENT_ID is not configured in .env. Enter your Personal Access Token below for instant repository mirror connection.",
      });
      setConnectionMode("pat");
      const el = document.getElementById("pat-connect-input");
      if (el) el.focus();
    }
  };

  const handleSavePat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!patInput.trim()) {
      toast.error("Please enter your GitHub Personal Access Token.");
      return;
    }

    setIsSavingPat(true);
    toast.loading("Verifying GitHub token...", { id: "gh-token-verify" });
    const res = await githubService.saveToken(patInput);
    setIsSavingPat(false);

    if (res.ok && res.user) {
      toast.success(`Connected as @${res.user.login}!`, { id: "gh-token-verify" });
      setPatInput("");
      await fetchData(true);
      setIsSelectModalOpen(true);
    } else {
      toast.error(res.error || "Failed to verify GitHub token", { id: "gh-token-verify" });
    }
  };

  const handleDisconnect = () => {
    githubService.disconnect();
    setIsConnected(false);
    setProfile(null);
    setRepos([]);
    setOrgs([]);
    setEvents([]);
    toast.info("Disconnected from GitHub account.");
  };

  const handleForceRefresh = () => {
    fetchData(true);
    toast.success("Syncing live GitHub repository catalog...");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* DASHBOARD HEADER */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-xl px-4 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shadow-md">
            <Github className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-foreground tracking-tight">
                GitHub Live Account Mirror
              </h1>
              {isConnected ? (
                <Badge className="h-5 px-1.5 text-[9px] font-mono bg-emerald-950 text-emerald-400 border-emerald-800">
                  SYNCED
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="h-5 px-1.5 text-[9px] font-mono border-amber-800 text-amber-400"
                >
                  DISCONNECTED
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Realtime repository catalog, branch trees, commit ledgers and 1-click clone engine
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Rate Limit Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg border border-border/80 bg-zinc-950/60 font-mono text-[11px]">
            <span className="text-muted-foreground">Rate Limit:</span>
            <span
              className={`font-bold ${rateLimit.remaining < 500 ? "text-amber-400" : "text-cyan-400"}`}
            >
              {rateLimit.remaining}/{rateLimit.limit}
            </span>
            <span className="text-[10px] text-zinc-500">
              (resets in{" "}
              {Math.max(0, Math.round((rateLimit.resetTime.getTime() - now) / 60000))}m)
            </span>
          </div>

          {/* Sync Countdown & Refresh */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" /> Syncing in {syncCountdown}s
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleForceRefresh}
              disabled={isRefreshing}
              className="h-8 px-2.5 text-xs border-border bg-zinc-950/60 text-zinc-300 hover:text-white gap-1.5"
            >
              <RefreshCw
                className={`size-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`}
              />
              <span>Force Sync</span>
            </Button>
          </div>

          {isConnected ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setIsSelectModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-1.5 h-8 shadow-sm"
              >
                <FolderPlus className="size-3.5" />
                <span>Select & Segregate Repos</span>
              </Button>
              {profile?.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt={profile.login}
                  className="size-6 rounded-full border border-zinc-700"
                />
              )}
              <span className="text-xs font-mono font-semibold text-zinc-300">
                @{profile?.login}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="h-8 px-2.5 text-xs border-red-900/60 bg-red-950/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 gap-1.5"
              >
                <LogOut className="size-3.5" />
                <span>Disconnect</span>
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                const el = document.getElementById("pat-connect-input");
                if (el) el.focus();
                else handleConnectGitHub();
              }}
              className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs gap-1.5 h-8"
            >
              <Github className="size-3.5" />
              <span>Connect GitHub</span>
            </Button>
          )}
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-60 shrink-0 border-r border-border/80 bg-zinc-950/40 p-4 space-y-6">
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab("workspace-folders");
                setSelectedRepo(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "workspace-folders" && !selectedRepo
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-zinc-900 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderOpen className="size-4 text-primary" />
                <span>AI Workspace Folders</span>
              </div>
              <Badge variant="outline" className="h-4 px-1 text-[9px] font-mono border-primary/40 text-primary">
                {organizedCount}
              </Badge>
            </button>

            <button
              onClick={() => {
                setActiveTab("overview");
                setSelectedRepo(null);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "overview" && !selectedRepo
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-muted-foreground hover:bg-zinc-900 hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="size-4" />
              <span>Account Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("repos");
                setSelectedRepo(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "repos" && !selectedRepo
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-muted-foreground hover:bg-zinc-900 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="size-4" />
                <span>Repositories</span>
              </div>
              <Badge variant="outline" className="h-4 px-1 text-[9px] font-mono border-border">
                {repos.length}
              </Badge>
            </button>

            <button
              onClick={() => {
                setActiveTab("activity");
                setSelectedRepo(null);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "activity" && !selectedRepo
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-muted-foreground hover:bg-zinc-900 hover:text-foreground"
              }`}
            >
              <Activity className="size-4" />
              <span>Activity Feed</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("orgs");
                setSelectedRepo(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "orgs" && !selectedRepo
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-muted-foreground hover:bg-zinc-900 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building className="size-4" />
                <span>Organizations</span>
              </div>
              <Badge variant="outline" className="h-4 px-1 text-[9px] font-mono border-border">
                {orgs.length}
              </Badge>
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-h-[calc(100vh-60px)] space-y-6">
          {selectedRepo ? (
            <GitHubRepoDetail repo={selectedRepo} onBack={() => setSelectedRepo(null)} />
          ) : activeTab === "workspace-folders" ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-foreground">AI Repository Workspace Folders</h2>
                  <p className="text-xs text-muted-foreground">
                    Repositories organized by AI into internal workspace folders according to project README content.
                  </p>
                </div>
                {isConnected && (
                  <Button
                    size="sm"
                    onClick={() => setIsSelectModalOpen(true)}
                    className="bg-primary text-primary-foreground font-semibold text-xs gap-1.5 h-8 shadow-sm"
                  >
                    <FolderPlus className="size-3.5" />
                    <span>Select Repos to Segregate</span>
                  </Button>
                )}
              </div>
              <WorkspaceFolderTree />
            </div>
          ) : activeTab === "overview" ? (
            profile ? (
              <GitHubOverview
                profile={profile}
                repos={repos}
                events={events}
                onSelectRepo={(r) => setSelectedRepo(r)}
                onNavigateTab={(t) => setActiveTab(t)}
              />
            ) : (
              <div className="p-8 text-center rounded-2xl border border-border bg-zinc-950/60 space-y-6 max-w-lg mx-auto my-8 shadow-xl">
                <div className="size-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mx-auto shadow-md">
                  <Github className="size-8 text-zinc-300" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Connect GitHub Account
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Mirror your repositories, branch trees, commit logs, and activity telemetry in realtime.
                  </p>
                </div>

                {/* Connection Mode Selector */}
                <div className="flex items-center justify-center gap-1 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl w-fit mx-auto text-xs">
                  <button
                    type="button"
                    onClick={() => setConnectionMode("pat")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                      connectionMode === "pat"
                        ? "bg-cyan-500 text-zinc-950 shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Key className="size-3.5" />
                    <span>Personal Access Token</span>
                    <Badge className="h-4 px-1 text-[8px] bg-emerald-950 text-emerald-400 border-emerald-800">
                      Direct
                    </Badge>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConnectionMode("oauth")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                      connectionMode === "oauth"
                        ? "bg-cyan-500 text-zinc-950 shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Github className="size-3.5" />
                    <span>OAuth Sign-In</span>
                  </button>
                </div>

                {connectionMode === "pat" ? (
                  <form onSubmit={handleSavePat} className="space-y-4 text-left">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                        <span>Personal Access Token</span>
                        <a
                          href="https://github.com/settings/tokens/new?scopes=repo,read:user,read:org&description=VYRON%20Workspace"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <span>Generate Token</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                      <div className="relative">
                        <Input
                          id="pat-connect-input"
                          type={showPatToken ? "text" : "password"}
                          value={patInput}
                          onChange={(e) => setPatInput(e.target.value)}
                          placeholder="ghp_... or github_pat_..."
                          className="bg-zinc-900/90 border-zinc-700 text-xs pr-10 font-mono text-zinc-200"
                          disabled={isSavingPat}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPatToken((prev) => !prev)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                        >
                          {showPatToken ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Requires <code className="text-zinc-300">repo</code> and <code className="text-zinc-300">read:user</code> scopes. Direct token authorization avoids OAuth callback issues.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSavingPat || !patInput.trim()}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs h-9 gap-1.5"
                    >
                      {isSavingPat ? (
                        <>
                          <RefreshCw className="size-3.5 animate-spin" />
                          <span>Verifying with GitHub...</span>
                        </>
                      ) : (
                        <>
                          <Key className="size-3.5" />
                          <span>Connect with Token</span>
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl border border-amber-800/60 bg-amber-950/20 text-left space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                        <AlertTriangle className="size-3.5" />
                        <span>OAuth Configuration Notice</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        If GitHub displays a <strong>404 Not Found</strong> during authorization, your Supabase Auth provider currently has an invalid Client ID (e.g. numeric App ID <code className="text-zinc-300">1919453</code>). Use the <strong>Personal Access Token</strong> tab above for instant, 100% reliable connection.
                      </p>
                    </div>

                    <Button
                      onClick={handleConnectGitHub}
                      className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs h-9 gap-2"
                    >
                      <Github className="size-4" />
                      <span>Authorize via GitHub OAuth</span>
                    </Button>
                  </div>
                )}
              </div>
            )
          ) : activeTab === "repos" ? (
            <GitHubRepoList repos={repos} onSelectRepo={(r) => setSelectedRepo(r)} />
          ) : activeTab === "activity" ? (
            <GitHubActivityFeed events={events} />
          ) : activeTab === "orgs" ? (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Connected Organizations ({orgs.length})
              </h3>
              {orgs.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-border bg-zinc-950/60 space-y-2">
                  <Building className="size-8 text-zinc-600 mx-auto" />
                  <p className="text-xs text-zinc-400">
                    No public organizations found on your account.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orgs.map((org) => (
                    <div
                      key={org.id}
                      className="p-4 rounded-xl border border-border bg-zinc-950 flex items-center gap-3"
                    >
                      <img
                        src={org.avatar_url}
                        alt={org.login}
                        className="size-10 rounded-xl border border-zinc-800"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{org.login}</h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">
                          {org.description || "Organization"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      {/* MULTI REPOSITORY SELECTION MODAL */}
      <MultiRepoSelectModal
        open={isSelectModalOpen}
        onOpenChange={setIsSelectModalOpen}
        repositories={repos}
        onImportComplete={() => setActiveTab("workspace-folders")}
      />
    </div>
  );
}
