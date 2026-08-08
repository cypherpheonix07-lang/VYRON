import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { apiRoutes, architectureRecommendations, blueprintNodes, schemaTables } from "@/lib/mock-data";

export const Route = createFileRoute("/app/projects/$id/blueprint")({
  head: () => ({
    meta: [
      { title: "Architecture blueprint — PROJECT BRAHMA" },
      { name: "description", content: "Interactive architecture canvas, database schema, API contract and recommendations." },
      { property: "og:title", content: "Architecture blueprint — PROJECT BRAHMA" },
      { property: "og:description", content: "Generated service topology with schema and API routes." },
    ],
  }),
  component: BlueprintTab,
});

type NodeType = (typeof blueprintNodes)[number];

function BlueprintTab() {
  const [selected, setSelected] = useState<NodeType | null>(null);

  return (
    <>
      <SectionCard
        title="System architecture"
        description="Zoom, pan and select a component to inspect its responsibilities."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("blueprint.json exported", { description: "9 nodes, 9 edges, 5 tables, 7 routes." })}
          >
            <Download className="size-4" aria-hidden /> Blueprint JSON
          </Button>
        }
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
            <p className="mt-1 text-sm text-muted-foreground">5 tables derived from the detected data entities.</p>
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
                          <TableHead>Key</TableHead>
                          <TableHead>Relationship</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {t.fields.map((f) => (
                          <TableRow key={f.name}>
                            <TableCell className="font-mono text-xs">{f.name}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">{f.type}</TableCell>
                            <TableCell>
                              {f.pk ? <Badge variant="outline" className="rounded-full text-[10px]">PK</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">{f.rel}</TableCell>
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
          <SectionCard title="API routes" description="Generated contract for the payment service.">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead className="hidden sm:table-cell">Purpose</TableHead>
                    <TableHead>Auth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiRoutes.map((r) => (
                    <TableRow key={r.path + r.method}>
                      <TableCell>
                        <Badge variant="outline" className="rounded-full font-mono text-[10px]">{r.method}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{r.path}</TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">{r.purpose}</TableCell>
                      <TableCell className="text-xs">{r.auth ? "Required" : "Public"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>

          <SectionCard title="Architecture recommendations" description="Ranked by expected impact on reliability.">
            <ul className="space-y-3">
              {architectureRecommendations.map((r) => (
                <li key={r.title} className="rounded-xl border border-border/70 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium">{r.title}</p>
                    <Badge variant="outline" className="shrink-0 rounded-full text-[10px]">{r.impact} impact</Badge>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{r.body}</p>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
