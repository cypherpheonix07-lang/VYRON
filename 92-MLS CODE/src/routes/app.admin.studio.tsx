import { Link, createFileRoute } from "@tanstack/react-router";
import { Activity, FolderKanban, Heart, ShieldCheck, Terminal, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SectionCard, StatCard, StatusBadge } from "@/components/brahma/primitives";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminStats, adminUsers, auditLog, systemHealth, usageTrend } from "@/lib/mock-data";

export const Route = createFileRoute("/app/admin/studio")({
  component: AdminStudioOverview,
});

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

function AdminStudioOverview() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={adminStats.users}
          icon={Users}
          hint="Registered members"
        />
        <StatCard
          label="Total projects"
          value={adminStats.projects}
          icon={FolderKanban}
          hint="Active workspaces"
        />
        <StatCard
          label="Total analyses"
          value={adminStats.analyses}
          icon={Activity}
          hint="Runs executed"
        />
        <StatCard
          label="Reports generated"
          value={adminStats.reports}
          icon={ShieldCheck}
          hint="Executive exports"
        />
      </div>

      {/* Usage Trend & System Health */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Analysis run volume"
          description="Weekly frequency of analysis and report generation runs."
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageTrend} margin={{ left: -18, right: 6, top: 6 }}>
                <defs>
                  <linearGradient id="gAnalyses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="analyses"
                  name="Analyses"
                  stroke="var(--chart-1)"
                  fill="url(#gAnalyses)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="System diagnostic health"
          description="Live status probes of critical backend services."
        >
          <ul className="space-y-4">
            {systemHealth.map((sh) => (
              <li
                key={sh.name}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/70 p-3 surface bg-card/10"
              >
                <div className="flex items-center gap-2">
                  <Heart className="size-4 text-primary shrink-0" aria-hidden />
                  <span className="text-sm font-medium">{sh.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{sh.latency}</span>
                  <StatusBadge status={sh.status} />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Users & Audit Logs */}
      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Active users"
          description="Latest accounts registered in this workspace."
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Joined</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.slice(0, 4).map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="max-w-[200px]">
                      <p className="truncate font-medium">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </TableCell>
                    <TableCell className="text-xs">{u.role}</TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                      {u.joined}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={u.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard
          title="Security audit logs"
          description="Diagnostic ledger of privileged dashboard mutations."
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actor / Action</TableHead>
                  <TableHead className="hidden sm:table-cell">Target</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLog.slice(0, 4).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="max-w-[240px]">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                        <Terminal className="size-3 shrink-0" aria-hidden />
                        <span className="truncate">{log.actor}</span>
                      </div>
                      <p className="mt-1 text-xs leading-snug">{log.action}</p>
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">
                      {log.target}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-mono text-[10px] text-muted-foreground">
                      {log.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
