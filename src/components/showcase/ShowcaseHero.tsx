import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Code2,
  FileCheck,
  GitBranch,
  Layers,
  Lock,
  Network,
  Play,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
} from "lucide-react";
import {
  BlueprintGraphAnimated,
  TraceabilityMiniMatrix,
  RiskGaugeCluster,
  ReleaseGateAnimator,
  AlertTicker,
} from "@/components/brahma/showcase-components";

export function ShowcaseHero() {
  const [activeTab, setActiveTab] = useState<"blueprint" | "traceability" | "risk" | "gate">("blueprint");

  return (
    <section
      id="showcase"
      className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden border-b border-border/60"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-tr from-primary/10 via-cyan-500/10 to-indigo-500/10 blur-[130px] -z-10 pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* TOP STATUS TICKER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              VYRON v2.4 • Active Intelligence Engine
            </span>
          </div>
          <div className="w-full sm:w-auto">
            <AlertTicker />
          </div>
        </div>

        {/* HERO TITLE & NARRATIVE */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-wide">
            <Sparkles className="size-3.5" />
            <span>Dedicated Product Intelligence Showcase</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Engineering Intelligence, Architecture Governance &{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-primary to-indigo-400 bg-clip-text text-transparent">
              Software Quality Platform
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Vyron bridges the widening gap between <strong className="text-foreground">engineering intent</strong> and{" "}
            <strong className="text-foreground">implementation reality</strong>. While AI coding tools accelerate code
            generation, Vyron ensures every commit conforms to your architectural blueprint, security policies, and
            verifiable acceptance criteria.
          </p>

          {/* DUAL ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/25 px-6"
            >
              <Link to="/app">
                Launch Live Workspace <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="gap-2 border-border/80 hover:bg-secondary">
              <a href="#how-it-works">
                Explore How It Works <Terminal className="size-4 text-muted-foreground" />
              </a>
            </Button>

            <Button asChild size="lg" variant="ghost" className="gap-2 text-cyan-400 hover:text-cyan-300">
              <Link to="/github">
                Live GitHub Mirror <GitBranch className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* HIGH-LEVEL CONCEPTUAL PIPELINE (Requirement 089-091) */}
        <div className="rounded-2xl border border-border/70 bg-secondary/20 p-6 backdrop-blur-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                The Engineering Reality Flow
              </h2>
              <p className="text-sm font-semibold text-foreground">
                How Brahma Connects Intent to Release through Autonomous & Deterministic Intelligence
              </p>
            </div>
            <Badge variant="outline" className="text-[11px] font-mono border-cyan-500/40 text-cyan-400 self-start">
              Copilot Orchestration Layer
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
            {[
              {
                step: "01",
                label: "Requirements",
                sub: "EARS Extraction",
                icon: FileCheck,
                color: "text-amber-400",
                bg: "bg-amber-400/10",
              },
              {
                step: "02",
                label: "Blueprint",
                sub: "Service Topology",
                icon: Network,
                color: "text-indigo-400",
                bg: "bg-indigo-400/10",
              },
              {
                step: "03",
                label: "Repository",
                sub: "Live Git Mirror",
                icon: GitBranch,
                color: "text-cyan-400",
                bg: "bg-cyan-400/10",
              },
              {
                step: "04",
                label: "Analysis",
                sub: "Lizard AST + Bandit",
                icon: Code2,
                color: "text-emerald-400",
                bg: "bg-emerald-400/10",
              },
              {
                step: "05",
                label: "Governance",
                sub: "Zero-Drift Gates",
                icon: ShieldCheck,
                color: "text-rose-400",
                bg: "bg-rose-400/10",
              },
              {
                step: "06",
                label: "Release",
                sub: "SHA-256 Provenance",
                icon: Sparkles,
                color: "text-primary",
                bg: "bg-primary/10",
              },
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.step}
                  className="relative p-3.5 rounded-xl border border-border/60 bg-card/60 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-muted-foreground font-bold">{p.step}</span>
                    <div className={`p-1.5 rounded-lg ${p.bg} ${p.color}`}>
                      <Icon className="size-4" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {p.label}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{p.sub}</div>

                  {idx < 5 && (
                    <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/40 text-xs">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 font-mono">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <BrainCircuit className="size-3.5" /> Central Brahma Copilot
            </span>
            <span>Synthesizes Context • Plans Missions • Enforces Release Gates</span>
          </div>
        </div>

        {/* INTERACTIVE PRODUCT PREVIEW (Requirement 097-104) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-foreground">Interactive Engine Preview</h2>
              <p className="text-xs text-muted-foreground">
                Inspect live operational components synthesized from actual Brahma repository telemetry
              </p>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center gap-1 p-1 rounded-xl border border-border/70 bg-secondary/30">
              {[
                { id: "blueprint", label: "Architecture Graph", icon: Network },
                { id: "traceability", label: "Traceability Matrix", icon: CheckCircle2 },
                { id: "risk", label: "Risk & Debt Forecast", icon: TrendingUp },
                { id: "gate", label: "Release Gate Evaluator", icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE PREVIEW STAGE */}
          <div className="rounded-2xl border border-border/80 bg-card/80 p-5 shadow-2xl backdrop-blur-sm">
            {activeTab === "blueprint" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 pb-2">
                  <span className="font-mono text-cyan-400">Blueprint Topology • 18 Service Nodes</span>
                  <span>Click any node in the canvas to inspect its latency & heuristics</span>
                </div>
                <BlueprintGraphAnimated onSelectNode={() => {}} />
              </div>
            )}

            {activeTab === "traceability" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 pb-2">
                  <span className="font-mono text-cyan-400">Bi-Directional Lineage • Requirements ↔ Code ↔ Tests</span>
                  <span>Zero Phantom Tests • 100% Verified Acceptance Criteria</span>
                </div>
                <TraceabilityMiniMatrix />
              </div>
            )}

            {activeTab === "risk" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 pb-2">
                  <span className="font-mono text-cyan-400">Technical Debt Forecast • 30/60/90 Days</span>
                  <span>Cyclomatic Hotspots & Monetary Refactoring Impact</span>
                </div>
                <RiskGaugeCluster />
              </div>
            )}

            {activeTab === "gate" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 pb-2">
                  <span className="font-mono text-cyan-400">Deterministic Release Checkpoint • 4 Criteria</span>
                  <span>Authoritative Math Rules with SHA-256 Provenance</span>
                </div>
                <ReleaseGateAnimator />
              </div>
            )}
          </div>
        </div>

        {/* EVIDENCE NUMBERS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
          {[
            { label: "Deterministic Gate Tolerance", value: "0 Critical CVEs", sub: "Bandit AST Scanned" },
            { label: "Cyclomatic Complexity Budget", value: "< 15 / Function", sub: "Lizard AST Metric" },
            { label: "Traceability Assurance", value: "100% EARS Mapped", sub: "Req ↔ Code ↔ Test" },
            { label: "Frontend Navigation Speed", value: "< 10ms", sub: "95 Typed Routes" },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-xl border border-border/50 bg-secondary/15 space-y-1">
              <div className="text-xl sm:text-2xl font-black text-foreground font-mono">{stat.value}</div>
              <div className="text-xs font-semibold text-foreground">{stat.label}</div>
              <div className="text-[11px] text-muted-foreground">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
