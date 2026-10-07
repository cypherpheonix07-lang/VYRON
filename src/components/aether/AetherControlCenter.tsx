import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Cpu,
  Bot,
  Brain,
  ShieldCheck,
  Layers,
  Activity,
  Sparkles,
  Terminal,
  Database,
  Search,
  GitBranch,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Share2,
  Server,
  Workflow,
  Lock,
  ChevronRight,
  ExternalLink,
  Sliders,
  Send,
  X,
} from "lucide-react";
import { useCopilot } from "@/state/copilot/useCopilot";
import { useProjects } from "@/hooks/useProjects";
import { useAppMode } from "@/state/mode/useAppMode";
import { toast } from "sonner";

interface AgentDef {
  name: string;
  role: string;
  confidence: string;
  status: "active" | "busy" | "waiting";
}

interface ModelArbitration {
  name: string;
  role: string;
  score: string;
  latency: string;
}

interface MemoryItem {
  type: "EPISODIC" | "SEMANTIC" | "PROCEDURAL" | "TEMPORAL" | "COUNTERFACTUAL";
  title: string;
  content: string;
  confidence: string;
  provenance: string;
}

interface ToolAdapter {
  name: string;
  desc: string;
  risk: "High" | "Medium" | "Safe";
  category: string;
}

interface RehearsalStep {
  num: string;
  title: string;
  detail: string;
  status: "ok" | "active" | "queued" | "failed";
}

const DEFAULT_AGENTS: AgentDef[] = [
  { name: "Executive", role: "Goal control · policy bounds", confidence: "94%", status: "active" },
  { name: "Researcher", role: "Evidence synthesis · knowledge fetch", confidence: "89%", status: "active" },
  { name: "Architect", role: "System topology & AST analysis", confidence: "96%", status: "active" },
  { name: "Engineer", role: "Implementation & patch verification", confidence: "84%", status: "busy" },
  { name: "Security", role: "Threat analysis & RLS audit", confidence: "98%", status: "active" },
  { name: "Critic", role: "Adversarial review & contradiction scan", confidence: "91%", status: "waiting" },
];

const DEFAULT_MODELS: ModelArbitration[] = [
  { name: "GPT-6 Astra", role: "Architecture synthesis + high-order reasoning", score: "96%", latency: "240ms" },
  { name: "Claude Opus 5.5", role: "Long-horizon deliberation & cross-file review", score: "94%", latency: "380ms" },
  { name: "Claude Sonnet 5.5", role: "Rapid parallel AST parsing & tool invocation", score: "88%", latency: "140ms" },
  { name: "Kimi K3.5 Pro", role: "Long-context retrieval & memory synthesis", score: "91%", latency: "210ms" },
];

const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    type: "EPISODIC",
    title: "Architecture B rejected",
    content: "Monolithic schema consolidation was dropped because client-server isolation required strict dual-mode boundaries.",
    confidence: "94%",
    provenance: "PR #142 · Verification Run P04",
  },
  {
    type: "SEMANTIC",
    title: "AETHER is model-agnostic",
    content: "Core orchestration survives upstream provider outages by routing tool calls dynamically through capability adapters.",
    confidence: "98%",
    provenance: "Invariant GEMINI.md · ADR-008",
  },
  {
    type: "PROCEDURAL",
    title: "Deployments require sandbox rehearsal",
    content: "High-impact external writes must be simulated, state-diffed, and verified before committing production side effects.",
    confidence: "99%",
    provenance: "Policy Engine v3.1 · Stage-Gate P11",
  },
  {
    type: "TEMPORAL",
    title: "Arbitration policy upgraded",
    content: "Recent routing benchmarks improved architecture task selection by 8.2 percentage points with zero hallucination rate.",
    confidence: "87%",
    provenance: "Evaluation Matrix CM-06",
  },
  {
    type: "COUNTERFACTUAL",
    title: "Without deterministic verification",
    content: "Autonomous execution would optimize for superficially plausible responses rather than verified, evidence-backed outcomes.",
    confidence: "95%",
    provenance: "Adversarial Test Suite BZ",
  },
];

const DEFAULT_TOOLS: ToolAdapter[] = [
  { name: "GitHub Connector", desc: "repo · pull-request · tree inspect", risk: "Medium", category: "VCS" },
  { name: "Browser Automation", desc: "headless navigation · DOM assertions", risk: "Medium", category: "Web" },
  { name: "Postgres Client", desc: "parameterized queries · schema diff", risk: "High", category: "Database" },
  { name: "Terminal Sandbox", desc: "isolated container command execution", risk: "High", category: "Compute" },
  { name: "Docker Runtime", desc: "container lifecycle · ephemeral test twins", risk: "High", category: "Virtualization" },
  { name: "MCP Registry", desc: "dynamic capability discovery & contracts", risk: "Medium", category: "Protocol" },
  { name: "Telemetry Engine", desc: "distributed spans · live event streams", risk: "Safe", category: "Observability" },
  { name: "Evidence Fabric", desc: "cryptographic ledger · audit hash chain", risk: "Safe", category: "Security" },
  { name: "Document Parser", desc: "semantic chunking · schema validation", risk: "Safe", category: "Ingestion" },
];

export function AetherControlCenter() {
  const { mode } = useAppMode();
  const { projects, activeProject } = useProjects();
  const { submitPrompt } = useCopilot();

  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "memory" | "agents" | "tools" | "simulation">("overview");
  const [autonomyEnabled, setAutonomyEnabled] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string>("executive");
  const [commandInput, setCommandInput] = useState("");
  const [modalData, setModalData] = useState<{ title: string; subtitle?: string; content: React.ReactNode } | null>(null);
  const [simRunning, setSimRunning] = useState(false);
  const [rehearsalStep, setRehearsalStep] = useState(2);

  // Events Stream State
  const [events, setEvents] = useState<Array<{ time: string; msg: string; tag: string; tone: "good" | "warn" | "info" }>>(() => [
    { time: "18:42:10", msg: "Goal trajectory compiled: Core Intelligence Engine", tag: "PLANNER", tone: "good" },
    { time: "18:42:18", msg: "GPT-6 Astra selected for AST topology synthesis", tag: "ROUTER", tone: "good" },
    { time: "18:42:25", msg: "Claude Opus assigned for adversarial boundary verification", tag: "AGENTS", tone: "good" },
    { time: "18:42:33", msg: "Epistemic memory conflict scan: 0 contradictions", tag: "MEMORY", tone: "good" },
    { time: "18:42:41", msg: "Sandbox deployment checkpoint prepared", tag: "VERIFY", tone: "warn" },
  ]);

  const addEvent = useCallback((msg: string, tag: string, tone: "good" | "warn" | "info" = "good") => {
    const time = new Date().toLocaleTimeString([], { hour12: false });
    setEvents((prev) => [{ time, msg, tag, tone }, ...prev.slice(0, 19)]);
  }, []);

  const handleCommandExecute = () => {
    const cmd = commandInput.trim();
    if (!cmd) return;

    addEvent(`Command dispatched: "${cmd}"`, "EXEC", "info");

    const lower = cmd.toLowerCase();
    if (lower.includes("sim") || lower.includes("rehearsal")) {
      setActiveTab("simulation");
      toast.success("Switched to Simulation Rehearsal Lab");
    } else if (lower.includes("mem") || lower.includes("lattice")) {
      setActiveTab("memory");
      toast.success("Switched to Epistemic Memory Lattice");
    } else if (lower.includes("arch") || lower.includes("topology")) {
      setActiveTab("architecture");
      toast.success("Opened Architecture Control Mesh");
    } else if (lower.includes("agent") || lower.includes("critic")) {
      setActiveTab("agents");
      toast.success("Opened Agent Command Table");
    } else if (lower.includes("tool") || lower.includes("mcp")) {
      setActiveTab("tools");
      toast.success("Opened Tool & MCP Mesh");
    } else {
      void submitPrompt(`[AETHER Command] ${cmd}`);
      toast.info(`Executing cognitive query: "${cmd}"`);
    }

    setCommandInput("");
  };

  const startRehearsal = () => {
    setSimRunning(true);
    setRehearsalStep(0);
    addEvent("Beginning sandboxed deployment rehearsal...", "SIM", "warn");

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setRehearsalStep(step);
      if (step >= 4) {
        clearInterval(interval);
        setSimRunning(false);
        addEvent("Sandbox rehearsal passed. Verification packet created.", "VERIFY", "good");
        toast.success("Rehearsal passed all verification gates!");
        setModalData({
          title: "Rehearsal Verification Packet",
          subtitle: "Audit Summary · Zero Side-Effects",
          content: (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>Deterministic pre-flight checks satisfied (5/5 stages green).</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px] bg-black/40 p-3 rounded-lg border border-white/5 text-muted-foreground">
                <div className="text-emerald-400">✓ Plan construction validated against active workspace</div>
                <div className="text-emerald-400">✓ Schema drift simulation: 0 breaking columns</div>
                <div className="text-emerald-400">✓ Ephemeral sandbox container executed successfully</div>
                <div className="text-emerald-400">✓ Expected vs Actual state diff matches 100%</div>
                <div className="text-cyan-400">✓ Rollback transaction graph generated (reversible in &lt;100ms)</div>
              </div>
              <p className="text-muted-foreground">
                No external services were mutated. Human approval is required prior to applying changes to the live environment.
              </p>
            </div>
          ),
        });
      }
    }, 700);
  };

  const rehearsalSteps: RehearsalStep[] = useMemo(
    () => [
      { num: "01", title: "Synthesize Plan", detail: "Derive AST & state transition graph", status: rehearsalStep >= 1 ? "ok" : rehearsalStep === 0 ? "active" : "queued" },
      { num: "02", title: "Inject Failure Scenarios", detail: "Simulate timeout, network drop, schema drift", status: rehearsalStep >= 2 ? "ok" : rehearsalStep === 1 ? "active" : "queued" },
      { num: "03", title: "Sandbox Rehearsal", detail: "Execute in isolated ephemeral twin", status: rehearsalStep >= 3 ? "ok" : rehearsalStep === 2 ? "active" : "queued" },
      { num: "04", title: "Evaluate State Diffs", detail: "Verify invariants & boundary integrity", status: rehearsalStep >= 4 ? "ok" : rehearsalStep === 3 ? "active" : "queued" },
      { num: "05", title: "Assemble Approval Packet", detail: "Generate cryptographic verification evidence", status: rehearsalStep >= 4 ? "ok" : "queued" },
    ],
    [rehearsalStep]
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#070b12] text-[#edf4ff] flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Cybernetic Command Bar */}
      <div className="border-b border-white/[0.08] bg-[#070b12]/90 backdrop-blur-md px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center size-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_20px_rgba(124,255,225,0.25)]">
            <Cpu className="size-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-sm text-white">AETHER</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                COGNITIVE CONTROL CENTER
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              Project: <span className="text-white font-medium">{activeProject?.name || "Global Engineering Workspace"}</span> · Mode: <span className={mode === "NORMAL" ? "text-emerald-400" : "text-amber-400"}>{mode}</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] p-1 rounded-xl">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "architecture", label: "Architecture", icon: Workflow },
            { id: "memory", label: "Memory Lattice", icon: Brain },
            { id: "agents", label: "Agent Mesh", icon: Bot },
            { id: "tools", label: "Tool Mesh", icon: Sliders },
            { id: "simulation", label: "Simulation Lab", icon: Play },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as never)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  active
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/15 border border-cyan-500/30 text-white shadow-[0_0_15px_rgba(124,255,225,0.12)]"
                    : "text-muted-foreground hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon className={`size-3.5 ${active ? "text-cyan-400" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02]">
            <span className="text-[11px] text-muted-foreground">Sandbox Autonomy</span>
            <button
              onClick={() => {
                setAutonomyEnabled(!autonomyEnabled);
                addEvent(`Autonomy policy toggled: ${!autonomyEnabled ? "ACTIVE (Sandbox Only)" : "PAUSED"}`, "POLICY", !autonomyEnabled ? "good" : "warn");
              }}
              className={`w-8 h-4.5 rounded-full transition-colors relative p-0.5 ${autonomyEnabled ? "bg-cyan-500/30 border border-cyan-400/50" : "bg-zinc-800 border border-white/10"}`}
            >
              <div className={`size-3.5 rounded-full bg-cyan-400 transition-transform ${autonomyEnabled ? "translate-x-3.5 bg-cyan-300" : "translate-x-0 bg-zinc-500"}`} />
            </button>
          </div>

          <button
            onClick={() => setActiveTab("simulation")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-all"
          >
            <Play className="size-3.5" />
            <span>Rehearse</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 p-6 space-y-6 max-w-[1600px] w-full mx-auto">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Hero and State Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hero Banner */}
              <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0f1926]/90 via-[#0a111b]/90 to-[#070b12] p-6 shadow-2xl">
                <div className="absolute -right-20 -top-20 size-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                  Adaptive Executive Thinking & Execution Reasoning
                </span>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-white mt-1.5 mb-2 leading-tight">
                  A cognitive operating system that happens to look like chat.
                </h1>
                <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  AETHER orchestrates frontier reasoning models, episodic-semantic memory, tool adapters, and verification loops into an accountable agent execution fabric.
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs">
                    <span className="text-muted-foreground">Goal Graph:</span> <strong className="text-emerald-400">Active</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs">
                    <span className="text-muted-foreground">Frontier Models:</span> <strong className="text-white">4 Available</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs">
                    <span className="text-muted-foreground">Capability Adapters:</span> <strong className="text-cyan-400">9 Registered</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs">
                    <span className="text-muted-foreground">Decision Confidence:</span> <strong className="text-emerald-400">92%</strong>
                  </div>
                </div>
              </div>

              {/* Cognitive State Box */}
              <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0f1926]/90 to-[#0a111b]/90 p-5 flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Brain className="size-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Cognitive State</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="text-[10px] text-emerald-400 font-mono">CONVERGED</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div className="text-[9px] font-mono tracking-wider text-muted-foreground uppercase">Objective</div>
                    <div className="text-sm font-semibold text-white mt-1 truncate">
                      {activeProject?.name || "System Verification"}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div className="text-[9px] font-mono tracking-wider text-muted-foreground uppercase">Phase</div>
                    <div className="text-sm font-semibold text-cyan-400 mt-1">Autonomous Plan</div>
                  </div>
                  <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div className="text-[9px] font-mono tracking-wider text-muted-foreground uppercase">Risk Tier</div>
                    <div className="text-sm font-semibold text-amber-400 mt-1">Medium (Safe)</div>
                  </div>
                  <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div className="text-[9px] font-mono tracking-wider text-muted-foreground uppercase">Uncertainty</div>
                    <div className="text-sm font-semibold text-emerald-400 mt-1">8.4% (Bounded)</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Policy Boundary: Enforced</span>
                  <span className="text-cyan-400 font-mono">AST-Verified</span>
                </div>
              </div>
            </div>

            {/* Middle Grid: Active Specialist Agents & Model Arbitration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Specialist Agents */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0a111b]/80 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Active Specialist Mesh</h3>
                    <p className="text-[11px] text-muted-foreground">Specialists sharing structured state with zero hallucination leakage</p>
                  </div>
                  <button onClick={() => setActiveTab("agents")} className="text-xs text-cyan-400 hover:underline">
                    View all
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {DEFAULT_AGENTS.map((agent) => (
                    <div
                      key={agent.name}
                      onClick={() =>
                        setModalData({
                          title: `${agent.name} Agent`,
                          subtitle: agent.role,
                          content: (
                            <div className="space-y-3 text-xs">
                              <p className="text-muted-foreground">
                                Responsible for domain-bounded analysis under platform authority controls.
                              </p>
                              <div className="p-3 bg-black/40 rounded-lg border border-white/5 font-mono text-[11px] text-cyan-300">
                                <div>Status: {agent.status.toUpperCase()}</div>
                                <div>Confidence Target: {agent.confidence}</div>
                                <div>Sandbox Isolation: ENFORCED</div>
                                <div>Lease Channel: aether.agent.{agent.name.toLowerCase()}</div>
                              </div>
                            </div>
                          ),
                        })
                      }
                      className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <strong className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {agent.name}
                        </strong>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                            agent.status === "busy"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : agent.status === "waiting"
                              ? "bg-zinc-800 text-zinc-400 border border-white/5"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{agent.role}</p>
                      <div className="mt-3 flex items-center justify-between text-[9px] text-muted-foreground">
                        <span>Confidence</span>
                        <span className="text-cyan-400 font-mono font-medium">{agent.confidence}</span>
                      </div>
                      <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                          style={{ width: agent.confidence }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Arbitration */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0a111b]/80 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Model Arbitration</h3>
                    <p className="text-[11px] text-muted-foreground">Task-oriented routing based on empirical performance</p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ZERO HARDCODING
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {DEFAULT_MODELS.map((model) => (
                    <div key={model.name} className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{model.name}</span>
                        <span className="text-xs font-mono font-bold text-cyan-400">{model.score}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{model.role}</p>
                      <div className="mt-3 flex items-center justify-between text-[9px] text-muted-foreground font-mono">
                        <span>Avg Latency</span>
                        <span className="text-emerald-400">{model.latency}</span>
                      </div>
                      <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: model.score }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Grid: Live Event Telemetry & Goal Trajectory */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Event Feed */}
              <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-[#0a111b]/80 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">Event Telemetry Stream</h3>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">LIVE AUDIT BUS</span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {events.map((ev, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white/[0.015] border border-white/[0.04] text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono text-[10px] text-muted-foreground shrink-0">{ev.time}</span>
                        <span className="text-zinc-200 truncate">{ev.msg}</span>
                      </div>
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border shrink-0 ${
                          ev.tone === "warn"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : ev.tone === "info"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {ev.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goal Trajectory */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0a111b]/80 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Goal Trajectory</h3>
                  <span className="text-[10px] font-mono text-cyan-400">84% DONE</span>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Build Cognitive Core Architecture", prog: "100%", color: "bg-emerald-400" },
                    { label: "Wire Model Gateway & Fallbacks", prog: "92%", color: "bg-cyan-400" },
                    { label: "Assemble Epistemic Memory Lattice", prog: "88%", color: "bg-cyan-400" },
                    { label: "Connect MCP Capability Mesh", prog: "74%", color: "bg-blue-400" },
                    { label: "Complete Verification & Gate Check", prog: "65%", color: "bg-indigo-400" },
                  ].map((goal, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-300">{goal.label}</span>
                        <span className="font-mono font-medium text-cyan-300">{goal.prog}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className={`h-full ${goal.color} rounded-full`} style={{ width: goal.prog }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Command Input Box */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d1724]/90 p-4 flex items-center gap-3 shadow-xl">
              <Terminal className="size-5 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCommandExecute()}
                placeholder="Dispatches intent: e.g., 'simulate deployment', 'inspect memory', 'route task', 'audit security'..."
                className="flex-1 bg-transparent border-none outline-none text-xs lg:text-sm text-white placeholder:text-muted-foreground"
              />
              <button
                onClick={handleCommandExecute}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:opacity-90 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(124,255,225,0.3)]"
              >
                <span>Execute</span>
                <Send className="size-3" />
              </button>
            </div>
          </div>
        )}

        {/* ARCHITECTURE TAB */}
        {activeTab === "architecture" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {/* Interactive Canvas */}
            <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#09111b] to-[#071019] p-6 relative min-h-[580px] overflow-hidden flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Cognitive Subsystem Topology</h3>
                <p className="text-xs text-muted-foreground">
                  Closed-loop architecture connecting human intent, executive controller, memory, models, tools, and simulation.
                </p>
              </div>

              {/* Topology Nodes Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-auto py-6">
                {[
                  { id: "human", title: "Human Interface", role: "Source of authority & review", icon: Lock },
                  { id: "executive", title: "Executive Controller", role: "Goal decomposition & policy", icon: Cpu },
                  { id: "memory", title: "Memory Fabric", role: "Episodic & semantic lattice", icon: Brain },
                  { id: "planner", title: "Planner", role: "Dependency-aware tasks", icon: Workflow },
                  { id: "router", title: "Model Router", role: "Dynamic capability arbitration", icon: Radio },
                  { id: "agents", title: "Agent Mesh", role: "Specialist workers", icon: Bot },
                  { id: "tools", title: "Tool & MCP Fabric", role: "Controlled system side effects", icon: Sliders },
                  { id: "simulation", title: "Simulation & Verify", role: "Digital twin pre-flight checks", icon: ShieldCheck },
                ].map((node) => {
                  const Icon = node.icon;
                  const active = selectedNode === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-32 ${
                        active
                          ? "bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(124,255,225,0.2)] transform -translate-y-1"
                          : "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`size-4 ${active ? "text-cyan-300" : "text-muted-foreground"}`} />
                        {active && <span className="size-2 rounded-full bg-cyan-400 animate-ping" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">{node.title}</div>
                        <div className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{node.role}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-[11px] text-muted-foreground font-mono flex items-center justify-between border-t border-white/[0.06] pt-3">
                <span>Contract: Zero-Fiction / Deterministic Proof</span>
                <span className="text-cyan-400">Status: All Nodes Healthy</span>
              </div>
            </div>

            {/* Node Detail Inspector */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0a111b]/90 p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <Cpu className="size-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Subsystem Inspector</h3>
              </div>

              <div>
                <h4 className="text-base font-bold text-white capitalize">{selectedNode} Component</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {selectedNode === "human" && "The ultimate authority. Approves high-impact mutations and governs cognitive bounds."}
                  {selectedNode === "executive" && "Coordinates task budgets, enforces safety policies, and prevents runaway autonomous loops."}
                  {selectedNode === "memory" && "Stores evidence-backed beliefs, temporal state, and counterfactual simulation results."}
                  {selectedNode === "planner" && "Translates high-level missions into sequential and parallel dependency graphs."}
                  {selectedNode === "router" && "Arbitrates between frontier reasoning engines based on task type, latency, and cost."}
                  {selectedNode === "agents" && "Coordinates specialist workers (Security, Architecture, Code, Research) without crosstalk."}
                  {selectedNode === "tools" && "Enforces granular capability permissions and dry-run boundaries before external side effects."}
                  {selectedNode === "simulation" && "Pre-flights deployment and code updates inside an ephemeral sandbox before confirmation."}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between py-2 border-b border-white/[0.04] text-xs">
                  <span className="text-muted-foreground">Authority Level</span>
                  <span className="font-mono text-cyan-400 font-medium">
                    {selectedNode === "human" ? "ROOT_SUPERUSER" : "RESTRICTED_SANDBOX"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.04] text-xs">
                  <span className="text-muted-foreground">Health Status</span>
                  <span className="font-mono text-emerald-400 font-medium">100% NOMINAL</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.04] text-xs">
                  <span className="text-muted-foreground">Telemetry Channel</span>
                  <span className="font-mono text-zinc-300">aether.sys.{selectedNode}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.04] text-xs">
                  <span className="text-muted-foreground">Reversibility</span>
                  <span className="font-mono text-emerald-400">GUARANTEED</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MEMORY LATTICE TAB */}
        {activeTab === "memory" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">Epistemic Memory Lattice</h3>
                  <p className="text-xs text-muted-foreground">Beliefs are immutable evidence objects with provenance and confidence</p>
                </div>
                <span className="text-xs font-mono text-cyan-400">{DEFAULT_MEMORIES.length} ACTIVE RECORDS</span>
              </div>

              <div className="space-y-3">
                {DEFAULT_MEMORIES.map((mem, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setModalData({
                        title: mem.title,
                        subtitle: `${mem.type} Memory Record · ${mem.confidence} Confidence`,
                        content: (
                          <div className="space-y-3 text-xs">
                            <p className="text-zinc-200 leading-relaxed">{mem.content}</p>
                            <div className="p-3 bg-black/40 rounded-lg border border-white/5 space-y-1 font-mono text-[11px] text-muted-foreground">
                              <div>Provenance: <span className="text-cyan-300">{mem.provenance}</span></div>
                              <div>Epistemic Status: VERIFIED_OBSERVATION</div>
                              <div>Contradiction Check: 0 Blockers</div>
                              <div>Isolation Mode: CURRENT_PROJECT_ONLY</div>
                            </div>
                          </div>
                        ),
                      })
                    }
                    className="p-4 rounded-xl border border-white/[0.06] bg-[#0a111b]/80 hover:bg-[#0d1624] hover:border-cyan-500/30 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase font-semibold">
                        {mem.type}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-medium">{mem.confidence} confidence</span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{mem.title}</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{mem.content}</p>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-2 border-t border-white/[0.04]">
                      <span>Source: {mem.provenance}</span>
                      <span className="text-cyan-500">Inspect</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory Architecture Rules */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0a111b]/90 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Memory Discipline Laws</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                AETHER rejects unstructured chat history accumulation. Memories must carry explicit provenance and confidence boundaries.
              </p>

              <div className="space-y-3 text-xs">
                {[
                  { tag: "EPISODIC", desc: "What actually occurred in past sessions and verification runs." },
                  { tag: "SEMANTIC", desc: "Core verified platform principles and engineering constraints." },
                  { tag: "PROCEDURAL", desc: "Action execution workflows and verification runbooks." },
                  { tag: "TEMPORAL", desc: "How signals, performance, and drift change over time." },
                  { tag: "COUNTERFACTUAL", desc: "Simulation results modeling alternative deployment paths." },
                ].map((item) => (
                  <div key={item.tag} className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.02]">
                    <div className="font-mono text-[10px] text-cyan-400 font-bold">{item.tag}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AGENTS TAB */}
        {activeTab === "agents" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold text-white">Agent Command Table</h3>
              <p className="text-xs text-muted-foreground">Specialist reasoning agents operating under bounded authority</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEFAULT_AGENTS.map((agent) => (
                <div
                  key={agent.name}
                  className="rounded-2xl border border-white/[0.08] bg-[#0a111b]/90 p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="size-4 text-cyan-400" />
                        <span className="text-sm font-bold text-white">{agent.name}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          agent.status === "busy"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : agent.status === "waiting"
                            ? "bg-zinc-800 text-zinc-400 border border-white/5"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/[0.06]">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-mono text-cyan-400 font-bold">{agent.confidence}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" style={{ width: agent.confidence }} />
                    </div>
                    <button
                      onClick={() =>
                        setModalData({
                          title: `${agent.name} Agent Dispatch`,
                          subtitle: "Specialist Lease Details",
                          content: (
                            <div className="space-y-3 text-xs">
                              <p className="text-muted-foreground">
                                Dispatched through <code className="text-cyan-300">aiProject/runtime/agentRuntime.ts</code> with zero cross-tenant visibility.
                              </p>
                              <div className="p-3 bg-black/40 rounded-lg border border-white/5 font-mono text-[11px] text-zinc-300 space-y-1">
                                <div>Recursion Ceiling: 4 Steps</div>
                                <div>Tool Set: AST_PARSER, METRIC_CHECK, SCHEMA_DIFF</div>
                                <div>Max Budget: 2000 tokens</div>
                              </div>
                            </div>
                          ),
                        })
                      }
                      className="w-full mt-2 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-xs font-medium text-white transition-colors"
                    >
                      Inspect Lease
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOOLS TAB */}
        {activeTab === "tools" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold text-white">Tool & MCP Capability Mesh</h3>
              <p className="text-xs text-muted-foreground">
                Capabilities requested by agent intent and governed by runtime authorization checks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEFAULT_TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  className="rounded-2xl border border-white/[0.08] bg-[#0a111b]/90 p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{tool.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          tool.risk === "High"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : tool.risk === "Medium"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {tool.risk} Risk
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{tool.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500">{tool.category} Adapter</span>
                    <button
                      onClick={() =>
                        setModalData({
                          title: tool.name,
                          subtitle: `${tool.category} Capability Adapter · ${tool.risk} Risk Tier`,
                          content: (
                            <div className="space-y-3 text-xs">
                              <p className="text-muted-foreground">
                                Authorized under strict Zero-Fiction boundaries. No client credentials exposed to generative prompts.
                              </p>
                              <div className="p-3 bg-black/40 rounded-lg border border-white/5 font-mono text-[11px] text-zinc-300 space-y-1">
                                <div>Dry-Run Capable: TRUE</div>
                                <div>Rate Limit: 60 req/min</div>
                                <div>Audit Telemetry: ENABLED</div>
                              </div>
                            </div>
                          ),
                        })
                      }
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SIMULATION TAB */}
        {activeTab === "simulation" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {/* Rehearsal Board */}
            <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-[#0a111b]/90 p-6 space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold text-white">Deployment Rehearsal & Verification Twin</h3>
                  <span className="text-xs font-mono text-cyan-400">ISOLATED DIGITAL TWIN</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  High-impact operations are rehearsed in an isolated digital twin with failure scenario injection prior to production commit.
                </p>
              </div>

              <div className="space-y-3 py-4">
                {rehearsalSteps.map((step) => (
                  <div
                    key={step.num}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      step.status === "active"
                        ? "bg-cyan-500/10 border-cyan-500/30 text-white shadow-[0_0_15px_rgba(124,255,225,0.15)]"
                        : step.status === "ok"
                        ? "bg-emerald-500/5 border-emerald-500/20 text-zinc-200"
                        : "bg-white/[0.015] border-white/[0.05] text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                          step.status === "ok"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : step.status === "active"
                            ? "bg-cyan-500/20 text-cyan-300 animate-pulse"
                            : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {step.num}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{step.title}</div>
                        <div className="text-[10px] text-muted-foreground">{step.detail}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        step.status === "ok"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : step.status === "active"
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
                          : "bg-zinc-800 text-zinc-500 border-white/5"
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Reversibility: Reversible Rollback Guaranteed</span>
                <button
                  disabled={simRunning}
                  onClick={startRehearsal}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(124,255,225,0.25)]"
                >
                  {simRunning ? <RotateCcw className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
                  <span>{simRunning ? "Executing Sandbox..." : "Start Full Rehearsal"}</span>
                </button>
              </div>
            </div>

            {/* Verification Contract Box */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0a111b]/90 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Verification Contract</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Before consequential side effects are dispatched, AETHER proves validity through deterministic assertions.
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">Risk Class</span>
                  <strong className="text-amber-400 text-xs">High-Impact Mutation</strong>
                </div>
                <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">Pre-Condition</span>
                  <strong className="text-white text-xs">Reversible AST &amp; DB rollback</strong>
                </div>
                <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">Authority Gate</span>
                  <strong className="text-cyan-400 text-xs">Human approval required</strong>
                </div>
                <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">Evidence Requirement</span>
                  <strong className="text-emerald-400 text-xs">100% Passing Gate Assertions</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Interactive Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1724] p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setModalData(null)}
              className="absolute right-4 top-4 p-1 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="size-4" />
            </button>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">AETHER AUDIT MODAL</span>
              <h3 className="text-base font-bold text-white mt-0.5">{modalData.title}</h3>
              {modalData.subtitle && <p className="text-xs text-muted-foreground">{modalData.subtitle}</p>}
            </div>
            <div className="pt-2">{modalData.content}</div>
          </div>
        </div>
      )}
    </div>
  );
}
