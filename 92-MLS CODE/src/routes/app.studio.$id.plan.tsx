import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Database,
  FileCode,
  Layers,
  Network,
  RotateCw,
  Play,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  ArchitectureCanvas,
  MobileArchitectureFallback,
  NodeDetailsPanel,
  type BlueprintNode,
} from "@/components/brahma/architecture-canvas";
import { SectionCard, RiskBadge, StatusBadge, ScoreBar } from "@/components/brahma/primitives";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  apiRoutes,
  architectureRecommendations,
  blueprintNodes,
  getProject,
  requirements,
  schemaTables,
  impactMatrix,
} from "@/lib/mock-data";

export const Route = createFileRoute("/app/studio/$id/plan")({
  head: () => ({
    meta: [
      { title: "Blueprint Plan Reviewer — BRAHMA AI Studio" },
      { name: "description", content: "Review and approve the AI-generated software blueprint." },
    ],
  }),
  component: BlueprintPlanPage,
});

function BlueprintPlanPage() {
  const { id } = Route.useParams();
  const project = getProject(id);
  const navigate = useNavigate();

  const [activeNode, setActiveNode] = useState<BlueprintNode | null>(null);

  const handleApprove = () => {
    toast.success("Blueprint approved!", {
      description: "Triggering software generation pipeline...",
    });
    // Redirect to the generation page
    navigate({ to: "/app/studio/$id/generate", params: { id } });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Warning for Ambiguity */}
      {project.requirementClarity < 70 && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-[var(--warning)]/40 bg-[var(--warning)]/10 px-4 py-3 text-sm"
        >
          <AlertTriangle
            className="mt-0.5 size-4 shrink-0 text-[var(--warning)]"
            aria-hidden="true"
          />
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              Requirement clarity is {project.requirementClarity}%.
            </span>{" "}
            Brahma has flagged minor ambiguities in your brief. You can review the details below or
            regenerate the blueprint with refined prompts.
          </p>
        </div>
      )}

      <Tabs defaultValue="requirements" className="w-full">
        <TabsList
          className="w-full justify-start overflow-x-auto border-b border-border bg-transparent p-0"
          aria-label="Blueprint review categories"
        >
          <TabsTrigger
            value="requirements"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Requirements
          </TabsTrigger>
          <TabsTrigger
            value="architecture"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Architecture
          </TabsTrigger>
          <TabsTrigger
            value="database"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Database Schema
          </TabsTrigger>
          <TabsTrigger
            value="api"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            API Contract
          </TabsTrigger>
          <TabsTrigger
            value="risks"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Risks & Impact
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* REQUIREMENTS TAB */}
          <TabsContent value="requirements" className="space-y-4 outline-none">
            <div className="grid gap-4 md:grid-cols-2">
              <SectionCard title="Functional Requirements" description="Extracted behaviors.">
                <ul className="space-y-2">
                  {requirements.functional.map((r) => (
                    <li
                      key={r.id}
                      className="border border-border/60 rounded-xl p-3 surface flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="font-mono text-[9px] text-muted-foreground block">
                          {r.id}
                        </span>
                        <p className="text-xs text-foreground mt-0.5 leading-relaxed">{r.text}</p>
                      </div>
                      <Badge variant="outline" className="rounded-full text-[9px] shrink-0">
                        {r.confidence}% match
                      </Badge>
                    </li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard
                title="Non-Functional Requirements"
                description="Performance and compliance bounds."
              >
                <ul className="space-y-2">
                  {requirements.nonFunctional.map((r) => (
                    <li
                      key={r.id}
                      className="border border-border/60 rounded-xl p-3 surface flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="font-mono text-[9px] text-muted-foreground block">
                          {r.id}
                        </span>
                        <p className="text-xs text-foreground mt-0.5 leading-relaxed">{r.text}</p>
                      </div>
                      <Badge variant="outline" className="rounded-full text-[9px] shrink-0">
                        {r.confidence}% clarity
                      </Badge>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            </div>
          </TabsContent>

          {/* ARCHITECTURE TAB */}
          <TabsContent value="architecture" className="space-y-4 outline-none">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div>
                <div className="hidden sm:block">
                  <ArchitectureCanvas onSelect={setActiveNode} selectedId={activeNode?.id} />
                </div>
                <MobileArchitectureFallback onSelect={setActiveNode} />
              </div>
              <NodeDetailsPanel node={activeNode} />
            </div>

            <SectionCard
              title="Architecture Recommendations"
              description="Pre-generation optimizations."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {architectureRecommendations.slice(0, 2).map((rec) => (
                  <div
                    key={rec.title}
                    className="border border-border/60 rounded-xl p-4 surface space-y-1"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold">{rec.title}</p>
                      <Badge variant="outline" className="text-[9px]">
                        {rec.impact} impact
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{rec.body}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </TabsContent>

          {/* DATABASE TAB */}
          <TabsContent value="database" className="space-y-4 outline-none">
            <div className="grid gap-4 md:grid-cols-2">
              {schemaTables.slice(0, 2).map((tbl) => (
                <SectionCard
                  key={tbl.name}
                  title={`Table: ${tbl.name}`}
                  description="Derived fields and relations."
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Relation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tbl.fields.map((f) => (
                        <TableRow key={f.name}>
                          <TableCell className="font-mono text-xs">{f.name}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {f.type}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono">
                            {f.rel}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </SectionCard>
              ))}
            </div>
          </TabsContent>

          {/* API TAB */}
          <TabsContent value="api" className="space-y-4 outline-none">
            <SectionCard
              title="Proposed Endpoints"
              description="FastAPI/Fastify service contracts."
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Auth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiRoutes.map((route) => (
                    <TableRow key={route.path + route.method}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[9px]">
                          {route.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{route.path}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {route.purpose}
                      </TableCell>
                      <TableCell className="text-xs">
                        {route.auth ? "Required" : "Public"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SectionCard>
          </TabsContent>

          {/* RISKS TAB */}
          <TabsContent value="risks" className="space-y-4 outline-none">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="surface">
                <CardContent className="pt-4 space-y-2">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                    Technical Debt
                  </span>
                  <p className="text-2xl font-bold">Low</p>
                  <p className="text-[10px] text-muted-foreground">
                    Minimal legacy components predicted
                  </p>
                </CardContent>
              </Card>
              <Card className="surface">
                <CardContent className="pt-4 space-y-2">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                    Delivery Risk
                  </span>
                  <p className="text-2xl font-bold text-[var(--warning)]">Medium</p>
                  <p className="text-[10px] text-muted-foreground">
                    Slight ambiguity in UPI retry queues
                  </p>
                </CardContent>
              </Card>
              <Card className="surface">
                <CardContent className="pt-4 space-y-2">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                    Release Readiness
                  </span>
                  <p className="text-2xl font-bold text-[var(--success)]">92%</p>
                  <p className="text-[10px] text-muted-foreground">High test coverage target</p>
                </CardContent>
              </Card>
            </div>

            <SectionCard
              title="Business Impact Mappings"
              description="Verify alignment between modules and KPIs."
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Technical Risk</TableHead>
                    <TableHead>Business Weight</TableHead>
                    <TableHead>Open Issues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {impactMatrix.map((item) => (
                    <TableRow key={item.module}>
                      <TableCell className="font-semibold text-xs">{item.module}</TableCell>
                      <TableCell>
                        <ScoreBar value={item.technical} />
                      </TableCell>
                      <TableCell>
                        <ScoreBar value={item.business} />
                      </TableCell>
                      <TableCell className="tabular-nums text-xs">{item.issues} findings</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SectionCard>
          </TabsContent>
        </div>
      </Tabs>

      {/* Control Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border/60">
        <Button variant="outline" onClick={() => toast.info("Regeneration queued...")}>
          <RotateCw className="mr-2 size-4" /> Regenerate Blueprint
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => toast.info("Manual edit mode activated.")}>
            Edit Manually
          </Button>
          <Button
            onClick={handleApprove}
            className="bg-primary hover:bg-primary/95 text-primary-foreground"
          >
            Approve Blueprint <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
