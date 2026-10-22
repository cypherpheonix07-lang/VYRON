import React, { useState, useMemo, useEffect } from "react";
import {
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Copy,
  Download,
  Filter,
  Bot,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Shield,
  Check,
  Code2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { copilotStore } from "@/state/copilot/copilotStore";
import {
  MASTER_BUILD_DOMAINS,
  ALL_MASTER_BUILD_PHASES,
  MasterBuildPhase,
  MasterBuildDomain,
  PhaseStatus,
  ProjectPhaseRecord,
  calculateMasterBuildProgress,
} from "@/data/masterBuildPrompt";
import {
  MASTER_SDLC_AUDIT_BASELINE,
  CODEBASE_AUDIT_SUMMARY,
} from "@/data/masterBuildAuditBaseline";
import { cn } from "@/lib/utils";

interface MasterBuildPromptWorkbenchProps {
  projectId: string;
  onDirtyChange?: (isDirty: boolean) => void;
}

const STATUS_CONFIG: Record<
  PhaseStatus,
  { label: string; color: string; badgeClass: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Pending",
    color: "slate",
    badgeClass: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    icon: Clock,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "amber",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: Clock,
  },
  VERIFIED: {
    label: "Verified",
    color: "emerald",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    icon: CheckCircle2,
  },
  BLOCKED: {
    label: "Blocked",
    color: "rose",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    icon: AlertOctagon,
  },
  NOT_APPLICABLE: {
    label: "N/A",
    color: "zinc",
    badgeClass: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    icon: Check,
  },
};

export function MasterBuildPromptWorkbench({
  projectId,
  onDirtyChange,
}: MasterBuildPromptWorkbenchProps) {
  const storageKey = `vyron_master_build_sdlc_${projectId}`;

  // Initial load from localStorage, defaulting to authentic empirical codebase audit baseline
  const [phaseRecords, setPhaseRecords] = useState<Record<string, ProjectPhaseRecord>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return MASTER_SDLC_AUDIT_BASELINE;
  });

  const [activeLetter, setActiveLetter] = useState<string>("A");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  const handleLoadAuditBaseline = () => {
    setPhaseRecords(MASTER_SDLC_AUDIT_BASELINE);
    try {
      localStorage.setItem(storageKey, JSON.stringify(MASTER_SDLC_AUDIT_BASELINE));
    } catch {
      // ignore
    }
    if (onDirtyChange) onDirtyChange(true);
    toast.success(
      `Loaded Codebase Audit Baseline (${CODEBASE_AUDIT_SUMMARY.totalVerified} Verified, ${CODEBASE_AUDIT_SUMMARY.totalInProgress} In Progress — ${CODEBASE_AUDIT_SUMMARY.maturityScorePct}% Maturity)`
    );
  };

  const handleResetClean = () => {
    setPhaseRecords({});
    try {
      localStorage.setItem(storageKey, JSON.stringify({}));
    } catch {
      // ignore
    }
    if (onDirtyChange) onDirtyChange(true);
    toast.info("Reset SDLC plan to clean pending state.");
  };

  // Sync with localStorage
  const handleUpdateStatus = (code: string, newStatus: PhaseStatus) => {
    setPhaseRecords((prev) => {
      const next = {
        ...prev,
        [code]: {
          code,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          notes: prev[code]?.notes || "",
        },
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // quota
      }
      return next;
    });
    if (onDirtyChange) onDirtyChange(true);
    toast.success(`Phase ${code} marked as ${STATUS_CONFIG[newStatus].label}`);
  };

  const handleUpdateNotes = (code: string, notes: string) => {
    setPhaseRecords((prev) => {
      const next = {
        ...prev,
        [code]: {
          code,
          status: prev[code]?.status || "PENDING",
          updatedAt: new Date().toISOString(),
          notes,
        },
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // quota
      }
      return next;
    });
    if (onDirtyChange) onDirtyChange(true);
  };

  const toggleNotes = (code: string) => {
    setExpandedNotes((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  // Progress metrics calculation
  const progress = useMemo(() => {
    return calculateMasterBuildProgress(phaseRecords);
  }, [phaseRecords]);

  // Active domain
  const activeDomain = useMemo(() => {
    return (
      MASTER_BUILD_DOMAINS.find((d) => d.letter === activeLetter) ||
      MASTER_BUILD_DOMAINS[0]
    );
  }, [activeLetter]);

  // Filtered phases list
  const filteredPhases = useMemo(() => {
    let phases: MasterBuildPhase[] = [];

    if (searchQuery.trim().length > 0) {
      // Global search across all 520 phases
      const q = searchQuery.toLowerCase().trim();
      phases = ALL_MASTER_BUILD_PHASES.filter(
        (p) =>
          p.code.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.instruction.toLowerCase().includes(q) ||
          p.domainName.toLowerCase().includes(q)
      );
    } else {
      // Domain-filtered phases
      phases = activeDomain.phases;
    }

    if (statusFilter !== "ALL") {
      phases = phases.filter((p) => {
        const record = phaseRecords[p.code];
        const status = record?.status || "PENDING";
        return status === statusFilter;
      });
    }

    return phases;
  }, [searchQuery, activeDomain, statusFilter, phaseRecords]);

  // Ask Ather Copilot for this phase
  const handleAskAther = (phase: MasterBuildPhase) => {
    copilotStore.openDrawer();
    copilotStore.sendMessage(
      "CHAT",
      `Execute Master Build Prompt Phase [${phase.code}: ${phase.title}] (Domain: ${phase.domainName}).

Actionable Instruction:
"${phase.instruction}"

Project ID: ${projectId}.
Please produce the comprehensive architecture specifications, implementation patterns, and code artifacts satisfying all constraints for this milestone.`
    );
    toast.info(`Sent Phase ${phase.code} context to Ather Copilot.`);
  };

  // Ask Ather for entire domain
  const handleAskAtherDomain = (domain: MasterBuildDomain) => {
    copilotStore.openDrawer();
    copilotStore.sendMessage(
      "CHAT",
      `Execute Architectural Review for Domain [${domain.letter}: ${domain.name}].
Scope: ${domain.description}
Total Milestones: 20 phases (${domain.letter}.01 through ${domain.letter}.20).

Please assess the current project state against these 20 phases and recommend an implementation roadmap.`
    );
    toast.info(`Sent Domain ${domain.letter} overview to Ather Copilot.`);
  };

  // Export SDLC checklist
  const handleExportMarkdown = () => {
    let md = `# Master Build SDLC Plan & Checklist — Project ${projectId}\n\n`;
    md += `**Overall Progress**: ${progress.completionPct}% (${progress.verified} / ${progress.total} phases verified)\n\n`;

    for (const domain of MASTER_BUILD_DOMAINS) {
      md += `## Letter ${domain.letter}: ${domain.name}\n`;
      md += `*${domain.description}*\n\n`;
      md += `| Code | Status | Milestone | Instruction | Notes |\n`;
      md += `|:---|:---:|:---|:---|:---|\n`;

      for (const p of domain.phases) {
        const rec = phaseRecords[p.code];
        const status = rec?.status || "PENDING";
        const notes = rec?.notes ? rec.notes.replace(/\|/g, "\\|") : "-";
        md += `| \`${p.code}\` | **${status}** | ${p.title} | ${p.instruction} | ${notes} |\n`;
      }
      md += `\n`;
    }

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vyron-master-build-sdlc-${projectId}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported complete 520-Phase Master SDLC Markdown checklist.");
  };

  const handleCopyJson = () => {
    const data = {
      projectId,
      progress,
      records: phaseRecords,
      exportedAt: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success("Copied SDLC state JSON to clipboard.");
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="p-6 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-card via-[#110e24] to-card shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-violet-500/20 text-violet-400 border border-violet-500/30">
                SDLC Master Engine
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                26 Letters × 20 Phases = 520 Total Milestones
              </span>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                Actionable & Unambiguous
              </Badge>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <Layers className="size-6 text-violet-400" />
              Master Build Lifecycle Workbench
            </h2>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Complete, rigorous software development lifecycle from Architecture (A) through Zero-Downtime Deployment (Z).
              Track progress, record architectural notes, and trigger Ather Copilot directly on any milestone.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Button
              onClick={handleLoadAuditBaseline}
              variant="outline"
              size="sm"
              className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs gap-1.5"
            >
              <Shield className="size-3.5 text-emerald-400" />
              Load Codebase Audit
            </Button>
            <Button
              onClick={handleResetClean}
              variant="ghost"
              size="sm"
              className="border border-border/50 text-muted-foreground hover:text-foreground text-xs gap-1.5"
            >
              <RotateCcw className="size-3.5 text-muted-foreground" />
              Reset Plan
            </Button>
            <Button
              onClick={handleExportMarkdown}
              variant="outline"
              size="sm"
              className="border-violet-500/30 hover:bg-violet-500/10 text-xs gap-1.5"
            >
              <Download className="size-3.5 text-violet-400" />
              Export Markdown
            </Button>
            <Button
              onClick={handleCopyJson}
              variant="outline"
              size="sm"
              className="border-border hover:bg-secondary text-xs gap-1.5"
            >
              <Copy className="size-3.5 text-muted-foreground" />
              Copy JSON
            </Button>
          </div>
        </div>

        {/* Global Progress Strip */}
        <div className="mt-6 pt-5 border-t border-border/40 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <div className="text-[10px] uppercase text-muted-foreground font-semibold">Overall Progress</div>
            <div className="text-lg font-bold text-foreground mt-0.5 flex items-baseline gap-1.5">
              <span>{progress.completionPct}%</span>
              <span className="text-[11px] font-normal text-muted-foreground">({progress.verified}/{progress.total})</span>
            </div>
            <div className="w-full bg-secondary/80 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(progress.completionPct, 2)}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <div className="text-[10px] uppercase text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="size-3" />
              Verified
            </div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{progress.verified}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Phases audited & tested</div>
          </div>

          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <div className="text-[10px] uppercase text-amber-400 font-semibold flex items-center gap-1">
              <Clock className="size-3" />
              In Progress
            </div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{progress.inProgress}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Currently active tasks</div>
          </div>

          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <div className="text-[10px] uppercase text-slate-400 font-semibold flex items-center gap-1">
              <Clock className="size-3" />
              Pending
            </div>
            <div className="text-lg font-bold text-foreground mt-0.5">{progress.pending}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Awaiting execution</div>
          </div>

          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <div className="text-[10px] uppercase text-rose-400 font-semibold flex items-center gap-1">
              <AlertOctagon className="size-3" />
              Blocked
            </div>
            <div className="text-lg font-bold text-rose-400 mt-0.5">{progress.blocked}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Obstacles flagged</div>
          </div>
        </div>
      </div>

      {/* Codebase Audit Status Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/25 text-xs shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 grid place-items-center shrink-0">
            <Shield className="size-4 text-emerald-400" />
          </div>
          <div>
            <div className="font-semibold text-foreground flex items-center gap-2">
              <span>Empirical Codebase Audit (Zero-Fiction Law)</span>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/15 text-emerald-300 border-emerald-500/30">
                {CODEBASE_AUDIT_SUMMARY.maturityScorePct}% Maturity
              </Badge>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5 font-mono flex items-center gap-2 flex-wrap">
              <span className="text-emerald-400 font-bold">{CODEBASE_AUDIT_SUMMARY.totalVerified} Verified</span>
              <span className="text-border">•</span>
              <span className="text-amber-400 font-bold">{CODEBASE_AUDIT_SUMMARY.totalInProgress} In Progress</span>
              <span className="text-border">•</span>
              <span className="text-slate-400 font-bold">{CODEBASE_AUDIT_SUMMARY.totalGaps} Gaps</span>
              <span className="text-border">•</span>
              <span>26 Domains Audited</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <Button
            onClick={handleLoadAuditBaseline}
            variant="outline"
            size="sm"
            className="h-7 text-[11px] border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 gap-1.5"
          >
            <CheckCircle2 className="size-3 text-emerald-400" />
            Apply Baseline
          </Button>
        </div>
      </div>

      {/* Domain Ribbon Selector (A to Z) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
            Browse 26 Lifecycle Domains (A – Z)
          </span>
          <span>Click any letter to view its 20 concrete milestones</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {MASTER_BUILD_DOMAINS.map((domain) => {
            const isSelected = activeLetter === domain.letter && searchQuery.trim().length === 0;
            // count verified in this domain
            const verifiedInDomain = domain.phases.filter(
              (p) => phaseRecords[p.code]?.status === "VERIFIED"
            ).length;

            return (
              <button
                key={domain.letter}
                onClick={() => {
                  setActiveLetter(domain.letter);
                  setSearchQuery("");
                }}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[54px] px-2.5 py-2 rounded-xl border text-xs transition-all shrink-0",
                  isSelected
                    ? "bg-violet-600 border-violet-500 text-white font-bold shadow-lg shadow-violet-900/40 scale-105"
                    : "bg-card/70 border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <span className="text-sm font-black font-mono">{domain.letter}</span>
                <span className="text-[9px] mt-0.5 truncate max-w-[48px] font-medium opacity-80">
                  {verifiedInDomain}/20
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border/60">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search all 520 phases by code, keyword, or technology (e.g., 'Redis', 'OAuth', 'Brotli', 'S.06')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border-border/50 text-xs h-9 rounded-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto shrink-0">
          <span className="text-[11px] text-muted-foreground mr-1 hidden md:inline">Status:</span>
          {(["ALL", "VERIFIED", "IN_PROGRESS", "PENDING", "BLOCKED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap",
                statusFilter === st
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent"
              )}
            >
              {st === "ALL" ? "All" : STATUS_CONFIG[st]?.label || st}
            </button>
          ))}
        </div>
      </div>

      {/* Active Domain Context Header */}
      {!searchQuery && (
        <div className="p-4 rounded-xl border border-border/50 bg-card/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-violet-500/15 border border-violet-500/30 grid place-items-center text-violet-400 font-mono font-black text-xl shrink-0">
              {activeDomain.letter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground text-base">{activeDomain.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30">
                  Letter {activeDomain.letter}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeDomain.description}
              </p>
            </div>
          </div>

          <Button
            onClick={() => handleAskAtherDomain(activeDomain)}
            variant="outline"
            size="sm"
            className="border-violet-500/30 hover:bg-violet-500/15 text-xs text-violet-300 gap-1.5 shrink-0"
          >
            <Bot className="size-3.5 text-violet-400" />
            Ask Ather Copilot about Domain {activeDomain.letter}
          </Button>
        </div>
      )}

      {/* Phases Results Counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing <strong className="text-foreground">{filteredPhases.length}</strong> {filteredPhases.length === 1 ? "phase" : "phases"}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        <span>Click "Ask Ather" to generate code or architecture for any milestone</span>
      </div>

      {/* Phases Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPhases.map((phase) => {
          const rec = phaseRecords[phase.code];
          const currentStatus: PhaseStatus = rec?.status || "PENDING";
          const statusMeta = STATUS_CONFIG[currentStatus];
          const StatusIcon = statusMeta.icon;
          const hasNotes = rec?.notes && rec.notes.trim().length > 0;
          const isNotesOpen = expandedNotes[phase.code] || false;

          return (
            <Card
              key={phase.code}
              className={cn(
                "border transition-all bg-card/80 hover:bg-card hover:border-violet-500/40 relative overflow-hidden group",
                currentStatus === "VERIFIED" && "border-emerald-500/30",
                currentStatus === "IN_PROGRESS" && "border-amber-500/30",
                currentStatus === "BLOCKED" && "border-rose-500/30"
              )}
            >
              <CardContent className="p-4 space-y-3">
                {/* Header row: Code + Title + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-secondary text-primary border border-border/80">
                      {phase.code}
                    </span>
                    <h4 className="font-semibold text-foreground text-sm leading-tight">
                      {phase.title}
                    </h4>
                  </div>

                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1",
                      statusMeta.badgeClass
                    )}
                  >
                    <StatusIcon className="size-3" />
                    {statusMeta.label}
                  </span>
                </div>

                {/* Actionable Instruction */}
                <div className="p-2.5 rounded-lg bg-background/50 border border-border/40 text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground/80 block text-[10px] uppercase tracking-wider mb-0.5">
                    Actionable Instruction:
                  </span>
                  {phase.instruction}
                </div>

                {/* Empirical Codebase Evidence */}
                {(rec?.evidence || MASTER_SDLC_AUDIT_BASELINE[phase.code]?.evidence) && (
                  <div className="px-2.5 py-1.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300 font-mono flex items-start gap-1.5">
                    <CheckCircle2 className="size-3 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="leading-tight">
                      <span className="text-[9px] uppercase font-bold text-emerald-400/80 block">
                        Codebase Evidence:
                      </span>
                      {rec?.evidence || MASTER_SDLC_AUDIT_BASELINE[phase.code]?.evidence}
                    </div>
                  </div>
                )}

                {/* Domain Tag (helpful when searching globally) */}
                {searchQuery && (
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-muted/60 text-foreground">
                      Domain {phase.domainLetter}
                    </span>
                    <span>{phase.domainName}</span>
                  </div>
                )}

                {/* Notes expander */}
                {isNotesOpen && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">
                      Implementation Notes / Evidence:
                    </label>
                    <textarea
                      rows={2}
                      value={rec?.notes || ""}
                      onChange={(e) => handleUpdateNotes(phase.code, e.target.value)}
                      placeholder="e.g., Implemented in commit #a3b91c. ADR-01 approved. Test coverage passes."
                      className="w-full text-xs p-2 rounded-lg bg-background border border-border/60 focus:outline-none focus:border-violet-500 text-foreground"
                    />
                  </div>
                )}

                {/* Footer Controls: Status buttons + Ask Ather */}
                <div className="flex items-center justify-between pt-2 border-t border-border/40 gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    {(["PENDING", "IN_PROGRESS", "VERIFIED", "BLOCKED"] as PhaseStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(phase.code, st)}
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-medium transition-colors border",
                          currentStatus === st
                            ? STATUS_CONFIG[st].badgeClass
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                        )}
                        title={`Mark as ${STATUS_CONFIG[st].label}`}
                      >
                        {STATUS_CONFIG[st].label}
                      </button>
                    ))}

                    <button
                      onClick={() => toggleNotes(phase.code)}
                      className={cn(
                        "ml-1 text-[10px] px-1.5 py-0.5 rounded border text-muted-foreground hover:text-foreground",
                        hasNotes ? "border-violet-500/40 text-violet-300 bg-violet-500/10" : "border-border/40"
                      )}
                    >
                      {hasNotes ? "Notes (1)" : "+ Note"}
                    </button>
                  </div>

                  <Button
                    onClick={() => handleAskAther(phase)}
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs px-2.5 gap-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-500/15 font-medium ml-auto"
                  >
                    <Sparkles className="size-3 text-violet-400 animate-pulse" />
                    Ask Ather
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPhases.length === 0 && (
        <div className="p-12 text-center rounded-xl border border-dashed border-border/60 bg-card/40 space-y-3">
          <BookOpen className="size-8 text-muted-foreground mx-auto" />
          <h4 className="font-semibold text-foreground text-sm">No phases found</h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            No milestones match your current query or filter criteria. Clear your search or reset filters to explore all 520 phases.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
            }}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
