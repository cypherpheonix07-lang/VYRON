import { useState } from "react";
import { SPECIALIST_AGENTS, SpecialistAgent } from "./showcaseData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  Database,
  FileText,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Workflow,
} from "lucide-react";

export function MultiAgentSection() {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("security-analyst");

  const selectedAgent: SpecialistAgent =
    SPECIALIST_AGENTS.find((a) => a.id === selectedAgentId) ?? SPECIALIST_AGENTS[0]!;

  return (
    <section className="py-20 border-b border-border/60 bg-secondary/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            <Boxes className="size-3.5" />
            <span>Specialist Mesh • 7 Bounded Agent Roles</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Multi-Agent Intelligence Under Central Governance
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Instead of relying on an unconstrained monolithic model that hallucinates when switching contexts, Brahma
            deploys <strong className="text-foreground">7 bounded specialist agents</strong>. Each specialist possesses
            domain-specific tools, strict recursion limits, and read-only sandboxes.
          </p>
        </div>

        {/* SEQUENTIAL DELEGATION FLOWCHART (Requirement 323-331) */}
        <div className="p-6 rounded-2xl border border-border/70 bg-card/70 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
              Delegation Pipeline Example • Pre-Release Investigation
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">Sequential Bounded Execution</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-1">
            {[
              {
                step: "01",
                role: "Central Copilot",
                action: "Plans mission & assigns bounded subtasks",
                icon: BrainCircuit,
                color: "text-primary",
              },
              {
                step: "02",
                role: "Security Analyst",
                action: "Executes Bandit AST scan for CWE-89 flaws",
                icon: ShieldAlert,
                color: "text-rose-400",
              },
              {
                step: "03",
                role: "Requirements Agent",
                action: "Verifies 100% EARS acceptance coverage",
                icon: CheckCircle2,
                color: "text-cyan-400",
              },
              {
                step: "04",
                role: "Data Quality Agent",
                action: "Checks null drift & schema consistency",
                icon: Database,
                color: "text-amber-400",
              },
              {
                step: "05",
                role: "Risk Analyst",
                action: "Calculates technical debt & schedule slip",
                icon: TrendingUp,
                color: "text-indigo-400",
              },
              {
                step: "06",
                role: "Report Generator",
                action: "Compiles signed PDF publication",
                icon: FileText,
                color: "text-emerald-400",
              },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="p-3.5 rounded-xl border border-border/60 bg-secondary/30 space-y-1.5 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground">{step.step}</span>
                    <Icon className={`size-4 ${step.color}`} />
                  </div>
                  <div className="text-xs font-bold text-foreground">{step.role}</div>
                  <div className="text-[11px] text-muted-foreground leading-tight">{step.action}</div>

                  {idx < 5 && (
                    <span className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-xs">
                      →
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 7 AGENTS GRID + SELECTED AGENT INSPECTOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AGENT BUTTONS (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SPECIALIST_AGENTS.map((agent) => {
              const Icon = agent.icon;
              const isSelected = agent.id === selectedAgentId;

              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 relative ${
                    isSelected
                      ? "border-primary bg-primary/15 shadow-md ring-1 ring-primary/30"
                      : "border-border/60 bg-card/60 hover:border-primary/40 hover:bg-card"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-bold text-foreground">{agent.name}</div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{agent.role}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* AGENT DETAIL PANEL (5 cols) */}
          <div className="lg:col-span-5">
            <Card className="border-border/80 bg-card/90 shadow-xl backdrop-blur-sm sticky top-24">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2 pb-4 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs font-mono border-primary/40 text-primary">
                      Specialist Inspector
                    </Badge>
                    <span className="text-[10px] font-mono text-muted-foreground">ID: {selectedAgent.id}</span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    {selectedAgent.name}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedAgent.role}</p>
                </div>

                {/* BOUNDED SCOPE */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Bounded Execution Safeguards
                  </div>
                  <p className="text-xs text-foreground/90 bg-secondary/30 p-3 rounded-lg border border-border/40 font-medium">
                    {selectedAgent.boundedScope}
                  </p>
                </div>

                {/* ASSIGNED TOOLS */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    Assigned Execution Tools
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAgent.toolsAssigned.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded border border-border/60 bg-background text-cyan-300"
                      >
                        tool::{t}()
                      </span>
                    ))}
                  </div>
                </div>

                {/* SAMPLE DELEGATION CALL */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                    Sample Copilot Delegation Call
                  </div>
                  <p className="text-xs font-mono text-foreground/80 bg-background/80 p-3 rounded-lg border border-border/40 leading-relaxed">
                    {selectedAgent.sampleDelegation}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
