import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  CheckCircle2,
  FileCheck,
  Loader2,
  Play,
  RotateCw,
  Search,
  Sparkles,
  TrendingUp,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard, ScoreBar } from "@/components/brahma/primitives";
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

export const Route = createFileRoute("/app/studio/$id/tests")({
  head: () => ({
    meta: [
      { title: "Testing Studio — BRAHMA AI Studio" },
      {
        name: "description",
        content: "Run AI-generated unit, API and E2E test suites with code audits.",
      },
    ],
  }),
  component: TestingStudioPage,
});

const mockTests = [
  {
    id: "UT-1",
    name: "Auth JWT Token Verification",
    suite: "Unit",
    status: "Passed",
    time: "18ms",
  },
  {
    id: "UT-2",
    name: "User Registration Role Restriction",
    suite: "Unit",
    status: "Passed",
    time: "24ms",
  },
  {
    id: "API-1",
    name: "GET /api/v1/projects schema verification",
    suite: "API",
    status: "Passed",
    time: "84ms",
  },
  {
    id: "API-2",
    name: "POST /api/v1/deploy payload limits",
    suite: "API",
    status: "Failed",
    time: "142ms",
    error:
      "Returned status 500. Expected 400. Payload size exceeded max bounds but database did not reject.",
  },
  {
    id: "E2E-1",
    name: "Onboarding Wizard redirect path",
    suite: "E2E",
    status: "Passed",
    time: "1.2s",
  },
  {
    id: "E2E-2",
    name: "Publish Pipeline gate checklist blocking",
    suite: "E2E",
    status: "Passed",
    time: "2.4s",
  },
];

function TestingStudioPage() {
  const { id } = Route.useParams();

  const [activeTab, setActiveTab] = useState("All");
  const [running, setRunning] = useState(false);
  const [testSuites, setTestSuites] = useState(mockTests);

  const filtered =
    activeTab === "All" ? testSuites : testSuites.filter((item) => item.suite === activeTab);

  const runAllTests = async () => {
    setRunning(true);
    toast.info("Running AI test suites...", { description: "Spawning local container runner." });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRunning(false);
    toast.success("Tests completed with 1 failure.", {
      description: "Static code analysis recommendations updated in panel.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top statistics summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="surface">
          <CardContent className="pt-4 space-y-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              Total Suites
            </span>
            <p className="text-2xl font-bold">{testSuites.length}</p>
            <p className="text-[10px] text-muted-foreground">Unit, API, and E2E scripts</p>
          </CardContent>
        </Card>
        <Card className="surface">
          <CardContent className="pt-4 space-y-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              Passed
            </span>
            <p className="text-2xl font-bold text-[var(--success)]">
              {testSuites.filter((t) => t.status === "Passed").length}
            </p>
            <p className="text-[10px] text-muted-foreground">Handshake verified</p>
          </CardContent>
        </Card>
        <Card className="surface">
          <CardContent className="pt-4 space-y-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              Failed
            </span>
            <p className="text-2xl font-bold text-[var(--critical)]">
              {testSuites.filter((t) => t.status === "Failed").length}
            </p>
            <p className="text-[10px] text-[var(--critical)]">Requires code review</p>
          </CardContent>
        </Card>
        <Card className="surface">
          <CardContent className="pt-4 space-y-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              Test Coverage
            </span>
            <p className="text-2xl font-bold">89.4%</p>
            <p className="text-[10px] text-muted-foreground">92% target coverage</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileCheck className="size-5 text-primary" /> Test Execution Matrix
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            View test history logs and run static audit evaluations.
          </p>
        </div>

        <div className="flex gap-2">
          {/* Category selection */}
          <div className="flex items-center bg-secondary/50 p-0.5 rounded border border-border/40 shrink-0">
            {["All", "Unit", "API", "E2E"].map((cat) => (
              <Button
                key={cat}
                variant={activeTab === cat ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-3 text-[10px]"
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <Button
            onClick={runAllTests}
            disabled={running}
            className="bg-primary text-primary-foreground text-xs h-8"
          >
            {running ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <Play className="mr-1.5 size-3.5" />
            )}
            Run Test Suites
          </Button>
        </div>
      </div>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
          <TabsTrigger value="results" className="text-xs">
            Execution Results
          </TabsTrigger>
          <TabsTrigger value="audits" className="text-xs">
            Performance & Accessibility Audits
          </TabsTrigger>
        </TabsList>

        {/* RESULTS CONTENT */}
        <TabsContent value="results" className="space-y-4 outline-none">
          <SectionCard title="Test Runs Summary" description="Detailed trace logs per route.">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Test Scenario Name</TableHead>
                  <TableHead>Suite</TableHead>
                  <TableHead>Execution Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((suite) => {
                  const isPassed = suite.status === "Passed";
                  return (
                    <>
                      <TableRow key={suite.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {suite.id}
                        </TableCell>
                        <TableCell className="text-xs font-semibold">{suite.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[9px]">
                            {suite.suite}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {suite.time}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`rounded-full text-[9px] ${
                              isPassed
                                ? "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]"
                                : "bg-[var(--critical)]/10 text-[var(--critical)] border-[var(--critical)]"
                            }`}
                            variant="outline"
                          >
                            {suite.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      {suite.error && (
                        <TableRow key={`${suite.id}-error`}>
                          <TableCell colSpan={5} className="bg-[var(--critical)]/5 px-6 py-4">
                            <div className="space-y-2">
                              <p className="text-xs text-[var(--critical)] font-semibold flex items-center gap-1.5">
                                <AlertTriangle className="size-4" /> Failure Details:
                              </p>
                              <p className="text-xs text-muted-foreground font-mono leading-relaxed bg-zinc-950 p-3 rounded-lg border border-border/40">
                                {suite.error}
                              </p>
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-[10px] text-primary"
                                  onClick={() => {
                                    toast.success(
                                      "AI patch generated for API payload schema check.",
                                    );
                                  }}
                                >
                                  <Sparkles className="mr-1 size-3 shrink-0" /> Auto-Fix with AI
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        {/* AUDITS CONTENT */}
        <TabsContent value="audits" className="space-y-4 outline-none">
          <div className="grid gap-4 sm:grid-cols-3">
            <SectionCard title="Accessibility Audit" description="WCAG 2.1 compliance.">
              <div className="space-y-2 py-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">96/100</span>
                  <span className="text-xs text-[var(--success)]">Passed</span>
                </div>
                <ScoreBar value={96} />
                <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                  Missing alt attributes in landing screen elements were corrected during
                  generation.
                </p>
              </div>
            </SectionCard>

            <SectionCard title="Performance Audit" description="Lighthouse score targets.">
              <div className="space-y-2 py-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">91/100</span>
                  <span className="text-xs text-[var(--success)]">Passed</span>
                </div>
                <ScoreBar value={91} />
                <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                  Fast API response times average ~22ms. Asset caching rules enabled.
                </p>
              </div>
            </SectionCard>

            <SectionCard title="SEO Audit" description="Search index optimizations.">
              <div className="space-y-2 py-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">100/100</span>
                  <span className="text-xs text-[var(--success)]">Perfect</span>
                </div>
                <ScoreBar value={100} />
                <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                  All pages include canonical tags, meta description attributes, and clear H1 tag
                  hierachies.
                </p>
              </div>
            </SectionCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
