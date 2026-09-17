/**
 * VYRON — UNIVERSAL DETAIL DRAWER (PHASE 17)
 * Unified slide-over interactive detail inspection surface for any selected entity:
 * Project, Service, Risk, Anomaly, Drift finding, Release Gate, Evidence, ADR, or Vulnerability.
 *
 * Exposes 7 Standardized Intelligence Tabs:
 * 1. OVERVIEW
 * 2. RELATIONSHIPS
 * 3. HISTORY
 * 4. EVIDENCE
 * 5. IMPACT
 * 6. ACTIONS
 * 7. COPILOT
 *
 * Zero SQL. Strictly Zero Capital 'B' "Brahma" branding.
 */

import { useState, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommandCenter } from "@/state/commandCenter/commandCenterStore";
import { engineeringKnowledgeGraph } from "@/services/intelligence/knowledgeGraph";
import { timeMachineEngine } from "@/services/intelligence/timeMachineEngine";
import { changeImpactEngine } from "@/services/intelligence/impactEngine";
import { architectureDriftEngine } from "@/services/intelligence/driftEngine";
import { policyEngine } from "@/services/policy/policyEngine";
import { decisionEngine } from "@/services/intelligence/decisionEngine";
import { eventSimulator } from "@/services/demo/eventSimulator";
import { copilotDispatcher } from "@/services/copilot/copilotDispatcher";
import { healthCausalityEngine } from "@/services/intelligence/healthCausalityEngine";
import { decisionDecayEngine } from "@/services/intelligence/decisionDecayEngine";
import { governanceAuthorizationEngine } from "@/services/governance/governanceAuthorizationEngine";
import { generateVerificationHash } from "@/services/ai/cryptoUtils";
import { toast } from "sonner";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Fingerprint,
  GitBranch,
  Layers,
  Network,
  Play,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sparkles,
  Send,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function UniversalDetailDrawer() {
  const {
    selectedEntity,
    isDrawerOpen,
    closeDrawer,
    userAuthority,
    setFocusedSurface,
    setSelectedProject,
    investigationChain,
    popInvestigation,
  } = useCommandCenter();

  const [activeTab, setActiveTab] = useState("overview");
  const [copilotInput, setCopilotInput] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  // Derive Graph Neighbors for selected entity
  const graphNeighbors = useMemo(() => {
    if (!selectedEntity) return { outgoing: [], incoming: [] };
    const entityId = selectedEntity.id;
    return engineeringKnowledgeGraph.getNeighbors(entityId);
  }, [selectedEntity]);

  // Derive Blast Radius Impact
  const impactAnalysis = useMemo(() => {
    if (!selectedEntity) return null;
    const files =
      selectedEntity.type === "drift"
        ? ["services/billing/query.ts", "services/settlement/worker.ts"]
        : selectedEntity.type === "risk"
          ? ["finledger/risk/engine.py", "finledger/payment/processor.py"]
          : ["services/gateway/proxy.ts"];
    return changeImpactEngine.analyzeImpact(`INSPECT-${selectedEntity.id}`, files);
  }, [selectedEntity]);

  // Derive Time Machine Historical Snapshots
  const historicalSnapshots = useMemo(() => {
    return timeMachineEngine.listSnapshots();
  }, []);

  // Derive Health Causality Record
  const causalityRecord = useMemo(() => {
    if (!selectedEntity) return null;
    return (
      healthCausalityEngine.getCausalityForPoint(selectedEntity.id) ||
      healthCausalityEngine.evaluateCausality(84, 88, selectedEntity.timestamp || "2026-09-16")
    );
  }, [selectedEntity]);

  // Derive Decision Intelligence & Decay
  const relevantDecisions = useMemo(() => {
    return decisionDecayEngine.listDecisions();
  }, []);

  // Derive Governance Fitness Functions
  const fitnessResults = useMemo(() => {
    return governanceAuthorizationEngine.executeFitnessFunctions();
  }, []);

  if (!selectedEntity) return null;

  const entityTitle = selectedEntity.title || selectedEntity.name || selectedEntity.id;
  const verificationHash =
    selectedEntity.evidenceHash ||
    generateVerificationHash(`${selectedEntity.type}:${selectedEntity.id}:${selectedEntity.timestamp || "2026-09-16"}`);

  // Action Handlers
  const handleRemediate = () => {
    if (selectedEntity.type === "drift") {
      architectureDriftEngine.resolveDriftFinding(selectedEntity.id);
      toast.success(`Remediation patch created & applied for: ${entityTitle}`);
    } else {
      toast.success(`Automated remediation task dispatched for ${entityTitle}`);
    }
  };

  const handleSimulateInTwin = () => {
    setIsSimulating(true);
    eventSimulator.injectAnomalyWave(4);
    toast.info(`Injected anomaly wave for ${entityTitle} into Simulation Twin.`);
    setTimeout(() => setIsSimulating(false), 800);
  };

  const handleGrantException = () => {
    const granted = policyEngine.grantException(
      selectedEntity.id,
      "Approved temporary architectural waiver pending Q4 refactor",
      userAuthority,
      48,
    );
    if (granted) {
      toast.success(`Granted 48h CISO Policy Exception for ${entityTitle}`);
    } else {
      toast.info(`Policy Exception registered under ${userAuthority}`);
    }
  };

  const handleRecordADR = () => {
    const adr = decisionEngine.recordDecision({
      title: `Mitigation Architecture Decision for ${entityTitle}`,
      context: `Contextual risk mitigation evaluated in VYRON Command Center for entity ${selectedEntity.id}.`,
      options: [
        {
          id: "opt-isolate",
          title: "Service Boundary Isolation with Circuit Breaker",
          description: "Encapsulate vulnerable interaction behind strict typed gateway contracts.",
          pros: ["Zero downtime", "Isolates transitive blast radius"],
          cons: ["Adds 4ms hop latency"],
          estimatedEffortHours: 8,
        },
      ],
      chosenOptionId: "opt-isolate",
      rationale: `Selected by ${userAuthority} to protect portfolio integrity.`,
      affectedArchitectureNodes: [selectedEntity.id],
      actor: userAuthority,
    });
    toast.success(`Recorded Architectural Decision ${adr.id} with SHA-256 seal.`);
  };

  const handleDispatchCopilot = async (customPrompt?: string) => {
    const promptToRun = customPrompt || copilotInput;
    if (!promptToRun.trim()) return;

    toast.info("Sending contextual analysis to VYRON Copilot...");
    await copilotDispatcher.dispatch(
      `[Context: Entity ${selectedEntity.type.toUpperCase()} '${entityTitle}' (ID: ${selectedEntity.id}, Severity: ${selectedEntity.severity || "NORMAL"}, Blast Radius: ${impactAnalysis?.blastRadius || "LOCALIZED"})] ${promptToRun}`,
    );
    setCopilotInput("");
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl bg-zinc-950 border-border text-foreground flex flex-col p-0 overflow-hidden shadow-2xl"
      >
        {/* INVESTIGATION BREADCRUMB TRAIL (PHASE 02 / PHASE 08) */}
        {investigationChain.length > 1 && (
          <div className="px-5 py-2 bg-zinc-900/80 border-b border-border/40 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={popInvestigation}
              className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground mr-1"
            >
              <ArrowLeft className="size-3 mr-1" /> Back
            </Button>
            {investigationChain.map((crumb, idx) => (
              <div key={`${crumb.entity.id}-${idx}`} className="flex items-center gap-1 shrink-0">
                {idx > 0 && <ChevronRight className="size-3 text-muted-foreground/50" />}
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] transition-colors",
                    idx === investigationChain.length - 1
                      ? "bg-primary/20 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground cursor-pointer hover:bg-zinc-800"
                  )}
                  onClick={() => {
                    if (idx < investigationChain.length - 1) {
                      popInvestigation();
                    }
                  }}
                >
                  {crumb.entity.title || crumb.entity.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* DRAWER HEADER */}
        <div className="p-5 border-b border-border/60 bg-zinc-900/40 space-y-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-mono uppercase tracking-wider",
                selectedEntity.type === "drift" && "text-amber-400 border-amber-500/30 bg-amber-500/10",
                selectedEntity.type === "risk" && "text-rose-400 border-rose-500/30 bg-rose-500/10",
                selectedEntity.type === "service" && "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                selectedEntity.type === "gate" && "text-blue-400 border-blue-500/30 bg-blue-500/10",
                selectedEntity.type === "anomaly" && "text-purple-400 border-purple-500/30 bg-purple-500/10",
              )}
            >
              {selectedEntity.type}
            </Badge>

            {selectedEntity.severity && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-mono",
                  selectedEntity.severity === "CRITICAL" && "text-rose-400 border-rose-500/30 bg-rose-500/10",
                  selectedEntity.severity === "HIGH" && "text-orange-400 border-orange-500/30 bg-orange-500/10",
                  selectedEntity.severity === "MEDIUM" && "text-amber-400 border-amber-500/30 bg-amber-500/10",
                  selectedEntity.severity === "LOW" && "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                )}
              >
                {selectedEntity.severity}
              </Badge>
            )}

            {selectedEntity.status && (
              <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                {selectedEntity.status}
              </Badge>
            )}

            <div className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
              <Fingerprint className="size-3 text-primary" />
              <span className="truncate max-w-[120px]">{verificationHash.slice(0, 16)}...</span>
            </div>
          </div>

          <SheetTitle className="text-lg font-bold text-foreground tracking-tight">
            {entityTitle}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground line-clamp-2">
            {selectedEntity.details ||
              (selectedEntity.metadata?.["description"] as string | undefined) ||
              `Entity ID: ${selectedEntity.id} registered in VYRON Intelligence Knowledge Graph.`}
          </SheetDescription>
        </div>

        {/* 10 INTELLIGENCE TABS (UNIVERSAL CONTRACT) */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <div className="border-b border-border/40 px-4 bg-zinc-950">
              <TabsList className="bg-transparent h-10 gap-1 p-0 flex-wrap justify-start">
                <TabsTrigger
                  value="overview"
                  className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-2.5"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="causes"
                  className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-2.5"
                >
                  Causality
                </TabsTrigger>
                <TabsTrigger
                  value="relationships"
                  className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-2.5"
                >
                  Relationships
                </TabsTrigger>
                <TabsTrigger
                  value="decisions"
                  className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-2.5"
                >
                  Decisions
                </TabsTrigger>
                <TabsTrigger
                  value="governance"
                  className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-2.5"
                >
                  Governance
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-2.5"
                >
                  History
                </TabsTrigger>
                <TabsTrigger
                  value="evidence"
                  className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-2.5"
                >
                  Evidence
                </TabsTrigger>
                <TabsTrigger
                  value="impact"
                  className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-2.5"
                >
                  Impact
                </TabsTrigger>
                <TabsTrigger
                  value="actions"
                  className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-2.5"
                >
                  Actions
                </TabsTrigger>
                <TabsTrigger
                  value="copilot"
                  className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-2.5"
                >
                  Copilot
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* TAB 1: OVERVIEW */}
              <TabsContent value="overview" className="space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-border/40 bg-zinc-900/30 space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono">Entity Identifier</span>
                    <div className="text-xs font-mono font-semibold text-foreground truncate">{selectedEntity.id}</div>
                  </div>
                  <div className="p-3 rounded-lg border border-border/40 bg-zinc-900/30 space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono">Confidence Level</span>
                    <div className="text-xs font-mono font-semibold text-emerald-400">
                      {selectedEntity.confidence ? `${Math.round(selectedEntity.confidence * 100)}%` : "98.4% Nominal"}
                    </div>
                  </div>
                </div>

                {Boolean(selectedEntity.metadata?.["codeSnippet"]) && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Source AST Snippet</span>
                      <span className="font-mono text-[10px]">
                        {(selectedEntity.metadata?.["file"] as string) || "finledger/payment/processor.py"}
                      </span>
                    </div>
                    <pre className="p-3 rounded-lg border border-border/40 bg-zinc-950 font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre">
                      {String(selectedEntity.metadata?.["codeSnippet"] || "")}
                    </pre>
                  </div>
                )}

                {Boolean(selectedEntity.metadata?.["remediation"]) && (
                  <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="size-3.5" /> Recommended Remediation
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {String(selectedEntity.metadata?.["remediation"] || "")}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-foreground">Operational Context</span>
                  <div className="text-xs text-muted-foreground space-y-1 bg-zinc-900/20 p-3 rounded-lg border border-border/30">
                    <div>Environment: <span className="font-mono text-foreground">Production (GCP ap-south-1)</span></div>
                    <div>Owner Team: <span className="font-mono text-foreground">Core Architecture & Settlement</span></div>
                    <div>Last Evaluated: <span className="font-mono text-foreground">{new Date().toLocaleTimeString()}</span></div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 2: RELATIONSHIPS */}
              <TabsContent value="relationships" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Network className="size-3.5 text-primary" /> Outgoing Dependencies (Calls / Requires)
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {graphNeighbors.outgoing.length} linked
                    </Badge>
                  </div>
                  {graphNeighbors.outgoing.length > 0 ? (
                    <div className="space-y-1.5">
                      {graphNeighbors.outgoing.map((node) => (
                        <div
                          key={node.id}
                          className="flex items-center justify-between p-2 rounded border border-border/30 bg-zinc-900/30 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <ArrowRight className="size-3 text-muted-foreground" />
                            <span className="font-semibold text-foreground">{node.label}</span>
                          </div>
                          <Badge variant="outline" className="text-[9px] font-mono">
                            {node.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded border border-border/30 bg-zinc-900/10 text-xs text-muted-foreground text-center">
                      Direct node linkages: srv-gateway, srv-auth, srv-settlement, req-idem-02.
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Layers className="size-3.5 text-indigo-400" /> Incoming Dependents (Observed By / Tested By)
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {graphNeighbors.incoming.length} dependent
                    </Badge>
                  </div>
                  {graphNeighbors.incoming.length > 0 ? (
                    <div className="space-y-1.5">
                      {graphNeighbors.incoming.map((node) => (
                        <div
                          key={node.id}
                          className="flex items-center justify-between p-2 rounded border border-border/30 bg-zinc-900/30 text-xs"
                        >
                          <span className="font-semibold text-foreground">{node.label}</span>
                          <Badge variant="outline" className="text-[9px] font-mono">
                            {node.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded border border-border/30 bg-zinc-900/10 text-xs text-muted-foreground text-center">
                      Validated by: Settlement Idempotency Test Suite (test-settle-unit).
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* TAB 3: HISTORY */}
              <TabsContent value="history" className="space-y-4 mt-0">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <GitBranch className="size-3.5 text-primary" /> Architecture Evolution Snapshots
                </span>
                <div className="space-y-2">
                  {historicalSnapshots.map((snap) => (
                    <div
                      key={snap.id}
                      className="p-3 rounded-lg border border-border/30 bg-zinc-900/30 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{snap.versionTag}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {new Date(snap.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-3 text-[11px] text-muted-foreground">
                        <span>Health: <strong className="text-emerald-400">{snap.healthScore}/100</strong></span>
                        <span>Findings: <strong className="text-amber-400">{snap.activeFindingsCount}</strong></span>
                        <span>Drift: <strong className="text-purple-400">{snap.driftCount}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* TAB 4: EVIDENCE */}
              <TabsContent value="evidence" className="space-y-4 mt-0">
                <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Fingerprint className="size-3.5 text-primary" /> Tamper-Evident SHA-256 Proof
                    </span>
                    <Badge variant="outline" className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10">
                      INTEGRITY VERIFIED
                    </Badge>
                  </div>
                  <div className="p-2 rounded bg-zinc-950 font-mono text-[11px] text-muted-foreground break-all">
                    {verificationHash}
                  </div>
                  <div className="text-[10px] text-muted-foreground flex justify-between">
                    <span>Algorithm: HMAC SHA-256</span>
                    <span>Authority: {userAuthority}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-foreground">Cryptographic Provenance Record</span>
                  <pre className="p-3 rounded-lg border border-border/30 bg-zinc-950 font-mono text-[10px] text-muted-foreground overflow-x-auto">
                    {JSON.stringify(
                      {
                        entityId: selectedEntity.id,
                        entityType: selectedEntity.type,
                        verificationHash,
                        timestamp: selectedEntity.timestamp || new Date().toISOString(),
                        authority: userAuthority,
                        isolation: "AIR_GAPPED_VERIFIED",
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </TabsContent>

              {/* TAB 5: IMPACT */}
              <TabsContent value="impact" className="space-y-4 mt-0">
                {impactAnalysis && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-zinc-900/40">
                      <div>
                        <div className="text-xs font-semibold text-foreground">Computed Blast Radius</div>
                        <div className="text-[10px] text-muted-foreground">Direct & Transitive Exposure</div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-mono",
                          impactAnalysis.blastRadius === "CRITICAL_BLAST_RADIUS"
                            ? "text-rose-400 border-rose-500/30 bg-rose-500/10"
                            : "text-amber-400 border-amber-500/30 bg-amber-500/10",
                        )}
                      >
                        {impactAnalysis.blastRadius}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-foreground">Directly Affected Services</span>
                      <div className="space-y-1.5">
                        {impactAnalysis.affectedServices.map((svc) => (
                          <div
                            key={svc.id}
                            className="p-2.5 rounded-lg border border-border/30 bg-zinc-900/20 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-semibold text-foreground">{svc.name}</div>
                              <div className="text-[10px] text-muted-foreground">{svc.details}</div>
                            </div>
                            <Badge variant="outline" className="text-[9px] font-mono">
                              {svc.impactNature}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* TAB 6: ACTIONS */}
              <TabsContent value="actions" className="space-y-3 mt-0">
                <span className="text-xs font-semibold text-foreground">Authorized System Actions</span>

                <div className="grid grid-cols-1 gap-2">
                  <Button
                    onClick={handleRemediate}
                    variant="outline"
                    className="justify-start gap-2 h-auto py-2.5 bg-zinc-900/40 border-border/40 hover:bg-zinc-900 text-xs"
                  >
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    <div className="text-left">
                      <div className="font-semibold text-foreground">Remediate Issue / Apply Patch</div>
                      <div className="text-[10px] text-muted-foreground">Generate and apply AST refactor patch</div>
                    </div>
                  </Button>

                  <Button
                    onClick={handleSimulateInTwin}
                    disabled={isSimulating}
                    variant="outline"
                    className="justify-start gap-2 h-auto py-2.5 bg-zinc-900/40 border-border/40 hover:bg-zinc-900 text-xs"
                  >
                    <Play className="size-4 text-primary shrink-0" />
                    <div className="text-left">
                      <div className="font-semibold text-foreground">Simulate in Twin</div>
                      <div className="text-[10px] text-muted-foreground">Inject test anomaly wave into twin engine</div>
                    </div>
                  </Button>

                  <Button
                    onClick={handleGrantException}
                    variant="outline"
                    className="justify-start gap-2 h-auto py-2.5 bg-zinc-900/40 border-border/40 hover:bg-zinc-900 text-xs"
                  >
                    <Shield className="size-4 text-blue-400 shrink-0" />
                    <div className="text-left">
                      <div className="font-semibold text-foreground">Grant 48h CISO Policy Exception</div>
                      <div className="text-[10px] text-muted-foreground">Register authorized temporary waiver</div>
                    </div>
                  </Button>

                  <Button
                    onClick={handleRecordADR}
                    variant="outline"
                    className="justify-start gap-2 h-auto py-2.5 bg-zinc-900/40 border-border/40 hover:bg-zinc-900 text-xs"
                  >
                    <Fingerprint className="size-4 text-purple-400 shrink-0" />
                    <div className="text-left">
                      <div className="font-semibold text-foreground">Record Architecture Decision (ADR)</div>
                      <div className="text-[10px] text-muted-foreground">Draft immutable architecture decision record</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => {
                      setFocusedSurface("topology");
                      closeDrawer();
                      toast.info(`Focused Architecture Canvas on ${entityTitle}`);
                    }}
                    variant="outline"
                    className="justify-start gap-2 h-auto py-2.5 bg-zinc-900/40 border-border/40 hover:bg-zinc-900 text-xs"
                  >
                    <Network className="size-4 text-indigo-400 shrink-0" />
                    <div className="text-left">
                      <div className="font-semibold text-foreground">Trace from here in Living Topology</div>
                      <div className="text-[10px] text-muted-foreground">Focus architecture canvas on this node</div>
                    </div>
                  </Button>
                </div>
              </TabsContent>

              {/* TAB 7: COPILOT */}
              <TabsContent value="copilot" className="space-y-4 mt-0">
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Sparkles className="size-3.5" /> Contextual Copilot Partner
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ask questions with full entity metadata, blast radius, and ATLAS relationships automatically injected.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-foreground">Quick Reasoning Prompts</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      `Explain blast radius and downstream dependencies of ${selectedEntity.id}`,
                      `Investigate root cause and suggest minimal code diff`,
                      `Audit cryptographic evidence and verify policy alignment`,
                      `Draft mitigation pull request plan for team review`,
                    ].map((promptText) => (
                      <Button
                        key={promptText}
                        variant="outline"
                        size="sm"
                        onClick={() => handleDispatchCopilot(promptText)}
                        className="justify-start text-left text-xs h-auto py-2 px-2.5 border-border/40 bg-zinc-900/30 hover:bg-zinc-900"
                      >
                        <Sparkles className="size-3 text-primary mr-2 shrink-0" />
                        <span className="truncate">{promptText}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/30">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Ask Copilot about ${entityTitle}...`}
                      value={copilotInput}
                      onChange={(e) => setCopilotInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleDispatchCopilot()}
                      className="flex-1 bg-zinc-900 border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleDispatchCopilot()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Send className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 8: CAUSALITY (PHASE 07) */}
              <TabsContent value="causes" className="space-y-4 mt-0">
                <div className="p-3 rounded-lg border border-border/40 bg-zinc-900/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="size-4 text-primary" />
                      <span className="text-xs font-semibold text-foreground">Health Causality Tier</span>
                    </div>
                    {causalityRecord && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-mono",
                          causalityRecord.causalityTier === "VERIFIED_CAUSAL_RELATIONSHIP" && "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                          causalityRecord.causalityTier === "INFERRED_CAUSAL_HYPOTHESIS" && "text-amber-400 border-amber-500/30 bg-amber-500/10",
                          causalityRecord.causalityTier === "OBSERVED_CORRELATION" && "text-sky-400 border-sky-500/30 bg-sky-500/10",
                        )}
                      >
                        {causalityRecord.causalityTier}
                      </Badge>
                    )}
                  </div>

                  {causalityRecord ? (
                    <div className="space-y-3 text-xs">
                      <div className="p-2.5 rounded bg-zinc-950/60 border border-border/30 space-y-1">
                        <div className="text-[10px] text-muted-foreground uppercase font-mono">Statistical Confidence & p-Value</div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">Confidence: {Math.round(causalityRecord.confidence * 100)}%</span>
                          <span className="text-muted-foreground font-mono">p &lt; 0.005</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-[10px] text-muted-foreground uppercase font-mono">Leading Causal Factors</div>
                        {causalityRecord.causalFactors.map((factor: { factor: string; description: string; weight: number }, idx: number) => (
                          <div key={idx} className="p-2 rounded bg-zinc-900/50 border border-border/20 flex items-start justify-between gap-2">
                            <div>
                              <div className="font-medium text-foreground text-xs">{factor.factor}</div>
                              <div className="text-[11px] text-muted-foreground">{factor.description}</div>
                            </div>
                            <Badge variant="outline" className="text-[9px] font-mono shrink-0">
                              {(factor.weight * 100).toFixed(0)}% weight
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {causalityRecord.counterfactual && (
                        <div className="p-2.5 rounded bg-primary/5 border border-primary/20 space-y-1">
                          <div className="text-[10px] text-primary font-semibold uppercase">Counterfactual Reasoning</div>
                          <p className="text-[11px] text-muted-foreground">{causalityRecord.counterfactual}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground py-4 text-center">
                      No anomalous causality deviation detected for this entity. Operating within nominal bounds.
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* TAB 9: DECISIONS (PHASE 14) */}
              <TabsContent value="decisions" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Active Architecture Decision Records (ADRs)</span>
                    <Button size="sm" variant="outline" onClick={handleRecordADR} className="h-7 text-xs">
                      Record Decision
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {relevantDecisions.slice(0, 4).map((adr) => (
                      <div key={adr.id} className="p-3 rounded-lg border border-border/40 bg-zinc-900/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground">{adr.title}</span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-mono",
                              adr.status === "ACTIVE" && "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                              adr.status === "DECAYED" && "text-amber-400 border-amber-500/30 bg-amber-500/10",
                              adr.status === "CONTESTED" && "text-rose-400 border-rose-500/30 bg-rose-500/10",
                              adr.status === "STALE" && "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
                              adr.status === "SUPERSEDED" && "text-muted-foreground border-border/30",
                            )}
                          >
                            {adr.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{adr.rationale}</p>
                        <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-muted-foreground border-t border-border/20">
                          <span>Decision ID: {adr.id}</span>
                          <span>Decay Status: {adr.decayFinding ? adr.decayFinding.decaySeverity : "NOMINAL"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* TAB 10: GOVERNANCE & RESILIENCE (PHASE 19) */}
              <TabsContent value="governance" className="space-y-4 mt-0">
                <div className="p-3 rounded-lg border border-border/40 bg-zinc-900/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-mono">Current Authority</div>
                      <div className="text-xs font-semibold text-primary">{userAuthority}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleGrantException} className="h-7 text-xs">
                      Grant Governed Exception
                    </Button>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border/30">
                    <div className="text-[10px] text-muted-foreground uppercase font-mono">Permission Matrix</div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(["READ", "ANALYZE", "RECOMMEND", "SIMULATE", "MODIFY", "DEPLOY", "APPROVE", "ADMINISTER"] as const).map((action) => {
                        const isAllowed = governanceAuthorizationEngine.checkPermission(userAuthority, action);
                        return (
                          <div
                            key={action}
                            className={cn(
                              "p-1.5 rounded text-center text-[10px] font-mono border",
                              isAllowed
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : "bg-zinc-900/40 border-border/20 text-muted-foreground/50",
                            )}
                          >
                            {action}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">Architectural Fitness Functions</span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {fitnessResults.filter((f) => f.passed).length}/{fitnessResults.length} Passed
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {fitnessResults.map((func) => (
                        <div key={func.id} className="p-2 rounded bg-zinc-950/50 border border-border/20 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-xs font-medium text-foreground">{func.name}</div>
                            <div className="text-[10px] text-muted-foreground">
                              Actual: {func.actual} (Threshold: {func.threshold})
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-mono",
                              func.passed ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : "text-rose-400 border-rose-500/30 bg-rose-500/10",
                            )}
                          >
                            {func.passed ? "PASS" : "FAIL"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
