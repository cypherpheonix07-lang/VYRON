/**
 * VYRON — BLUEPRINT GRAPH × RELEASE GATE CONVERGENCE SURFACE
 * GOD MODE vULTIMA ΩΩΩΩΩΩΩΩ
 * Single Canonical Engineering Control Surface:
 * Multi-layer ReactFlow graph + Live Release Gate Rail + Gate Impact Map
 * + Evidence Drawer + Release Twin + Counterfactual Simulator + Rollback Plan.
 * Strictly ZERO Raw SQL.
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Node as FlowNode,
  type Edge as FlowEdge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  GitBranch,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Activity,
  FileCheck,
  Zap,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  blueprintGraphEngine,
  BlueprintGraphNode,
  BlueprintGraphEdge,
  BlueprintSemanticLayer,
  CounterfactualSimulationResult,
} from "@/services/blueprint/blueprintGraphEngine";
import {
  releaseGateEngine,
  ReleaseGateDefinition,
  DecomposedReleaseScore,
  CausalBlockerExplanation,
  ReleaseTwinRehearsalResult,
  DeterministicRollbackPlan,
} from "@/services/release/releaseGateEngine";
import {
  blueprintGateConvergence,
  ConvergenceCycleResult,
} from "@/services/blueprint/blueprintGateConvergence";

const LAYER_COLORS: Record<BlueprintSemanticLayer, string> = {
  SYSTEM: "hsl(280, 80%, 65%)",
  PRODUCT: "hsl(260, 75%, 65%)",
  PROJECT: "hsl(220, 85%, 60%)",
  DOMAIN: "hsl(200, 85%, 55%)",
  CAPABILITY: "hsl(180, 70%, 50%)",
  REQUIREMENT: "hsl(160, 70%, 45%)",
  COMPONENT: "hsl(210, 80%, 60%)",
  SERVICE: "hsl(190, 85%, 50%)",
  DATA: "hsl(145, 75%, 45%)",
  INTEGRATION: "hsl(35, 90%, 55%)",
  AGENT_TOOL: "hsl(290, 85%, 65%)",
  TEST: "hsl(130, 70%, 45%)",
  SECURITY_CONTROL: "hsl(0, 80%, 60%)",
  RELEASE: "hsl(215, 90%, 60%)",
  DEPLOYMENT: "hsl(240, 80%, 65%)",
  ENVIRONMENT: "hsl(170, 75%, 45%)",
  RUNTIME: "hsl(205, 85%, 55%)",
  INCIDENT: "hsl(15, 90%, 55%)",
  EVIDENCE: "hsl(45, 95%, 50%)",
};

export const BlueprintReleaseConvergenceView: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [nodes, setNodes] = useState<BlueprintGraphNode[]>([]);
  const [edges, setEdges] = useState<BlueprintGraphEdge[]>([]);
  const [gates, setGates] = useState<ReleaseGateDefinition[]>([]);
  const [readiness, setReadiness] = useState<DecomposedReleaseScore | null>(null);

  const [selectedNode, setSelectedNode] = useState<BlueprintGraphNode | null>(null);
  const [selectedGate, setSelectedGate] = useState<ReleaseGateDefinition | null>(null);
  const [blockerDetail, setBlockerDetail] = useState<CausalBlockerExplanation | null>(null);

  // Dialog States
  const [showTwinModal, setShowTwinModal] = useState(false);
  const [twinResult, setTwinResult] = useState<ReleaseTwinRehearsalResult | null>(null);
  const [showSimModal, setShowSimModal] = useState(false);
  const [simResult, setSimResult] = useState<CounterfactualSimulationResult | null>(null);
  const [showRollbackModal, setShowRollbackModal] = useState(false);
  const [rollbackPlan, setRollbackPlan] = useState<DeterministicRollbackPlan | null>(null);

  // Filter State
  const [activeLayerFilter, setActiveLayerFilter] = useState<string>("ALL");
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<Set<string>>(new Set());

  // Load Initial Graph & Gates
  useEffect(() => {
    refreshData();
    const unsubscribe = blueprintGateConvergence.subscribe((result) => {
      refreshData();
      toast.info("Convergence Loop Triggered", {
        description: `${result.triggerEvent} -> Score: ${result.recalculatedReadiness.overallScore}%`,
      });
    });
    return () => unsubscribe();
  }, []);

  const refreshData = () => {
    setNodes(blueprintGraphEngine.getAllNodes());
    setEdges(blueprintGraphEngine.getAllEdges());
    setGates(releaseGateEngine.getAllGates());
    setReadiness(releaseGateEngine.evaluateReleaseReadiness());
  };

  // Convert to ReactFlow Nodes
  const flowNodes: FlowNode[] = useMemo(() => {
    return nodes
      .filter((n) => activeLayerFilter === "ALL" || n.layer === activeLayerFilter)
      .map((n) => {
        const isSelected = selectedNode?.id === n.id;
        const isHighlighted = highlightedNodeIds.has(n.id);
        const color = LAYER_COLORS[n.layer] || "var(--primary)";

        return {
          id: n.id,
          position: { x: n.position.x, y: n.position.y },
          data: { label: n.label },
          style: {
            background: isSelected
              ? "hsl(222, 47%, 14%)"
              : isHighlighted
              ? "hsl(222, 40%, 18%)"
              : "hsl(222, 47%, 9%)",
            color: "hsl(210, 40%, 98%)",
            border: `2px solid ${isSelected ? color : isHighlighted ? "hsl(45, 95%, 50%)" : "hsl(217, 32%, 22%)"}`,
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 12,
            minWidth: 170,
            boxShadow: isSelected
              ? `0 0 16px ${color}66`
              : isHighlighted
              ? "0 0 14px hsl(45, 95%, 50%, 0.4)"
              : "0 4px 12px rgba(0,0,0,0.5)",
            cursor: "pointer",
          },
        };
      });
  }, [nodes, selectedNode, highlightedNodeIds, activeLayerFilter]);

  // Convert to ReactFlow Edges
  const flowEdges: FlowEdge[] = useMemo(() => {
    return edges.map((e) => {
      const isCritical = e.isCriticalPath;
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        animated: isCritical,
        label: e.type,
        labelStyle: { fill: "hsl(215, 20%, 65%)", fontSize: 9, fontWeight: 600 },
        labelBgStyle: { fill: "hsl(222, 47%, 11%)" },
        style: {
          stroke: isCritical ? "hsl(215, 90%, 60%)" : "hsl(217, 32%, 30%)",
          strokeWidth: isCritical ? 2 : 1.2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isCritical ? "hsl(215, 90%, 60%)" : "hsl(217, 32%, 30%)",
        },
      };
    });
  }, [edges]);

  // Node Selection Handler
  const handleSelectNode = (nodeId: string) => {
    const node = blueprintGraphEngine.getNode(nodeId);
    if (!node) return;
    setSelectedNode(node);
    setSelectedGate(null);

    // Highlight Ancestors and Descendants
    const upstream = blueprintGraphEngine.getUpstreamAncestors(nodeId);
    const downstream = blueprintGraphEngine.getDownstreamDescendants(nodeId);
    setHighlightedNodeIds(new Set([nodeId, ...upstream, ...downstream]));
  };

  // Gate Selection Handler
  const handleSelectGate = (gate: ReleaseGateDefinition) => {
    setSelectedGate(gate);
    setSelectedNode(null);

    // Highlight Bound Nodes
    setHighlightedNodeIds(new Set(gate.boundNodeIds));

    // Explain why blocked if failed
    if (gate.status === "FAILED" || gate.status === "BLOCKED") {
      const expl = releaseGateEngine.explainWhyBlocked(gate.id);
      setBlockerDetail(expl);
    } else {
      setBlockerDetail(null);
    }
  };

  // Run Release Twin
  const handleRehearseTwin = () => {
    const res = releaseGateEngine.rehearseReleaseTwin("v2.5.0");
    setTwinResult(res);
    setShowTwinModal(true);
  };

  // Run Counterfactual Simulation
  const handleSimulateImpact = () => {
    if (!selectedNode) {
      toast.error("Please select a node on the canvas to simulate failure impact");
      return;
    }
    const res = blueprintGraphEngine.simulateCounterfactual({
      nodeModifications: [{ id: selectedNode.id, state: "FAILED", healthScore: 0 }],
      edgeAdditions: [],
      edgeRemovals: [],
    });
    setSimResult(res);
    setShowSimModal(true);
  };

  // Generate Rollback Plan
  const handleViewRollback = () => {
    const plan = releaseGateEngine.generateRollbackPlan("v2.5.0");
    setRollbackPlan(plan);
    setShowRollbackModal(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Command Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-card/80 border border-border/80 backdrop-blur-md shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Layers className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                Living Project Engineering Blueprint &amp; Release Gate Convergence
                <Badge variant="outline" className="text-[10px] border-primary/30 text-primary font-mono">
                  GOD MODE vULTIMA
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">
                Causal multi-layer graph bound to 21 automated release gate families with cryptographic evidence verification.
              </p>
            </div>
          </div>
        </div>

        {/* Global Release Readiness Pill */}
        {readiness && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-background/80 border border-border">
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                  Readiness Score
                </span>
                <span className="text-lg font-black text-foreground font-mono">
                  {readiness.overallScore}%
                </span>
              </div>
              <Badge
                className={`text-xs px-2.5 py-1 ${
                  readiness.verdict === "RELEASE_APPROVED"
                    ? "bg-emerald-600/90 text-white"
                    : readiness.verdict === "REVIEW_REQUIRED"
                    ? "bg-amber-600/90 text-white"
                    : "bg-red-600/90 text-white"
                }`}
              >
                {readiness.verdict === "RELEASE_APPROVED" && <CheckCircle2 className="size-3.5 mr-1" />}
                {readiness.verdict === "REVIEW_REQUIRED" && <AlertTriangle className="size-3.5 mr-1" />}
                {readiness.verdict === "RELEASE_BLOCKED" && <ShieldAlert className="size-3.5 mr-1" />}
                {readiness.verdict.replace("_", " ")}
              </Badge>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleRehearseTwin}
              className="text-xs gap-1.5 h-9 bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary"
            >
              <Play className="size-3.5" /> Rehearse Release Twin
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewRollback}
              className="text-xs gap-1.5 h-9"
            >
              <RotateCcw className="size-3.5" /> Reversible Rollback
            </Button>
          </div>
        )}
      </div>

      {/* 2. Main Convergence Surface (Split View: Graph Canvas + Gate Rail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Canvas Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border-border/80 bg-card/60 backdrop-blur-md overflow-hidden shadow-xl">
            <div className="p-3 border-b border-border/80 flex items-center justify-between bg-card/90">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[11px] font-mono">
                  Rev #{blueprintGraphEngine.getCurrentRevision()}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {nodes.length} Nodes &bull; {edges.length} Causal Edges
                </span>
              </div>

              {/* Semantic Layer Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground uppercase font-mono mr-1">
                  Layer:
                </span>
                <select
                  value={activeLayerFilter}
                  onChange={(e) => setActiveLayerFilter(e.target.value)}
                  className="bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1 outline-none font-mono"
                >
                  <option value="ALL">ALL LAYERS (19)</option>
                  <option value="SYSTEM">SYSTEM</option>
                  <option value="DOMAIN">DOMAIN</option>
                  <option value="REQUIREMENT">REQUIREMENT</option>
                  <option value="SERVICE">SERVICE</option>
                  <option value="DATA">DATA</option>
                  <option value="SECURITY_CONTROL">SECURITY_CONTROL</option>
                  <option value="TEST">TEST</option>
                  <option value="RELEASE">RELEASE</option>
                  <option value="RUNTIME">RUNTIME</option>
                  <option value="EVIDENCE">EVIDENCE</option>
                </select>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedNode(null);
                    setSelectedGate(null);
                    setHighlightedNodeIds(new Set());
                  }}
                  className="h-7 text-[11px] px-2"
                >
                  Reset Selection
                </Button>
              </div>
            </div>

            {/* ReactFlow Canvas */}
            <div className="h-[560px] w-full bg-zinc-950/90 relative">
              <ReactFlow
                nodes={flowNodes}
                edges={flowEdges}
                fitView
                minZoom={0.3}
                maxZoom={2.2}
                onNodeClick={(_, node) => handleSelectNode(node.id)}
                proOptions={{ hideAttribution: true }}
              >
                <Background color="hsl(217, 32%, 18%)" gap={24} />
                <Controls className="!bg-card !border-border !fill-foreground" />
                <MiniMap
                  className="!hidden sm:!block !bg-card"
                  maskColor="rgba(0,0,0,0.6)"
                  nodeColor={(n) => {
                    const realNode = nodes.find((item) => item.id === n.id);
                    return realNode ? LAYER_COLORS[realNode.layer] || "#3b82f6" : "#3b82f6";
                  }}
                />
              </ReactFlow>

              {/* Counterfactual Simulation Quick Action Bar */}
              {selectedNode && (
                <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-xl bg-card/95 border border-primary/40 backdrop-blur-md shadow-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-foreground">
                      Focused: {selectedNode.label} ({selectedNode.layer})
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Health: {selectedNode.healthScore}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSimulateImpact}
                      className="h-7 text-xs bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300"
                    >
                      <Zap className="size-3 mr-1" /> Simulate Failure Impact
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Node Proof Drawer */}
          {selectedNode && (
            <Card className="border-border/80 bg-card/60 backdrop-blur-md p-4 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className="text-[10px]"
                      style={{ background: LAYER_COLORS[selectedNode.layer], color: "#fff" }}
                    >
                      {selectedNode.layer}
                    </Badge>
                    <h3 className="text-sm font-bold text-foreground">{selectedNode.label}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Owner: <span className="font-semibold text-foreground">{selectedNode.owner}</span> &bull; Scope:{" "}
                    <span className="font-mono text-cyan-400">{selectedNode.scope}</span> &bull; Authority:{" "}
                    <span className="font-semibold text-emerald-400">{selectedNode.authority}</span>
                  </p>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  Blast Radius: {selectedNode.blastRadius}%
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-border/80 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Evidence Proofs
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedNode.evidenceIds.map((ev) => (
                      <Badge key={ev} variant="outline" className="text-[10px] font-mono text-cyan-300">
                        {ev}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Bound Release Gates
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedNode.boundGateIds.map((g) => (
                      <Badge key={g} variant="outline" className="text-[10px] font-mono text-amber-300">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Invalidation Invariants
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedNode.invalidationRules.map((r) => (
                      <span key={r} className="text-[10px] font-mono text-red-300 block">
                        &bull; {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Release Gate Rail Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-xl flex flex-col h-[700px]">
            <CardHeader className="pb-3 border-b border-border/80">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  Release Gate Checklist ({gates.length})
                </CardTitle>
                <Button size="sm" variant="ghost" onClick={refreshData} className="size-7 p-0">
                  <RefreshCw className="size-3.5" />
                </Button>
              </div>
              <CardDescription className="text-xs">
                Every gate is cryptographically bound to graph nodes and empirical test receipts.
              </CardDescription>
            </CardHeader>

            {/* Scrollable Gate List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {gates.map((g) => {
                const isSelected = selectedGate?.id === g.id;
                const isPassed = g.status === "VERIFIED" || g.status === "PASSED";
                const isBlocked = g.status === "BLOCKED";
                const isFailed = g.status === "FAILED";

                return (
                  <div
                    key={g.id}
                    onClick={() => handleSelectGate(g)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary shadow-md"
                        : "bg-background/60 hover:bg-background/90 border-border/70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">{g.id}</span>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={`text-[9px] px-1.5 py-0 ${
                            isPassed
                              ? "text-emerald-400 border-emerald-500/40"
                              : isBlocked
                              ? "text-red-400 border-red-500/40"
                              : "text-amber-400 border-amber-500/40"
                          }`}
                        >
                          {g.status}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] font-mono">
                          {g.score}%
                        </Badge>
                      </div>
                    </div>

                    <h4 className="font-semibold text-foreground mt-1.5 line-clamp-1">{g.name}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      {g.description}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/60 text-[10px] text-muted-foreground">
                      <span>Authority: {g.requiredAuthority}</span>
                      <span className="font-mono text-cyan-400">{g.freshness}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Causal Gate Detail / "Why Blocked?" Explanation */}
          {selectedGate && (
            <Card className="border-border/80 bg-card/60 backdrop-blur-md p-4 shadow-xl">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-muted-foreground">{selectedGate.id}</span>
                <Badge variant="outline" className="text-[10px] font-mono text-cyan-400">
                  {selectedGate.family}
                </Badge>
              </div>
              <h3 className="text-sm font-bold text-foreground mt-1">{selectedGate.name}</h3>

              {blockerDetail ? (
                <div className="mt-3 p-3 rounded-lg bg-red-950/30 border border-red-500/40 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-red-300 font-semibold">
                    <AlertTriangle className="size-3.5" />
                    Causal Blocker Explanation
                  </div>
                  <p className="text-[11px] text-red-200">{blockerDetail.directCause}</p>
                  <p className="text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground">Remediation:</span>{" "}
                    {blockerDetail.remediationPlan}
                  </p>
                </div>
              ) : (
                <div className="mt-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3.5" />
                    Gate Conditions Verified &amp; Passing
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Predicate Expression: <code className="text-cyan-300">{selectedGate.predicateExpression}</code>
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* 3. Rehearse Release Twin Modal */}
      <Dialog open={showTwinModal} onOpenChange={setShowTwinModal}>
        <DialogContent className="max-w-xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Play className="size-5 text-primary" />
              Release Twin Rehearsal Summary
            </DialogTitle>
            <DialogDescription className="text-xs">
              Simulated dry-run deployment in staging mirror environment.
            </DialogDescription>
          </DialogHeader>

          {twinResult && (
            <div className="space-y-4 text-xs py-2">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-background border border-border">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Target Release
                  </span>
                  <span className="font-bold text-foreground text-sm font-mono">
                    {twinResult.targetReleaseVersion}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Simulation Verdict
                  </span>
                  <Badge className="bg-emerald-600 text-white text-[11px] mt-0.5">
                    {twinResult.verdict}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Gates Passed
                  </span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {twinResult.simulatedGatesPassed}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Rollback Rehearsal
                  </span>
                  <span className="font-bold text-cyan-400 font-mono">
                    {twinResult.rollbackRehearsalPassed ? "VERIFIED (45s RTO)" : "FAILED"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-mono mb-1">
                  Cryptographic Rehearsal Hash
                </span>
                <code className="text-[10px] text-cyan-300 font-mono bg-zinc-950 p-2 rounded block break-all">
                  {twinResult.rehearsalHash}
                </code>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button size="sm" onClick={() => setShowTwinModal(false)} className="text-xs">
              Close Rehearsal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Counterfactual Impact Simulator Modal */}
      <Dialog open={showSimModal} onOpenChange={setShowSimModal}>
        <DialogContent className="max-w-xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-amber-400">
              <Zap className="size-5" />
              Counterfactual Blast Radius Simulator
            </DialogTitle>
            <DialogDescription className="text-xs">
              Hypothetical simulation of node degradation or critical dependency severance.
            </DialogDescription>
          </DialogHeader>

          {simResult && (
            <div className="space-y-4 text-xs py-2">
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-background border border-border">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Projected Risk
                  </span>
                  <span className="font-bold text-amber-400 text-sm font-mono">
                    {simResult.projectedRiskScore}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Readiness Delta
                  </span>
                  <span className="font-bold text-red-400 text-sm font-mono">
                    {simResult.projectedReadinessDelta}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Recommendation
                  </span>
                  <Badge variant="outline" className="text-[10px] text-amber-300 border-amber-500/40">
                    {simResult.recommendation}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-mono mb-1">
                  Impacted Downstream Descendants ({simResult.impactedDescendants.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {simResult.impactedDescendants.map((id) => (
                    <Badge key={id} variant="outline" className="text-[10px] font-mono text-cyan-300">
                      {id}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-mono mb-1">
                  Potentially Invalidated Release Gates ({simResult.impactedGateIds.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {simResult.impactedGateIds.map((gid) => (
                    <Badge key={gid} variant="outline" className="text-[10px] font-mono text-red-300">
                      {gid}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button size="sm" onClick={() => setShowSimModal(false)} className="text-xs">
              Dismiss Simulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Deterministic Rollback Plan Modal */}
      <Dialog open={showRollbackModal} onOpenChange={setShowRollbackModal}>
        <DialogContent className="max-w-xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-cyan-400">
              <RotateCcw className="size-5" />
              Deterministic Reversible Rollback Plan
            </DialogTitle>
            <DialogDescription className="text-xs">
              Cryptographically verified rollback plan tied to prior baseline revision.
            </DialogDescription>
          </DialogHeader>

          {rollbackPlan && (
            <div className="space-y-4 text-xs py-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Prior Verified Revision
                  </span>
                  <span className="font-bold text-foreground font-mono">
                    Rev #{rollbackPlan.priorVerifiedRevision}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Estimated RTO
                  </span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {rollbackPlan.estimatedRTOSeconds} seconds
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                  Sequenced Reversal Steps
                </span>
                {rollbackPlan.steps.map((st) => (
                  <div key={st.stepNumber} className="p-2.5 rounded-lg border border-border/70 bg-background/50 flex items-start gap-2.5">
                    <span className="grid size-5 rounded-full bg-primary/20 text-primary font-mono text-[10px] font-bold place-items-center mt-0.5">
                      {st.stepNumber}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{st.action}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Target: <span className="font-mono text-cyan-300">{st.targetService}</span> &bull; Expectation: {st.expectedOutcome}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button size="sm" onClick={() => setShowRollbackModal(false)} className="text-xs">
              Close Rollback Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
