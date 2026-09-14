import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { GITHUB_PIPELINE_STAGES, GitHubPipelineStage } from "./showcaseData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ExternalLink,
  FileCode2,
  FolderGit2,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Network,
  Radio,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";

export function GitHubMirrorSection() {
  const [activeStageId, setActiveStageId] = useState<string>(GITHUB_PIPELINE_STAGES[0]!.id);

  const activeStage: GitHubPipelineStage =
    GITHUB_PIPELINE_STAGES.find((s) => s.id === activeStageId) ?? GITHUB_PIPELINE_STAGES[0]!;

  return (
    <section id="github" className="py-20 border-b border-border/60 bg-secondary/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
              <FolderGit2 className="size-3.5" />
              <span>Repository Reality Ingestion</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              The GitHub Mirror & Change Impact Pipeline
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Git records what text changed. Brahma determines what that text change means for your system topology,
              security boundaries, requirement compliance, and release readiness.
            </p>
          </div>

          <div className="shrink-0">
            <Button asChild variant="outline" className="gap-2 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10">
              <Link to="/github">
                Open Live GitHub Mirror <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 7-STAGE INTERACTIVE HORIZONTAL PIPELINE (Requirement 180-184) */}
        <div className="space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Interactive Changeset Traversal • Click any stage to inspect the intelligence flow
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {GITHUB_PIPELINE_STAGES.map((stage) => {
              const isSelected = stage.id === activeStageId;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? "border-primary bg-primary/15 shadow-md ring-1 ring-primary/30"
                      : "border-border/60 bg-card/60 hover:border-primary/40 hover:bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground">{stage.badge}</span>
                    {isSelected && <span className="size-2 rounded-full bg-primary animate-pulse" />}
                  </div>
                  <div
                    className={`text-xs font-bold leading-tight line-clamp-2 ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {stage.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE STAGE DEEP DIVE BOARD */}
        <Card className="border-border/80 bg-card/90 shadow-xl overflow-hidden backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <GitPullRequest className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{activeStage.badge}</span>
                    <h3 className="text-lg font-bold text-foreground">{activeStage.name}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{activeStage.summary}</p>
                </div>
              </div>

              <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary self-start">
                Deterministic Telemetry
              </Badge>
            </div>

            {/* TWO COLUMN INSPECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT: INGESTION INPUT & PROCESSING */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-border/60 bg-secondary/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
                    <Radio className="size-3.5 text-cyan-400" /> Information Flow Input
                  </div>
                  <p className="text-xs font-mono text-foreground/90 bg-background/60 p-2.5 rounded-lg border border-border/40 overflow-x-auto">
                    {activeStage.inputData}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-secondary/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
                    <Terminal className="size-3.5 text-indigo-400" /> Pipeline Processing Details
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {activeStage.processingDetails}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
                    <BrainCircuit className="size-3.5" /> Copilot Agent Synthesis
                  </div>
                  <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                    {activeStage.copilotInsight}
                  </p>
                </div>
              </div>

              {/* RIGHT: COMPUTED TELEMETRY & ARTIFACT PREVIEW */}
              <div className="rounded-xl border border-border/70 bg-zinc-950/80 p-5 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <span className="text-cyan-400 font-bold uppercase text-[11px]">
                    {activeStage.sampleOutput.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Git SHA 4f82d91</span>
                </div>

                {/* METRICS GAUGES */}
                <div className="grid grid-cols-3 gap-2">
                  {activeStage.sampleOutput.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="p-2.5 rounded-lg border border-border/50 bg-secondary/20 space-y-0.5"
                    >
                      <div className="text-[10px] text-muted-foreground">{m.label}</div>
                      <div
                        className={`text-sm font-bold ${
                          m.status === "good"
                            ? "text-emerald-400"
                            : m.status === "warn"
                              ? "text-amber-400"
                              : "text-rose-400"
                        }`}
                      >
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* OUTPUT LOG / DETAILS */}
                <div className="p-3 rounded-lg border border-border/50 bg-black/40 text-[11px] leading-relaxed text-zinc-300">
                  <div className="text-muted-foreground text-[10px] mb-1">EVIDENCE LOG:</div>
                  {activeStage.sampleOutput.details}
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/30">
                  <span>Engine: Python AST + Celery Worker</span>
                  <span className="text-emerald-400 font-semibold">Latency: 42ms</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WORKFLOW SUMMARY CALLOUT */}
        <div className="p-5 rounded-2xl border border-border/60 bg-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GitCommit className="size-5 text-primary shrink-0" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              Every push triggers incremental AST analysis. Only files with modified tokens or functions are reparsed,
              guaranteeing sub-second change impact feedback on 100,000+ line repositories.
            </p>
          </div>
          <Button asChild size="sm" variant="ghost" className="shrink-0 text-primary gap-1">
            <a href="#how-it-works">
              See 10-Phase Lifecycle <ArrowRight className="size-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
