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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function GitHubDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "repos" | "orgs" | "activity" | "starred"
  >("overview");
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepoItem | null>(null);

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

  // Sync data from GitHub
  const fetchData = useCallback(
    async (forceRefresh = false) => {
      try {
        setIsRefreshing(true);
        const userProfile = await githubService.fetchUserProfile(forceRefresh);
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
        // Fallback demo user if not connected to live OAuth yet
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
    toast.loading("Initiating GitHub OAuth...", { id: "gh-oauth" });
    const res = await authService.signInWithOAuth("github");
    if (!res.ok) {
      toast.error(res.error?.message || "Failed to start GitHub OAuth", { id: "gh-oauth" });
    }
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
              {Math.max(0, Math.round((rateLimit.resetTime.getTime() - Date.now()) / 60000))}m)
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

          {!isConnected && (
            <Button
              size="sm"
              onClick={handleConnectGitHub}
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
              <span>Live Activity Stream</span>
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
              <div className="p-12 text-center rounded-2xl border border-border bg-zinc-950/60 space-y-4 max-w-md mx-auto my-12">
                <Github className="size-12 text-zinc-500 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">
                    Connect GitHub to Start Mirroring
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Authenticate your GitHub account to access your repositories, branch trees, and
                    live telemetry feeds.
                  </p>
                </div>
                <Button
                  onClick={handleConnectGitHub}
                  className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs"
                >
                  Connect GitHub Account
                </Button>
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
    </div>
  );
}
