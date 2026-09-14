import { useState } from "react";
import { USE_CASES, UseCaseItem } from "./showcaseData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Code2,
  GraduationCap,
  Layers,
  Network,
  Rocket,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

export function UseCaseSection() {
  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string>(USE_CASES[0]!.id);

  const selectedCase: UseCaseItem =
    USE_CASES.find((c) => c.id === selectedUseCaseId) ?? USE_CASES[0]!;

  const audiences = [
    { label: "Software Architects", desc: "Living blueprints & drift detection", icon: Network },
    { label: "Engineering Managers", desc: "Technical debt forecasting & delivery risk", icon: Briefcase },
    { label: "Security & AppSec Teams", desc: "Bandit AST scans & STRIDE threat triage", icon: ShieldCheck },
    { label: "DevOps & Release Engineers", desc: "Deterministic gates with SHA-256 seals", icon: Rocket },
    { label: "QA & Verification Leads", desc: "EARS requirement-to-test traceability", icon: CheckCircle2 },
    { label: "Academic Researchers", desc: "Reproducible code health & complexity grading", icon: GraduationCap },
  ];

  return (
    <section className="py-20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold">
            <Target className="size-3.5" />
            <span>Practical Engineering Value • Use-Case Explorer</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Built for Modern Engineering Organizations
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            From fast-moving startups adopting AI code generation to enterprise organizations managing compliance and
            governance, explore how Brahma delivers actionable engineering clarity.
          </p>
        </div>

        {/* AUDIENCE PILLARS STRIP (Requirement 435-450) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {audiences.map((aud) => {
            const Icon = aud.icon;
            return (
              <div
                key={aud.label}
                className="p-3.5 rounded-xl border border-border/60 bg-secondary/20 space-y-1.5 hover:border-primary/40 transition-all"
              >
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary w-fit">
                  <Icon className="size-4" />
                </div>
                <div className="text-xs font-bold text-foreground leading-tight">{aud.label}</div>
                <div className="text-[11px] text-muted-foreground leading-tight">{aud.desc}</div>
              </div>
            );
          })}
        </div>

        {/* USE CASES TAB SELECTOR & ACTIVE DETAIL CARD (Requirement 428-434) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* USE CASE BUTTONS (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Select Practical Engineering Scenario:
            </div>
            {USE_CASES.map((uc) => {
              const Icon = uc.icon;
              const isSelected = uc.id === selectedUseCaseId;

              return (
                <button
                  key={uc.id}
                  onClick={() => setSelectedUseCaseId(uc.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-primary bg-primary/15 shadow-md ring-1 ring-primary/30"
                      : "border-border/60 bg-card/60 hover:border-primary/40 hover:bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground leading-tight">{uc.title}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{uc.audience}</div>
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                </button>
              );
            })}
          </div>

          {/* ACTIVE USE CASE DETAIL SHEET (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="border-border/80 bg-card/90 shadow-xl backdrop-blur-sm sticky top-24">
              <CardContent className="p-6 sm:p-8 space-y-5">
                <div className="space-y-1.5 pb-4 border-b border-border/50">
                  <Badge variant="outline" className="text-xs font-mono border-primary/40 text-primary">
                    Audience: {selectedCase.audience}
                  </Badge>
                  <h3 className="text-xl font-bold text-foreground">{selectedCase.title}</h3>
                </div>

                {/* PROBLEM */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                    The Critical Challenge
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border/40">
                    {selectedCase.problem}
                  </p>
                </div>

                {/* BRAHMA SOLUTION */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    The Brahma Engineering Solution
                  </div>
                  <p className="text-xs text-foreground/90 font-medium leading-relaxed bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30">
                    {selectedCase.brahmaSolution}
                  </p>
                </div>

                {/* TWO-COLUMN: OUTPUT & BUSINESS IMPACT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-3 rounded-lg border border-border/50 bg-secondary/20 space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                      Tangible Output Produced
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed">{selectedCase.keyOutput}</p>
                  </div>

                  <div className="p-3 rounded-lg border border-border/50 bg-secondary/20 space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                      Business Value Impact
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed">{selectedCase.businessImpact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
