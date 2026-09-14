import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Code2,
  FileCheck,
  GitPullRequest,
  Layers,
  Network,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function WhyBrahmaSection() {
  const problems = [
    {
      id: "drift",
      title: "AI Code Acceleration vs. Architectural Drift",
      icon: Network,
      problem:
        "Developers using AI assistants ship 5x to 10x more code per sprint. However, AI code generators lack whole-system context, leading them to create redundant utility files, cross service boundary rules, and bypass agreed architectural patterns.",
      consequence:
        "The codebase deteriorates into an unmaintainable distributed monolith where changing one endpoint breaks three downstream services unexpectedly.",
      brahmaResponse:
        "Vyron continuously parses Git commits and compares the source code AST against the validated system blueprint, instantly flagging boundary violations and calculating an Architectural Drift Index.",
      brahmaFeature: "Continuous Architecture Drift Engine",
    },
    {
      id: "traceability",
      title: "Requirements Divergence & Phantom Coverage",
      icon: FileCheck,
      problem:
        "As features evolve under tight deadlines, code implementation drifts away from original product requirements specifications. Meanwhile, test suites achieve 80%+ line coverage by testing trivia while leaving critical acceptance criteria unverified.",
      consequence:
        "Features pass green CI checks but fail user acceptance testing or violate regulatory requirements because no test actually verified the intended business behavior.",
      brahmaResponse:
        "Vyron constructs a bi-directional traceability matrix connecting EARS requirements to implementation AST nodes and unit/integration test assertions, exposing uncovered clauses and phantom tests.",
      brahmaFeature: "Bi-Directional EARS Traceability Matrix",
    },
    {
      id: "security",
      title: "Superficial Linters vs. In-Depth AST Vulnerabilities",
      icon: ShieldAlert,
      problem:
        "Standard CI/CD linters check formatting, syntax conventions, and known CVE dependencies, but remain blind to deep structural security flaws like raw SQL concatenations, insecure deserialization, and subtle privilege escalations.",
      consequence:
        "High-severity security flaws escape into staging and production environments, leading to costly emergency patches, compliance failures, and data exposure risks.",
      brahmaResponse:
        "Vyron embeds Bandit AST scanning alongside STRIDE threat classification, catching injection vulnerabilities, secret exposure, and insecure cryptography at the syntax-tree level.",
      brahmaFeature: "Bandit AST & STRIDE Threat Analysis",
    },
    {
      id: "governance",
      title: "Subjective Release Meetings vs. Deterministic Gates",
      icon: ShieldCheck,
      problem:
        "Engineering release decisions often hinge on subjective Slack debates, rushed verbal sign-offs, or outdated spreadsheet checklists that fail to guarantee codebase integrity.",
      consequence:
        "Releases are delayed by days of uncertainty or deployed prematurely, resulting in emergency weekend rollbacks, customer disruption, and lost revenue.",
      brahmaResponse:
        "Vyron replaces subjective meetings with authoritative mathematical release gates: zero critical CWEs, cyclomatic complexity < 15, and 100% Tier-1 test traceability, sealed with SHA-256 provenance.",
      brahmaFeature: "Deterministic Release Gate Evaluator",
    },
  ];

  return (
    <section className="py-20 border-b border-border/60 bg-secondary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* SECTION HEADER */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-semibold">
            <AlertTriangle className="size-3.5" />
            <span>The Engineering Governance Gap</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Why VYRON Exists
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            AI-assisted software generation has solved the problem of typing speed. But it has intensified the far more
            dangerous problem of <strong className="text-foreground">architectural decay</strong>. When code is written
            faster than humans can reason about its systemic impact, traditional CI/CD pipelines fail to maintain
            architectural integrity.
          </p>
        </div>

        {/* 4-COLUMN PROBLEM -> CONSEQUENCE -> RESPONSE MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <Card
                key={p.id}
                className="border-border/70 bg-card/70 hover:border-primary/40 transition-all duration-200 overflow-hidden"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground">{p.title}</h3>
                    </div>
                  </div>

                  {/* 3-STEP STRUCTURE: PROBLEM -> CONSEQUENCE -> BRAHMA RESPONSE */}
                  <div className="space-y-3 text-xs sm:text-sm">
                    {/* PROBLEM */}
                    <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                        <AlertTriangle className="size-3" /> The Industry Problem
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{p.problem}</p>
                    </div>

                    {/* CONSEQUENCE */}
                    <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase tracking-wider text-[10px]">
                        <TrendingDown className="size-3" /> The Engineering Consequence
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{p.consequence}</p>
                    </div>

                    {/* BRAHMA RESPONSE */}
                    <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                          <CheckCircle2 className="size-3.5" /> The Vyron Response
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono border-emerald-500/30 text-emerald-400 py-0"
                        >
                          {p.brahmaFeature}
                        </Badge>
                      </div>
                      <p className="text-foreground/90 font-medium leading-relaxed">{p.brahmaResponse}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* COMPARISON CALLOUT */}
        <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-background to-secondary/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-foreground">
              Traditional CI Checks Build Quality. Brahma Governs Systemic Architecture.
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Deterministic AST metrics provide the mathematical foundation. AI Copilot provides context and reasoning.
            </p>
          </div>
          <a
            href="#features"
            className="shrink-0 text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1.5 underline underline-offset-4"
          >
            Explore the 17 Capability Families <ArrowRight className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
