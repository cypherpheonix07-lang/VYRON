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

export const Route = createFileRoute("/app/projects/$id/tests")({
  head: () => ({
    meta: [
      { title: "Testing Roster — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Run verification test cases and verify coverage gates.",
      },
    ],
  }),
  component: ProjectTestingPage,
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
    name: "GET /api/v1/payments schema verification",
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

function ProjectTestingPage() {
  const { id } = Route.useParams();

  const [activeTab, setActiveTab] = useState("All");
  const [running, setRunning] = useState(false);
  const [testSuites, setTestSuites] = useState(mockTests);

  const filtered =
    activeTab === "All" ? testSuites : testSuites.filter((item) => item.suite === activeTab);

  const handleRunTests = () => {
    setRunning(true);
    toast.info("Running project test suites...");
    setTimeout(() => {
      setRunning(false);
      setTestSuites((prev) =>
        prev.map((t) => {
          if (t.status === "Failed") {
            const { error, ...rest } = t;
            return { ...rest, status: "Passed" };
          }
          return t;
        }),
      );
      toast.success("All tests completed successfully. Coverage is 84%.");
    }, 2000);
  };

  const total = testSuites.length;
  const passed = testSuites.filter((t) => t.status === "Passed").length;
  const failed = total - passed;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Project Verification & Test Runs</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Execute unit, API, and end-to-end regression specs.
          </p>
        </div>
        <Button
          onClick={handleRunTests}
          disabled={running}
          className="bg-primary text-primary-foreground text-xs font-semibold"
        >
          {running ? (
            <>
              <Loader2 className="mr-1.5 size-3.5 animate-spin" /> Verifying...
            </>
          ) : (
            <>
              <Play className="mr-1.5 size-3.5" /> Execute Test Suites
            </>
          )}
        </Button>
      </header>

      {/* Top Test Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="surface">
          <CardContent className="pt-4 space-y-1">
            <span className="text-[9px] uppercase font-mono tracking-widest text-muted-foreground">
              Total Test Cases
            </span>
            <p className="text-xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card className="surface">
          <CardContent className="pt-4 space-y-1">
            <span className="text-[9px] uppercase font-mono tracking-widest text-muted-foreground">
              Passed
            </span>
            <p className="text-xl font-bold text-emerald-400">{passed}</p>
          </CardContent>
        </Card>
        <Card className="surface">
          <CardContent className="pt-4 space-y-1">
            <span className="text-[9px] uppercase font-mono tracking-widest text-muted-foreground">
              Failed
            </span>
            <p
              className={`text-xl font-bold ${failed > 0 ? "text-[var(--critical)]" : "text-muted-foreground"}`}
            >
              {failed}
            </p>
          </CardContent>
        </Card>
        <Card className="surface">
          <CardContent className="pt-4 space-y-1">
            <span className="text-[9px] uppercase font-mono tracking-widest text-muted-foreground">
              Test Coverage
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-bold text-cyan-400">84%</span>
            </div>
            <ScoreBar value={84} />
          </CardContent>
        </Card>
      </div>

      {/* Roster & Filters */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-950 border border-border">
          <TabsTrigger value="All">All Suites</TabsTrigger>
          <TabsTrigger value="Unit">Unit</TabsTrigger>
          <TabsTrigger value="API">API</TabsTrigger>
          <TabsTrigger value="E2E">E2E</TabsTrigger>
        </TabsList>
      </Tabs>

      <SectionCard title="Test Suite Roster" description="Individual specification metrics.">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Specification</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Log Findings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-xs font-semibold">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[9px]">
                    {item.suite}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">
                  {item.time}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[9px] rounded-full ${
                      item.status === "Passed"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-[10px] text-muted-foreground max-w-xs truncate font-mono">
                  {item.error ? (
                    <span className="text-[var(--critical)] flex items-center gap-1">
                      <AlertTriangle className="size-3 shrink-0" /> {item.error}
                    </span>
                  ) : (
                    "✓ Spec verified cleanly"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
