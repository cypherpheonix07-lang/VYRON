import { Link, createFileRoute } from "@tanstack/react-router";
import { GitBranch } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  EmptyState,
  LoadingSkeleton,
  RiskBadge,
  ScoreGauge,
  SectionCard,
  StatCard,
} from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { codeHealthMetrics, complexityTrend, fileIssues, getProject, maintainability } from "@/lib/mock-data";

export const Route = createFileRoute("/app/projects/$id/code-health")({
  head: () => ({
    meta: [
      { title: "Code health analysis — PROJECT BRAHMA" },
      { name: "description", content: "Maintainability, complexity, duplication, coverage and file-level issues." },
      { property: "og:title", content: "Code health analysis — PROJECT BRAHMA" },
      { property: "og:description", content: "Repository quality metrics with prioritized recommendations." },
    ],
  }),
  component: CodeHealthTab,
});

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

function CodeHealthTab() {
  const { id } = Route.useParams();
  const p = getProject(id);
  const [state, setState] = useState<"loaded" | "loading">("loaded");

  if (!p.repoConnected) {
    return (
      <EmptyState
        icon={GitBranch}
        title="Repository not connected"
        description="Connect a Git repository to compute maintainability, complexity, duplication and coverage for this project."
        action={
          <Button asChild>
            <Link to="/app/projects/$id" params={{ id }}>Connect repository</Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <Tabs value={state} onValueChange={(v) => setState(v as "loaded" | "loading")}>
          <TabsList aria-label="Preview analysis states">
            <TabsTrigger value="loaded">Results</TabsTrigger>
            <TabsTrigger value="loading">Analysis running</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {state === "loading" ? (
        <div className="space-y-4">
          <LoadingSkeleton />
          <LoadingSkeleton variant="chart" />
          <LoadingSkeleton variant="table" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
            <SectionCard title="Overall code health" description={`${codeHealthMetrics.loc.toLocaleString()} lines analyzed`}>
              <div className="flex justify-center py-2">
                <ScoreGauge value={codeHealthMetrics.overall} sublabel="of 100" />
              </div>
            </SectionCard>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Duplication" value={`${codeHealthMetrics.duplication}%`} tone="success" hint="Threshold 5%" />
              <StatCard label="Test coverage" value={`${codeHealthMetrics.coverage}%`} tone="warning" hint="Target 80%" />
              <StatCard label="Dependency risk" value={codeHealthMetrics.dependencyRisk} tone="warning" hint={`${codeHealthMetrics.outdatedDeps} outdated packages`} />
              <StatCard label="Files flagged" value={fileIssues.length} tone="critical" hint="Across 6 modules" />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Maintainability by module" description="Higher is better; below 65 needs attention.">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maintainability} margin={{ left: -18, right: 6, top: 6 }}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="module" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="score" name="Maintainability" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
            <SectionCard title="Complexity and duplication trend" description="Average cyclomatic complexity per changed file.">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={complexityTrend} margin={{ left: -18, right: 6, top: 6 }}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="complexity" name="Complexity" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="duplication" name="Duplication %" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="File-level issues" description="Sorted by complexity contribution.">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Complexity</TableHead>
                    <TableHead className="hidden sm:table-cell">Issues</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="hidden lg:table-cell">Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fileIssues.map((f) => (
                    <TableRow key={f.file}>
                      <TableCell className="max-w-[260px] truncate font-mono text-xs">{f.file}</TableCell>
                      <TableCell className="tabular-nums">{f.complexity}</TableCell>
                      <TableCell className="hidden tabular-nums sm:table-cell">{f.issues}</TableCell>
                      <TableCell><RiskBadge level={f.severity} /></TableCell>
                      <TableCell className="hidden max-w-[360px] text-xs text-muted-foreground lg:table-cell">{f.recommendation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </>
      )}
    </>
  );
}
