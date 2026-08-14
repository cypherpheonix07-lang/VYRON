import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Network,
  ShieldCheck,
  ShieldAlert,
  Target,
  FileCode,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  Database,
  Terminal,
  X,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// 1. Node Information Dictionary for Side-Sheet
interface NodeInfo {
  id: string;
  name: string;
  category: string;
  desc: string;
  latency: string;
  status: "active" | "verified" | "monitoring";
  heuristic: string;
}

const nodeDictionary: Record<string, NodeInfo> = {
  prompt: {
    id: "prompt",
    name: "User Intent & PRD Prompt",
    category: "Ingest Layer",
    desc: "Ingests raw natural language specifications, SRS PDFs, and user stories into tokenized semantic vectors.",
    latency: "12ms",
    status: "active",
    heuristic: "Cosine similarity intent matching with 94.2% precision across domain ontologies.",
  },
  ast: {
    id: "ast",
    name: "AST & Requirement Extractor",
    category: "Parsing Engine",
    desc: "Extracts functional and non-functional requirements, identifying actors, modules, database entities, and constraints.",
    latency: "84ms",
    status: "verified",
    heuristic: "Deterministic parsing matching ISO/IEC/IEEE 29148 requirements specifications.",
  },
  planner: {
    id: "planner",
    name: "LLM Blueprint Planner",
    category: "Synthesis Engine",
    desc: "Generates multi-tier microservices architecture, API route contracts, and relational schemas without hallucinations.",
    latency: "320ms",
    status: "active",
    heuristic: "Enforces 12-factor application architecture rules and decoupled state boundaries.",
  },
  traceability: {
    id: "traceability",
    name: "Traceability Matrix Linker",
    category: "Validation Layer",
    desc: "Maintains bidirectional cryptographic lineage from every user requirement to architecture components and test suites.",
    latency: "45ms",
    status: "verified",
    heuristic: "Zero unmapped requirement drift gate enforcement.",
  },
  sentinel: {
    id: "sentinel",
    name: "Security Sentinel Node",
    category: "Threat Modeling",
    desc: "Runs automated STRIDE threat modeling, OWASP Top 10 rule validation, and CWE vulnerability scanning.",
    latency: "140ms",
    status: "monitoring",
    heuristic: "Blocks builds with CVSS score >= 7.0 at the Publish Gate.",
  },
  sync: {
    id: "sync",
    name: "Sync Target & VCS Adapter",
    category: "Deployment Layer",
    desc: "Emits verified blueprint specifications to Git repositories, OpenAPI schemas, Dockerfiles, and cloud infrastructure.",
    latency: "60ms",
    status: "verified",
    heuristic: "Automated webhook push listeners with tamper-evident SHA-256 signatures.",
  },
};

// 2. Animated Interactive Blueprint Graph
export function BlueprintGraphAnimated({
  onSelectNode,
}: {
  onSelectNode: (node: NodeInfo) => void;
}) {
  const [activePulse, setActivePulse] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePulse((p) => (p + 1) % 6);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const nodes = [
    { key: "prompt", label: "User Prompt", x: 60, y: 110, icon: Sparkles },
    { key: "ast", label: "AST Extractor", x: 220, y: 50, icon: Layers },
    { key: "planner", label: "LLM Planner", x: 380, y: 50, icon: Network },
    { key: "traceability", label: "Traceability", x: 220, y: 170, icon: Target },
    { key: "sentinel", label: "Security Sentinel", x: 380, y: 170, icon: ShieldCheck },
    { key: "sync", label: "Sync Target", x: 540, y: 110, icon: Database },
  ];

  return (
    <div className="relative w-full h-[240px] select-none rounded-xl border border-border/80 bg-zinc-950/70 p-2 overflow-hidden shadow-inner">
      <svg className="absolute inset-0 size-full pointer-events-none" viewBox="0 0 600 240">
        {/* Animated Dashed Edge Connections */}
        <defs>
          <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Edges */}
        <path
          d="M 120 110 L 220 50"
          stroke="url(#edgeGlow)"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[dash_20s_linear_infinite]"
        />
        <path
          d="M 120 110 L 220 170"
          stroke="url(#edgeGlow)"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[dash_20s_linear_infinite]"
        />
        <path
          d="M 280 50 L 380 50"
          stroke="url(#edgeGlow)"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[dash_20s_linear_infinite]"
        />
        <path
          d="M 280 170 L 380 170"
          stroke="url(#edgeGlow)"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[dash_20s_linear_infinite]"
        />
        <path
          d="M 440 50 L 540 110"
          stroke="url(#edgeGlow)"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[dash_20s_linear_infinite]"
        />
        <path
          d="M 440 170 L 540 110"
          stroke="url(#edgeGlow)"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[dash_20s_linear_infinite]"
        />
        <path d="M 280 50 L 380 170" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M 280 170 L 380 50" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
      </svg>

      {/* Nodes */}
      {nodes.map((n, idx) => {
        const info = nodeDictionary[n.key];
        const isPulsing = activePulse === idx;
        const Icon = n.icon;

        return (
          <div
            key={n.key}
            onClick={() => info && onSelectNode(info)}
            style={{ left: `${n.x}px`, top: `${n.y}px` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center gap-1 z-10 transition-transform hover:scale-110`}
          >
            <div
              className={`grid size-10 place-items-center rounded-xl border bg-slate-900 shadow-md transition-all ${
                isPulsing
                  ? "border-primary text-primary ring-4 ring-primary/20 scale-105"
                  : "border-slate-700/80 text-slate-300 group-hover:border-primary/60 group-hover:text-white"
              }`}
            >
              <Icon className="size-4" />
            </div>
            <span className="text-[10px] font-semibold text-slate-300 bg-slate-950/80 px-1.5 py-0.5 rounded-md border border-slate-800 tracking-tight whitespace-nowrap">
              {n.label}
            </span>
          </div>
        );
      })}

      <div className="absolute bottom-2 right-3 text-[9px] text-muted-foreground/60 font-mono flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>Click node to inspect heuristics</span>
      </div>
    </div>
  );
}

// 3. Traceability Mini-Matrix Scene
export function TraceabilityMiniMatrix() {
  const links = [
    {
      req: "REQ-01 (Auth 2FA)",
      arch: "VaultAuthService",
      test: "test_2fa_totp.py",
      status: "Linked",
    },
    {
      req: "REQ-02 (PCI-DSS Ledger)",
      arch: "PaymentOrchestrator",
      test: "test_token_vault.go",
      status: "Linked",
    },
    {
      req: "REQ-03 (FHIR Telemetry)",
      arch: "TelemetryIngestor",
      test: "test_fhir_sync.rs",
      status: "Linked",
    },
    {
      req: "REQ-04 (Role Self-Change)",
      arch: "SecurityTrigger",
      test: "test_rbac_guard.sql",
      status: "Linked",
    },
  ];

  return (
    <div className="h-[240px] rounded-xl border border-border/80 bg-zinc-950/70 p-4 overflow-y-auto space-y-2">
      <div className="flex items-center justify-between text-xs pb-1 border-b border-border/40">
        <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider">
          Live Traceability Lineage
        </span>
        <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
          100% Coverage
        </Badge>
      </div>

      <div className="space-y-1.5 text-xs font-mono">
        {links.map((l) => (
          <div
            key={l.req}
            className="flex items-center justify-between p-2 rounded-lg bg-secondary/25 border border-border/40 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-semibold">{l.req}</span>
              <ArrowRight className="size-3 text-muted-foreground" />
              <span className="text-indigo-300">{l.arch}</span>
              <ArrowRight className="size-3 text-muted-foreground" />
              <span className="text-slate-400 text-[10px]">{l.test}</span>
            </div>
            <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="size-3" /> {l.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Risk Gauge Cluster Scene
export function RiskGaugeCluster() {
  return (
    <div className="h-[240px] rounded-xl border border-border/80 bg-zinc-950/70 p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between text-xs pb-1 border-b border-border/40">
        <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider">
          Delivery Risk & Technical Debt Cluster
        </span>
        <span className="text-[10px] text-muted-foreground font-mono">Realtime Forecast</span>
      </div>

      <div className="grid grid-cols-3 gap-3 py-2 text-center">
        <div className="rounded-lg border border-border/60 bg-secondary/20 p-3 space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            Architecture Health
          </p>
          <p className="text-2xl font-extrabold text-[var(--success)]">94.8%</p>
          <p className="text-[10px] text-muted-foreground">Optimal coupling</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-secondary/20 p-3 space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            Delivery Delay Risk
          </p>
          <p className="text-2xl font-extrabold text-cyan-400">Low (4d)</p>
          <p className="text-[10px] text-muted-foreground">Within schedule</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-secondary/20 p-3 space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            Critical Vulnerabilities
          </p>
          <p className="text-2xl font-extrabold text-green-400">0 CVE</p>
          <p className="text-[10px] text-muted-foreground">Gate passing</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2 font-mono">
        <span>Cyclomatic Max: 8</span>
        <span>Duplication: 1.8%</span>
        <span>Test Pass Rate: 100%</span>
      </div>
    </div>
  );
}

// 5. Scene Rotator Container (8s rotation, hover pause, reduced motion)
export function ShowcaseSceneRotator() {
  const [scene, setScene] = useState<0 | 1 | 2>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setScene((s) => ((s + 1) % 3) as 0 | 1 | 2);
    }, 8000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      className="space-y-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative">
        {scene === 0 && <BlueprintGraphAnimated onSelectNode={(n) => setSelectedNode(n)} />}
        {scene === 1 && <TraceabilityMiniMatrix />}
        {scene === 2 && <RiskGaugeCluster />}
      </div>

      {/* Progress Dots & Scene Switcher */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => setScene(idx as 0 | 1 | 2)}
              className={`h-1.5 rounded-full transition-all ${
                scene === idx ? "w-6 bg-primary" : "w-1.5 bg-secondary hover:bg-muted-foreground"
              }`}
              title={`Switch to Scene ${idx + 1}`}
            />
          ))}
          <span className="text-[10px] text-muted-foreground font-mono ml-2">
            {scene === 0
              ? "1/3: Blueprint Graph"
              : scene === 1
                ? "2/3: Traceability Matrix"
                : "3/3: Risk Gauges"}
          </span>
        </div>

        <span className="text-[10px] text-muted-foreground/60 font-mono">
          {isPaused ? "Paused on hover" : "Auto-rotating (8s)"}
        </span>
      </div>

      {/* Node Detail Sheet */}
      <Sheet open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
        <SheetContent className="surface border-border sm:max-w-md">
          {selectedNode && (
            <div className="space-y-5 pt-4">
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono border-primary/40 text-primary"
                  >
                    {selectedNode.category}
                  </Badge>
                  <Badge className="bg-green-500/10 text-green-400 text-[10px]">
                    Latency {selectedNode.latency}
                  </Badge>
                </div>
                <SheetTitle className="text-lg font-bold text-foreground">
                  {selectedNode.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  {selectedNode.desc}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-3 border-t border-border/40 pt-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Validation Heuristic
                  </p>
                  <p className="text-xs text-foreground bg-secondary/30 p-2.5 rounded-lg border border-border/40 font-mono">
                    {selectedNode.heuristic}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// 6. Alert Ticker
export function AlertTicker() {
  const alerts = [
    {
      type: "Security",
      msg: "0 Critical CVEs detected across 38 active modules.",
      color: "text-green-400",
    },
    {
      type: "Architecture",
      msg: "Service topology validated: 0 circular dependencies.",
      color: "text-cyan-400",
    },
    {
      type: "Compliance",
      msg: "PCI-DSS and HIPAA telemetry audit encryption verified.",
      color: "text-indigo-400",
    },
    {
      type: "Release Gate",
      msg: "All 14 validation tests passing with 100% gate sign-off.",
      color: "text-amber-400",
    },
  ];

  const [activeAlert, setActiveAlert] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAlert((a) => (a + 1) % alerts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const cur = alerts[activeAlert] || alerts[0];
  if (!cur) return null;

  return (
    <div className="rounded-lg border border-border/80 bg-zinc-950/80 px-3 py-2 flex items-center justify-between text-xs shadow-inner">
      <div className="flex items-center gap-2 truncate">
        <span className="size-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
        <span className="font-bold text-foreground shrink-0">[{cur.type}]</span>
        <span className={`truncate text-xs ${cur.color}`}>{cur.msg}</span>
      </div>
      <span className="text-[10px] text-muted-foreground/60 font-mono shrink-0 ml-2">
        {activeAlert + 1}/{alerts.length}
      </span>
    </div>
  );
}

// 7. Release Gate Animator
export function ReleaseGateAnimator() {
  const [phase, setPhase] = useState<"pending" | "running" | "pass">("pass");

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p === "pass" ? "pending" : p === "pending" ? "running" : "pass"));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <div className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
          <ShieldCheck className="size-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Enforced Publish Gate</span>
            <span className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono font-bold">
              <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
              Running Live
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {phase === "pass"
              ? "All 5 quality and security criteria signed off"
              : phase === "running"
                ? "Executing unit tests & SAST vulnerability audit..."
                : "Verifying blueprint constraints..."}
          </p>
        </div>
      </div>
      <Badge
        className={
          phase === "pass"
            ? "bg-green-500/20 text-green-400 border-green-500/30"
            : phase === "running"
              ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 animate-pulse"
              : "bg-amber-500/20 text-amber-400 border-amber-500/30"
        }
      >
        {phase.toUpperCase()}
      </Badge>
    </div>
  );
}

// 8. Metrics Strip
export function MetricsStrip() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
      <div className="rounded-lg border border-border/60 bg-zinc-950/40 p-3 text-center">
        <p className="text-xl font-extrabold text-cyan-400 font-mono">99.4%</p>
        <p className="text-[11px] text-muted-foreground">Architecture Precision</p>
      </div>
      <div className="rounded-lg border border-border/60 bg-zinc-950/40 p-3 text-center">
        <p className="text-xl font-extrabold text-green-400 font-mono">0 CVE</p>
        <p className="text-[11px] text-muted-foreground">Critical Vulnerability Floor</p>
      </div>
      <div className="rounded-lg border border-border/60 bg-zinc-950/40 p-3 text-center">
        <p className="text-xl font-extrabold text-indigo-400 font-mono">100%</p>
        <p className="text-[11px] text-muted-foreground">Traceability Coverage</p>
      </div>
    </div>
  );
}
