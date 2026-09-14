import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Database,
  Layers,
  Lock,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

export function DemoSimulationSection() {
  const [activeScenario, setActiveScenario] = useState<"fintech" | "healthtech" | "edtech">("fintech");

  const scenarios = {
    fintech: {
      name: "FinTech High-Frequency Payment Gateway",
      industry: "Financial Services",
      files: 142,
      complexity: 4.1,
      cweStatus: "0 Critical, 1 Low (MD5 hash)",
      traceability: "100% (PCI-DSS REQ-01..08)",
      drift: "0.0%",
      gateDecision: "PASSED",
      accent: "text-cyan-400",
      border: "border-cyan-500/40",
    },
    healthtech: {
      name: "MedTech HIPAA & FHIR Telemetry Engine",
      industry: "Healthcare Software",
      files: 89,
      complexity: 3.4,
      cweStatus: "0 Vulnerabilities (All passing)",
      traceability: "98.5% (HIPAA Security Rule)",
      drift: "0.0%",
      gateDecision: "PASSED",
      accent: "text-emerald-400",
      border: "border-emerald-500/40",
    },
    edtech: {
      name: "EdTech Collaborative Course Mesh",
      industry: "Education & Learning",
      files: 64,
      complexity: 6.8,
      cweStatus: "1 High (Unsanitized file upload)",
      traceability: "81.0% (Missing video sync test)",
      drift: "8.4% (Unapproved /stream route)",
      gateDecision: "HOLD (2 Blockers)",
      accent: "text-rose-400",
      border: "border-rose-500/40",
    },
  };

  const current = scenarios[activeScenario];

  return (
    <section className="py-20 border-b border-border/60 bg-secondary/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold">
            <RefreshCw className="size-3.5" />
            <span>Simulation Lab • Safe Experimentation Sandbox</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Demo Mode & Controlled Simulation
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Prospective enterprise teams, auditors, and security researchers need to evaluate full platform capabilities
            without connecting private repositories or production database credentials. Brahma provides an isolated in-memory
            simulation container with synthetic scenarios and instant state resets.
          </p>
        </div>

        {/* SCENARIO SWITCHER BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-border/70 bg-card/70">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-foreground">Select Simulation Domain Scenario:</div>
            <div className="text-[11px] text-muted-foreground">
              Loads pre-packaged AST syntax trees, EARS requirements, and synthetic test suites
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: "fintech", label: "FinTech Gateway" },
              { id: "healthtech", label: "MedTech HIPAA" },
              { id: "edtech", label: "EdTech (With Drift Flaw)" },
            ].map((sc) => (
              <button
                key={sc.id}
                onClick={() => setActiveScenario(sc.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeScenario === sc.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE SIMULATED STATE DISPLAY */}
        <Card className={`border ${current.border} bg-card/90 shadow-xl backdrop-blur-sm`}>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono border-amber-500/40 text-amber-400">
                    SIMULATION ENVIRONMENT
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{current.industry}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">{current.name}</h3>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  className={`text-xs font-mono font-bold ${
                    current.gateDecision.includes("PASSED")
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                  }`}
                >
                  GATE: {current.gateDecision}
                </Badge>
              </div>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg border border-border/50 bg-secondary/30 space-y-1">
                <div className="text-[10px] text-muted-foreground uppercase">Source Files</div>
                <div className="text-lg font-bold text-foreground">{current.files}</div>
              </div>
              <div className="p-3 rounded-lg border border-border/50 bg-secondary/30 space-y-1">
                <div className="text-[10px] text-muted-foreground uppercase">Avg Cyclomatic</div>
                <div className="text-lg font-bold text-cyan-400">{current.complexity}</div>
              </div>
              <div className="p-3 rounded-lg border border-border/50 bg-secondary/30 space-y-1">
                <div className="text-[10px] text-muted-foreground uppercase">Security Findings</div>
                <div className="text-xs font-bold text-foreground truncate">{current.cweStatus}</div>
              </div>
              <div className="p-3 rounded-lg border border-border/50 bg-secondary/30 space-y-1">
                <div className="text-[10px] text-muted-foreground uppercase">Req Traceability</div>
                <div className="text-lg font-bold text-emerald-400">{current.traceability}</div>
              </div>
              <div className="p-3 rounded-lg border border-border/50 bg-secondary/30 space-y-1">
                <div className="text-[10px] text-muted-foreground uppercase">Arch Drift Index</div>
                <div
                  className={`text-lg font-bold ${
                    current.drift === "0.0%" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {current.drift}
                </div>
              </div>
            </div>

            {/* SAFE ISOLATION BADGE & RESET */}
            <div className="p-4 rounded-xl border border-border/60 bg-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                <span>
                  Simulated sandbox uses zero live credentials, writes zero external state, and resets completely on demand.
                </span>
              </div>
              <Button
                onClick={() => setActiveScenario("fintech")}
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 shrink-0"
              >
                <RotateCcw className="size-3.5" /> Reset to FinTech Baseline
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
