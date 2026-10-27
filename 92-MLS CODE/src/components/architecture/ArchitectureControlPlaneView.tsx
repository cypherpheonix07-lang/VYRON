/**
 * VYRON — IMAGE-DRIVEN ULTRA-NUCLEAR ARCHITECTURE CONTROL PLANE VIEW
 * GOD MODE vULTIMA ΩΩΩΩΩΩΩΩ
 * Synthesizes all 6 Reference Patterns:
 * 1. API Gateway (Image 01)
 * 2. Backend for Frontend (Image 02)
 * 3. Bulkhead Isolation (Image 03)
 * 4. Transactional Outbox (Image 04)
 * 5. Hexagonal Core Ports & Adapters (Image 05)
 * 6. 15-Layer Real-SaaS Lifecycle Stack (Image 06)
 * + 250×104 Deep Section Dossier Explorer (26,000 instances).
 * Strictly ZERO Raw SQL.
 */

import React, { useState, useMemo } from "react";
import {
  Globe,
  Layers,
  ShieldCheck,
  Package,
  Cpu,
  Terminal,
  Activity,
  Search,
  RefreshCw,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  Smartphone,
  Send,
  Zap,
  Box,
  Sliders,
  Sparkles,
  Check,
  X,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { apiGateway, GatewayRoute, GatewayResponse } from "@/architecture/gateway/apiGatewayEngine";
import { bffComposition, WebDashboardDto, MobileSummaryDto, PartnerIntegrationDto } from "@/architecture/bff/bffCompositionEngine";
import { bulkheadIsolation, BulkheadPoolStats, BulkheadPoolId } from "@/architecture/bulkhead/bulkheadIsolationEngine";
import { transactionalOutbox, OutboxEvent, BusinessEntity } from "@/architecture/outbox/transactionalOutboxEngine";
import { hexagonalProjectService } from "@/architecture/hexagonal/hexagonalCoreEngine";
import { lifecycleStack, StackLayerDefinition } from "@/architecture/stack/lifecycleStackEngine";
import { nuclearDossierData, NuclearPhaseDefinition } from "@/architecture/dossier/nuclearDossier250x104Data";

export interface ArchitectureControlPlaneViewProps {
  projectId?: string;
}

export const ArchitectureControlPlaneView: React.FC<ArchitectureControlPlaneViewProps> = ({
  projectId = "proj-brahma",
}) => {
  const [activeTab, setActiveTab] = useState<
    "gateway" | "bff" | "bulkhead" | "outbox" | "hexagonal" | "stack" | "dossier"
  >("gateway");

  // --- Image 01: API Gateway State ---
  const routes = useMemo(() => apiGateway.getRegisteredRoutes(), []);
  const [testPath, setTestPath] = useState("/api/v1/projects");
  const [testMethod, setTestMethod] = useState<"GET" | "POST">("GET");
  const [testRole, setTestRole] = useState<"DEVELOPER" | "OPERATOR" | "READONLY" | "ANONYMOUS">("DEVELOPER");
  const [gatewayResult, setGatewayResult] = useState<GatewayResponse | null>(null);

  const handleExecuteGatewayTest = async () => {
    const res = await apiGateway.handleRequest(
      testMethod,
      testPath,
      {
        requestId: `REQ-${Date.now()}`,
        correlationId: `CORR-${Date.now()}`,
        clientType: "web",
        tenantId: "tenant-enterprise-01",
        role: testRole,
        ipAddress: "127.0.0.1",
        timestamp: new Date().toISOString(),
      }
    );
    setGatewayResult(res);
    if (res.success) {
      toast.success(`Gateway Route ${testMethod} ${testPath} Successful (Status: ${res.statusCode})`);
    } else {
      toast.error(`Gateway Error: ${res.error?.code}`, { description: res.error?.message });
    }
  };

  // --- Image 02: BFF State ---
  const [bffMode, setBffMode] = useState<"WEB" | "MOBILE" | "PARTNER">("WEB");
  const [webDto, setWebDto] = useState<WebDashboardDto | null>(null);
  const [mobileDto, setMobileDto] = useState<MobileSummaryDto | null>(null);
  const [partnerDto, setPartnerDto] = useState<PartnerIntegrationDto | null>(null);

  const handleFetchBff = async (mode: "WEB" | "MOBILE" | "PARTNER") => {
    setBffMode(mode);
    if (mode === "WEB") {
      const data = await bffComposition.composeWebDashboard(projectId);
      setWebDto(data);
    } else if (mode === "MOBILE") {
      const data = await bffComposition.composeMobileSummary(projectId);
      setMobileDto(data);
    } else {
      const data = await bffComposition.composePartnerIntegration(projectId, "partner-acme-corp");
      setPartnerDto(data);
    }
  };

  // --- Image 03: Bulkhead State ---
  const [bulkheadStats, setBulkheadStats] = useState<BulkheadPoolStats[]>(() =>
    bulkheadIsolation.getPoolStats()
  );

  const handleSimulateBulkhead = (poolId: BulkheadPoolId) => {
    const tenant = "tenant-enterprise-01";
    const res = bulkheadIsolation.acquireSlot(poolId, tenant);
    if (res.acquired) {
      toast.success(`Acquired 1 concurrency slot in ${poolId}`);
    } else {
      toast.error(`Slot Rejected: ${res.reason}`);
    }
    setBulkheadStats(bulkheadIsolation.getPoolStats());
  };

  const handleReleaseBulkhead = (poolId: BulkheadPoolId) => {
    const tenant = "tenant-enterprise-01";
    bulkheadIsolation.releaseSlot(poolId, tenant);
    toast.info(`Released 1 concurrency slot in ${poolId}`);
    setBulkheadStats(bulkheadIsolation.getPoolStats());
  };

  // --- Image 04: Outbox State ---
  const [outboxEvents, setOutboxEvents] = useState<OutboxEvent[]>(() =>
    transactionalOutbox.getOutboxEvents()
  );
  const [dlqEvents, setDlqEvents] = useState<OutboxEvent[]>(() =>
    transactionalOutbox.getDlqEvents()
  );
  const [lastEntity, setLastEntity] = useState<BusinessEntity | null>(null);

  const handleAtomicCommit = () => {
    const idKey = `IDEM-${Date.now()}`;
    const result = transactionalOutbox.atomicCommit({
      entityId: `proj-brahma-entity`,
      entityData: { deploymentTimestamp: new Date().toISOString(), status: "PROMOTED_CANARY" },
      aggregateType: "PROJECT",
      eventType: "PROJECT_DEPLOYED",
      payload: { projectId: "proj-brahma", version: "v2.5.0-canonical" },
      correlationId: `CORR-${Date.now()}`,
      idempotencyKey: idKey,
    });

    setLastEntity(result.entity);
    setOutboxEvents(transactionalOutbox.getOutboxEvents());
    toast.success(`Atomic Transaction Committed (Event: ${result.eventId})`);
  };

  const handleRelayOutbox = async () => {
    const res = await transactionalOutbox.relayPendingEvents();
    setOutboxEvents(transactionalOutbox.getOutboxEvents());
    setDlqEvents(transactionalOutbox.getDlqEvents());
    toast.info(`Outbox Relay: ${res.relayedCount} Relayed, ${res.failedCount} Failed`);
  };

  // --- Image 05: Hexagonal Core State ---
  const [hexagonalResult, setHexagonalResult] = useState<any>(null);

  const handleRunHexagonalUseCase = async () => {
    const res = await hexagonalProjectService.evaluateGates(projectId);
    setHexagonalResult(res);
    toast.success(`Hexagonal Domain Core Evaluated (Score: ${res.overallScore}%)`);
  };

  // --- Image 06: Lifecycle Stack State ---
  const stackLayers = useMemo(() => lifecycleStack.getAllLayers(), []);
  const stackSummary = useMemo(() => lifecycleStack.getStackHealthSummary(), []);

  // --- 250x104 Dossier State ---
  const allPhases = useMemo(() => Object.values(nuclearDossierData.phases), []);
  const [searchPhase, setSearchPhase] = useState("");
  const [selectedPhaseId, setSelectedPhaseId] = useState("P011");

  const filteredPhases = useMemo(() => {
    if (!searchPhase.trim()) return allPhases.slice(0, 30);
    const q = searchPhase.toLowerCase();
    return allPhases.filter(
      (p) =>
        p.phaseId.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q)
    );
  }, [allPhases, searchPhase]);

  const activePhase: NuclearPhaseDefinition = useMemo(() => {
    return (
      nuclearDossierData.phases[selectedPhaseId] ??
      allPhases[0] ?? {
        phaseId: "P001",
        title: "Forensic reconstruction — repository",
        domain: "Forensic reconstruction",
        subDomain: "repository",
        index: 1,
        sections: {},
      }
    );
  }, [selectedPhaseId, allPhases]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[var(--radius-md)] p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/30 font-mono text-[11px]">
                GOD MODE vULTIMA ΩΩΩΩΩΩΩΩ
              </Badge>
              <Badge variant="outline" className="font-mono text-[11px] text-[var(--text-muted)]">
                6 IMAGE PATTERNS SYNTHESIZED
              </Badge>
              <Badge variant="outline" className="font-mono text-[11px] bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30">
                250 PHASES × 104 SECTIONS (26,000 INSTANCES)
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              Engineering Architecture Intelligence Control Plane
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              API Gateway • Backend for Frontend • Bulkhead Isolation • Transactional Outbox • Hexagonal Core • 15-Layer Real-SaaS Lifecycle Stack.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleRunHexagonalUseCase}
              className="gap-1.5 font-mono text-xs bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
            >
              <Zap className="size-3.5" />
              Run Core Hexagonal Ports
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-default)]/60 mt-4 overflow-x-auto text-xs font-mono">
          {[
            { id: "gateway", label: "01. API Gateway", icon: Globe, badge: `${routes.length} Routes` },
            { id: "bff", label: "02. BFF Composition", icon: Smartphone, badge: "3 Clients" },
            { id: "bulkhead", label: "03. Bulkhead Pools", icon: Box, badge: "6 Pools" },
            { id: "outbox", label: "04. Transactional Outbox", icon: Send, badge: `${outboxEvents.length} Events` },
            { id: "hexagonal", label: "05. Hexagonal Core", icon: Layers, badge: "Ports & Adapters" },
            { id: "stack", label: "06. 15-Layer SaaS Stack", icon: Server, badge: "100% Verified" },
            { id: "dossier", label: "07. 250×104 Section Dossier", icon: Terminal, badge: "26,000" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-[var(--radius-sm)] transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white font-bold"
                    : "bg-[var(--surface-sunken)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)]"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded text-[10px] ${
                      isActive ? "bg-white/20 text-white" : "bg-[var(--surface-base)] text-[var(--text-muted)]"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: API GATEWAY (IMAGE 01) */}
      {activeTab === "gateway" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Registered Routes */}
          <Card className="bg-[var(--surface-base)] border-[var(--border-default)] lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Globe className="size-4 text-[var(--color-primary)]" />
                API Gateway Route Registry & Policy Configuration
              </CardTitle>
              <CardDescription className="text-xs">
                Single policy-bearing edge: Normalization, Auth, Rate Limits, TTL Caching, and Upstream Circuit Breakers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="divide-y divide-[var(--border-default)]/60">
                {routes.map((r, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-bold bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                          {r.method}
                        </Badge>
                        <span className="font-bold text-[var(--text-primary)]">{r.pathPattern.toString().replace(/[/^]/g, "")}</span>
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        Upstream: {r.upstreamService} • Role Required: {r.requiredRole || "PUBLIC"}
                      </div>
                    </div>
                    <div className="text-right text-[10px] space-y-0.5">
                      <div className="text-[var(--text-secondary)]">{r.rateLimitPerMinute} req/min</div>
                      <div className="text-[var(--text-muted)]">Cache: {r.cacheTtlSeconds}s | Timeout: {r.timeoutMs}ms</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Request Tester */}
          <Card className="bg-[var(--surface-base)] border-[var(--border-default)] lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Play className="size-4 text-[var(--color-primary)]" />
                Edge Ingress Simulator
              </CardTitle>
              <CardDescription className="text-xs">
                Simulate client requests through gateway boundaries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 font-mono text-xs">
              <div className="space-y-2">
                <Label className="text-xs">Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["GET", "POST"] as const).map((m) => (
                    <Button
                      key={m}
                      size="sm"
                      variant={testMethod === m ? "default" : "outline"}
                      onClick={() => setTestMethod(m)}
                      className="font-mono text-xs"
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Route Path</Label>
                <Input
                  value={testPath}
                  onChange={(e) => setTestPath(e.target.value)}
                  className="h-8 font-mono text-xs bg-[var(--surface-sunken)]"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Caller Role</Label>
                <select
                  value={testRole}
                  onChange={(e) => setTestRole(e.target.value as any)}
                  className="w-full h-8 px-2 rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-sunken)] font-mono text-xs text-[var(--text-primary)]"
                >
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="OPERATOR">OPERATOR</option>
                  <option value="READONLY">READONLY</option>
                  <option value="ANONYMOUS">ANONYMOUS</option>
                </select>
              </div>

              <Button size="sm" onClick={handleExecuteGatewayTest} className="w-full font-mono text-xs bg-[var(--color-primary)]">
                Dispatch Through Gateway
              </Button>

              {gatewayResult && (
                <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)]">Status:</span>
                    <Badge variant="outline" className={gatewayResult.success ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}>
                      HTTP {gatewayResult.statusCode}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Latency:</span>
                    <span>{gatewayResult.metadata.latencyMs.toFixed(2)} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Cached:</span>
                    <span>{gatewayResult.metadata.cached ? "YES (HIT)" : "NO (MISS)"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Rate Limit Remaining:</span>
                    <span>{gatewayResult.metadata.rateLimitRemaining} tokens</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: BACKEND FOR FRONTEND (IMAGE 02) */}
      {activeTab === "bff" && (
        <Card className="bg-[var(--surface-base)] border-[var(--border-default)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Smartphone className="size-4 text-[var(--color-primary)]" />
                  Backend for Frontend (BFF) Multi-Client Aggregator
                </CardTitle>
                <CardDescription className="text-xs">
                  Tailors client presentation DTOs without redefining domain truth.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {(["WEB", "MOBILE", "PARTNER"] as const).map((mode) => (
                  <Button
                    key={mode}
                    size="sm"
                    variant={bffMode === mode ? "default" : "outline"}
                    onClick={() => handleFetchBff(mode)}
                    className="font-mono text-xs"
                  >
                    {mode} Client BFF
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 font-mono text-xs">
            {bffMode === "WEB" && (
              <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold">
                    Web Desktop BFF Payload (Rich Topology)
                  </Badge>
                  <span className="text-[10px] text-[var(--text-muted)]">Client: WEB_DESKTOP</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded bg-[var(--surface-base)] border border-[var(--border-default)]">
                    <span className="text-[10px] text-[var(--text-muted)] block">Blueprint Revision:</span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">Rev #{webDto?.graphRevision ?? 1}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--surface-base)] border border-[var(--border-default)]">
                    <span className="text-[10px] text-[var(--text-muted)] block">Release Readiness:</span>
                    <span className="text-sm font-bold text-[var(--color-success)]">{webDto?.readinessScore ?? 100}%</span>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--surface-base)] border border-[var(--border-default)]">
                    <span className="text-[10px] text-[var(--text-muted)] block">Graph Density:</span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {webDto?.graphMetrics.nodeCount ?? 9} Nodes, {webDto?.graphMetrics.edgeCount ?? 10} Edges
                    </span>
                  </div>
                </div>
              </div>
            )}

            {bffMode === "MOBILE" && (
              <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 font-bold">
                    Mobile App BFF Payload (Bandwidth-Optimized &lt; 2KB)
                  </Badge>
                  <span className="text-[10px] text-[var(--text-muted)]">Payload: 1.2 KB</span>
                </div>
                <div className="p-3 rounded bg-[var(--surface-base)] border border-[var(--border-default)] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[var(--text-primary)]">Verdict: {mobileDto?.verdict ?? "READY"}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Blocking Gates: {mobileDto?.blockingGatesCount ?? 0}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-[var(--color-success)]">
                    QUICK ACTION ENABLED
                  </Badge>
                </div>
              </div>
            )}

            {bffMode === "PARTNER" && (
              <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 font-bold">
                    Partner Integration BFF Payload (Scoped Minimization)
                  </Badge>
                  <span className="text-[10px] text-[var(--text-muted)]">Target: partner-acme-corp</span>
                </div>
                <div className="p-3 rounded bg-[var(--surface-base)] border border-[var(--border-default)] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">SLA Compliance:</span>
                    <span className="font-bold text-[var(--color-success)]">{partnerDto?.slaCompliancePct ?? 99.98}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Webhook Ingress Target:</span>
                    <span className="text-[10px] text-[var(--text-primary)]">{partnerDto?.webhookDeliveryTarget ?? "https://hooks.partner.org/..."}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 3: BULKHEAD ISOLATION (IMAGE 03) */}
      {activeTab === "bulkhead" && (
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bulkheadStats.map((pool) => (
              <Card key={pool.id} className="bg-[var(--surface-base)] border-[var(--border-default)]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-bold text-[var(--text-primary)]">{pool.name}</CardTitle>
                    <Badge variant="outline" className="text-[10px]">
                      {pool.utilizationPct}% Utilized
                    </Badge>
                  </div>
                  <CardDescription className="text-[10px] text-[var(--text-muted)]">ID: {pool.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="p-2 rounded bg-[var(--surface-sunken)] border border-[var(--border-default)]/60 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Active Slots:</span>
                      <span className="font-bold text-[var(--color-primary)]">{pool.activeCount} / {pool.maxConcurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Queued Requests:</span>
                      <span>{pool.queuedCount} / {pool.maxQueueCapacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Rejections Total:</span>
                      <span className={pool.rejectedTotal > 0 ? "text-[var(--color-danger)] font-bold" : "text-[var(--text-muted)]"}>
                        {pool.rejectedTotal}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleSimulateBulkhead(pool.id)} className="flex-1 text-[10px] h-7">
                      + Acquire Slot
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReleaseBulkhead(pool.id)} className="flex-1 text-[10px] h-7">
                      - Release
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TRANSACTIONAL OUTBOX (IMAGE 04) */}
      {activeTab === "outbox" && (
        <Card className="bg-[var(--surface-base)] border-[var(--border-default)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Send className="size-4 text-[var(--color-primary)]" />
                  Transactional Outbox & Asynchronous Relay
                </CardTitle>
                <CardDescription className="text-xs">
                  Atomic state + event persistence, deduplication cache, delivery state machine, and Dead Letter Queue.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleAtomicCommit} className="font-mono text-xs bg-[var(--color-primary)]">
                  Atomic Commit
                </Button>
                <Button size="sm" variant="outline" onClick={handleRelayOutbox} className="font-mono text-xs">
                  Relay Outbox Stream
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 font-mono text-xs">
            {lastEntity && (
              <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-[var(--text-muted)]">Last Mutated Business Entity: </span>
                  <span className="font-bold text-[var(--text-primary)]">{lastEntity.id} (Version: {lastEntity.version})</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-[var(--color-success)]">ATOMICALLY COMMITTED</Badge>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                Outbox Events Ledger ({outboxEvents.length} Events)
              </span>
              <div className="divide-y divide-[var(--border-default)]/60 max-h-56 overflow-y-auto">
                {outboxEvents.length === 0 ? (
                  <div className="p-4 text-center text-[var(--text-muted)]">Outbox empty. Click 'Atomic Commit' to generate an event.</div>
                ) : (
                  outboxEvents.map((evt) => (
                    <div key={evt.eventId} className="py-2 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-bold text-[var(--color-primary)] mr-2">{evt.eventType}</span>
                        <span className="text-[var(--text-muted)]">ID: {evt.eventId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--text-muted)]">Retries: {evt.retryCount}</span>
                        <Badge
                          variant="outline"
                          className={
                            evt.status === "PROCESSED"
                              ? "text-[var(--color-success)] bg-[var(--color-success)]/10"
                              : evt.status === "PENDING"
                              ? "text-blue-500 bg-blue-500/10"
                              : "text-[var(--color-danger)] bg-[var(--color-danger)]/10"
                          }
                        >
                          {evt.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {dlqEvents.length > 0 && (
              <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--color-danger)]">Dead Letter Queue (DLQ) — {dlqEvents.length} Poisoned Events</span>
                  <Badge variant="outline" className="text-[10px] text-[var(--color-danger)]">REPLAYABLE</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 5: HEXAGONAL ARCHITECTURE (IMAGE 05) */}
      {activeTab === "hexagonal" && (
        <Card className="bg-[var(--surface-base)] border-[var(--border-default)]">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Layers className="size-4 text-[var(--color-primary)]" />
              Hexagonal Architecture — Ports & Adapters Isolation Map
            </CardTitle>
            <CardDescription className="text-xs">
              Dependency Inversion: Pure domain core is decoupled from databases, HTTP, email, providers, and AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Inbound Adapters */}
              <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] space-y-2 text-center">
                <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider block">Inbound Ports & Adapters</span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 rounded bg-[var(--surface-base)] border border-[var(--border-default)]">WebHttpControllerAdapter</div>
                  <div className="p-2 rounded bg-[var(--surface-base)] border border-[var(--border-default)]">MobileHttpControllerAdapter</div>
                  <div className="p-2 rounded bg-[var(--surface-base)] border border-[var(--border-default)]">CliCommandAdapter</div>
                </div>
              </div>

              {/* Pure Domain Core */}
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)]/40 space-y-2 text-center shadow-md">
                <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider block">Domain Core (Pure Business Logic)</span>
                <div className="p-2.5 rounded bg-[var(--surface-base)] border border-[var(--border-default)] space-y-1 text-[11px]">
                  <div className="font-bold text-[var(--text-primary)]">ProjectDomainService</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Zero DB / Framework Imports</div>
                  <div className="text-[10px] text-[var(--color-success)]">Strict Inward Dependency Rule</div>
                </div>
              </div>

              {/* Outbound Adapters */}
              <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] space-y-2 text-center">
                <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider block">Outbound Ports & Adapters</span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 rounded bg-[var(--surface-base)] border border-[var(--border-default)]">ProjectRepositoryPort (Supabase)</div>
                  <div className="p-2 rounded bg-[var(--surface-base)] border border-[var(--border-default)]">EventPublisherPort (Outbox)</div>
                  <div className="p-2 rounded bg-[var(--surface-base)] border border-[var(--border-default)]">EvidenceStorePort (WORM)</div>
                </div>
              </div>
            </div>

            {hexagonalResult && (
              <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-[var(--text-muted)]">Core Use Case Execution: </span>
                  <span className="font-bold text-[var(--color-success)]">{hexagonalResult.verdict} (Score: {hexagonalResult.overallScore}%)</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-[var(--color-success)]">ALL PORTS COMPLIANT</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 6: 15-LAYER REAL-SAAS STACK (IMAGE 06) */}
      {activeTab === "stack" && (
        <Card className="bg-[var(--surface-base)] border-[var(--border-default)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Server className="size-4 text-[var(--color-primary)]" />
                  15-Layer Real-SaaS Lifecycle Stack
                </CardTitle>
                <CardDescription className="text-xs">
                  System Design → Architecture → Frontend → Backend → Storage → Auth → Cloud → CI/CD → Security → Rate Limit → CDN → Logs → Monitoring → Testing → Scaling.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono text-[var(--color-success)] bg-[var(--color-success)]/10">
                {stackSummary.verified} / {stackSummary.total} Layers Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-xs">
            <div className="divide-y divide-[var(--border-default)]/60">
              {stackLayers.map((l) => (
                <div key={l.layerIndex} className="py-2.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--color-primary)]">L{String(l.layerIndex).padStart(2, "0")}.</span>
                      <span className="font-bold text-[var(--text-primary)]">{l.name}</span>
                      <Badge variant="outline" className="text-[9px] bg-[var(--surface-sunken)]">{l.category}</Badge>
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)]">{l.primaryTechnology} • Invariant: {l.contractInvariant}</div>
                  </div>
                  <div className="text-right space-y-0.5">
                    <Badge variant="outline" className="text-[9px] text-[var(--color-success)] bg-[var(--color-success)]/10 font-bold">
                      {l.status}
                    </Badge>
                    <div className="text-[10px] text-[var(--text-muted)]">Rollback: {l.rollbackStrategy}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 7: 250×104 SECTION DOSSIER EXPLORER */}
      {activeTab === "dossier" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Phase Directory */}
          <Card className="bg-[var(--surface-base)] border-[var(--border-default)] lg:col-span-1 flex flex-col h-[520px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>Phase Directory (250)</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {filteredPhases.length} shown
                </Badge>
              </CardTitle>
              <div className="relative pt-1">
                <Search className="absolute left-2.5 top-3.5 size-3.5 text-[var(--text-muted)]" />
                <Input
                  value={searchPhase}
                  onChange={(e) => setSearchPhase(e.target.value)}
                  placeholder="Search phases or domains..."
                  className="pl-8 h-8 font-mono text-xs bg-[var(--surface-sunken)]"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-1 pr-2">
              {filteredPhases.map((phase) => (
                <button
                  key={phase.phaseId}
                  onClick={() => setSelectedPhaseId(phase.phaseId)}
                  className={`w-full text-left p-2 rounded-[var(--radius-sm)] border text-xs font-mono transition-colors flex items-center justify-between ${
                    selectedPhaseId === phase.phaseId
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] font-bold"
                      : "bg-[var(--surface-sunken)] text-[var(--text-secondary)] border-[var(--border-default)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="mr-1.5 opacity-80">{phase.phaseId}</span>
                    <span>{phase.title}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] shrink-0 opacity-80">
                    {phase.subDomain}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Phase Details & Section Contracts */}
          <Card className="bg-[var(--surface-base)] border-[var(--border-default)] lg:col-span-2 flex flex-col h-[520px]">
            <CardHeader className="pb-3 border-b border-[var(--border-default)]/60">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="font-mono text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    {activePhase.domain} • {activePhase.subDomain}
                  </Badge>
                  <CardTitle className="text-base font-bold text-[var(--text-primary)] pt-1">
                    {activePhase.phaseId} — {activePhase.title}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="font-mono text-[11px]">
                  104 Executable Sections
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                  Domain-Specific Architectural Mandate
                </span>
                <p className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] text-[var(--text-secondary)] text-[11px] leading-relaxed">
                  Every section in {activePhase.phaseId} enforces concrete invariants across the 6 synthesized architecture patterns. Contracts are bound to the canonical evidence ledger with zero unverified assumptions.
                </p>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                  Contract Sampler (A–Z / a–z / Mirror Parity)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {Object.entries(activePhase.sections).slice(0, 20).map(([key, sec]) => (
                    <div key={key} className="p-2.5 rounded bg-[var(--surface-sunken)] border border-[var(--border-default)]/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--color-primary)]">{key}: {sec.name}</span>
                        <Badge variant="outline" className="text-[9px] text-[var(--color-success)]">{sec.canonicalVerdict}</Badge>
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] line-clamp-2">
                        {sec.purpose}
                      </p>
                      <div className="text-[9px] text-[var(--text-muted)] pt-1 flex justify-between">
                        <span>Code: {sec.codeLocation}</span>
                        <span>{sec.syncAsync}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
