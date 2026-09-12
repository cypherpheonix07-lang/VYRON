import { Background, Controls, MiniMap, ReactFlow, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blueprintEdges, blueprintNodes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const kindTone: Record<string, string> = {
  Frontend: "var(--primary)",
  Backend: "var(--info)",
  Database: "var(--success)",
  AI: "var(--accent)",
  Auth: "var(--warning)",
  Storage: "var(--primary)",
  Worker: "var(--info)",
  External: "var(--critical)",
};

export type BlueprintNode = (typeof blueprintNodes)[number];

export function ArchitectureCanvas({
  onSelect,
  selectedId,
}: {
  onSelect: (node: BlueprintNode) => void;
  selectedId?: string | undefined;
}) {
  const nodes: Node[] = useMemo(
    () =>
      blueprintNodes.map((n) => ({
        id: n.id,
        position: { x: n.x, y: n.y },
        data: { label: n.label },
        style: {
          background: "color-mix(in oklab, var(--card) 92%, transparent)",
          color: "var(--foreground)",
          border: `1px solid ${selectedId === n.id ? kindTone[n.kind] : "var(--border)"}`,
          borderRadius: 12,
          padding: "10px 14px",
          fontSize: 12,
          fontWeight: 500,
          minWidth: 150,
          boxShadow:
            selectedId === n.id
              ? `0 0 0 3px color-mix(in oklab, ${kindTone[n.kind]} 25%, transparent)`
              : "0 10px 24px -18px oklch(0 0 0 / 0.9)",
        },
      })),
    [selectedId],
  );

  const edges: Edge[] = useMemo(
    () =>
      blueprintEdges.map((e) => ({
        ...e,
        animated: true,
        labelStyle: { fill: "var(--muted-foreground)", fontSize: 10 },
        labelBgStyle: { fill: "var(--card)" },
        style: { stroke: "color-mix(in oklab, var(--primary) 45%, transparent)", strokeWidth: 1.5 },
      })),
    [],
  );

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-xl border border-border bg-background/60 sm:h-[520px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        onNodeClick={(_, node) => {
          const found = blueprintNodes.find((n) => n.id === node.id);
          if (found) onSelect(found);
        }}
      >
        <Background color="var(--border)" gap={22} />
        <Controls className="!bg-card !border-border" showInteractive={false} />
        <MiniMap
          className="!hidden sm:!block !bg-card"
          maskColor="color-mix(in oklab, var(--background) 70%, transparent)"
          nodeColor={() => "var(--primary)"}
        />
      </ReactFlow>
    </div>
  );
}

export function NodeDetailsPanel({ node }: { node: BlueprintNode | null }) {
  if (!node) {
    return (
      <div className="surface flex h-full min-h-40 flex-col items-center justify-center rounded-xl p-6 text-center">
        <p className="text-sm font-medium">No component selected</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Select a node on the canvas to inspect its technology choice and responsibilities.
        </p>
      </div>
    );
  }
  return (
    <div className="surface h-full rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold">{node.label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{node.tech}</p>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 rounded-full"
          style={{ color: kindTone[node.kind], borderColor: kindTone[node.kind] }}
        >
          {node.kind}
        </Badge>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{node.detail}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="text-muted-foreground">Owner</dt>
          <dd className="mt-0.5 font-medium">Platform team</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Criticality</dt>
          <dd className="mt-0.5 font-medium">
            {["core", "db", "auth"].includes(node.id) ? "Tier 1" : "Tier 2"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function MobileArchitectureFallback({
  onSelect,
}: {
  onSelect: (node: BlueprintNode) => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <ul className="grid gap-2 sm:hidden">
      {blueprintNodes.map((n) => (
        <li key={n.id}>
          <Button
            variant="outline"
            className={cn(
              "h-auto w-full justify-between px-3 py-2.5 text-left",
              active === n.id && "border-primary",
            )}
            onClick={() => {
              setActive(n.id);
              onSelect(n);
            }}
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{n.label}</span>
              <span className="block truncate text-xs text-muted-foreground">{n.tech}</span>
            </span>
            <Badge variant="outline" className="shrink-0 rounded-full text-[10px]">
              {n.kind}
            </Badge>
          </Button>
        </li>
      ))}
    </ul>
  );
}
