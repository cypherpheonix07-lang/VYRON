import { Link, createFileRoute } from "@tanstack/react-router";
import { GitBranch, LayoutGrid, PlusCircle, Search, Table2 } from "lucide-react";
import { useMemo, useState } from "react";

import {
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  PageHeader,
  RiskBadge,
  ScoreBar,
  StatusBadge,
} from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projects } from "@/lib/mock-data";

export const Route = createFileRoute("/app/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Search and filter every monitored project by status, risk level and health score.",
      },
      { property: "og:title", content: "Projects — PROJECT BRAHMA" },
      {
        property: "og:description",
        content: "All monitored projects with health, risk and security scores.",
      },
    ],
  }),
  component: ProjectsPage,
});

type ViewState = "loaded" | "loading" | "empty" | "error";

function ProjectsPage() {
  const [state, setState] = useState<ViewState>("loaded");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [risk, setRisk] = useState("all");
  const [health, setHealth] = useState("all");

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q);
        const matchesStatus = status === "all" || p.status === status;
        const matchesRisk = risk === "all" || p.deliveryRisk === risk;
        const matchesHealth =
          health === "all" ||
          (health === "high" && p.healthScore >= 80) ||
          (health === "mid" && p.healthScore >= 60 && p.healthScore < 80) ||
          (health === "low" && p.healthScore < 60);
        return matchesQuery && matchesStatus && matchesRisk && matchesHealth;
      }),
    [query, status, risk, health],
  );

  return (
    <>
      <PageHeader
        title="Projects"
        description="Every project in this workspace with its latest blueprint, health and risk signal."
        actions={
          <>
            <Tabs value={state} onValueChange={(v) => setState(v as ViewState)}>
              <TabsList aria-label="Preview list states">
                <TabsTrigger value="loaded">Loaded</TabsTrigger>
                <TabsTrigger value="loading">Loading</TabsTrigger>
                <TabsTrigger value="empty">Empty</TabsTrigger>
                <TabsTrigger value="error">Error</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button asChild>
              <Link to="/app/projects/new">
                <PlusCircle className="size-4" aria-hidden /> Create project
              </Link>
            </Button>
          </>
        }
      />

      <div className="surface flex flex-col gap-3 rounded-xl p-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, domain or description"
            className="pl-9"
            aria-label="Search projects"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:w-auto">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["Analyzed", "Analyzing", "Needs Review", "At Risk", "Draft"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={risk} onValueChange={setRisk}>
            <SelectTrigger aria-label="Filter by risk">
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All risk levels</SelectItem>
              {["Low", "Medium", "High", "Critical"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s} risk
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={health} onValueChange={setHealth}>
            <SelectTrigger aria-label="Filter by health">
              <SelectValue placeholder="Health" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any health</SelectItem>
              <SelectItem value="high">80 and above</SelectItem>
              <SelectItem value="mid">60 – 79</SelectItem>
              <SelectItem value="low">Below 60</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-1 rounded-lg border border-border p-1">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
          >
            <LayoutGrid className="size-4" aria-hidden /> Grid
          </Button>
          <Button
            variant={view === "table" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("table")}
            aria-pressed={view === "table"}
          >
            <Table2 className="size-4" aria-hidden /> Table
          </Button>
        </div>
      </div>

      {state === "loading" ? <LoadingSkeleton variant="table" /> : null}
      {state === "error" ? (
        <ErrorState
          description="The project index could not be loaded."
          onRetry={() => setState("loaded")}
        />
      ) : null}
      {state === "empty" ? (
        <EmptyState
          title="No projects in this workspace"
          description="Create a project to generate its first blueprint."
          action={
            <Button asChild>
              <Link to="/app/projects/new">Create project</Link>
            </Button>
          }
        />
      ) : null}

      {state === "loaded" ? (
        filtered.length === 0 ? (
          <EmptyState
            title="No projects match these filters"
            description="Try clearing the search term or widening the status and risk filters."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                  setRisk("all");
                  setHealth("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : view === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <Card key={p.id} className="surface transition-colors hover:border-primary/40">
                <CardContent className="pt-2">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to="/app/projects/$id"
                      params={{ id: p.id }}
                      className="min-w-0 font-medium hover:text-primary"
                    >
                      <span className="block truncate">{p.name}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{p.domain}</span>
                    </Link>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <ScoreBar label="Health" value={p.healthScore} />
                    <ScoreBar label="Security" value={p.securityScore} />
                    <ScoreBar label="Risk" value={p.riskScore} />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                      <GitBranch className="size-3.5 shrink-0" aria-hidden />
                      <span className="truncate">
                        {p.repoConnected ? p.repoUrl : "Repository not connected"}
                      </span>
                    </span>
                    <RiskBadge level={p.deliveryRisk} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="surface">
            <CardContent className="overflow-x-auto pt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead className="hidden md:table-cell">Security</TableHead>
                    <TableHead className="hidden md:table-cell">Risk score</TableHead>
                    <TableHead>Delivery risk</TableHead>
                    <TableHead className="hidden lg:table-cell">Repository</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="max-w-[240px]">
                        <Link
                          to="/app/projects/$id"
                          params={{ id: p.id }}
                          className="block truncate font-medium hover:text-primary"
                        >
                          {p.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                      <TableCell>
                        <ScoreBar value={p.healthScore} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <ScoreBar value={p.securityScore} />
                      </TableCell>
                      <TableCell className="hidden tabular-nums md:table-cell">
                        {p.riskScore}
                      </TableCell>
                      <TableCell>
                        <RiskBadge level={p.deliveryRisk} />
                      </TableCell>
                      <TableCell className="hidden max-w-[220px] truncate text-xs text-muted-foreground lg:table-cell">
                        {p.repoConnected ? p.repoUrl : "Not connected"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      ) : null}
    </>
  );
}
