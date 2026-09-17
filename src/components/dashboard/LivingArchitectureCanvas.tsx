/**
 * VYRON — LIVING ARCHITECTURE CANVAS (PHASE 09)
 * Interactive architecture topology explorer with search, isolation, dependency traversal,
 * overlay modes (Runtime, Security, Drift), and "Trace from here" blast radius analysis.
 * Strictly ZERO SQL. Strictly Zero Capital 'B' "Brahma" branding.
 */

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommandCenter } from "@/state/commandCenter/commandCenterStore";
import { changeImpactEngine } from "@/services/intelligence/impactEngine";
import { engineeringKnowledgeGraph } from "@/services/intelligence/knowledgeGraph";
import { generateVerificationHash } from "@/services/ai/cryptoUtils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Lock,
  Network,
  Radio,
  Search,
  Server,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

export interface ServiceNode {
  id: string;
  name: string;
  protocol: string;
  port: string;
  type: "Gateway" | "Security" | "Core" | "Intelligence" | "Storage";
  status: "Healthy" | "Degraded" | "At Risk";
  owner: string;
  latencyP95: string;
  apis: string[];
  dependencies: string[];
  dependents: string[];
  requirements: string[];
  driftCount: number;
  vulnerabilityCount: number;
  evidenceHash: string;
}

const SERVICE_CATALOG: ServiceNode[] = [
  {
    id: "srv-gateway",
    name: "API Gateway Service",
    protocol: "HTTPS/REST",
    port: "8080",
    type: "Gateway",
    status: "Healthy",
    owner: "Platform Ingress Team",
    latencyP95: "142ms",
    apis: ["POST /v1/payments", "GET /v1/health", "POST /v1/auth/token"],
    dependencies: ["srv-auth", "srv-settlement"],
    dependents: ["Merchant Clients", "Web App"],
    requirements: ["NFR-01", "CON-01"],
    driftCount: 0,
    vulnerabilityCount: 0,
    evidenceHash: generateVerificationHash("SRV:GATEWAY:V24"),
  },
  {
    id: "srv-auth",
    name: "Authentication & GoTrue",
    protocol: "JWT / Bearer",
    port: "54321",
    type: "Security",
    status: "Healthy",
    owner: "Identity & Trust Team",
    latencyP95: "48ms",
    apis: ["POST /auth/v1/token", "GET /auth/v1/user", "POST /auth/v1/logout"],
    dependencies: ["PostgreSQL Database"],
    dependents: ["srv-gateway", "srv-settlement"],
    requirements: ["NFR-02", "CON-01"],
    driftCount: 0,
    vulnerabilityCount: 1, // JWT secret fallback in dev config
    evidenceHash: generateVerificationHash("SRV:AUTH:V24"),
  },
  {
    id: "srv-settlement",
    name: "Settlement Orchestration",
    protocol: "gRPC / Node",
    port: "9000",
    type: "Core",
    status: "At Risk",
    owner: "Settlement Core Team",
    latencyP95: "310ms",
    apis: ["POST /v2/settlements/execute", "GET /v2/settlements/:id"],
    dependencies: ["srv-risk", "PostgreSQL Database"],
    dependents: ["srv-gateway"],
    requirements: ["FR-01", "FR-02", "FR-03"],
    driftCount: 1, // Direct SQL query drift
    vulnerabilityCount: 1, // CWE-89
    evidenceHash: generateVerificationHash("SRV:SETTLEMENT:V24"),
  },
  {
    id: "srv-risk",
    name: "Composite Risk Engine",
    protocol: "HTTP / FastAPI",
    port: "8000",
    type: "Intelligence",
    status: "Healthy",
    owner: "AI Intelligence Team",
    latencyP95: "1.84s",
    apis: ["POST /api/v1/evaluate_risk", "GET /api/v1/anomaly_radar"],
    dependencies: ["PostgreSQL Database"],
    dependents: ["srv-settlement"],
    requirements: ["FR-02", "NFR-03"],
    driftCount: 0,
    vulnerabilityCount: 0,
    evidenceHash: generateVerificationHash("SRV:RISK:V24"),
  },
  {
    id: "srv-postgres",
    name: "PostgreSQL Database",
    protocol: "TCP / SQL",
    port: "5432",
    type: "Storage",
    status: "Healthy",
    owner: "Data Infra Team",
    latencyP95: "12ms",
    apis: ["SQL Connection Pool (Port 5432)"],
    dependencies: [],
    dependents: ["srv-auth", "srv-settlement", "srv-risk"],
    requirements: ["NFR-04", "CON-03"],
    driftCount: 0,
    vulnerabilityCount: 0,
    evidenceHash: generateVerificationHash("SRV:POSTGRES:V24"),
  },
];

export function LivingArchitectureCanvas() {
  const { selectEntity } = useCommandCenter();
  const [searchQuery, setSearchQuery] = useState("");
  const [overlayMode, setOverlayMode] = useState<"ALL" | "RUNTIME" | "SECURITY" | "DRIFT">("ALL");
  const [selectedService, setSelectedService] = useState<ServiceNode>(SERVICE_CATALOG[2]!); // srv-settlement

  const filteredServices = useMemo(() => {
    return SERVICE_CATALOG.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.type.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const handleTraceFromHere = (service: ServiceNode) => {
    const impact = changeImpactEngine.analyzeImpact(`TRACE-${service.id}`, [
      service.id === "srv-settlement" ? "services/settlement/worker.ts" : "services/gateway/proxy.ts",
    ]);
    toast.info(`Traced blast radius from ${service.name}: ${impact.blastRadius} (${impact.affectedServices.length} services affected)`);
  };

  const handleInspectService = (service: ServiceNode) => {
    setSelectedService(service);
    selectEntity({
      type: "service",
      id: service.id,
      name: service.name,
      status: service.status,
      severity: service.status === "At Risk" ? "HIGH" : "LOW",
      details: `${service.name} (${service.type}). Protocol: ${service.protocol} :${service.port}. Owner: ${service.owner}. P95 Latency: ${service.latencyP95}.`,
      evidenceHash: service.evidenceHash,
      metadata: {
        type: service.type,
        port: service.port,
        protocol: service.protocol,
        owner: service.owner,
        apis: service.apis,
        dependencies: service.dependencies,
        dependents: service.dependents,
        requirements: service.requirements,
        driftCount: service.driftCount,
        vulnerabilityCount: service.vulnerabilityCount,
      },
    });
  };

  return (
    <div className="space-y-3">
      {/* SEARCH BAR & OVERLAYS */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg border border-border/40 bg-zinc-950/40 text-xs">
        <div className="flex items-center gap-1.5 bg-zinc-900 px-2 py-1 rounded border border-border/50 flex-1 min-w-[140px] max-w-xs">
          <Search className="size-3 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search topology services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1">
          {(["ALL", "RUNTIME", "SECURITY", "DRIFT"] as const).map((mode) => (
            <Button
              key={mode}
              variant={overlayMode === mode ? "default" : "outline"}
              size="sm"
              onClick={() => setOverlayMode(mode)}
              className="h-6 px-1.5 text-[9px] font-mono"
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {/* SERVICE TOPOLOGY LIST */}
      <div className="space-y-1.5 max-h-56 overflow-y-auto">
        {filteredServices.map((svc) => (
          <div
            key={svc.id}
            onClick={() => handleInspectService(svc)}
            className={cn(
              "flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors",
              selectedService.id === svc.id
                ? "border-primary bg-primary/10"
                : "border-border/30 bg-zinc-950/40 hover:bg-zinc-900/40",
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={cn(
                  "size-2 rounded-full shrink-0",
                  svc.status === "Healthy" ? "bg-emerald-400" : "bg-amber-400 animate-pulse",
                )}
              />
              <div className="min-w-0">
                <div className="font-semibold text-foreground truncate">{svc.name}</div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {svc.protocol} :{svc.port} • Owner: {svc.owner}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {overlayMode === "RUNTIME" && (
                <Badge variant="outline" className="text-[9px] font-mono text-emerald-400">
                  {svc.latencyP95}
                </Badge>
              )}
              {overlayMode === "DRIFT" && svc.driftCount > 0 && (
                <Badge variant="outline" className="text-[9px] font-mono text-amber-400 border-amber-500/30 bg-amber-500/10">
                  1 DRIFT
                </Badge>
              )}
              {overlayMode === "SECURITY" && svc.vulnerabilityCount > 0 && (
                <Badge variant="outline" className="text-[9px] font-mono text-rose-400 border-rose-500/30 bg-rose-500/10">
                  1 VULN
                </Badge>
              )}
              <Badge variant="outline" className="text-[9px] font-mono">
                {svc.type}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* COMPONENT INSPECTION & TRACE FROM HERE */}
      <div className="p-3 rounded-lg border border-primary/20 bg-zinc-950/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Server className="size-3.5 text-primary" /> Active Canvas Node: {selectedService.name}
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleTraceFromHere(selectedService)}
              className="h-5 px-1.5 text-[9px] font-mono text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10"
            >
              Trace from here
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-5 px-1.5 text-[9px] gap-1 font-mono"
              onClick={() => handleInspectService(selectedService)}
            >
              <Sparkles className="size-2 text-primary" /> Inspect in Drawer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono">
          <div className="p-1.5 rounded bg-zinc-900/40 border border-border/20">
            <div className="text-muted-foreground text-[9px]">APIs Exposing</div>
            <div className="font-bold text-foreground truncate">{selectedService.apis[0]}</div>
          </div>
          <div className="p-1.5 rounded bg-zinc-900/40 border border-border/20">
            <div className="text-muted-foreground text-[9px]">Dependencies</div>
            <div className="font-bold text-foreground truncate">{selectedService.dependencies.join(", ") || "None"}</div>
          </div>
          <div className="p-1.5 rounded bg-zinc-900/40 border border-border/20">
            <div className="text-muted-foreground text-[9px]">EARS Reqs</div>
            <div className="font-bold text-foreground truncate">{selectedService.requirements.join(", ")}</div>
          </div>
          <div className="p-1.5 rounded bg-zinc-900/40 border border-border/20">
            <div className="text-muted-foreground text-[9px]">P95 Latency</div>
            <div className="font-bold text-emerald-400">{selectedService.latencyP95}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
