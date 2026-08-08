import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  FileBarChart2,
  FolderKanban,
  GitBranch,
  Network,
  PlusCircle,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  PageHeader,
  RiskBadge,
  ScoreBar,
  SectionCard,
  StatCard,
  StatusBadge,
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
import { activityFeed, healthTrend, projects, riskDistribution } from "@/lib/mock-data";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Executive overview of project health, security posture and delivery risk.",
      },
      { property: "og:title", content: "Dashboard — PROJECT BRAHMA" },
      { property: "og:description", content: "Portfolio health, security and delivery risk at a glance." },
    ],
  }),
  component: Dashboard,
});

const activityIcon = {
  security: ShieldAlert,
  blueprint: Network,
  report: FileBarChart2,
  risk: TrendingUp,
  repo: GitBranch,
} as const;

type ViewState = "loaded" | "loading" | "empty" | "error";

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

function Dashboard() {
  const [state, setState] = useState<ViewState>("loaded");

  return (
    <>
      <PageHeader
        title="Engineering intelligence overview"
        description="Portfolio-wide health, security posture and delivery risk, recalculated on every analysis run."
        actions={
          <>
            <Tabs value={state} onValueChange={(v) => setState(v as ViewState)}>
              <TabsList aria-label="Preview dashboard states">
                <TabsTrigger value="loaded">Loaded</TabsTrigger>
                <TabsTrigger value="loading">Loading</TabsTrigger>
                <TabsTrigger value="empty">Empty</TabsTrigger>
                <TabsTrigger value="error">Error</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button asChild>
              <Link to="/app/projects/new">
                <PlusCircle className="size-4" aria-hidden /> New project
              </Link>
            </Button>
          </>
        }
      />

      {state === "loading" ? (
        <div className="space-y-4">
          <LoadingSkeleton />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <LoadingSkeleton variant="chart" />
            </div>
            <LoadingSkeleton variant="chart" />
          </div>
          <LoadingSkeleton variant="table" />
        </div>
      ) : null}

      {state === "error" ? (
        <ErrorState
          title="Analysis service unavailable"
          description="We couldn't reach the analysis service to compute portfolio metrics."
          onRetry={() => setState("loaded")}
        />
      ) : null}

      {state === "empty" ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to generate a validated blueprint, then connect a repository for code health and security analysis."
          action={
            <Button asChild>
              <Link to="/app/projects/new">
                <PlusCircle className="size-4" aria-hidden /> Create project
              </Link>
            </Button>
          }
        />
      ) : null}

      {state === "loaded" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Total projects" value={projects.length} icon={FolderKanban} delta={12} hint="vs last month" />
            <StatCard label="Avg. health score" value="73" icon={Activity} delta={5} tone="success" hint="portfolio median 71" />
            <StatCard label="Security risk" value="High" icon={ShieldCheck} tone="critical" hint="2 critical findings open" />
            <StatCard label="Delivery risk" value="Medium" icon={TrendingUp} tone="warning" hint="1 project at risk" />
            <StatCard label="Reports generated" value="318" icon={FileBarChart2} delta={9} hint="all time" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard
              className="lg:col-span-2"
              title="Project health trend"
              description="Six-month rolling average across all monitored projects."
            >
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthTrend} margin={{ left: -18, right: 6, top: 6 }}>
                    <defs>
                      <linearGradient id="gHealth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gSec" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="health" name="Health" stroke="var(--chart-1)" fill="url(#gHealth)" strokeWidth={2} />
                    <Area type="monotone" dataKey="security" name="Security" stroke="var(--chart-2)" fill="url(#gSec)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="Risk distribution" description="Delivery risk across active projects.">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={82}
                      paddingAngle={3}
                      stroke="var(--background)"
                    >
                      {riskDistribution.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard
              className="lg:col-span-2"
              title="Recent projects"
              description="Latest analysis results per project."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to="/app/projects">View all</Link>
                </Button>
              }
            >
              <div className="-mx-2 overflow-x-auto px-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Health</TableHead>
                      <TableHead className="hidden md:table-cell">Security</TableHead>
                      <TableHead>Delivery risk</TableHead>
                      <TableHead className="hidden lg:table-cell">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="max-w-[220px]">
                          <Link
                            to="/app/projects/$id"
                            params={{ id: p.id }}
                            className="block truncate font-medium hover:text-primary"
                          >
                            {p.name}
                          </Link>
                          <span className="text-xs text-muted-foreground">{p.domain}</span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={p.status} />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {p.healthScore ? <ScoreBar value={p.healthScore} /> : <span className="text-xs text-muted-foreground">Pending</span>}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {p.securityScore ? <ScoreBar value={p.securityScore} /> : <span className="text-xs text-muted-foreground">Pending</span>}
                        </TableCell>
                        <TableCell>
                          <RiskBadge level={p.deliveryRisk} />
                        </TableCell>
                        <TableCell className="hidden whitespace-nowrap text-xs text-muted-foreground lg:table-cell">
                          {new Date(p.lastUpdated).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>

            <SectionCard title="Recent activity" description="Analysis runs, exports and alerts.">
              <ul className="space-y-4">
                {activityFeed.map((a) => {
                  const Icon = activityIcon[a.kind];
                  return (
                    <li key={a.id} className="flex gap-3">
                      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm leading-snug">{a.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground/70">{a.time}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </SectionCard>
          </div>
        </>
      ) : null}
    </>
  );
}
