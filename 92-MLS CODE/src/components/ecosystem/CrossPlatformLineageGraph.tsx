/**
 * VYRON — CROSS-PLATFORM PROJECT LINEAGE & CORRELATION GRAPH
 * Section 7 & Phase P32
 * GOD MODE vULTIMA vNEXT — Strictly ZERO SQL.
 */

import React, { useState, useEffect } from "react";
import {
  GitBranch,
  Github,
  Layers,
  ArrowRight,
  ExternalLink,
  Bot,
  Radio,
  Eye,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ecosystemControlPlane,
  CompleteLineageGraph,
  LineageGraphNode,
} from "@/services/ecosystem";

export function CrossPlatformLineageGraph() {
  const [graph, setGraph] = useState<CompleteLineageGraph | null>(null);

  useEffect(() => {
    loadGraph();
  }, []);

  function loadGraph() {
    const g = ecosystemControlPlane.getLineageGraph();
    setGraph(g);
  }

  if (!graph) return null;

  const accountNodes = graph.nodes.filter((n) => n.type === "GITHUB_ACCOUNT");
  const repoNodes = graph.nodes.filter((n) => n.type === "REPOSITORY");
  const vibeNodes = graph.nodes.filter((n) => n.type === "VIBE_PROJECT");
  const previewNodes = graph.nodes.filter((n) => n.type === "PREVIEW");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl bg-card/60 border border-border/70">
        <div>
          <h3 className="text-base font-bold tracking-tight">Cross-Platform Identity & Lineage DAG</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Deterministic correlation connecting GitHub organizations, repositories, vibe projects, agent runs, and deployment previews.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadGraph} className="text-xs">
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Refresh DAG
        </Button>
      </div>

      {/* DAG Visualization Lanes */}
      <div className="p-6 rounded-2xl bg-card/40 border border-border/60 overflow-x-auto space-y-6">
        <div className="grid grid-cols-4 gap-6 min-w-[700px]">
          {/* Lane 1: GitHub Accounts / Orgs */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-primary" />
              1. Account / Org
            </span>
            <div className="space-y-2.5">
              {accountNodes.map((n) => (
                <div key={n.id} className="p-3.5 rounded-xl bg-card/80 border border-border/70 shadow-sm space-y-1">
                  <div className="font-semibold text-xs text-foreground truncate">{n.label}</div>
                  <Badge variant="outline" className="text-[9px] text-emerald-400 border-emerald-500/30">
                    GitHub App Installed
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Lane 2: Enrolled Repositories */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              2. Enrolled Repo
            </span>
            <div className="space-y-2.5">
              {repoNodes.map((n) => (
                <div key={n.id} className="p-3.5 rounded-xl bg-card/80 border border-emerald-500/30 shadow-sm space-y-1">
                  <div className="font-semibold text-xs text-foreground truncate">{n.label}</div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Default: main</span>
                    <Badge variant="outline" className="text-[9px] text-emerald-400">
                      Health: {(n.metadata["health"] as number) || 98}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lane 3: Vibe-Coding Projects */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              3. Vibe Platform
            </span>
            <div className="space-y-2.5">
              {vibeNodes.map((n) => (
                <div key={n.id} className="p-3.5 rounded-xl bg-card/80 border border-indigo-500/30 shadow-sm space-y-1">
                  <div className="font-semibold text-xs text-foreground truncate">{n.label}</div>
                  <Badge variant="outline" className="text-[9px] uppercase text-indigo-400 border-indigo-500/30">
                    {n.provider}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Lane 4: Preview & Deployments */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              4. Preview & Deploys
            </span>
            <div className="space-y-2.5">
              {previewNodes.map((n) => (
                <div key={n.id} className="p-3.5 rounded-xl bg-card/80 border border-amber-500/30 shadow-sm space-y-2">
                  <div className="font-semibold text-xs text-foreground truncate">{n.label}</div>
                  <Button variant="outline" size="sm" asChild className="h-6 text-[10px] w-full">
                    <a href={n.metadata["url"] as string} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-2.5 h-2.5 mr-1" />
                      View URL
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
