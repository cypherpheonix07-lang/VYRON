import React, { useState } from "react";
import { CheckCircle2, Circle, ArrowRight, Sparkles, X, Trophy } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  desc: string;
  time: string;
  link: string;
  completed: boolean;
}

export function OnboardingChecklist({ onDismiss }: { onDismiss?: () => void }) {
  const [dismissed, setDismissed] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Connect your GitHub account",
      desc: "Synchronize repositories and enable real-time commit push feeds.",
      time: "2 min",
      link: "/app/settings",
      completed: true,
    },
    {
      id: 2,
      title: "Submit your first product requirement",
      desc: "Paste natural language requirements into the synthesis engine.",
      time: "3 min",
      link: "/app/studio",
      completed: true,
    },
    {
      id: 3,
      title: "Run your first blueprint generation",
      desc: "Synthesize high-assurance microservice DAG architectures.",
      time: "1 min",
      link: "/app/studio",
      completed: false,
    },
    {
      id: 4,
      title: "Trigger your first AST scan",
      desc: "Measure cyclomatic complexity and run Bandit security checks.",
      time: "2 min",
      link: "/app/projects",
      completed: false,
    },
    {
      id: 5,
      title: "Review your first release gate report",
      desc: "Audit mathematical proof of release readiness across 7 gates.",
      time: "2 min",
      link: "/app/reports",
      completed: false,
    },
  ]);

  if (dismissed) return null;

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPct = (completedCount / steps.length) * 100;
  const allComplete = completedCount === steps.length;

  const toggleStep = (id: number) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));
  };

  return (
    <div className="surface p-6 rounded-2xl border border-primary/30 relative overflow-hidden space-y-5 shadow-xl bg-gradient-to-br from-card/80 via-card/50 to-primary/5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              {allComplete ? (
                <Trophy className="size-4 text-amber-400" />
              ) : (
                <Sparkles className="size-4" />
              )}
            </span>
            <h3 className="text-sm font-bold text-foreground">
              {allComplete ? "Engineering Onboarding Mastered!" : "Platform Onboarding Checklist"}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/30">
              {completedCount} of {steps.length} Steps Complete
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Complete the core engineering milestones to unlock automated CI/CD release gate
            enforcement.
          </p>
        </div>

        <button
          onClick={() => {
            setDismissed(true);
            onDismiss?.();
          }}
          type="button"
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Dismiss checklist"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted/60 rounded-full h-2 overflow-hidden border border-border/40">
        <div
          className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={() => toggleStep(step.id)}
            className={cn(
              "p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3",
              step.completed
                ? "border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/40"
                : "border-border/80 bg-card/40 hover:border-primary/40 hover:bg-card/70",
            )}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {step.completed ? (
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="size-4 text-muted-foreground shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      step.completed
                        ? "text-foreground line-through opacity-80"
                        : "text-foreground",
                    )}
                  >
                    Step {step.id}: {step.title}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed pl-6">{step.desc}</p>
            </div>

            <div className="flex items-center justify-between pl-6 pt-2 border-t border-border/30 text-[10px] font-mono text-muted-foreground">
              <span>{step.time} est.</span>
              <Link
                to={step.link}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
              >
                <span>Go to page</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
