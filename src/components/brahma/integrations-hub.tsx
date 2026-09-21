import React, { useState, useEffect } from "react";
import {
  Github,
  GitBranch,
  Lock,
  Globe,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Play,
  Terminal,
  ExternalLink,
  Layers,
  Star,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  fetchUserIntegrations,
  fetchGitHubRepos,
  disconnectUserIntegration,
  type UserIntegrationRecord,
  type GitHubRepoItem,
  type IntegrationPushEvent,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

// 1. Provider Cards
export function ProviderSelectorCard({
  provider,
  selected,
  onSelect,
}: {
  provider: "github" | "gitlab" | "bitbucket";
  selected: boolean;
  onSelect: () => void;
}) {
  const configs = {
    github: {
      title: "GitHub",
      desc: "Connect public & private repositories for health and security analysis.",
      enabled: true,
      icon: Github,
      badge: "Enabled",
    },
    gitlab: {
      title: "GitLab",
      desc: "Self-managed or cloud GitLab pipelines with branch triggers.",
      enabled: false,
      icon: Globe,
      badge: "Adapter Ready",
    },
    bitbucket: {
      title: "Bitbucket",
      desc: "Atlassian Bitbucket workspaces and Jira issue link sync.",
      enabled: false,
      icon: Layers,
      badge: "Coming Soon",
    },
  };

  const cfg = configs[provider];
  const Icon = cfg.icon;

  return (
    <div
      onClick={cfg.enabled ? onSelect : undefined}
      className={`rounded-xl border p-4 transition-all relative overflow-hidden ${
        selected && cfg.enabled
          ? "border-primary bg-primary/10 ring-1 ring-primary/40 cursor-pointer shadow-lg"
          : cfg.enabled
            ? "border-border/80 bg-zinc-950/40 hover:border-primary/40 cursor-pointer"
            : "border-border/40 bg-zinc-950/20 opacity-60 cursor-not-allowed"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-secondary/80 text-foreground">
            <Icon className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              {cfg.title}
              {!cfg.enabled && <Lock className="size-3 text-muted-foreground" />}
            </h4>
            <p className="text-xs text-muted-foreground max-w-xs">{cfg.desc}</p>
          </div>
        </div>
        <Badge
          variant={cfg.enabled ? "default" : "secondary"}
          className="text-[10px] font-mono shrink-0"
        >
          {cfg.badge}
        </Badge>
      </div>
    </div>
  );
}

// 2. Disconnect Integration Modal
export function RevokeIntegrationModal({
  provider,
  onConfirm,
}: {
  provider: string;
  onConfirm: () => Promise<void>;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="mr-1.5 size-3.5" /> Disconnect
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="surface border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold">
            Disconnect {provider.toUpperCase()} Integration?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground">
            This will remove the authorization token and prevent BRAHMA from pulling repository
            branches or running automated code health analysis on push events.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs"
          >
            Confirm Disconnect
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// 3. GitHub Connect Card & Repository Explorer
export function GitHubConnectCard() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<UserIntegrationRecord[]>([]);
  const [repos, setRepos] = useState<GitHubRepoItem[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("main");
  const [loading, setLoading] = useState(true);
  const [pushFeed, setPushFeed] = useState<IntegrationPushEvent[]>([
    {
      id: "ev-p1",
      user_id: "u1",
      provider: "github",
      repo: "brahma-developer/aurora-payment-gateway",
      branch: "main",
      commit_sha: "3f2a1c8",
      message: "feat: add PCI-DSS tokenization vault handshake",
      author: "Phanindra Sharma",
      created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      id: "ev-p2",
      user_id: "u1",
      provider: "github",
      repo: "brahma-developer/medisync-core-fhir",
      branch: "master",
      commit_sha: "9a7d0e4",
      message: "fix: sanitize FHIR observation telemetry payloads",
      author: "Core Team",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
  ]);

  const ghIntegration = integrations.find((i) => i.provider === "github");

  const loadData = async () => {
    setLoading(true);
    try {
      const [ints, rList] = await Promise.all([
        fetchUserIntegrations(user?.id),
        fetchGitHubRepos(user?.id),
      ]);
      setIntegrations(ints);
      setRepos(rList);
      if (rList.length > 0 && rList[0]) {
        setSelectedRepo(rList[0].full_name);
        setSelectedBranch(rList[0].default_branch);
      }
    } catch (e) {
      toast.error("Failed to load GitHub integration state.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to Supabase Realtime for integration_events
    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase
        .channel("realtime:integration_events")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "integration_events" },
          (payload) => {
            const newEvent = payload.new as IntegrationPushEvent;
            setPushFeed((prev) => [newEvent, ...prev.slice(0, 19)]);
            toast.info(`Push event received on ${newEvent.repo}`, {
              description: `[${newEvent.commit_sha}] ${newEvent.message} by ${newEvent.author}`,
            });
          },
        )
        .subscribe();
    } catch (err) {
      console.warn("Realtime integration subscription fallback:", err);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);

  const handleConnectGitHub = () => {
    const clientId = import.meta.env["VITE_GITHUB_CLIENT_ID"] || "Iv1.8821941brahma";
    const redirectUri = `${window.location.origin}/auth/callback?integration=github`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=repo,read:org,read:user`;

    toast.info("Redirecting to GitHub OAuth handshake...", {
      description: "Granting repo, read:org, and read:user permissions to BRAHMA.",
    });

    window.location.href = githubAuthUrl;
  };

  const handleDisconnect = async () => {
    await disconnectUserIntegration("github", user?.id);
    setIntegrations((prev) => prev.filter((i) => i.provider !== "github"));
    toast.success("GitHub integration disconnected.");
  };

  return (
    <div className="space-y-6">
      {/* Connection State Card */}
      <div className="rounded-xl border border-border/80 bg-zinc-950/40 p-5">
        {ghIntegration ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={ghIntegration.avatar_url}
                alt={ghIntegration.username}
                className="size-12 rounded-full border border-primary/30 object-cover"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    @{ghIntegration.username}
                  </h4>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">
                    <CheckCircle2 className="size-3 mr-1" /> Connected
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {ghIntegration.repo_count} repositories accessible &bull; Scopes: repo, read:user
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleConnectGitHub} className="text-xs">
                <RefreshCw className="mr-1.5 size-3" /> Reconnect
              </Button>
              <RevokeIntegrationModal provider="GitHub" onConfirm={handleDisconnect} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="grid size-12 place-items-center rounded-xl bg-secondary text-foreground">
                <Github className="size-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">GitHub Authorization</h4>
                <p className="text-xs text-muted-foreground">
                  Authorize BRAHMA to pull repositories for Code Health metrics & Security CVE
                  scanning.
                </p>
              </div>
            </div>
            <Button
              onClick={handleConnectGitHub}
              className="bg-primary text-primary-foreground text-xs shrink-0"
            >
              <Github className="mr-2 size-4" /> Connect GitHub Account
            </Button>
          </div>
        )}
      </div>

      {/* Repo Picker & Branch Selector */}
      {ghIntegration && (
        <SectionCard
          title="Repository Explorer"
          description="Select an active repository to wire into Code Health and Security pipelines."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-foreground">Active Repository</label>
                <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                  <SelectTrigger className="text-xs bg-background/50">
                    <SelectValue placeholder="Select repository" />
                  </SelectTrigger>
                  <SelectContent>
                    {repos.map((r) => (
                      <SelectItem key={r.id} value={r.full_name}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{r.full_name}</span>
                          {r.private && (
                            <Badge variant="secondary" className="text-[9px] px-1 py-0">
                              Private
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Target Branch</label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="text-xs bg-background/50">
                    <SelectValue placeholder="Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">main (default)</SelectItem>
                    <SelectItem value="master">master</SelectItem>
                    <SelectItem value="staging">staging</SelectItem>
                    <SelectItem value="develop">develop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selected Repo Card Info */}
            {repos.find((r) => r.full_name === selectedRepo) && (
              <div className="rounded-lg border border-border/80 bg-secondary/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    {selectedRepo}
                    <a
                      href={`https://github.com/${selectedRepo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      <ExternalLink className="size-3 ml-1" />
                    </a>
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {repos.find((r) => r.full_name === selectedRepo)?.description ||
                      "No description provided."}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-muted-foreground text-[11px] font-mono">
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-cyan-400" />
                    {repos.find((r) => r.full_name === selectedRepo)?.language || "Code"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="size-3 text-amber-400" />
                    {repos.find((r) => r.full_name === selectedRepo)?.stargazers_count || 0}
                  </span>
                  <Button
                    size="sm"
                    className="text-xs bg-primary text-primary-foreground ml-2"
                    onClick={() => {
                      toast.success(`Repository ${selectedRepo} wired into project pipelines.`);
                    }}
                  >
                    Use Repository
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Realtime Push Feed */}
      <SectionCard
        title="Live Webhook Push Stream"
        description="Realtime commits received from GitHub webhook listeners."
      >
        <div className="space-y-2">
          {pushFeed.map((ev) => (
            <div
              key={ev.id}
              className="rounded-lg border border-border/60 bg-zinc-950/40 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <GitBranch className="size-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{ev.repo}</span>
                    <Badge variant="outline" className="text-[10px] font-mono border-border/80">
                      {ev.branch} &larr; {ev.commit_sha}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">{ev.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="text-[10px] text-muted-foreground/80 font-mono">
                  by {ev.author}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast.info(
                      `Re-running Code Health & Security analysis for commit ${ev.commit_sha}...`,
                    );
                  }}
                  className="text-xs text-primary hover:bg-primary/10 h-7 px-2"
                >
                  <Play className="size-3 mr-1" /> Re-run Analysis
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// 4. Main Integrations Center Hub
export function IntegrationsCenterHub() {
  const [selectedProvider, setSelectedProvider] = useState<"github" | "gitlab" | "bitbucket">(
    "github",
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProviderSelectorCard
          provider="github"
          selected={selectedProvider === "github"}
          onSelect={() => setSelectedProvider("github")}
        />
        <ProviderSelectorCard
          provider="gitlab"
          selected={selectedProvider === "gitlab"}
          onSelect={() => setSelectedProvider("gitlab")}
        />
        <ProviderSelectorCard
          provider="bitbucket"
          selected={selectedProvider === "bitbucket"}
          onSelect={() => setSelectedProvider("bitbucket")}
        />
      </div>

      {selectedProvider === "github" && <GitHubConnectCard />}
    </div>
  );
}
