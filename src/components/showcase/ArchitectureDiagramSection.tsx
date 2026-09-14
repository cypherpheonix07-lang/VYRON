import { useState } from "react";
import { ARCHITECTURE_NODES, ArchNode } from "./showcaseData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Layers,
  Lock,
  Network,
  Radio,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";

export function ArchitectureDiagramSection() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("copilot-engine");
  const [filterLayer, setFilterLayer] = useState<string>("All");

  const layers = ["All", "Frontend", "Core API", "Analysis", "AI & Agents", "Persistence", "External"];

  const selectedNode: ArchNode =
    ARCHITECTURE_NODES.find((n) => n.id === selectedNodeId) ?? ARCHITECTURE_NODES[0]!;

  const filteredNodes = ARCHITECTURE_NODES.filter((n) => {
    return filterLayer === "All" || n.layer === filterLayer;
  });

  return (
    <section className="py-20 border-b border-border/60 bg-secondary/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
              <Network className="size-3.5" />
              <span>Interactive System Topology • 18 Service Nodes</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              PROJECT BRAHMA System Architecture
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Explore the multi-tier engineering infrastructure powering Brahma. Select any service node to inspect its
              operational responsibility, inbound contracts, output artifacts, and architectural boundaries.
            </p>
          </div>

          {/* LAYER FILTER */}
          <div className="flex items-center gap-1 p-1 rounded-lg border border-border/70 bg-secondary/30 overflow-x-auto">
            {layers.map((l) => (
              <button
                key={l}
                onClick={() => setFilterLayer(l)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  filterLayer === l
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: INTERACTIVE NODE GRID + DETAILED SIDE PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: 18-NODE INTERACTIVE CANVAS (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Service Nodes ({filteredNodes.length})</span>
              <span>Click node to reveal operational role</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredNodes.map((node) => {
                const Icon = node.icon;
                const isSelected = node.id === selectedNodeId;

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between h-28 relative group ${
                      isSelected
                        ? "border-primary bg-primary/15 shadow-md ring-2 ring-primary/30"
                        : "border-border/60 bg-card/60 hover:border-primary/40 hover:bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-border/40 text-muted-foreground">
                        {node.layer}
                      </span>
                    </div>

                    <div>
                      <div
                        className={`text-xs font-bold leading-tight line-clamp-1 ${
                          isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
                        }`}
                      >
                        {node.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">{node.summary}</div>
                    </div>

                    {isSelected && (
                      <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-primary ring-2 ring-background" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: SELECTED NODE INSPECTOR SHEET (5 cols) */}
          <div className="lg:col-span-5">
            <Card className="border-border/80 bg-card/90 shadow-xl sticky top-24 overflow-hidden backdrop-blur-sm">
              <CardContent className="p-6 space-y-5">
                {/* NODE HEADER */}
                <div className="space-y-2 pb-4 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs font-mono border-primary/40 text-primary">
                      {selectedNode.layer} Layer
                    </Badge>
                    <span className="text-[10px] font-mono text-muted-foreground">ID: {selectedNode.id}</span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    {selectedNode.label}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedNode.summary}</p>
                </div>

                {/* OPERATIONAL ROLE */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    Operational Responsibility
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed font-medium bg-secondary/30 p-3 rounded-lg border border-border/40">
                    {selectedNode.operationalRole}
                  </p>
                </div>

                {/* WHY IT MATTERS */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Why This Component Matters
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border/40">
                    {selectedNode.whyItMatters}
                  </p>
                </div>

                {/* INPUTS & OUTPUTS */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-lg border border-border/50 bg-background/50 space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
                      Inbound Inputs
                    </div>
                    <ul className="space-y-1 text-[11px] text-foreground/80">
                      {selectedNode.inputs.map((inp) => (
                        <li key={inp} className="flex items-center gap-1 truncate">
                          <span className="size-1 rounded-full bg-cyan-400 shrink-0" />
                          <span className="truncate">{inp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-lg border border-border/50 bg-background/50 space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
                      Emitted Outputs
                    </div>
                    <ul className="space-y-1 text-[11px] text-foreground/80">
                      {selectedNode.outputs.map((out) => (
                        <li key={out} className="flex items-center gap-1 truncate">
                          <span className="size-1 rounded-full bg-emerald-400 shrink-0" />
                          <span className="truncate">{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* DEPENDENCIES */}
                {selectedNode.dependencies.length > 0 && (
                  <div className="pt-2 border-t border-border/40 space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
                      Connected Dependencies
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.dependencies.map((dep) => (
                        <button
                          key={dep}
                          onClick={() => setSelectedNodeId(dep)}
                          className="text-[10px] font-mono px-2 py-0.5 rounded border border-border/60 bg-secondary/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                        >
                          → {dep}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
