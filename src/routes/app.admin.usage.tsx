import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Sliders,
  DollarSign,
  HelpCircle,
  TrendingUp,
  Cpu,
  UserCheck,
  Plus,
  FileBarChart2,
  Globe,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader, SectionCard, StatCard } from "@/components/brahma/primitives";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/app/admin/usage")({
  head: () => ({
    meta: [
      { title: "Usage & Performance — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Platform workspace performance metrics, seat capacities, and member activity.",
      },
    ],
  }),
  component: AdminUsagePage,
});

const mockUsersUsage = [
  {
    id: "1",
    name: "Priya Nair",
    role: "Admin",
    projects: 9,
    analysesRun: 342,
    reportsExported: 14,
    lastActive: "Just now",
  },
  {
    id: "2",
    name: "Puli Phanindhra",
    role: "Editor",
    projects: 4,
    analysesRun: 118,
    reportsExported: 5,
    lastActive: "10m ago",
  },
  {
    id: "3",
    name: "Vishal Madhavan",
    role: "Editor",
    projects: 3,
    analysesRun: 84,
    reportsExported: 2,
    lastActive: "2h ago",
  },
  {
    id: "4",
    name: "Vishal S",
    role: "Editor",
    projects: 2,
    analysesRun: 12,
    reportsExported: 1,
    lastActive: "1d ago",
  },
];

const mockUsageTrend = [
  { day: "Mon", analyses: 42, reports: 9, publishes: 2, avgTime: 3.1 },
  { day: "Tue", analyses: 58, reports: 12, publishes: 4, avgTime: 2.8 },
  { day: "Wed", analyses: 71, reports: 15, publishes: 3, avgTime: 2.9 },
  { day: "Thu", analyses: 64, reports: 11, publishes: 5, avgTime: 3.4 },
  { day: "Fri", analyses: 88, reports: 19, publishes: 6, avgTime: 3.0 },
  { day: "Sat", analyses: 31, reports: 6, publishes: 1, avgTime: 2.5 },
  { day: "Sun", analyses: 24, reports: 4, publishes: 1, avgTime: 2.4 },
];

function AdminUsagePage() {
  const [users] = useState(mockUsersUsage);

  return (
    <div className="space-y-6">
      {/* Top statistics summary widget defined by SEATS and FEATURES */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="surface lg:col-span-2">
          <CardContent className="pt-4 space-y-3">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              Platform Seat Allocation
            </span>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold">4 of 10 Seats Occupied</p>
              <span className="text-xs font-semibold text-primary">40% capacity</span>
            </div>
            {/* Progress Bar */}
            <div
              className="h-2 w-full rounded-full bg-secondary/80 overflow-hidden"
              role="progressbar"
              aria-valuenow={40}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: "40%" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="surface">
          <CardContent className="pt-4 space-y-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              Total Analyses Run
            </span>
            <p className="text-2xl font-bold">556 runs</p>
            <p className="text-[10px] text-muted-foreground">All active projects</p>
          </CardContent>
        </Card>

        <Card className="surface">
          <CardContent className="pt-4 space-y-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
              Average Analysis Latency
            </span>
            <p className="text-2xl font-bold text-emerald-400">2.9s</p>
            <p className="text-[10px] text-muted-foreground">p95 pipeline latency</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Analyses trend line chart */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard
            title="Performance Trends"
            description="Workspace execution speed and project workload."
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockUsageTrend} margin={{ left: -24, right: 6, top: 6 }}>
                  <defs>
                    <linearGradient id="runs-color" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="currentColor"
                    className="text-[10px] text-muted-foreground opacity-50"
                  />
                  <YAxis
                    stroke="currentColor"
                    className="text-[10px] text-muted-foreground opacity-50"
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10, 10, 18, 0.95)",
                      borderColor: "rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      fontSize: "11px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="analyses"
                    name="Analyses Run"
                    stroke="var(--primary)"
                    fillOpacity={1}
                    fill="url(#runs-color)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        {/* Right Column: Plans list cards defined by SEATS and FEATURES */}
        <div className="space-y-4">
          <SectionCard
            title="Active Plan Summary"
            description="Seat capacity constraints per tier."
          >
            <div className="space-y-3">
              {[
                ["Student Free", "1 active account", "2 seats cap", "Standard AI engine"],
                ["Startup MVP", "2 active accounts", "5 seats cap", "Enterprise code audits"],
                ["Admin Pro", "1 active account", "Unlimited seats", "Dedicated regional proxies"],
              ].map(([name, active, seats, feature]) => (
                <div
                  key={name}
                  className="border border-border/60 p-3.5 rounded-xl surface flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">{name}</h4>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{seats}</p>
                    <p className="text-[8px] text-primary/80 tracking-wide font-medium mt-1 uppercase">
                      {feature}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[9px]">
                    {active}
                  </Badge>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* User activity & performance ledger */}
      <SectionCard
        title="Member Activity & Outputs"
        description="Verify project counts, analyses requested, and reports compiled per user."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Profile</TableHead>
              <TableHead>Workspace Role</TableHead>
              <TableHead>Assigned Projects</TableHead>
              <TableHead>Analyses Run</TableHead>
              <TableHead>Reports Exported</TableHead>
              <TableHead>Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="text-xs font-semibold">{u.name}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[9px] font-mono">
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground tabular-nums">
                  {u.projects}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">
                  {u.analysesRun}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">
                  {u.reportsExported}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{u.lastActive}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
