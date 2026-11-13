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
  Network,
  Database,
  Lock,
} from "lucide-react";
import { SHOWCASE_TOKENS } from "@/styles/vyron-auth-tokens";
import { cn } from "@/lib/utils";

interface CapabilityItem {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  metric: string;
  desc: string;
  nodes: Array<{ label: string; value: string; color: string; status: string }>;
}

export function GraphiteOceanShowcase() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const capabilities: CapabilityItem[] = [
    {
      id: "forensics",
      title: "12-Stage Forensics & AST",
      shortTitle: "AST Forensics",
      icon: FileCode,
      tag: "COMPLEXITY & CYCLOMATIC",
      metric: "Verified AST Tree",
      desc: "AST traversal analyzing maintainability index, Halstead volume, and code smell distribution before promotion.",
      nodes: [
        { label: "AST Parse", value: "Verified Safe", color: "text-[#6DA5C0]", status: "COMPLETE" },
        { label: "Cyclomatic", value: "Grade A (<8)", color: "text-emerald-400", status: "OPTIMAL" },
        { label: "Halstead Vol", value: "1,240 Bits", color: "text-teal-300", status: "STABLE" },
      ],
    },
    {
      id: "systems",
      title: "18 BRAHMA Engineering Systems",
      shortTitle: "18 Systems",
      icon: Layers,
      tag: "REALITY MAP & TWIN",
      metric: "30 Nav Domains",
      desc: "Comprehensive engineering workspace synchronizing architecture blueprints with running cloud realities.",
      nodes: [
        { label: "Reality Map", value: "18 Systems", color: "text-[#6DA5C0]", status: "ACTIVE" },
        { label: "Digital Twin", value: "Synchronized", color: "text-emerald-400", status: "ONLINE" },
        { label: "Bus Topology", value: "0ms Stale", color: "text-teal-300", status: "CONFIRMED" },
      ],
    },
    {
      id: "drift",
      title: "Architecture Drift & Causal Impact",
      shortTitle: "Drift Telemetry",
      icon: Compass,
      tag: "STATIC & RUNTIME TRUTH",
      metric: "0.00% Drift",
      desc: "Identifies architectural divergences between intended SRS requirements and deployed software topology.",
      nodes: [
        { label: "SRS Blueprint", value: "Contract v5", color: "text-[#6DA5C0]", status: "SPEC" },
        { label: "Live Codebase", value: "Aligned", color: "text-emerald-400", status: "MONITORED" },
        { label: "Drift Delta", value: "0 Divergences", color: "text-teal-300", status: "CLEAN" },
      ],
    },
    {
      id: "verification",
      title: "25-Gate Autonomous Verification",
      shortTitle: "25 SDLC Gates",
      icon: ShieldCheck,
      tag: "ZERO-FICTION AUDIT",
      metric: "SHA-256 Ledger",
      desc: "Strict automated gates verifying cross-boundary security, AST integrity, and tamper-evident audit ledgers.",
      nodes: [
        { label: "Security Boundary", value: "Pass (Gate 01)", color: "text-[#6DA5C0]", status: "PASSED" },
        { label: "Code Integrity", value: "Pass (Gate 12)", color: "text-emerald-400", status: "PASSED" },
        { label: "Audit Ledger", value: "24/25 PASS", color: "text-teal-300", status: "GATED" },
      ],
    },
  ];

  const currentCap: CapabilityItem = capabilities[activeTab] ?? capabilities[0]!;

  return (
    <div
      className="hidden lg:flex flex-col justify-between p-8 xl:p-12 border-l border-white/10 relative overflow-hidden h-full min-h-screen select-none"
      style={{
        backgroundColor: SHOWCASE_TOKENS.bg,
        color: SHOWCASE_TOKENS.primaryText,
      }}
    >
      {/* Background Volumetric Radial Glows */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: SHOWCASE_TOKENS.cyanAccent }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-15 blur-3xl"
        style={{ backgroundColor: SHOWCASE_TOKENS.coralDetail }}
        aria-hidden="true"
      />

      {/* Top Header */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-[#0F969C] animate-pulse shadow-[0_0_8px_#0F969C]" />
          <span className="text-[10px] font-mono tracking-widest text-[#6DA5C0] uppercase">
            18-SHADE VOLUMETRIC GLASS · ENGINEERING THEATER
          </span>
        </div>

        <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
          Engineering clarity,
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, #6DA5C0, #0F969C, #0C7075)",
            }}
          >
            from idea to deployment.
          </span>
        </h1>

        <p className="text-xs xl:text-sm text-muted-foreground max-w-lg leading-relaxed">
          Understand your architecture. Verify your changes. Ship with cryptographic confidence across
          30 engineering domains.
        </p>
      </div>

      {/* Interactive Architecture Preview Box */}
      <div className="relative z-10 my-8">
        <div className="rounded-2xl border border-white/10 bg-[#1A1A1A]/60 p-5 backdrop-blur-xl shadow-[0_15px_35px_rgba(15,150,156,0.2)] relative overflow-hidden glass-3d-surface">
          {/* Top Window Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/5 text-[11px] font-mono text-muted-foreground">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="size-2.5 rounded-full bg-red-500/70 shrink-0" />
              <div className="size-2.5 rounded-full bg-amber-500/70 shrink-0" />
              <div className="size-2.5 rounded-full bg-emerald-500/70 shrink-0" />
              <span className="ml-1 sm:ml-2 text-foreground font-semibold truncate text-[10px] sm:text-xs">
                vyron.engine::telemetry_fabric
              </span>
            </div>
            {/* Zero-Fiction Grounded Label */}
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap shrink-0">
              ● SAMPLE BENCHMARK (ZERO-FICTION)
            </span>
          </div>

          {/* Active capability view */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-mono tracking-wider text-[#6DA5C0] uppercase">
                  {currentCap.tag}
                </span>
                <h3 className="text-base font-bold text-foreground">
                  {currentCap.title}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-foreground bg-white/5 px-2 py-1 rounded border border-white/10">
                {currentCap.metric}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {currentCap.desc}
            </p>

            {/* Architecture Node Diagram Simulation with Connecting Lines */}
            <div className="relative pt-2">
              {/* Connecting SVG Bus Line */}
              <svg
                className="absolute top-1/2 left-0 right-0 w-full h-8 -translate-y-1/2 pointer-events-none hidden sm:block opacity-40"
                viewBox="0 0 400 32"
                preserveAspectRatio="none"
              >
                <path
                  d="M 60 16 L 340 16"
                  stroke="#0F969C"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  fill="none"
                />
              </svg>

              <div className="grid grid-cols-3 gap-2 relative z-10">
                {currentCap.nodes.map((node, i) => (
                  <div
                    key={node.label}
                    className="rounded-lg border border-white/10 bg-[#0B0B0B]/90 p-2.5 text-center backdrop-blur-md transition-all hover:border-white/20"
                  >
                    <div className="flex items-center justify-between text-[9px] text-muted-foreground font-mono mb-1">
                      <span>0{i + 1}</span>
                      <span className="text-[8px] text-emerald-400/80">{node.status}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono block truncate">
                      {node.label}
                    </span>
                    <span className={cn("text-xs font-bold font-mono block mt-0.5", node.color)}>
                      {node.value}
                    </span>
                  </div>
                ))}
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
                key={c.id}
                type="button"
                onClick={() => setActiveTab(i)}
                className={cn(
                  "p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between text-[10px]",
                  isSelected
                    ? "border-[#0F969C] bg-[#0F969C]/20 text-foreground font-semibold shadow-[0_0_12px_rgba(15,150,156,0.3)]"
                    : "border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground hover:bg-white/[0.06] hover:border-white/20",
                )}
              >
                <Icon className={cn("size-3.5 mb-1", isSelected ? "text-[#6DA5C0]" : "")} />
                <span className="truncate leading-tight font-medium">{c.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-3.5 text-emerald-400" />
          <span>Zero-Fiction Architecture Law Enforced</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">v5.2.0-STABLE</span>
      </div>
    </div>
  );
}
