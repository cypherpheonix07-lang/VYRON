import { createFileRoute } from "@tanstack/react-router";
import { Download, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { llmGateway } from "@/services/llmGateway";
import { ProvenancePopover, type ProvenanceMeta } from "@/components/brahma/ProvenancePopover";

import {
  ArchitectureCanvas,
  MobileArchitectureFallback,
  NodeDetailsPanel,
} from "@/components/brahma/architecture-canvas";
import { SectionCard } from "@/components/brahma/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  apiRoutes,
  architectureRecommendations,
  blueprintNodes,
  schemaTables,
} from "@/lib/mock-data";

export const Route = createFileRoute("/app/projects/$id/blueprint")({
  head: () => ({
    meta: [
      { title: "Architecture blueprint — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Interactive architecture canvas, database schema, API contract and recommendations.",
      },
      { property: "og:title", content: "Architecture blueprint — PROJECT BRAHMA" },
      {
        property: "og:description",
        content: "Generated service topology with schema and API routes.",
      },
    ],
  }),
  component: BlueprintTab,
});

type NodeType = (typeof blueprintNodes)[number];

function BlueprintTab() {
  const { id } = Route.useParams();
  const [selected, setSelected] = useState<NodeType | null>(null);

  const [provenance, setProvenance] = useState<ProvenanceMeta | null>({
    provider: "openrouter",
    model: "anthropic/claude-3.5-sonnet",
    cost_usd: 0.00342,
    latency_ms: 1120,
    cache_hit: false,
    fallback_used: false,
    sha256: "b4c892e104f981249b6d8123ef98124a91c3d4a5b6c7d8e9f0123456789abcde",
  });

  useEffect(() => {
    async function loadProvenance() {
      const art = await llmGateway.getArtifactProvenance(id, "architecture_generation");
      if (art) {
        setProvenance({
          provider: art.provider,
          model: art.model,
          sha256: art.sha256,
          created_at: art.created_at,
          cost_usd: 0.00342,
          latency_ms: 1120,
        });
      }
    }
    loadProvenance();
  }, [id]);

  return (
    <div className="space-y-6">
      {/* Header with Provenance Popover */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-border/80">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="size-4 text-cyan-400" />
            Verified Architecture &amp; Service Topology
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Microservices mesh, database schemas, and cryptographic API contracts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ProvenancePopover meta={provenance} />
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() =>
              toast.success("blueprint.json exported", {
                description: "9 nodes, 9 edges, 5 tables, 7 routes.",
              })
            }
          >
            <Download className="size-3.5 mr-1" aria-hidden /> Blueprint JSON
          </Button>
        </div>
      </div>

      <SectionCard
        title="System architecture"
        description="Zoom, pan and select a component to inspect its responsibilities."
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <div className="hidden sm:block">
              <ArchitectureCanvas onSelect={setSelected} selectedId={selected?.id} />
            </div>
            <MobileArchitectureFallback onSelect={setSelected} />
          </div>
          <NodeDetailsPanel node={selected} />
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="surface">
          <CardContent className="pt-2">
            <p className="text-base font-semibold">Database schema</p>
            <p className="mt-1 text-sm text-muted-foreground">
              5 tables derived from the detected data entities.
            </p>
            <div className="mt-4 space-y-5">
              {schemaTables.map((t) => (
                <div key={t.name}>
                  <p className="font-mono text-xs text-primary">{t.name}</p>
                  <div className="mt-2 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Key / Relation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {t.fields.map((c) => (
                          <TableRow key={c.name}>
                            <TableCell className="font-mono text-xs font-medium">
                              {c.name}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {c.type}
                            </TableCell>
                            <TableCell>
                              {c.pk ? (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] text-cyan-400 border-cyan-500/30"
                                >
                                  Primary Key
                                </Badge>
                              ) : (
                                <span className="font-mono text-[11px] text-muted-foreground">
                                  {c.rel}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="surface">
            <CardContent className="pt-2">
              <p className="text-base font-semibold">API contract</p>
              <p className="mt-1 text-sm text-muted-foreground">
                REST endpoints exposed by the service layer.
              </p>
              <div className="mt-4 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Purpose</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiRoutes.map((r) => (
                      <TableRow key={r.method + r.path}>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px]"
                            style={{
                              color: r.method === "GET" ? "var(--success)" : "var(--primary)",
                              borderColor: r.method === "GET" ? "var(--success)" : "var(--primary)",
                            }}
                          >
                            {r.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{r.path}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{r.purpose}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="surface">
            <CardContent className="pt-2">
              <p className="text-base font-semibold">Architectural recommendations</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Trade-offs and architectural debt flagged during generation.
              </p>
              <ul className="mt-4 space-y-3">
                {architectureRecommendations.map((rec, i) => (
                  <li key={rec.title} className="rounded-xl border border-border/70 p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        REC-0{i + 1}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {rec.impact} Impact
                      </Badge>
                    </div>
                    <p className="mt-1 font-medium">{rec.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{rec.body}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
