import { useState } from "react";
import { COPILOT_RELEASE_SCENARIO, CopilotScenarioStep } from "./showcaseData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Cpu,
  FileCheck,
  Fingerprint,
  Layers,
  Play,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
} from "lucide-react";

export function CopilotShowcaseSection() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(
    COPILOT_RELEASE_SCENARIO.steps.length - 1,
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const steps = COPILOT_RELEASE_SCENARIO.steps;
  const isFinished = currentStepIndex === steps.length - 1;

  const runSimulation = () => {
    setIsRunning(true);
    setCurrentStepIndex(0);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < steps.length) {
        setCurrentStepIndex(idx);
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 700);
  };

  const resetSimulation = () => {
    setCurrentStepIndex(steps.length - 1);
    setIsRunning(false);
  };

  return (
    <section className="py-20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold">
            <BrainCircuit className="size-3.5" />
            <span>The AI Orchestrator • Flagship Copilot</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Brahma Copilot vs. Generic Chatbots
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Generic chatbots hallucinate answers based on statistical language patterns. Brahma Copilot is an{" "}
            <strong className="text-foreground">autonomous engineering orchestrator</strong> with direct access to
            deterministic tools, AST code graphs, Bandit security scans, and authoritative release gates.
          </p>
        </div>

        {/* COPILOT LIFECYCLE PIPELINE (Requirement 296) */}
        <div className="p-6 rounded-2xl border border-border/70 bg-secondary/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
              The Copilot Execution Lifecycle
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">Deterministic Guardrails Enabled</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { num: "01", label: "User Goal", sub: "Natural intent" },
              { num: "02", label: "Context", sub: "AST & Blueprints" },
              { num: "03", label: "Plan", sub: "Mission graph" },
              { num: "04", label: "Tools", sub: "Lizard & Bandit" },
              { num: "05", label: "Agents", sub: "7 Specialists" },
              { num: "06", label: "Execution", sub: "Bounded steps" },
              { num: "07", label: "Evidence", sub: "Hard metrics" },
              { num: "08", label: "Result", sub: "SHA-256 Seal" },
            ].map((step, idx) => (
              <div
                key={step.num}
                className="p-3 rounded-xl border border-border/60 bg-card/60 text-center space-y-1 relative"
              >
                <div className="text-[10px] font-mono text-muted-foreground font-bold">{step.num}</div>
                <div className="text-xs font-bold text-foreground">{step.label}</div>
                <div className="text-[10px] text-muted-foreground">{step.sub}</div>
                {idx < 7 && (
                  <span className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-xs">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* INTERACTIVE RELEASE SCENARIO RUNNER (Requirement 718-736) */}
        <Card className="border-border/80 bg-card/90 shadow-2xl overflow-hidden backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* SCENARIO QUERY BANNER */}
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <Terminal className="size-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase">
                    Interactive Production Scenario
                  </div>
                  <div className="text-base sm:text-lg font-bold text-foreground font-mono">
                    "{COPILOT_RELEASE_SCENARIO.question}"
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {COPILOT_RELEASE_SCENARIO.projectContext}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={runSimulation}
                  disabled={isRunning}
                  size="sm"
                  className="gap-1.5 text-xs bg-primary text-primary-foreground font-semibold"
                >
                  <Play className="size-3.5" />
                  {isRunning ? "Evaluating Mission..." : "Replay Evaluation"}
                </Button>
                <Button
                  onClick={resetSimulation}
                  disabled={isRunning}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <RotateCcw className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* STEP PROGRESS BAR */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>
                  Mission Progress: Step {currentStepIndex + 1} of {steps.length}
                </span>
                <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP TILES LIST */}
            <div className="space-y-3">
              {steps.slice(0, currentStepIndex + 1).map((s, idx) => (
                <div
                  key={s.step}
                  className={`p-3.5 rounded-xl border transition-all duration-200 animate-in fade-in slide-in-from-left-2 ${
                    idx === currentStepIndex
                      ? "border-primary/50 bg-secondary/30 ring-1 ring-primary/20"
                      : "border-border/50 bg-secondary/15"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="size-6 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center border border-primary/20">
                        {s.step}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-foreground flex items-center gap-2">
                          <span>{s.phase}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">({s.agentOrTool})</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{s.actionSummary}</p>
                      </div>
                    </div>

                    <Badge
                      className={`text-[10px] font-mono self-start sm:self-center ${
                        s.findingBadge.type === "success"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                      }`}
                    >
                      {s.findingBadge.text}
                    </Badge>
                  </div>

                  <div className="mt-2 text-[11px] font-mono text-foreground/85 bg-background/50 p-2 rounded border border-border/40">
                    <span className="text-muted-foreground">EVIDENCE:</span> {s.evidence}
                  </div>
                </div>
              ))}
            </div>

            {/* FINAL VERDICT BOARD (Rendered when completed) */}
            {isFinished && (
              <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Award className="size-5" />
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                        Final Gate Evaluation Decision
                      </div>
                      <h4 className="text-lg font-bold text-foreground">
                        RELEASE STATUS: {COPILOT_RELEASE_SCENARIO.finalVerdict.status} (Score:{" "}
                        {COPILOT_RELEASE_SCENARIO.finalVerdict.score}/100)
                      </h4>
                    </div>
                  </div>

                  <Badge className="bg-emerald-500 text-black font-mono font-bold text-xs">
                    DEPLOYMENT APPROVED
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                  {COPILOT_RELEASE_SCENARIO.finalVerdict.summary}
                </p>

                {/* CRYPTOGRAPHIC MERKLE SEAL */}
                <div className="p-3 rounded-lg border border-border/60 bg-black/40 font-mono text-[10px] space-y-1">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Fingerprint className="size-3 text-cyan-400" /> Tamper-Evident SHA-256 Provenance Seal
                    </span>
                    <span className="text-emerald-400">VERIFIED IMMUTABLE</span>
                  </div>
                  <div className="text-zinc-300 break-all">
                    {COPILOT_RELEASE_SCENARIO.finalVerdict.sha256Seal}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
