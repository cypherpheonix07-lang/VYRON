import React, { useState } from "react";
import {
  Activity,
  Layers,
  ShieldCheck,
  Workflow,
  Sparkles,
  GitPullRequest,
  CheckCircle2,
  Terminal,
  Cpu,
  Compass,
  FileCode,
} from "lucide-react";
import { SHOWCASE_TOKENS } from "@/styles/vyron-auth-tokens";
import { cn } from "@/lib/utils";

export function GraphiteOceanShowcase() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const capabilities = [
    {
      title: "12-Stage Forensics & AST",
      icon: FileCode,
      tag: "COMPLEXITY & CYCLOMATIC",
      metric: "0 Fabricated Metrics",
      desc: "AST traversal analyzing maintainability index, Halstead volume, and code smell distribution before promotion.",
    },
    {
      title: "18 BRAHMA Engineering Systems",
      icon: Layers,
      tag: "REALITY MAP & TWIN",
      metric: "30 Nav Domains",
      desc: "Comprehensive engineering workspace synchronizing architecture blueprints with running cloud realities.",
    },
    {
      title: "Architecture Drift & Causal Impact",
      icon: Compass,
      tag: "STATIC & RUNTIME TRUTH",
      metric: "Real-time Delta",
      desc: "Identifies architectural divergences between intended SRS requirements and deployed software topology.",
    },
    {
      title: "25-Gate Autonomous Verification",
      icon: ShieldCheck,
      tag: "ZERO-FICTION AUDIT",
      metric: "Cryptographic SHA-256",
      desc: "Strict automated gates verifying cross-boundary security, AST integrity, and tamper-evident audit ledgers.",
    },
  ];

  return (
    <div
      className="hidden lg:flex flex-col justify-between p-8 xl:p-12 border-l border-[#1C2B38] relative overflow-hidden h-full min-h-screen"
      style={{
        backgroundColor: SHOWCASE_TOKENS.bg,
        color: SHOWCASE_TOKENS.primaryText,
      }}
    >
      {/* Background Radial Glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: SHOWCASE_TOKENS.cyanAccent }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: SHOWCASE_TOKENS.coralDetail }}
        aria-hidden="true"
      />

      {/* Top Header */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-[#65DFE8] animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-[#65DFE8] uppercase">
            GRAPHITE OCEAN · ENGINEERING THEATER
          </span>
        </div>

        <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
          Engineering clarity,
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: `linear-gradient(135deg, ${SHOWCASE_TOKENS.cyanAccent}, #99D9EA, ${SHOWCASE_TOKENS.coralDetail})`,
            }}
          >
            from idea to deployment.
          </span>
        </h1>

        <p className="text-xs xl:text-sm text-[#A0B2C6] max-w-lg leading-relaxed">
          Understand your architecture. Verify your changes. Ship with cryptographic confidence across
          30 engineering domains.
        </p>
      </div>

      {/* Interactive Architecture Preview Box */}
      <div className="relative z-10 my-8">
        <div className="rounded-2xl border border-[#1C2B38] bg-[#101A18]/80 p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 text-[11px] font-mono text-[#A0B2C6]">
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-full bg-red-500/70" />
              <div className="size-2.5 rounded-full bg-amber-500/70" />
              <div className="size-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-2 text-foreground font-semibold">
                vyron.engine::telemetry_fabric
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              ● REALTIME LIVE
            </span>
          </div>

          {/* Active capability view */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-mono tracking-wider text-[#65DFE8] uppercase">
                  {capabilities[activeTab]?.tag}
                </span>
                <h3 className="text-base font-bold text-foreground">
                  {capabilities[activeTab]?.title}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-foreground bg-white/5 px-2 py-1 rounded border border-white/10">
                {capabilities[activeTab]?.metric}
              </span>
            </div>

            <p className="text-xs text-[#A0B2C6] leading-relaxed">
              {capabilities[activeTab]?.desc}
            </p>

            {/* Architecture Node Diagram Simulation */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="rounded-lg border border-[#1C2B38] bg-[#070C0B]/80 p-2.5 text-center">
                <span className="text-[9px] text-muted-foreground font-mono block">Node A (AST)</span>
                <span className="text-xs font-bold text-[#65DFE8] font-mono">Clean Tree</span>
              </div>
              <div className="rounded-lg border border-[#1C2B38] bg-[#070C0B]/80 p-2.5 text-center">
                <span className="text-[9px] text-muted-foreground font-mono block">Node B (Twin)</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">Synchronized</span>
              </div>
              <div className="rounded-lg border border-[#1C2B38] bg-[#070C0B]/80 p-2.5 text-center">
                <span className="text-[9px] text-muted-foreground font-mono block">Node C (Gate)</span>
                <span className="text-xs font-bold text-[#FF9B91] font-mono">24/25 PASS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selector Buttons */}
        <div className="grid grid-cols-4 gap-1.5 mt-3">
          {capabilities.map((c, i) => {
            const Icon = c.icon;
            const isSelected = activeTab === i;

            return (
              <button
                key={c.title}
                type="button"
                onClick={() => setActiveTab(i)}
                className={cn(
                  "p-2 rounded-lg border text-left transition-all flex flex-col justify-between text-[10px]",
                  isSelected
                    ? "border-[#65DFE8] bg-[#101A18] text-foreground font-semibold shadow-md"
                    : "border-[#1C2B38] bg-[#090F18]/50 text-muted-foreground hover:text-foreground hover:bg-[#101A18]/50",
                )}
              >
                <Icon className={cn("size-3.5 mb-1", isSelected ? "text-[#65DFE8]" : "")} />
                <span className="truncate leading-tight">{c.title.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-4 border-t border-[#1C2B38] flex items-center justify-between text-[11px] text-[#A0B2C6]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-3.5 text-emerald-400" />
          <span>Zero-Fiction Architecture Law Enforced</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">v5.2.0-STABLE</span>
      </div>
    </div>
  );
}
