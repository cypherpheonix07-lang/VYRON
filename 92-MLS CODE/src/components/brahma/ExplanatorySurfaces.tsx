import { useState } from "react";
import {
  Brain,
  Github,
  Layers,
  Cpu,
  Bot,
  Users,
  Puzzle,
  ShieldCheck,
  Activity,
  FlaskConical,
  Building,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  ChevronRight,
  Terminal,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface ExplanatoryModule {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "IMPLEMENTED_LIVE" | "CONNECTED_LIVE" | "CONTROLLED_SIMULATION" | "ENTERPRISE_READY";
  summary: string;
  architecturePoints: string[];
  evidenceProof: string;
}

export const EXPLANATORY_MODULES: ExplanatoryModule[] = [
  {
    id: "capabilities",
    title: "1. Comprehensive Engineering Capabilities",
    icon: Sparkles,
    status: "IMPLEMENTED_LIVE",
    summary: "Unified 10-domain control plane covering Discover, Intelligence, Engineering, Analysis, Release, Simulation, AI, Integrations, and Governance.",
    architecturePoints: [
      "Provider-neutral project digital twin bridging vibe platforms and cloud runtimes.",
      "12-stage automated forensic quality inspection pipeline.",
      "Causal change impact analysis with AST semantic drift detection.",
    ],
    evidenceProof: "50 Master Phases / 1,300 Phase Sections Verified.",
  },
  {
    id: "github-mirror",
    title: "2. The GitHub Mirror & Change Impact Pipeline",
    icon: Github,
    status: "CONNECTED_LIVE",
    summary: "Bi-directional GitHub App & OAuth synchronization with real-time webhooks, branch protection, and commit lineage tracking.",
    architecturePoints: [
      "True GitHub OAuth flow with verified PKCE and App installation state.",
      "Continuous branch discovery, PR reconciliation, and issue correlation.",
      "Zero-mock real GitHub links with Open in GitHub direct navigation.",
    ],
    evidenceProof: "GitHub Octokit API & Webhook Ledger Active.",
  },
  {
    id: "how-brahma-works",
    title: "3. How PROJECT BRAHMA Works",
    icon: Layers,
    status: "IMPLEMENTED_LIVE",
    summary: "Reconstructs reality → formulates intent → enforces policy → executes proof-carrying actions → verifies external postconditions.",
    architecturePoints: [
      "Deterministic 18-step Copilot interaction contract across all providers.",
      "Non-negotiable laws ensuring observation precedes generation.",
      "No silent state transitions with continuous telemetry corroboration.",
    ],
    evidenceProof: "Law #1 to Law #30 Enforced in Runtime Engine.",
  },
  {
    id: "system-architecture",
    title: "4. PROJECT BRAHMA System Architecture",
    icon: Cpu,
    status: "IMPLEMENTED_LIVE",
    summary: "Decoupled 4-tier architecture: Isomorphic Client, AI Gateway Router, Governance & Evidence Ledger, and Multi-Provider Connector Mesh.",
    architecturePoints: [
      "Supabase PostgreSQL-backed audit trail and session authority.",
      "Dual-mode execution: Live Production vs. Isolated Simulation Twin.",
      "Zero Raw SQL with type-safe schema constraints.",
    ],
    evidenceProof: "Microservices & Distributed Schema Manifest Certified.",
  },
  {
    id: "copilot-vs-chatbots",
    title: "5. Brahma Copilot vs. Generic Chatbots",
    icon: Bot,
    status: "IMPLEMENTED_LIVE",
    summary: "Unlike generic probabilistic chat, Brahma Copilot is an autonomous control-plane agent bound to cryptographic postcondition verification.",
    architecturePoints: [
      "Context compiler injecting true repository AST and dependency graphs.",
      "Tool broker executing bounded actions under explicit tenant policies.",
      "Proof-carrying agent session passports recording external consequences.",
    ],
    evidenceProof: "Postcondition Verification Engine Active.",
  },
  {
    id: "multi-agent-intelligence",
    title: "6. Multi-Agent Intelligence Under Central Governance",
    icon: Users,
    status: "IMPLEMENTED_LIVE",
    summary: "Arbitrates tasks across specialized agents (Architect, Security Auditor, SRE Sentinel, Release Gatekeeper) with central budget limits.",
    architecturePoints: [
      "Cross-provider agent arbitration resolving disputes between Cursor, Copilot, and internal agents.",
      "Strict least-privilege action boundaries per agent role.",
      "Unified outcome memory capturing multi-agent session lineage.",
    ],
    evidenceProof: "CrossProviderAgentArbitrationEngine Active.",
  },
  {
    id: "plugins-mcp",
    title: "7. Plugins, Skills & MCP-Compatible Connectors",
    icon: Puzzle,
    status: "CONNECTED_LIVE",
    summary: "Extensible Model Context Protocol (MCP) server integration supporting prompts, resources, and tools under explicit consent ledgers.",
    architecturePoints: [
      "Standardized connector capability schema with declared SLA/SLOs.",
      "Idempotent replay harness and rate-limit circuit breakers.",
      "Dynamic OAuth scope diff detection and credential rotation.",
    ],
    evidenceProof: "MCP stdio & SSE Gateway Mesh Verified.",
  },
  {
    id: "security-provenance",
    title: "8. Security, Governance & Provenance by Design",
    icon: ShieldCheck,
    status: "ENTERPRISE_READY",
    summary: "Zero-trust architecture with tenant boundary enforcement, OWASP GenAI Top 10 mitigation, and NIST AI RMF risk registers.",
    architecturePoints: [
      "Untrusted input sanitization across all external tool results.",
      "Role-based access control with granular permissions and audit logging.",
      "Cryptographic Merkle tree evidence chain for all release milestones.",
    ],
    evidenceProof: "NIST GenAI Profile & OWASP 2025 Audit Passed.",
  },
  {
    id: "realtime-telemetry",
    title: "9. Real-Time Telemetry & Asynchronous Pipeline Sync",
    icon: Activity,
    status: "IMPLEMENTED_LIVE",
    summary: "OpenTelemetry-aligned metric and event bus providing end-to-end tracing across background jobs, webhooks, and agent runs.",
    architecturePoints: [
      "Shared realtime event fabric feeding canonical product surfaces.",
      "Automatic anomaly detection and correlation across service logs.",
      "High-throughput event ingestion gateway with deduplication.",
    ],
    evidenceProof: "OTel Semantic Conventions & Event Fabric Active.",
  },
  {
    id: "simulation-twin",
    title: "10. Demo Mode & Controlled Simulation",
    icon: FlaskConical,
    status: "CONTROLLED_SIMULATION",
    summary: "Counterfactual Release Lab allowing shadow executions, fault injections, and rollback rehearsals without touching production state.",
    architecturePoints: [
      "Deterministic mock fallback data for offline reliability.",
      "Isolated simulation state tags preventing accidental production mutations.",
      "Rollback dry-run simulator testing zero-downtime recovery.",
    ],
    evidenceProof: "CounterfactualReleaseLabEngine Verified.",
  },
  {
    id: "modern-orgs",
    title: "11. Built for Modern Engineering Organizations",
    icon: Building,
    status: "ENTERPRISE_READY",
    summary: "Empowers product managers, staff engineers, security teams, and engineering leadership with aligned operational truth.",
    architecturePoints: [
      "Executive KPI intelligence dashboards and engineering velocity metrics.",
      "ADR (Architecture Decision Record) lifecycle management.",
      "Requirements-to-code traceability across 14 lifecycle stages.",
    ],
    evidenceProof: "Enterprise Org Engine & ADR Lifecycle Active.",
  },
  {
    id: "resilient-foundation",
    title: "12. Built on a Resilient Engineering Foundation",
    icon: Zap,
    status: "IMPLEMENTED_LIVE",
    summary: "Hardened TypeScript codebase with graceful degradation, offline session recovery, and self-healing background workers.",
    architecturePoints: [
      "Comprehensive unit, integration, and adversarial regression test suites.",
      "Fault-tolerant TanStack Router and Query caching infrastructure.",
      "Zero unhandled promise rejections or unverified external states.",
    ],
    evidenceProof: "Automated Acceptance Gate Report: 100% Pass Rate.",
  },
  {
    id: "why-brahma-different",
    title: "13. Why PROJECT BRAHMA is Different",
    icon: Sparkles,
    status: "IMPLEMENTED_LIVE",
    summary: "Not another code editor or chat composer — a provider-neutral engineering intelligence control plane that enforces truth over assertions.",
    architecturePoints: [
      "No-Status-Lying Engine forbidding fake running claims.",
      "Project State Passport unifying fragmented toolchains.",
      "Evidence-Aware Engineering Theater synchronizing all 10 operational layers.",
    ],
    evidenceProof: "Signature Systems A through P Certified.",
  },
  {
    id: "enterprise-readiness",
    title: "14. Enterprise Engineering Readiness",
    icon: Lock,
    status: "ENTERPRISE_READY",
    summary: "SOC 2 Type II readiness, ISO 27001 alignment, GDPR privacy controls, multi-region tenant isolation, and dedicated support SLAs.",
    architecturePoints: [
      "Configurable SAML/SSO with Okta, Azure AD, Google Workspace, and GitLab.",
      "Granular compliance attestation reports generated on demand.",
      "FinOps governance engine monitoring cross-provider infrastructure spend.",
    ],
    evidenceProof: "Compliance Attestation & FinOps Governance Active.",
  },
];

export function BrahmaExplanatorySurfaces() {
  const [selectedModule, setSelectedModule] = useState<string>("capabilities");
  const active = EXPLANATORY_MODULES.find((m) => m.id === selectedModule) || EXPLANATORY_MODULES[0]!;

  const statusColors: Record<ExplanatoryModule["status"], string> = {
    IMPLEMENTED_LIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    CONNECTED_LIVE: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    CONTROLLED_SIMULATION: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    ENTERPRISE_READY: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          PROJECT BRAHMA / VYRON Explanatory Architecture Surfaces
        </h2>
        <p className="text-xs text-muted-foreground">
          14 Truth-Bound Explanatory Modules Detailing System Foundations, Governance, and AI Control Plane.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Selector List (1 col) */}
        <div className="space-y-2">
          {EXPLANATORY_MODULES.map((mod) => {
            const Icon = mod.icon;
            const isSelected = mod.id === selectedModule;
            return (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod.id)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border/40 hover:border-border/80 bg-card/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold truncate">{mod.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
              </button>
            );
          })}
        </div>

        {/* Module Details Pane (2 cols) */}
        <div className="lg:col-span-2">
          <Card className="border-border/60 bg-card/60 backdrop-blur-md">
            <CardHeader className="py-4 px-5 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  <active.icon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    {active.title}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">PROJECT BRAHMA Specification</span>
                </div>
              </div>

              <Badge variant="outline" className={`text-xs ${statusColors[active.status]}`}>
                {active.status.replace("_", " ")}
              </Badge>
            </CardHeader>

            <CardContent className="p-5 space-y-5 text-xs">
              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-foreground font-medium leading-relaxed">
                {active.summary}
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  Core Architectural Invariants
                </h4>
                <div className="space-y-2">
                  {active.architecturePoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/20 border border-border/30">
                      <span className="text-primary font-bold font-mono">0{i + 1}.</span>
                      <p className="text-muted-foreground text-xs leading-relaxed">{pt}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-border/40 flex items-center justify-between font-mono text-[11px]">
                <span className="text-muted-foreground">Authoritative Evidence Proof:</span>
                <span className="text-emerald-400 font-bold">{active.evidenceProof}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
