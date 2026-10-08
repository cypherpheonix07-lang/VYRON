/**
 * VYRON — ENGINEERING PORTFOLIO & REPOSITORY COMMAND CENTER
 * Section 7 & Phases P08, P12, P13
 * GOD MODE vULTIMA vNEXT — Strictly ZERO SQL.
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Github,
  GitBranch,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  Clock,
  Plus,
  Trash2,
  Lock,
  Radio,
  Sliders,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ecosystemControlPlane,
  EcosystemOverviewSummary,
  EnrolledRepositoryEntity,
  GitHubAccountEntity,
  ProviderHealthSlo,
  NormalizedEcosystemEvent,
} from "@/services/ecosystem";

export function EngineeringPortfolio() {
  const [summary, setSummary] = useState<EcosystemOverviewSummary | null>(null);
  const [repositories, setRepositories] = useState<EnrolledRepositoryEntity[]>([]);
  const [accounts, setAccounts] = useState<GitHubAccountEntity[]>([]);
  const [healthSlos, setHealthSlos] = useState<ProviderHealthSlo[]>([]);
  const [recentEvents, setRecentEvents] = useState<NormalizedEcosystemEvent[]>([]);
  const [isReconciling, setIsReconciling] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<EnrolledRepositoryEntity | null>(null);
  const [newRepoInput, setNewRepoInput] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);

  const loadData = useCallback(async () => {
    const s = await ecosystemControlPlane.getOverviewSummary();
    setSummary(s);
    const repos = ecosystemControlPlane.getEnrolledRepositories();
    setRepositories(repos);
    setAccounts(ecosystemControlPlane.getAccounts());
    setRecentEvents(ecosystemControlPlane.getRecentEvents(10));
    const slos = await ecosystemControlPlane.getHealthSlos();
    setHealthSlos(slos);
    setSelectedRepo((curr) => curr || repos[0] || null);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleReconcile() {
    setIsReconciling(true);
    try {
      const report = await ecosystemControlPlane.triggerReconciliation();
      toast.success(report.summary);
      await loadData();
    } catch (e: any) {
      toast.error(e?.message || "Reconciliation failed");
    } finally {
      setIsReconciling(false);
    }
  }

  async function handleAutoEnroll() {
    if (!newRepoInput.trim() || !newRepoInput.includes("/")) {
      toast.error("Please enter a valid repository full name (e.g. 'owner/repo')");
      return;
    }
    setIsEnrolling(true);
    try {
      const enrolled = await ecosystemControlPlane.autoEnrollRepository(newRepoInput.trim());
      toast.success(`Enrolled repository ${enrolled.fullName} into portfolio`);
      setNewRepoInput("");
      await loadData();
    } catch (e: any) {
      toast.error(e?.message || "Failed to enroll repository");
    } finally {
      setIsEnrolling(false);
    }
  }

  async function handleOffboard(fullName: string) {
    try {
      await ecosystemControlPlane.offboardRepository(fullName);
      toast.success(`Offboarded repository ${fullName} from live monitoring`);
      await loadData();
    } catch (e: any) {
      toast.error(e?.message || "Failed to offboard repository");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-card/80 via-card/50 to-primary/5 border border-border/70 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Engineering Portfolio & Repository Control</h2>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                <Radio className="w-3 h-3 mr-1 animate-pulse" />
                Live Control Plane
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Continuous discovery, auto-enrollment, vibe-coding platform sync, and real-time AST drift tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReconcile}
            disabled={isReconciling}
            className="text-xs border-border/80 hover:bg-accent/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isReconciling ? "animate-spin text-primary" : ""}`} />
            {isReconciling ? "Reconciling..." : "Reconcile Dual-Plane"}
          </Button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-card/60 border border-border/60">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Enrolled Repos</span>
            <Github className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold">{summary?.enrolledRepositoriesCount ?? 1}</div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Across {summary?.accountsCount ?? 1} GitHub org</p>
        </div>

        <div className="p-4 rounded-xl bg-card/60 border border-border/60">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Vibe Platforms</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold">{summary?.connectedVibePlatformsCount ?? 1}</div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Lovable, v0, Cursor, Bolt</p>
        </div>

        <div className="p-4 rounded-xl bg-card/60 border border-border/60">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Aggregate Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">{summary?.aggregateHealthScore ?? 98}%</div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Zero critical SLO breaches</p>
        </div>

        <div className="p-4 rounded-xl bg-card/60 border border-border/60">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Recent Events</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold">{summary?.recentEventsCount ?? 1}</div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Idempotency deduplicated</p>
        </div>
      </div>

      {/* Provider Health SLO Bar */}
      <div className="p-4 rounded-xl bg-card/40 border border-border/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Connected Provider Health SLOs
          </span>
          <span className="text-[11px] text-muted-foreground">Contractual Latency & Error Budgets</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {healthSlos.map((slo) => (
            <div
              key={slo.provider}
              className="p-2.5 rounded-lg bg-card/80 border border-border/50 flex flex-col justify-between text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground truncate">{slo.displayName}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline justify-between text-[11px] text-muted-foreground">
                <span>{slo.latencyMs}ms</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-emerald-500/30 text-emerald-400">
                  {slo.freshnessState}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Repository Portfolio on Left, Selected Repo Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Enrolled Repositories */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Github className="w-4 h-4 text-primary" />
              Enrolled Repositories ({repositories.length})
            </h3>
          </div>

          {/* Quick Auto-Enroll Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Auto-enroll repository (e.g. org/new-service)..."
              value={newRepoInput}
              onChange={(e) => setNewRepoInput(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-card/80 border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            <Button
              size="sm"
              onClick={handleAutoEnroll}
              disabled={isEnrolling}
              className="text-xs bg-primary hover:bg-primary/90 h-8"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Enroll
            </Button>
          </div>

          {/* Repositories List */}
          <div className="space-y-2.5">
            {repositories.map((repo) => {
              const isSelected = selectedRepo?.fullName === repo.fullName;
              return (
                <div
                  key={repo.fullName}
                  onClick={() => setSelectedRepo(repo)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 border-primary/40 shadow-sm"
                      : "bg-card/60 border-border/60 hover:border-border hover:bg-card/90"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm hover:underline">{repo.fullName}</span>
                        {repo.isPrivate ? (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-amber-400 border-amber-500/30">
                            Private
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-muted-foreground">
                            Public
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 h-4 text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                        >
                          {repo.enrollmentStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{repo.description}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400">{repo.healthScore}/100</div>
                      <span className="text-[10px] text-muted-foreground">Health</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5" />
                        {repo.defaultBranch}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                        AST Drift: {repo.astDriftScore}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {repo.connectedVibePlatforms.map((p) => (
                        <Badge key={p} variant="secondary" className="text-[10px] px-1.5 py-0 uppercase">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Repository Deep Control Surface */}
        <div className="lg:col-span-5 space-y-4">
          {selectedRepo ? (
            <div className="p-5 rounded-2xl bg-card/70 border border-border/70 space-y-4 backdrop-blur-md">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-base">{selectedRepo.fullName}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Canonical Repository Control Surface</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 text-xs text-primary hover:text-primary/90"
                >
                  <a href={selectedRepo.htmlUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    GitHub
                  </a>
                </Button>
              </div>

              {/* Status Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-card/90 border border-border/50">
                  <span className="text-muted-foreground">Enrollment State</span>
                  <div className="font-semibold text-emerald-400 mt-1">{selectedRepo.enrollmentStatus}</div>
                </div>
                <div className="p-3 rounded-lg bg-card/90 border border-border/50">
                  <span className="text-muted-foreground">Data Freshness</span>
                  <div className="font-semibold text-primary mt-1">{selectedRepo.freshness}</div>
                </div>
              </div>

              {/* Topics / Tags */}
              <div>
                <span className="text-xs font-semibold text-muted-foreground">Topics & Signals</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedRepo.topics.map((t) => (
                    <Badge key={t} variant="outline" className="text-[11px] px-2 py-0.5">
                      #{t}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Connected Vibe Platforms */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Synced Vibe Platforms
                </span>
                <div className="space-y-1.5">
                  {selectedRepo.connectedVibePlatforms.map((p) => (
                    <div
                      key={p}
                      className="p-2.5 rounded-lg bg-card/90 border border-border/50 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold uppercase">{p}</span>
                      <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active Sync
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone / Offboard */}
              <div className="pt-3 border-t border-border/50 flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleOffboard(selectedRepo.fullName)}
                  className="text-xs h-8"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Offboard from Live Monitoring
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-card/40 border border-border/50 text-center text-muted-foreground text-xs">
              Select a repository on the left to inspect its deep control surface.
            </div>
          )}

          {/* Real-Time Event Stream Log */}
          <div className="p-4 rounded-xl bg-card/40 border border-border/60 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-primary" />
              Event Ingestion Stream (Recent)
            </span>
            <div className="space-y-2 max-h-56 overflow-y-auto text-xs">
              {recentEvents.map((evt) => (
                <div
                  key={evt.eventId}
                  className="p-2.5 rounded-lg bg-card/80 border border-border/40 flex items-center justify-between"
                >
                  <div>
                    <span className="font-medium text-foreground block">{evt.eventType}</span>
                    <span className="text-[10px] text-muted-foreground">
                      by @{evt.actor.login} • {new Date(evt.receivedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase">
                    {evt.provider}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
