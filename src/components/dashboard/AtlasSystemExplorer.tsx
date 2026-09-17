/**
 * VYRON — ATLAS SYSTEM EXPLORER (PHASE 13)
 * Interactive knowledge graph explorer connecting architectural, requirement, code,
 * security, test, and release entities across 14 canonical relationship types.
 * Supports 8 graph modes: ARCHITECTURE, DEPENDENCY, REQUIREMENT, DECISION, RELEASE, RUNTIME, SECURITY, EVIDENCE.
 * Progressive disclosure, cycle detection, and multi-format exports.
 * Strictly ZERO SQL. Strictly Zero Capital 'B' "Brahma" branding.
 */

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommandCenter } from "@/state/commandCenter/commandCenterStore";
import { engineeringKnowledgeGraph, GraphNode } from "@/services/intelligence/knowledgeGraph";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Download,
  Filter,
  Layers,
  Network,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

export const ATLAS_RELATIONSHIP_TYPES = [
  "REQUIRES",
  "IMPLEMENTS",
  "DEPENDS_ON",
  "CALLS",
  "EXPOSES",
  "OWNED_BY",
  "VALIDATED_BY",
  "TESTED_BY",
  "AFFECTS",
  "VIOLATES",
  "DERIVED_FROM",
  "OBSERVED_BY",
  "DEPLOYED_AS",
  "SUPERSEDES",
] as const;

export const GRAPH_MODES = [
  "ARCHITECTURE",
  "DEPENDENCY",
  "REQUIREMENT",
  "DECISION",
  "RELEASE",
  "RUNTIME",
  "SECURITY",
  "EVIDENCE",
] as const;

export function AtlasSystemExplorer() {
  const { selectEntity, graphMode, setGraphMode } = useCommandCenter();
  const [searchNode, setSearchNode] = useState("");

  const graphData = useMemo(() => {
    return engineeringKnowledgeGraph.exportGraphData();
  }, []);

  const cycles = useMemo(() => {
    return engineeringKnowledgeGraph.detectCycles();
  }, []);

  const filteredNodes = useMemo(() => {
    return graphData.nodes.filter((n) => {
      const matchesSearch =
        n.label.toLowerCase().includes(searchNode.toLowerCase()) ||
        n.id.toLowerCase().includes(searchNode.toLowerCase());
      if (graphMode === "ARCHITECTURE") return matchesSearch;
      if (graphMode === "DEPENDENCY") return matchesSearch && (n.type === "service" || n.type === "dependency");
      if (graphMode === "REQUIREMENT") return matchesSearch && (n.type === "requirement" || n.type === "service");
      if (graphMode === "DECISION") return matchesSearch && (n.type === "decision" || n.type === "service");
      if (graphMode === "SECURITY") return matchesSearch && (n.type === "vulnerability" || n.type === "service");
      return matchesSearch;
    });
  }, [graphData.nodes, searchNode, graphMode]);

  const [selectedNode, setSelectedNode] = useState<GraphNode>(
    graphData.nodes.find((n) => n.id === "srv-settlement") || graphData.nodes[0] || {
      id: "srv-settlement",
      label: "Settlement Service",
      type: "service",
      metadata: {},
    },
  );

  const neighbors = useMemo(() => {
    return engineeringKnowledgeGraph.getNeighbors(selectedNode.id);
  }, [selectedNode.id]);

  const handleInspectNode = (node: GraphNode) => {
    setSelectedNode(node);
    selectEntity({
      type: "node",
      id: node.id,
      name: node.label,
      details: `ATLAS Knowledge Entity ID: ${node.id}. Type: ${node.type}. Health: ${node.healthScore ?? 85}/100.`,
      metadata: {
        type: node.type,
        metadata: node.metadata,
        healthScore: node.healthScore,
        riskLevel: node.riskLevel,
      },
    });
  };

  const handleExport = (format: "json-ld" | "dot" | "cytoscape") => {
    if (format === "cytoscape") {
      const exported = engineeringKnowledgeGraph.exportCytoscape();
      toast.success(`Exported Cytoscape graph (${exported.elements.nodes.length} elements).`);
    } else if (format === "dot") {
      const dot = engineeringKnowledgeGraph.exportDot();
      toast.success(`Generated Graphviz DOT notation (${dot.length} characters).`);
    } else {
      const jsonLd = engineeringKnowledgeGraph.exportJsonLd();
      toast.success(`Generated W3C JSON-LD graph ontology.`);
    }
  };

  return (
    <div className="space-y-3">
      {/* GRAPH MODE TABS & EXPORT BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg border border-border/40 bg-zinc-950/40 text-xs">
        <div className="flex flex-wrap items-center gap-1">
          {GRAPH_MODES.map((m) => (
            <Button
              key={m}
              variant={graphMode === m ? "default" : "outline"}
              size="sm"
              onClick={() => setGraphMode(m)}
              className="h-6 px-1.5 text-[9px] font-mono"
            >
              {m}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("cytoscape")}
            className="h-6 px-1.5 text-[9px] font-mono gap-1"
          >
            <Download className="size-2.5" /> Cyto
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("dot")}
            className="h-6 px-1.5 text-[9px] font-mono gap-1"
          >
            DOT
          </Button>
        </div>
      </div>

      {/* SEARCH AND NODE STATS */}
      <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-zinc-950/40">
        <div className="flex items-center gap-2">
          <Network className="size-4 text-primary" />
          <div>
            <div className="text-xs font-semibold text-foreground">ATLAS Unified Knowledge Graph</div>
            <div className="text-[10px] text-muted-foreground">
              {graphData.nodes.length} Entities • {graphData.edges.length} Edges • {cycles.length === 0 ? "Zero Cycles (Acyclic)" : `${cycles.length} Cycles`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-zinc-900 px-2 py-0.5 rounded border border-border/40 max-w-[140px]">
          <Search className="size-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search graph..."
            value={searchNode}
            onChange={(e) => setSearchNode(e.target.value)}
            className="bg-transparent text-[11px] text-foreground focus:outline-none w-full"
          />
        </div>
      </div>

      {/* 14 CANONICAL RELATIONSHIPS BADGES */}
      <div className="flex flex-wrap gap-1">
        {ATLAS_RELATIONSHIP_TYPES.map((rel) => (
          <Badge
            key={rel}
            variant="outline"
            className="text-[9px] font-mono py-0.5 px-1.5 bg-zinc-900/60 text-muted-foreground"
          >
            {rel}
          </Badge>
        ))}
      </div>

      {/* INTERACTIVE NODE LIST */}
      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {filteredNodes.map((node) => (
          <div
            key={node.id}
            onClick={() => handleInspectNode(node)}
            className={cn(
              "flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors",
              selectedNode.id === node.id
                ? "border-primary bg-primary/10"
                : "border-border/30 bg-zinc-950/40 hover:bg-zinc-900/40",
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-foreground truncate">{node.label}</span>
              <span className="text-[10px] font-mono text-muted-foreground">({node.id})</span>
            </div>
            <Badge variant="outline" className="text-[9px] font-mono shrink-0">
              {node.type}
            </Badge>
          </div>
        ))}
      </div>

      {/* ACTIVE NODE DETAILS */}
      <div className="p-3 rounded-lg border border-primary/20 bg-zinc-950/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" /> Active Entity: {selectedNode.label}
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-5 px-1.5 text-[9px] gap-1 font-mono"
            onClick={() => handleInspectNode(selectedNode)}
          >
            <Sparkles className="size-2 text-primary" /> Explore in Drawer
          </Button>
        </div>

        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>Outgoing: {neighbors.outgoing.length} nodes</span>
          <span>Incoming: {neighbors.incoming.length} nodes</span>
          <span>Health: {selectedNode.healthScore ?? 85}/100</span>
        </div>
      </div>
    </div>
  );
}
