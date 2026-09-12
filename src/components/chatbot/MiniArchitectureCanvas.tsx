/**
 * PROJECT BRAHMA — MINI ARCHITECTURE CANVAS (PHASE D.1)
 * Compact interactive blueprint viewer for chatbot artifacts.
 */

import React from "react";
import { Server, Database, Shield, Globe, Layers, ArrowRight } from "lucide-react";

export interface MiniNode {
  id: string;
  name: string;
  type?: string;
  desc?: string;
}

export interface MiniEdge {
  id: string;
  source: string;
  target: string;
}

export interface MiniArchitectureCanvasProps {
  nodes?: MiniNode[];
  edges?: MiniEdge[];
  className?: string;
}

export function MiniArchitectureCanvas({
  nodes = [],
  edges = [],
  className = "",
}: MiniArchitectureCanvasProps) {
  const getNodeIcon = (type?: string) => {
    switch ((type || "").toLowerCase()) {
      case "gateway":
      case "ingress":
        return <Globe className="size-3.5 text-cyan-400" />;
      case "database":
      case "warehouse":
        return <Database className="size-3.5 text-emerald-400" />;
      case "auth":
      case "security":
        return <Shield className="size-3.5 text-violet-400" />;
      case "queue":
      case "stream":
        return <Layers className="size-3.5 text-amber-400" />;
      default:
        return <Server className="size-3.5 text-blue-400" />;
    }
  };

  if (!nodes || nodes.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-center text-xs text-zinc-500">
        No blueprint nodes to display.
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800/60">
        <span className="font-semibold text-zinc-200">Architecture DAG</span>
        <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
          {nodes.length} Nodes &bull; {edges.length} Edges
        </span>
      </div>

      {/* Grid of Microservice Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="p-2 rounded bg-zinc-900/90 border border-zinc-800 hover:border-cyan-500/40 transition-colors space-y-1"
          >
            <div className="flex items-center gap-1.5">
              {getNodeIcon(node.type)}
              <span className="text-xs font-semibold text-zinc-200 truncate">{node.name}</span>
            </div>
            {node.desc && (
              <p className="text-[10px] text-zinc-400 line-clamp-2 leading-snug">{node.desc}</p>
            )}
          </div>
        ))}
      </div>

      {/* Top Edge Dependencies Sample */}
      {edges.length > 0 && (
        <div className="pt-2 border-t border-zinc-800/60">
          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            Key Pipelines & Connections
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {edges.slice(0, 10).map((edge) => (
              <span
                key={edge.id}
                className="inline-flex items-center gap-1 text-[10px] font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-300"
              >
                <span>{edge.source}</span>
                <ArrowRight className="size-2.5 text-zinc-500" />
                <span className="text-cyan-400">{edge.target}</span>
              </span>
            ))}
            {edges.length > 10 && (
              <span className="text-[10px] font-mono text-zinc-500 self-center">
                +{edges.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
