import { useState } from "react";
import { LIFECYCLE_PHASES, LifecyclePhase } from "./showcaseData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  Layers,
  Network,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
} from "lucide-react";

export function HowItWorksSection() {
  const [activePhaseNumber, setActivePhaseNumber] = useState<number>(1);

  const activePhase: LifecyclePhase =
    LIFECYCLE_PHASES.find((p) => p.phase === activePhaseNumber) ?? LIFECYCLE_PHASES[0]!;

  return (
    <section id="how-it-works" className="py-20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            <Workflow className="size-3.5" />
            <span>The Operating Model • 10-Phase Lifecycle</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How PROJECT BRAHMA Works
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Brahma pairs <strong className="text-foreground">authoritative deterministic algorithms</strong> with{" "}
            <strong className="text-foreground">autonomous AI reasoning</strong>. Math-based static analyzers guarantee
            zero hallucination on metrics, while AI Copilot synthesizes multi-dimensional intent and coordinates
            specialist investigations.
          </p>
        </div>

        {/* COMPARATIVE SYSTEM ARCHITECTURE CALLOUT (Deterministic vs AI) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border border-border/70 bg-secondary/20">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Cpu className="size-4" />
              <span>Deterministic Systems (The Authoritative Foundation)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Calculates exact AST cyclomatic complexity via Lizard, identifies known CWE vulnerabilities via Bandit,
              validates schema foreign keys, builds acyclic dependency graphs, and evaluates mathematical release gate
              policies. <em>Never hallucinates. Repeatable to the byte.</em>
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <BrainCircuit className="size-4" />
              <span>AI & Multi-Agent Mesh (The Context & Reasoning Layer)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dissects ambiguous human intent into EARS requirements, models business blast radiuses, formulates multi-step
              investigation plans, coordinates 7 bounded specialist agents, and writes clear refactoring guidance.
              <em>Operates over verified facts.</em>
            </p>
          </div>
        </div>

        {/* 10-PHASE INTERACTIVE SELECTOR */}
        <div className="space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Select a phase to explore the deterministic vs. AI operating model:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {LIFECYCLE_PHASES.map((p) => {
              const isSelected = p.phase === activePhaseNumber;
              return (
                <button
                  key={p.phase}
                  onClick={() => setActivePhaseNumber(p.phase)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-105"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <div className="text-[10px] font-mono">P{p.phase}</div>
                  <div className="text-xs font-semibold truncate">{p.name.split(" ")[0]}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE PHASE BOARD */}
        <Card className="border-border/80 bg-card/90 shadow-xl overflow-hidden backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary">
                    Phase {activePhase.phase} of 10
                  </Badge>
                  <h3 className="text-xl font-bold text-foreground">{activePhase.name}</h3>
                </div>
                <p className="text-sm text-foreground/80 font-medium">{activePhase.headline}</p>
              </div>

              <div className="p-2.5 rounded-xl border border-border/60 bg-secondary/30 text-xs font-mono text-cyan-400 self-start">
                <span className="text-muted-foreground">Key Artifact:</span> {activePhase.keyArtifact}
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{activePhase.description}</p>

            {/* DUAL RESPONSIBILITY SPLIT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  <Cpu className="size-3.5" /> Deterministic Authority
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                  {activePhase.deterministicRole}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
                  <BrainCircuit className="size-3.5" /> AI Reasoning & Synthesis
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                  {activePhase.aiRole}
                </p>
              </div>
            </div>

            {/* NEXT PHASE TRIGGER */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40 text-xs">
              <button
                onClick={() => setActivePhaseNumber((prev) => (prev > 1 ? prev - 1 : 10))}
                className="text-muted-foreground hover:text-foreground font-mono"
              >
                ← Previous Phase
              </button>
              <button
                onClick={() => setActivePhaseNumber((prev) => (prev < 10 ? prev + 1 : 1))}
                className="text-primary hover:text-primary/80 font-semibold font-mono flex items-center gap-1"
              >
                Next Phase →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
