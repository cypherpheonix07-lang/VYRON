import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Globe,
  Lock,
  Server,
  Radio,
  Code2,
  ShieldAlert,
  Cpu,
  Brain,
  Bot,
  Sparkles,
  Puzzle,
  Cable,
  Github,
  Database,
  Download,
  ShieldCheck,
  CheckCircle2,
  FlaskConical,
  ExternalLink,
  Activity,
  Layers,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchitectureDiagramSection } from "@/components/showcase/ArchitectureDiagramSection";

export interface SystemDefinition {
  id: string;
  name: string;
  layer: "Frontend" | "Core API" | "Analysis" | "AI & Agents" | "Persistence" | "External";
  icon: React.ComponentType<{ className?: string }>;
  status: "Operational" | "Enforced" | "Ready" | "Streaming" | "Deterministic" | "Active" | "Synchronized" | "Multi-Model" | "Context-Aware" | "Autonomous" | "Isolated" | "Connected" | "Realtime" | "Postgres RLS" | "Verified" | "Zero-Tamper" | "Zero-Drift";
  route: string;
  description: string;
  contracts: string[];
}

export const BRAHMA_18_SYSTEMS: SystemDefinition[] = [
  {
    id: "app-shell",
    name: "React 19 AppShell",
    layer: "Frontend",
    icon: Globe,
    status: "Operational",
    route: "/app",
    description: "Responsive TanStack router application frame, theme synchronization, and sidebar navigation topology.",
    contracts: ["RFC-011", "DOM-01", "W3C-A11Y"],
  },
  {
    id: "supabase-auth",
    name: "Auth Gateway & RLS",
    layer: "Frontend",
    icon: Lock,
    status: "Enforced",
    route: "/app/team",
    description: "Cryptographic JWT session manager, role-based access control, and row-level security isolation.",
    contracts: ["SEC-001", "RLS-TENANT", "AUTH-JWT"],
  },
  {
    id: "fastapi-gateway",
    name: "FastAPI Core Gateway",
    layer: "Core API",
    icon: Server,
    status: "Ready",
    route: "/app/api-gateway",
    description: "High-throughput asynchronous Python gateway exposing typed OpenAPI endpoints and telemetry pipelines.",
    contracts: ["API-002", "OPENAPI-V3", "PYDANTIC-V2"],
  },
  {
    id: "realtime-broker",
    name: "Realtime Event Bus",
    layer: "Core API",
    icon: Radio,
    status: "Streaming",
    route: "/app/monitoring",
    description: "Postgres LISTEN/NOTIFY event broadcaster, WebSocket pub-sub channels, and live telemetry feed.",
    contracts: ["EVT-004", "WS-PUB-SUB", "SSE-FEED"],
  },
  {
    id: "lizard-ast",
    name: "Lizard AST Analyzer",
    layer: "Analysis",
    icon: Code2,
    status: "Deterministic",
    route: "/app/forensics",
    description: "Static cyclomatic complexity, token density, and maintainability index calculator with zero LLM variance.",
    contracts: ["AST-005", "CYC-COMPLEXITY", "MAINT-INDEX"],
  },
  {
    id: "bandit-security",
    name: "Bandit AST Security",
    layer: "Analysis",
    icon: ShieldAlert,
    status: "Active",
    route: "/app/security-center",
    description: "AST-level vulnerability detector mapping insecure code patterns to official CWE classifications.",
    contracts: ["SEC-006", "CWE-TOP-25", "OWASP-TOP-10"],
  },
  {
    id: "celery-workers",
    name: "Celery Task Workers",
    layer: "Analysis",
    icon: Cpu,
    status: "Synchronized",
    route: "/app/system-flow",
    description: "Distributed asynchronous worker cluster managing multi-stage repository scans and task execution.",
    contracts: ["WORK-007", "CELERY-REDIS", "TASK-QUEUE"],
  },
  {
    id: "ai-gateway",
    name: "AI Gateway 2.0",
    layer: "AI & Agents",
    icon: Brain,
    status: "Multi-Model",
    route: "/app/admin/models",
    description: "Multi-provider LLM routing layer with cost attribution, latency budgeting, and automated model fallback.",
    contracts: ["AI-008", "TOKEN-QUOTA", "FALLBACK-ROUTER"],
  },
  {
    id: "copilot-engine",
    name: "Brahma Copilot Engine",
    layer: "AI & Agents",
    icon: Bot,
    status: "Context-Aware",
    route: "/app/chat",
    description: "Dynamic context assembly pipeline combining repo AST, active stage invariants, and user prompts.",
    contracts: ["COP-009", "CONTEXT-ASSEMBLY", "STREAM-CHAT"],
  },
  {
    id: "specialist-agents",
    name: "Specialist Agents Mesh",
    layer: "AI & Agents",
    icon: Sparkles,
    status: "Autonomous",
    route: "/app/aether",
    description: "Eight domain-specific autonomous workers executing requirements, architecture, code, and security tasks.",
    contracts: ["MESH-010", "WORKER-SWARM", "P2P-COORDINATION"],
  },
  {
    id: "plugin-runtime",
    name: "Plugin Sandbox Runtime",
    layer: "AI & Agents",
    icon: Puzzle,
    status: "Isolated",
    route: "/app/plugins",
    description: "Wasm & micro-container execution environment isolating third-party code tools from core storage.",
    contracts: ["PLUG-011", "WASM-SANDBOX", "CAP-ISOLATION"],
  },
  {
    id: "connectors-hub",
    name: "Connectors Hub (MCP)",
    layer: "External",
    icon: Cable,
    status: "Connected",
    route: "/app/connectors",
    description: "Model Context Protocol endpoints bridging VYRON to external developer tools and cloud services.",
    contracts: ["MCP-012", "MCP-V1", "TOOL-DISCOVERY"],
  },
  {
    id: "github-sync",
    name: "GitHub Mirror Sync",
    layer: "External",
    icon: Github,
    status: "Realtime",
    route: "/app/github",
    description: "Bidirectional repository synchronizer ingesting webhooks and calculating structural file AST diffs.",
    contracts: ["GIT-013", "WEBHOOK-INGEST", "AST-DIFF"],
  },
  {
    id: "supabase-postgres",
    name: "PostgreSQL Database",
    layer: "Persistence",
    icon: Database,
    status: "Postgres RLS",
    route: "/app/datasets",
    description: "Authoritative relational persistence layer with strictly parameterized ORM queries and tenant isolation.",
    contracts: ["DB-014", "ZERO-RAW-SQL", "PARAM-QUERY"],
  },
  {
    id: "reportlab-engine",
    name: "ReportLab PDF Compiler",
    layer: "Analysis",
    icon: Download,
    status: "Verified",
    route: "/app/exports",
    description: "Deterministic engineering document generator compiling audit findings and release readiness reports.",
    contracts: ["REP-015", "PDF-COMPILER", "EVIDENCE-PACK"],
  },
  {
    id: "audit-vault",
    name: "Immutable Audit Vault",
    layer: "Persistence",
    icon: ShieldCheck,
    status: "Zero-Tamper",
    route: "/app/admin/audit",
    description: "Cryptographically hashed audit log recording every code mutation, gate transition, and agent action.",
    contracts: ["AUD-016", "HASH-CHAIN", "ZERO-TAMPER"],
  },
  {
    id: "release-evaluator",
    name: "Release Gate Evaluator",
    layer: "Analysis",
    icon: CheckCircle2,
    status: "Zero-Drift",
    route: "/app/release",
    description: "Multi-gate quality verification engine validating unit tests, security posture, and zero architectural drift.",
    contracts: ["REL-017", "GATE-ENGINE", "ZERO-DRIFT"],
  },
  {
    id: "demo-sandbox",
    name: "Demo Simulation Lab",
    layer: "Core API",
    icon: FlaskConical,
    status: "Isolated",
    route: "/app/simulation",
    description: "In-memory mock fixture engine allowing non-destructive exploratory testing without modifying production data.",
    contracts: ["SIM-018", "FIXTURE-LAB", "EPHEMERAL-TWIN"],
  },
];

export function BrahmaSystemsOverviewView() {
  const [selectedLayer, setSelectedLayer] = useState<string>("All");

  const layers = [
    "All",
    "Frontend",
    "Core API",
    "Analysis",
    "AI & Agents",
    "Persistence",
    "External",
  ];

  const filteredSystems = BRAHMA_18_SYSTEMS.filter(
    (sys) => selectedLayer === "All" || sys.layer === selectedLayer,
  );

  return (
    <div className="space-y-10 py-2">
      {/* Top Banner */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/15 text-primary text-xs font-semibold">
              <Layers className="size-3.5" />
              <span>PROJECT BRAHMA — 18-SYSTEM ARCHITECTURE CONTROL PLANE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              18 Core Architecture Systems & Service Nodes
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Every subsystem is fully mapped, verified, and navigable. Select any system node to review its operational telemetry, contract invariants, and direct execution workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-card border border-border text-center">
              <div className="text-xl font-bold text-primary">18 / 18</div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Active Systems</div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-card border border-border text-center">
              <div className="text-xl font-bold text-emerald-400">100%</div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Contract Coverage</div>
            </div>
          </div>
        </div>

        {/* Layer Filter Buttons */}
        <div className="mt-6 pt-6 border-t border-border/60 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground mr-1 flex items-center gap-1.5">
            <Filter className="size-3.5" /> Filter by Layer:
          </span>
          {layers.map((layer) => (
            <Button
              key={layer}
              size="sm"
              variant={selectedLayer === layer ? "default" : "outline"}
              className="h-7 text-xs px-3"
              onClick={() => setSelectedLayer(layer)}
            >
              {layer}
            </Button>
          ))}
        </div>
      </div>

      {/* 18 Systems Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            Active Service Nodes ({filteredSystems.length})
          </h2>
          <span className="text-xs text-muted-foreground">Click any card to launch its live workspace</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSystems.map((sys, idx) => {
            const Icon = sys.icon;
            return (
              <Card
                key={sys.id}
                className="group border border-border/70 hover:border-primary/50 transition-all duration-200 hover:shadow-lg bg-card/60 backdrop-blur-sm flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          SYS-{(idx + 1).toString().padStart(2, "0")} • {sys.layer}
                        </div>
                        <CardTitle className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {sys.name}
                        </CardTitle>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-mono uppercase bg-background/50 border-primary/30 text-primary">
                      {sys.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {sys.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {sys.contracts.map((c) => (
                      <span
                        key={c}
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-muted/60 text-muted-foreground border border-border/50"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[150px]">
                      {sys.route}
                    </span>
                    <Button asChild size="sm" variant="ghost" className="h-7 text-xs gap-1 px-2.5 hover:text-primary">
                      <Link to={sys.route as never}>
                        Open System
                        <ArrowRight className="size-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Embedded Architecture Diagram Topology Section */}
      <div className="rounded-2xl border border-border/80 overflow-hidden shadow-2xl">
        <ArchitectureDiagramSection />
      </div>
    </div>
  );
}
