import { useState } from "react";
import { TECHNOLOGY_TIERS, TechTier } from "./showcaseData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  BrainCircuit,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  FileText,
  Globe,
  HardDrive,
  Layers,
  Lock,
  Network,
  Radio,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";

export function TechnologyMatrixSection() {
  const [activeTierLayer, setActiveTierLayer] = useState<string>("01");

  const activeTier: TechTier =
    TECHNOLOGY_TIERS.find((t) => t.layer === activeTierLayer) ?? TECHNOLOGY_TIERS[0]!;

  return (
    <section id="technology" className="py-20 border-b border-border/60 bg-secondary/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
            <Layers className="size-3.5" />
            <span>The Technical Stack • 8 Architectural Layers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Built on a Resilient Engineering Foundation
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            PROJECT BRAHMA is not an API wrapper or a superficial dashboard. It is an end-to-end engineering system
            integrating Python AST analyzers, Bandit vulnerability parsers, PostgreSQL row-level security, and a
            multi-provider AI Gateway.
          </p>
        </div>

        {/* 8-LAYER HORIZONTAL SELECTOR (Requirement 267-275) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {TECHNOLOGY_TIERS.map((tier) => {
            const isSelected = tier.layer === activeTierLayer;
            return (
              <button
                key={tier.layer}
                onClick={() => setActiveTierLayer(tier.layer)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-105"
                    : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <div className="text-[10px] font-mono opacity-80">Tier {tier.layer}</div>
                <div className="text-xs font-bold truncate">{tier.name.split(" ")[0]}</div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE TIER DEEP DIVE BOARD */}
        <Card className="border-border/80 bg-card/90 shadow-xl backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary">
                    Architectural Layer {activeTier.layer}
                  </Badge>
                  <h3 className="text-xl font-bold text-foreground">{activeTier.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {activeTier.technologies.length} Verified Technologies In This Tier
                </p>
              </div>

              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs font-mono self-start">
                Enterprise Production Proven
              </Badge>
            </div>

            {/* TECHNOLOGIES IN THIS TIER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTier.technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="p-4 rounded-xl border border-border/60 bg-secondary/20 space-y-2 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground">{tech.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border/60 text-muted-foreground">
                      {tech.category}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="text-foreground/90 font-medium leading-tight">
                      <span className="text-muted-foreground font-mono text-[10px] uppercase">Role: </span>
                      {tech.role}
                    </div>
                    <div className="text-muted-foreground leading-relaxed pt-1 border-t border-border/40">
                      <span className="text-cyan-400 font-mono text-[10px] uppercase">Why Chosen: </span>
                      {tech.whyChosen}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TECHNICAL DETAILS DRAWER / ADVANCED CALLOUT */}
            <div className="p-4 rounded-xl border border-border/60 bg-background/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Terminal className="size-4 text-primary" />
                <span>Deterministic Gate Invariance: Strict TypeScript compilation with 0 index signature errors.</span>
              </div>
              <span className="text-emerald-400 font-bold">100% PASS (T1–T12 Verified)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
