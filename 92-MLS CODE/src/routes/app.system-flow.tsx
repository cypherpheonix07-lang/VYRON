/**
 * VYRON — SYSTEM FLOW & ULTRA-NUCLEAR ARCHITECTURE ROUTE
 * Live operational backend telemetry, 6-pattern image-driven architecture, and OpenAI Sentinel defense.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SystemFlowControlPlane } from "@/components/systemFlow/SystemFlowControlPlane";
import { ArchitectureControlPlaneView } from "@/components/architecture/ArchitectureControlPlaneView";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, Activity } from "lucide-react";

export const Route = createFileRoute("/app/system-flow")({
  head: () => ({
    meta: [
      { title: "Architecture & System Flow — VYRON" },
      {
        name: "description",
        content:
          "Live backend data-flow waterfall, 6-pattern image-driven architecture, and OpenAI Sentinel defense.",
      },
    ],
  }),
  component: SystemFlowPage,
});

function SystemFlowPage() {
  const [viewMode, setViewMode] = useState<"architecture" | "systemFlow">("architecture");

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between p-2 rounded-[var(--radius-sm)] bg-[var(--surface-raised)] border border-[var(--border-default)]">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={viewMode === "architecture" ? "default" : "outline"}
            onClick={() => setViewMode("architecture")}
            className="font-mono text-xs gap-1.5"
          >
            <Layers className="size-3.5" />
            Nuclear Architecture Control Plane (6 Patterns)
          </Button>
          <Button
            size="sm"
            variant={viewMode === "systemFlow" ? "default" : "outline"}
            onClick={() => setViewMode("systemFlow")}
            className="font-mono text-xs gap-1.5"
          >
            <Activity className="size-3.5" />
            Live System Flow & Backend Sentinel
          </Button>
        </div>
        <Badge variant="outline" className="font-mono text-[10px] text-[var(--color-primary)]">
          {viewMode === "architecture" ? "IMAGE-DRIVEN ARCHITECTURE" : "RUNTIME WATERFALL"}
        </Badge>
      </div>

      {viewMode === "architecture" ? (
        <ArchitectureControlPlaneView />
      ) : (
        <SystemFlowControlPlane />
      )}
    </div>
  );
}
