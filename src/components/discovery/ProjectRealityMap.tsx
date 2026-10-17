import React, { useState, useMemo } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Sparkles,
  Layers,
  FileCode,
  ShieldCheck,
  Activity,
  PlayCircle,
  AlertCircle,
  ExternalLink,
  GitPullRequest,
  Search,
  Filter,
  Eye,
  Table as TableIcon,
  Network,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Info,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  realityMapService,
  RealityEntity,
  RealityRelationship,
  TruthCategory,
  RealityEntityType,
} from "@/services/discovery/realityMapService";
import { useActiveProject } from "@/hooks/useActiveProject";
import { cn } from "@/lib/utils";

const entityIcons: Record<RealityEntityType, React.ComponentType<{ className?: string }>> = {
  requirement: Sparkles,
  component: Layers,
  file: FileCode,
  test: ShieldCheck,
  run: PlayCircle,
  deployment: Activity,
  finding: AlertCircle,
};

const truthCategoryStyles: Record<
  TruthCategory,
  { label: string; stroke: string; strokeDasharray?: string; badgeClass: string; description: string }
> = {
  declared: {
    label: "Declared",
    stroke: "#38bdf8", // Sky blue
    badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    description: "Architectural intention and declared specifications.",
  },
  observed: {
    label: "Observed",
    stroke: "#10b981", // Emerald
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    description: "Confirmed by AST call graph or runtime telemetry.",
  },
  inferred: {
    label: "Inferred",
    stroke: "#f59e0b", // Amber
    strokeDasharray: "5,5",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    description: "Causal dependency derived by algorithmic inference.",
  },
  simulated: {
    label: "Simulated",
    stroke: "#a855f7", // Purple
    strokeDasharray: "2,4",
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    description: "Evaluated in simulation twin environment.",
  },
};

export function ProjectRealityMap() {
  const { project } = useActiveProject();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState<"graph" | "table">("graph");
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>("ent-comp-copilot");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [compareMode, setCompareMode] = useState(false);

  const snapshot = useMemo(() => {
    return realityMapService.getProjectSnapshot(project?.id || "brahma-core");
  }, [project?.id]);

  const selectedEntity = useMemo(() => {
    return snapshot.entities.find((e) => e.id === selectedEntityId) || null;
  }, [snapshot.entities, selectedEntityId]);

  // Filter entities
  const filteredEntities = useMemo(() => {
    return snapshot.entities.filter((ent) => {
      const matchesSearch =
        ent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ent.sourcePath && ent.sourcePath.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = selectedType === "all" || ent.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [snapshot.entities, searchQuery, selectedType]);

  // Filtered entity IDs for graph projection
  const filteredEntityIds = useMemo(() => {
    return new Set(filteredEntities.map((e) => e.id));
  }, [filteredEntities]);

  // Filter relationships
  const filteredRelationships = useMemo(() => {
    return snapshot.relationships.filter((rel) => {
      const bothNodesVisible =
        filteredEntityIds.has(rel.sourceId) && filteredEntityIds.has(rel.targetId);
      const matchesCategory =
        selectedCategory === "all" || rel.truthCategory === selectedCategory;
      return bothNodesVisible && matchesCategory;
    });
  }, [snapshot.relationships, filteredEntityIds, selectedCategory]);

  // ReactFlow Nodes
  const nodes: Node[] = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {
      "ent-req-pci": { x: 50, y: 60 },
      "ent-req-auth": { x: 50, y: 220 },
      "ent-comp-copilot": { x: 380, y: 60 },
      "ent-comp-reasoning": { x: 380, y: 220 },
      "ent-comp-auth": { x: 380, y: 360 },
      "ent-file-registry": { x: 720, y: 60 },
      "ent-find-drift": { x: 720, y: 220 },
      "ent-test-suite": { x: 50, y: 380 },
      "ent-run-durable": { x: 720, y: 380 },
    };

    return filteredEntities.map((ent, idx) => {
      const pos = positions[ent.id] || { x: (idx % 3) * 320 + 50, y: Math.floor(idx / 3) * 160 + 50 };
      const isSelected = ent.id === selectedEntityId;
      const Icon = entityIcons[ent.type] || Layers;

      return {
        id: ent.id,
        position: pos,
        data: {
          label: (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold">
                  <Icon className="size-3.5 text-primary" />
                  {ent.name}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                  {ent.type}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {ent.description}
              </p>
              {ent.sourcePath && (
                <span className="text-[10px] font-mono text-cyan-400 truncate mt-1">
                  {ent.sourcePath}
                </span>
              )}
            </div>
          ),
        },
        style: {
          background: "color-mix(in oklab, var(--card) 95%, transparent)",
          color: "var(--foreground)",
          border: `1.5px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
          borderRadius: 12,
          padding: "12px 14px",
          width: 280,
          boxShadow: isSelected
            ? "0 0 0 3px color-mix(in oklab, var(--primary) 25%, transparent)"
            : "0 4px 16px -6px oklch(0 0 0 / 0.7)",
          cursor: "pointer",
        },
      };
    });
  }, [filteredEntities, selectedEntityId]);

  // ReactFlow Edges
  const edges: Edge[] = useMemo(() => {
    return filteredRelationships.map((rel) => {
      const style = truthCategoryStyles[rel.truthCategory];
      return {
        id: rel.id,
        source: rel.sourceId,
        target: rel.targetId,
        animated: rel.truthCategory === "inferred" || rel.truthCategory === "simulated",
        label: `${rel.relationshipType} (${rel.truthCategory})`,
        labelStyle: { fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "monospace" },
        labelBgStyle: { fill: "var(--card)", fillOpacity: 0.9 },
        style: {
          stroke: style.stroke,
          strokeWidth: 2,
          strokeDasharray: style.strokeDasharray,
        },
      };
    });
  }, [filteredRelationships]);

  return (
    <div className="space-y-6">
      {/* Top Controls & Scope Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-xl border border-border/60 bg-card/40 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Network className="size-5 text-primary" />
              Project Reality Map
            </h2>
            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/25">
              CANONICAL GRAPH
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono bg-muted text-muted-foreground">
              {snapshot.revision}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Topology of grounded project reality. Distinguishes declared architecture, observed runtime facts, and causal inferences.
          </p>
        </div>

        {/* View Toggle & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-border p-0.5 bg-background">
            <Button
              variant={activeView === "graph" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs gap-1.5 px-3"
              onClick={() => setActiveView("graph")}
            >
              <Network className="size-3.5" />
              Topology Canvas
            </Button>
            <Button
              variant={activeView === "table" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs gap-1.5 px-3"
              onClick={() => setActiveView("table")}
            >
              <TableIcon className="size-3.5" />
              Accessible Table
            </Button>
          </div>

          <Button
            variant={compareMode ? "secondary" : "outline"}
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => setCompareMode(!compareMode)}
          >
            <RotateCcw className="size-3.5" />
            {compareMode ? "Diff Active" : "Snapshot Diff"}
          </Button>
        </div>
      </div>

      {/* Snapshot Diff Banner (D08) */}
      {compareMode && (
        <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-cyan-200 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Info className="size-4 text-cyan-400 shrink-0" />
            <span>
              Comparing baseline <strong>rev-main-HEAD</strong> against working tree. All 9 core nodes match verified invariants with 0 breaking structural mutations.
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[11px] border-cyan-500/40 text-cyan-300"
            onClick={() => setCompareMode(false)}
          >
            Dismiss Diff
          </Button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search entities, files, or requirements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-xs bg-background/50 border-border"
          />
        </div>

        {/* Truth Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-muted-foreground mr-1 flex items-center gap-1">
            <Filter className="size-3" /> Truth Category:
          </span>
          <Button
            size="sm"
            variant={selectedCategory === "all" ? "default" : "outline"}
            className="h-7 text-[11px] px-2.5"
            onClick={() => setSelectedCategory("all")}
          >
            All ({snapshot.summary.totalRelationships})
          </Button>
          {(["declared", "observed", "inferred", "simulated"] as TruthCategory[]).map((cat) => {
            const style = truthCategoryStyles[cat];
            const count = snapshot.relationships.filter((r) => r.truthCategory === cat).length;
            return (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? "default" : "outline"}
                className={cn("h-7 text-[11px] px-2.5 gap-1.5", selectedCategory === cat && style.badgeClass)}
                onClick={() => setSelectedCategory(cat)}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: style.stroke }}
                />
                {style.label} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Graph Canvas vs Accessible Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          {activeView === "graph" ? (
            <div className="h-[520px] w-full overflow-hidden rounded-xl border border-border bg-background/70 relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                minZoom={0.3}
                maxZoom={2}
                onNodeClick={(_, node) => {
                  setSelectedEntityId(node.id);
                }}
              >
                <Background color="var(--border)" gap={24} />
                <Controls className="!bg-card !border-border" showInteractive={false} />
                <MiniMap
                  className="!hidden sm:!block !bg-card"
                  maskColor="color-mix(in oklab, var(--background) 70%, transparent)"
                  nodeColor={() => "var(--primary)"}
                />
              </ReactFlow>

              {/* Truth Legend Overlay (D07) */}
              <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-md border border-border/80 rounded-lg p-2.5 text-[10px] space-y-1.5 pointer-events-none shadow-lg">
                <div className="font-semibold text-foreground tracking-wider uppercase text-[9px] mb-1">
                  Relationship Truth Legend
                </div>
                {(["declared", "observed", "inferred", "simulated"] as TruthCategory[]).map((cat) => {
                  const s = truthCategoryStyles[cat];
                  return (
                    <div key={cat} className="flex items-center gap-2">
                      <span
                        className="w-4 h-0.5 inline-block"
                        style={{
                          backgroundColor: s.stroke,
                          borderStyle: s.strokeDasharray ? "dashed" : "solid",
                        }}
                      />
                      <span className="font-medium text-foreground">{s.label}:</span>
                      <span className="text-muted-foreground">{s.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* W3C Accessible Table Projection (D05) */
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-3 border-b border-border bg-muted/30 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  Entity Register ({filteredEntities.length} entities)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Tabular projection for accessible screen-reader inspection
                </span>
              </div>
              <div className="overflow-x-auto max-h-[480px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-muted/60 border-b border-border text-[11px] font-semibold text-muted-foreground">
                    <tr>
                      <th className="p-3">Type</th>
                      <th className="p-3">Entity Name</th>
                      <th className="p-3">Source Path</th>
                      <th className="p-3">Health</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredEntities.map((ent) => {
                      const Icon = entityIcons[ent.type] || Layers;
                      const isSelected = ent.id === selectedEntityId;
                      return (
                        <tr
                          key={ent.id}
                          className={cn(
                            "hover:bg-muted/30 transition-colors cursor-pointer",
                            isSelected && "bg-primary/5",
                          )}
                          onClick={() => setSelectedEntityId(ent.id)}
                        >
                          <td className="p-3">
                            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-muted-foreground">
                              <Icon className="size-3 text-primary" />
                              {ent.type}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-foreground">
                            {ent.name}
                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                              {ent.description}
                            </p>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-cyan-400">
                            {ent.sourcePath || "—"}
                          </td>
                          <td className="p-3 font-mono font-semibold">
                            <span
                              className={cn(
                                ent.healthScore >= 90
                                  ? "text-emerald-400"
                                  : ent.healthScore >= 70
                                    ? "text-amber-400"
                                    : "text-red-400",
                              )}
                            >
                              {ent.healthScore}%
                            </span>
                          </td>
                          <td className="p-3">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] capitalize",
                                ent.status === "verified"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              {ent.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-[10px] px-2 text-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEntityId(ent.id);
                              }}
                            >
                              Inspect
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Entity Inspector Side Panel (D06 & D09) */}
        <div className="lg:col-span-4">
          {selectedEntity ? (
            <div className="rounded-xl border border-border bg-card p-5 space-y-5 sticky top-20 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono mb-1.5">
                    {selectedEntity.type}
                  </Badge>
                  <h3 className="text-base font-bold text-foreground leading-snug">
                    {selectedEntity.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]"
                  >
                    {selectedEntity.status}
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedEntity.description}
              </p>

              <div className="space-y-3 pt-2 border-t border-border/60 text-xs">
                {selectedEntity.sourcePath && (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block mb-0.5">
                      Source Location
                    </span>
                    <span className="font-mono text-cyan-400 text-[11px] break-all">
                      {selectedEntity.sourcePath}
                    </span>
                  </div>
                )}

                {selectedEntity.owner && (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block mb-0.5">
                      Responsible Authority
                    </span>
                    <span className="text-foreground font-medium">{selectedEntity.owner}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block mb-0.5">
                      Health Metric
                    </span>
                    <span className="text-emerald-400 font-bold font-mono text-sm">
                      {selectedEntity.healthScore}/100
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block mb-0.5">
                      Revision Bound
                    </span>
                    <span className="font-mono text-foreground text-xs">{selectedEntity.revision}</span>
                  </div>
                </div>
              </div>

              {/* Contextual Action Buttons (D09) */}
              <div className="pt-4 border-t border-border/60 space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-2">
                  Contextual Operations
                </div>

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full text-xs justify-between h-8 border-border"
                >
                  <Link to="/app/impact">
                    <span className="flex items-center gap-1.5">
                      <GitPullRequest className="size-3.5 text-primary" />
                      Analyze Causal Impact
                    </span>
                    <ArrowRight className="size-3" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  className="w-full text-xs justify-between h-8 bg-primary text-primary-foreground"
                >
                  <Link to="/app/chat">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="size-3.5" />
                      Ask ATHER About This
                    </span>
                    <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
              <Network className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-medium">No Entity Selected</p>
              <p className="text-[11px] mt-1">
                Click any node on the topology canvas or row in the table to inspect its provenance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
