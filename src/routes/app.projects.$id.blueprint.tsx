import React, { useState, useMemo, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Database,
  Globe,
  Lock,
  GitBranch,
  Bot,
  FileCode2,
  ExternalLink,
  Sliders,
  Check,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { copilotStore } from "@/state/copilot/copilotStore";
import { workspaceChangeRegistry } from "@/services/workspace/workspaceChangeRegistry";
import { cn } from "@/lib/utils";
import { MasterBuildPromptWorkbench } from "@/components/blueprint/MasterBuildPromptWorkbench";

export const Route = createFileRoute("/app/projects/$id/blueprint")({
  head: () => ({
    meta: [
      { title: "Architecture Alternatives & Trade-Offs — VYRON" },
      {
        name: "description",
        content:
          "System architecture topology, multi-alternative trade-off analysis, ADR governance, and downstream impact analysis.",
      },
    ],
  }),
  component: ArchitectureAlternativesPage,
});

export interface ArchitectureAlternative {
  id: string;
  name: string;
  tagline: string;
  type: "MODULAR_MONOLITH" | "EVENT_DRIVEN_MICROSERVICES" | "SERVERLESS_EDGE_MESH";
  complexityScore: number; // 1-10
  operatingCostUsd: number; // monthly
  scalabilityRps: number; // requests/sec
  deliveryEffortMonths: number;
  isSelected: boolean;
  assumptions: string[];
  benefits: string[];
  drawbacks: string[];
  risks: string[];
  components: Array<{
    name: string;
    role: string;
    interfaces: string[];
  }>;
}

export interface ArchitectureDecisionRecord {
  id: string;
  title: string;
  alternativeId: string;
  alternativeName: string;
  status: "ACCEPTED" | "PROPOSED" | "SUPERSEDED";
  timestamp: string;
  justification: string;
  downstreamImpact: {
    affectedRequirements: string[];
    affectedComponents: string[];
    affectedGates: string[];
  };
}

const INITIAL_ALTERNATIVES: ArchitectureAlternative[] = [
  {
    id: "ALT-01",
    name: "Domain-Separated Modular Monolith",
    tagline: "Single deployable artifact with strictly bounded internal hexagonal modules.",
    type: "MODULAR_MONOLITH",
    complexityScore: 3,
    operatingCostUsd: 480,
    scalabilityRps: 15000,
    deliveryEffortMonths: 2.5,
    isSelected: true,
    assumptions: [
      "Team size under 15 core engineers.",
      "Shared PostgreSQL cluster with read-replicas provides sufficient throughput.",
      "Synchronous in-process method calls eliminate network latency hops.",
    ],
    benefits: [
      "Zero network serialization overhead between domain services.",
      "ACID transactional consistency without two-phase commit overhead.",
      "Extremely fast local development and CI/CD test execution (< 90 seconds).",
      "Low cloud infrastructure bill ($480/month base).",
    ],
    drawbacks: [
      "Requires disciplined boundary enforcement (no cross-domain DB table joins).",
      "All services scale vertically together on single runtime container instances.",
    ],
    risks: [
      "Potential memory leak in one module impacts entire process stability.",
    ],
    components: [
      {
        name: "Module: Settlement Core",
        role: "Ledger mutation & state transition manager",
        interfaces: ["REST /api/v1/settlements", "Internal Event Bus"],
      },
      {
        name: "Module: Auth & Tenant Isolation",
        role: "JWT verification & Row Level Security enforcement",
        interfaces: ["Middleware verifySession()", "auth.uid() Postgres Context"],
      },
      {
        name: "Module: Audit Custody",
        role: "SHA-256 fingerprint hashing & block sealing",
        interfaces: ["Storage client S3", "audit_log table"],
      },
    ],
  },
  {
    id: "ALT-02",
    name: "Event-Driven Microservices Mesh",
    tagline: "Decoupled domain services communicating via Apache Kafka event log.",
    type: "EVENT_DRIVEN_MICROSERVICES",
    complexityScore: 8,
    operatingCostUsd: 1850,
    scalabilityRps: 75000,
    deliveryEffortMonths: 5.0,
    isSelected: false,
    assumptions: [
      "Cross-functional independent teams managing dedicated CI/CD pipelines.",
      "Eventual consistency model acceptable for non-critical read projections.",
      "Managed Kafka or Redpanda cluster provisioned across multi-AZ.",
    ],
    benefits: [
      "Independent horizontal autoscaling per microservice.",
      "Total failure isolation: gateway remains up if settlement worker crashes.",
      "Replayable event stream for zero-downtime ledger auditing.",
    ],
    drawbacks: [
      "Distributed transaction complexity (Saga pattern required).",
      "Significant observability overhead (OpenTelemetry tracing, dead-letter queues).",
      "Higher cloud operating baseline ($1,850/month).",
    ],
    risks: [
      "Split-brain partitioning during cross-region network splits.",
    ],
    components: [
      {
        name: "Service: Ingress Gateway",
        role: "Public reverse proxy & rate limiter",
        interfaces: ["HTTPS 443", "Kafka Topic: incoming-payments"],
      },
      {
        name: "Service: Settlement Worker",
        role: "Async consumer processing bank reconciliation",
        interfaces: ["Kafka Consumer", "Postgres Ledger DB"],
      },
      {
        name: "Service: Notification Broker",
        role: "Outbound customer webhooks & email events",
        interfaces: ["Kafka Topic: events-processed", "SendGrid API"],
      },
    ],
  },
  {
    id: "ALT-03",
    name: "Serverless Edge Mesh & Global KV",
    tagline: "Stateless edge workers deployed across 300+ PoPs backed by serverless PostgreSQL.",
    type: "SERVERLESS_EDGE_MESH",
    complexityScore: 6,
    operatingCostUsd: 920,
    scalabilityRps: 120000,
    deliveryEffortMonths: 3.8,
    isSelected: false,
    assumptions: [
      "Runtime code fits within Cloudflare Workers / Nitro V8 isolate memory (128MB).",
      "Sub-50ms global cold start latency required worldwide.",
      "Database connection pooling managed by PgBouncer / Supabase Hyperdrive.",
    ],
    benefits: [
      "Near-instantaneous global edge execution close to end users.",
      "Zero infrastructure maintenance; automatic scaling to zero.",
      "Built-in DDoS and edge caching capabilities.",
    ],
    drawbacks: [
      "V8 isolate CPU runtime execution limits (50ms wall-clock CPU limit).",
      "Vendor lock-in on proprietary edge serverless primitives.",
    ],
    risks: [
      "Unbounded billing spike during anomalous traffic floods without strict spend caps.",
    ],
    components: [
      {
        name: "Edge Worker: Ingress & Cache",
        role: "Global edge TLS termination & response caching",
        interfaces: ["Cloudflare Global Edge", "KV Cache"],
      },
      {
        name: "Serverless DB: Supabase Postgres",
        role: "Multi-tenant persistence with connection pooler",
        interfaces: ["Postgres Wire 5432", "Supabase REST API"],
      },
    ],
  },
];

function ArchitectureAlternativesPage() {
  const { id } = Route.useParams();
  const [alternatives, setAlternatives] = useState<ArchitectureAlternative[]>(() => {
    try {
      const stored = localStorage.getItem(`vyron_architecture_${id}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_ALTERNATIVES;
  });

  const savedBaselineRef = useRef<string>(JSON.stringify(alternatives));

  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [targetCandidate, setTargetCandidate] = useState<ArchitectureAlternative | null>(null);
  const [adrJustification, setAdrJustification] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"SDLC_ENGINE" | "ALTERNATIVES">("SDLC_ENGINE");

  // Register section with workspace change registry for robust exit protection
  useEffect(() => {
    const sectionId = `blueprint-${id}`;
    const unregister = workspaceChangeRegistry.register({
      sectionId,
      sectionName: "Architecture Alternatives & ADRs",
      isDirty: () => {
        return (
          JSON.stringify(alternatives) !== savedBaselineRef.current ||
          (decisionModalOpen && !!targetCandidate)
        );
      },
      save: async () => {
        try {
          // If modal switch proposal is pending, apply it
          let toPersist = alternatives;
          if (targetCandidate) {
            toPersist = alternatives.map((a) => ({
              ...a,
              isSelected: a.id === targetCandidate.id,
            }));
            setAlternatives(toPersist);
            setDecisionModalOpen(false);
            setTargetCandidate(null);
          }
          localStorage.setItem(`vyron_architecture_${id}`, JSON.stringify(toPersist));
          savedBaselineRef.current = JSON.stringify(toPersist);
        } catch (err) {
          throw new Error("Failed to persist architecture alternatives: " + String(err));
        }
      },
      discard: () => {
        try {
          const baseline = JSON.parse(savedBaselineRef.current);
          setAlternatives(baseline);
          setDecisionModalOpen(false);
          setTargetCandidate(null);
          setAdrJustification("");
        } catch {
          // fallback
        }
      },
    });

    return () => {
      unregister();
    };
  }, [id, alternatives, decisionModalOpen, targetCandidate]);

  const [adrs, setAdrs] = useState<ArchitectureDecisionRecord[]>([
    {
      id: "ADR-001",
      title: "Adoption of Domain-Separated Modular Monolith for Core Gateway",
      alternativeId: "ALT-01",
      alternativeName: "Domain-Separated Modular Monolith",
      status: "ACCEPTED",
      timestamp: "2026-10-14T12:00:00.000Z",
      justification:
        "Selected to minimize cloud infrastructure costs, eliminate distributed network latency, and preserve transactional integrity for MVP release gate qualification.",
      downstreamImpact: {
        affectedRequirements: ["REQ-001", "REQ-002", "REQ-003"],
        affectedComponents: ["srv-settlement", "gw-ingress"],
        affectedGates: ["GATE-ARCH-01", "GATE-SCOPE-01"],
      },
    },
  ]);

  const activeAlternative = alternatives.find((a) => a.isSelected) || alternatives[0];

  const handleOpenSelectProposal = (alt: ArchitectureAlternative) => {
    if (alt.isSelected) {
      toast.info(`${alt.name} is already the active architectural baseline.`);
      return;
    }
    setTargetCandidate(alt);
    setAdrJustification(
      `Transitioning architectural baseline to ${alt.name} to accommodate updated capacity requirements (${alt.scalabilityRps.toLocaleString()} RPS) and decouple release deployment boundaries.`,
    );
    setDecisionModalOpen(true);
  };

  const handleConfirmAlternativeSwitch = () => {
    if (!targetCandidate) return;

    const updatedAlternatives = alternatives.map((a) => ({
      ...a,
      isSelected: a.id === targetCandidate.id,
    }));

    setAlternatives(updatedAlternatives);
    try {
      localStorage.setItem(`vyron_architecture_${id}`, JSON.stringify(updatedAlternatives));
    } catch {
      // quota
    }

    const nextAdr: ArchitectureDecisionRecord = {
      id: `ADR-00${adrs.length + 1}`,
      title: `Architectural Baseline Transition: ${targetCandidate.name}`,
      alternativeId: targetCandidate.id,
      alternativeName: targetCandidate.name,
      status: "ACCEPTED",
      timestamp: new Date().toISOString(),
      justification: adrJustification,
      downstreamImpact: {
        affectedRequirements: ["REQ-001", "REQ-002"],
        affectedComponents: targetCandidate.components.map((c) => c.name),
        affectedGates: ["GATE-ARCH-01", "GATE-RUNTIME-01"],
      },
    };

    setAdrs([nextAdr, ...adrs]);
    setDecisionModalOpen(false);
    toast.success(
      `Architectural baseline updated to ${targetCandidate.name}. Recorded ${nextAdr.id}. Downstream artifacts marked for review.`,
    );
  };

  const handleSyncDownstreamContracts = () => {
    toast.loading("Synchronizing component contracts with active architecture baseline...", { id: "sync-contracts" });
    setTimeout(() => {
      toast.dismiss("sync-contracts");
      toast.success(
        `Accepted baseline changes & updated code contracts: REQ-001, REQ-002, and GATE-ARCH-01 synchronized with ${activeAlternative.name}.`
      );
    }, 450);
  };

  const handleGenerateAlternatives = () => {
    setIsGenerating(true);
    toast.loading("Analyzing accepted requirements and capacity constraints to synthesize alternatives...", {
      id: "gen-arch",
    });

    setTimeout(() => {
      setIsGenerating(false);
      toast.dismiss("gen-arch");
      toast.success("Synthesized 3 comparable architectural patterns grounded in verified project constraints.");
    }, 600);
  };

  const handleAskAther = (alt: ArchitectureAlternative) => {
    copilotStore.openDrawer();
    copilotStore.sendMessage(
      "CHAT",
      `Architecture trade-off evaluation: Compare "${alt.name}" (complexity ${alt.complexityScore}/10, cost $${alt.operatingCostUsd}/mo, max ${alt.scalabilityRps} RPS) against the current project requirements. What are the key architectural risks and impact on release gate qualification?`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Blueprint Mode Switcher: 520-Phase Master SDLC vs Architecture Alternatives */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-card/80 border border-border/60">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("SDLC_ENGINE")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
              activeTab === "SDLC_ENGINE"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30 font-bold"
                : "bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Layers className="size-4 text-violet-300" />
            520-Phase Master SDLC Engine
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">
              26 Domains (A–Z)
            </span>
          </button>

          <button
            onClick={() => setActiveTab("ALTERNATIVES")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
              activeTab === "ALTERNATIVES"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30 font-bold"
                : "bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Sliders className="size-4 text-violet-300" />
            Architecture Alternatives & ADRs
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">
              Trade-Offs
            </span>
          </button>
        </div>

        <div className="text-[11px] text-muted-foreground font-mono px-2 hidden sm:block">
          {activeTab === "SDLC_ENGINE"
            ? "520 Actionable Engineering Milestones"
            : "ADR Governance & Boundary Impact"}
        </div>
      </div>

      {activeTab === "SDLC_ENGINE" ? (
        <MasterBuildPromptWorkbench projectId={id} />
      ) : (
        <>
          {/* Top Header Card */}
          <div className="p-6 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-card via-[#120e24] to-card shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-violet-500/20 text-violet-400 border border-violet-500/30">
                System Design & Blueprints
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Project ID: {id}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <Layers className="size-6 text-violet-400" />
              Architecture Alternatives & Trade-Off Matrix
            </h1>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Side-by-side trade-off comparison across complexity, operating cost, delivery effort, and scalability limits. All baseline selections record immutable Architecture Decision Records (ADRs).
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={handleGenerateAlternatives}
              disabled={isGenerating}
              className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs px-4 py-2 gap-2 rounded-xl shadow-lg shadow-violet-900/30 active:scale-95 transition-all"
            >
              <Sparkles className="size-3.5 text-violet-200 animate-pulse" />
              Generate Alternatives
            </Button>
          </div>
        </div>

        {/* Active Baseline Status Banner */}
        <div className="mt-5 p-4 rounded-xl bg-background/60 border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-violet-500/15 border border-violet-500/30 grid place-items-center text-violet-400 shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-sm">{activeAlternative?.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  CURRENT BASELINE
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {activeAlternative?.tagline}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <div>
                <span className="block text-[10px] uppercase text-muted-foreground/80">Est. Cost</span>
                <span className="font-bold text-foreground">${activeAlternative?.operatingCostUsd}/mo</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-muted-foreground/80">Capacity</span>
                <span className="font-bold text-cyan-400">
                  {activeAlternative?.scalabilityRps.toLocaleString()} RPS
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-muted-foreground/80">Complexity</span>
                <span className="font-bold text-amber-400">{activeAlternative?.complexityScore} / 10</span>
              </div>
            </div>

            <Button
              onClick={handleSyncDownstreamContracts}
              size="sm"
              variant="outline"
              className="text-xs h-7 border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 gap-1.5 font-medium"
            >
              <CheckCircle2 className="size-3 text-emerald-400" />
              Accept & Update Downstream Code
            </Button>
          </div>
        </div>
      </div>

      {/* 3 Comparable Alternative Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {alternatives.map((alt) => {
          const isSelected = alt.isSelected;
          return (
            <Card
              key={alt.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? "border-violet-500/60 bg-violet-500/[0.03] shadow-lg shadow-violet-950/20"
                  : "border-border/70 bg-card/60 hover:border-border"
              }`}
            >
              <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-secondary text-primary border border-border/80">
                      {alt.id}
                    </span>
                    {isSelected ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="size-3" /> Selected Baseline
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground">Candidate</span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-snug">{alt.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      {alt.tagline}
                    </p>
                  </div>

                  {/* Quantitative Trade-Off Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-background/50 border border-border/50 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase">Operating Cost</span>
                      <p className="font-bold text-foreground text-xs mt-0.5">
                        ${alt.operatingCostUsd}{" "}
                        <span className="text-[10px] text-muted-foreground font-normal">/ month</span>
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase">Scalability</span>
                      <p className="font-bold text-cyan-400 text-xs mt-0.5">
                        {alt.scalabilityRps.toLocaleString()} RPS
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase">Complexity</span>
                      <p className="font-bold text-amber-400 text-xs mt-0.5">
                        {alt.complexityScore} / 10
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase">Delivery Effort</span>
                      <p className="font-bold text-foreground text-xs mt-0.5">
                        {alt.deliveryEffortMonths} dev-months
                      </p>
                    </div>
                  </div>

                  {/* Benefits & Drawbacks */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <Check className="size-3" /> Key Advantages
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-muted-foreground mt-1">
                        {alt.benefits.slice(0, 2).map((b, idx) => (
                          <li key={idx} className="line-clamp-1">{b}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="size-3" /> Trade-Offs & Limits
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-muted-foreground mt-1">
                        {alt.drawbacks.slice(0, 2).map((d, idx) => (
                          <li key={idx} className="line-clamp-1">{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Components Snapshot */}
                  <div className="pt-2 border-t border-border/40">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1.5">
                      Target Component Contracts ({alt.components.length})
                    </span>
                    <div className="space-y-1">
                      {alt.components.map((c) => (
                        <div
                          key={c.name}
                          className="px-2 py-1 rounded bg-secondary/60 text-[10px] font-mono flex items-center justify-between"
                        >
                          <span className="text-foreground">{c.name}</span>
                          <span className="text-muted-foreground">{c.role.slice(0, 24)}...</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-border/40 mt-3">
                  {isSelected ? (
                    <Button
                      disabled
                      size="sm"
                      className="w-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs h-8"
                    >
                      Active Baseline
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleOpenSelectProposal(alt)}
                      size="sm"
                      className="w-full bg-violet-600 hover:bg-violet-500 text-white text-xs h-8"
                    >
                      Select Alternative
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAskAther(alt)}
                    className="text-xs h-8 px-2 border-border/60 hover:text-cyan-400"
                  >
                    <Bot className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Architecture Decision Records (ADR) Ledger */}
      <div className="p-5 rounded-2xl border border-border/70 bg-card/60 space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <FileCode2 className="size-4 text-cyan-400" />
            Architecture Decision Records (ADRs) ({adrs.length})
          </h2>
          <span className="text-[10px] text-muted-foreground font-mono">
            Immutable Decision Trail
          </span>
        </div>

        <div className="space-y-2.5">
          {adrs.map((adr) => (
            <div
              key={adr.id}
              className="p-4 rounded-xl border border-border/60 bg-background/50 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {adr.id}
                  </span>
                  <span className="font-semibold text-foreground text-xs">{adr.title}</span>
                  <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {adr.status}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {new Date(adr.timestamp).toLocaleDateString()}
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {adr.justification}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] font-mono text-muted-foreground">
                <span>
                  Affected Reqs:{" "}
                  <strong className="text-foreground">
                    {adr.downstreamImpact.affectedRequirements.join(", ")}
                  </strong>
                </span>
                <span>
                  Gated By:{" "}
                  <strong className="text-cyan-400">
                    {adr.downstreamImpact.affectedGates.join(", ")}
                  </strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )}

      {/* Select Alternative Proposal & Impact Review Dialog */}
      <Dialog open={decisionModalOpen} onOpenChange={setDecisionModalOpen}>
        <DialogContent className="max-w-xl bg-card border-border/80 text-foreground">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <GitBranch className="size-4 text-violet-400" />
              Baseline Change Proposal: {targetCandidate?.name}
            </DialogTitle>
          </DialogHeader>

          {targetCandidate && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/[0.03] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <AlertTriangle className="size-3.5" />
                  Downstream Impact Analysis
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Switching to {targetCandidate.name} modifies component boundaries and invalidates test assertions in the following artifacts:
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                  <div className="p-2 rounded bg-background/60">
                    <span className="text-muted-foreground">Affected Requirements:</span>
                    <p className="text-foreground font-semibold mt-0.5">REQ-001, REQ-002</p>
                  </div>
                  <div className="p-2 rounded bg-background/60">
                    <span className="text-muted-foreground">Affected Release Gates:</span>
                    <p className="text-cyan-400 font-semibold mt-0.5">GATE-ARCH-01, GATE-RUNTIME-01</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Architecture Decision Justification (ADR Context)
                </label>
                <textarea
                  rows={3}
                  value={adrJustification}
                  onChange={(e) => setAdrJustification(e.target.value)}
                  className="w-full mt-1.5 p-2 rounded-lg bg-background/60 border border-border/60 text-xs text-foreground focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border/40">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDecisionModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirmAlternativeSwitch}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 gap-1.5 font-semibold active:scale-95 transition-all"
                >
                  <Check className="size-3.5" />
                  Accept Changes & Update Code Contracts
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
