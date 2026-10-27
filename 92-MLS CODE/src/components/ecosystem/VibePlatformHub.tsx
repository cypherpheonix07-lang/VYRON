/**
 * VYRON — VIBE PLATFORM HUB & AUTO-DISCOVERY INBOX
 * Section 7 & Phases P24, P26, P28, P30, P31
 * GOD MODE vULTIMA vNEXT — Strictly ZERO SQL.
 */

import React, { useState, useEffect } from "react";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Bot,
  Play,
  Terminal,
  Clock,
  Key,
  Lock,
  ArrowRight,
  Eye,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ecosystemControlPlane,
  AutoConnectCandidate,
  VibePlatformProjectEntity,
  VibeAgentRunEntity,
} from "@/services/ecosystem";

export function VibePlatformHub() {
  const [candidates, setCandidates] = useState<AutoConnectCandidate[]>([]);
  const [vibeProjects, setVibeProjects] = useState<VibePlatformProjectEntity[]>([]);
  const [agentRuns, setAgentRuns] = useState<VibeAgentRunEntity[]>([]);
  const [isAuthorizing, setIsAuthorizing] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setCandidates(ecosystemControlPlane.getAllCandidates());
    setVibeProjects(ecosystemControlPlane.getVibeProjects());
    setAgentRuns(ecosystemControlPlane.getRecentAgentRuns());
  }

  async function handleAuthorize(candidateId: string) {
    setIsAuthorizing(candidateId);
    try {
      const record = await ecosystemControlPlane.authorizeVibeCandidate(candidateId);
      toast.success(`Authorized ${record.provider.toUpperCase()} with explicit consent audit hash: ${record.auditHash.slice(0, 12)}...`);
      await loadData();
    } catch (e: any) {
      toast.error(e?.message || "Failed to authorize provider");
    } finally {
      setIsAuthorizing(null);
    }
  }

  function handleRevoke(provider: any) {
    try {
      ecosystemControlPlane.revokeVibeAuthorization(provider);
      toast.success(`Revoked authorization for ${provider.toUpperCase()}`);
      loadData();
    } catch (e: any) {
      toast.error(e?.message || "Failed to revoke authorization");
    }
  }

  const pendingCandidates = candidates.filter((c) => c.consentStatus === "PENDING_USER_REVIEW");
  const authorizedCandidates = candidates.filter((c) => c.consentStatus === "AUTHORIZED");

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-card/80 via-card/50 to-indigo-500/10 border border-border/70 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-sm">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Vibe-Coding Platform Ecosystem Hub</h2>
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs">
                Auto-Discovery & Consent
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Autonomous discovery with human-in-the-loop authorization. Connect Lovable, v0, Bolt, Cursor, and Replit.
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={loadData} className="text-xs border-border/80">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh Providers
        </Button>
      </div>

      {/* Auto-Discovery Inbox */}
      {pendingCandidates.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Auto-Discovery Inbox ({pendingCandidates.length} Pending Review)
            </span>
            <span className="text-[11px] text-muted-foreground">Explicit Consent Required (No Silent Auth)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pendingCandidates.map((cand) => (
              <div
                key={cand.candidateId}
                className="p-4 rounded-xl bg-card/90 border border-border/70 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-sm uppercase">{cand.provider}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Detected in repository: <span className="font-mono text-foreground">{cand.associatedRepoFullName}</span>
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30">
                    {Math.round(cand.confidenceScore * 100)}% Confidence
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground bg-accent/20 p-2.5 rounded-lg border border-border/40">
                  <span className="font-medium text-foreground block mb-1">Evidence Signals:</span>
                  {cand.evidenceDetails.map((ev, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {cand.suggestedScopes.map((sc) => (
                      <Badge key={sc} variant="secondary" className="text-[9px] px-1 py-0">
                        {sc}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAuthorize(cand.candidateId)}
                    disabled={isAuthorizing === cand.candidateId}
                    className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Authorize
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected Vibe Projects & Live Status */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Active Vibe-Coding Platform Projects ({vibeProjects.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vibeProjects.map((prj) => (
            <div
              key={prj.id}
              className="p-4 rounded-xl bg-card/60 border border-border/60 hover:border-border transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{prj.projectName}</span>
                    <Badge variant="outline" className="text-[10px] uppercase text-indigo-400 border-indigo-500/30">
                      {prj.provider}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{prj.associatedRepoFullName}</p>
                </div>
                <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Synced
                </Badge>
              </div>

              {prj.latestPromptSnippet && (
                <div className="p-2.5 rounded-lg bg-card/90 border border-border/40 text-xs">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block mb-0.5">
                    Latest Prompt Signal:
                  </span>
                  <p className="text-muted-foreground italic line-clamp-2">"{prj.latestPromptSnippet}"</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40">
                <span className="text-muted-foreground">Branch: {prj.associatedBranch}</span>
                {prj.previewUrl && (
                  <Button variant="ghost" size="sm" asChild className="h-7 text-xs text-primary p-0">
                    <a href={prj.previewUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Preview
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Agent Run Monitor */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          Autonomous Agent Run Stream (Recent Multi-Platform Executions)
        </h3>

        <div className="space-y-2.5">
          {agentRuns.map((run) => (
            <div
              key={run.id}
              className="p-4 rounded-xl bg-card/60 border border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{run.agentName}</span>
                  <Badge variant="secondary" className="text-[10px] uppercase">
                    {run.provider}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                  >
                    {run.status}
                  </Badge>
                  {run.commitSha && (
                    <span className="font-mono text-[10px] text-muted-foreground bg-accent/40 px-1.5 py-0.5 rounded">
                      {run.commitSha}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{run.prompt}</p>
                {run.filesModified.length > 0 && (
                  <span className="text-[11px] text-muted-foreground">
                    Modified: <span className="font-mono text-foreground">{run.filesModified.join(", ")}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-muted-foreground shrink-0">
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3" />
                  {run.durationMs}ms
                </span>
                {run.previewUrl && (
                  <Button variant="outline" size="sm" asChild className="h-7 text-xs">
                    <a href={run.previewUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Preview
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
