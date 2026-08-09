import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { RiskBadge, SectionCard, StatCard, StatusBadge } from "@/components/brahma/primitives";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminActivity, adminKpis, adminRiskDistribution, adminSystemHealth, analysesPerDay, projectsByDomain } from "@/lib/settings-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminKpis.map((k) => (
          <StatCard
            key={k.label}
            label={k.label}
            value={k.value}
            hint={k.hint}
            {...(typeof k.delta === "number" ? { delta: k.delta } : {})}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Analyses per day" description="Last 30 days across all workspaces.">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysesPerDay}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" interval={5} />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <RTooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="analyses" stroke="var(--primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Projects by domain" description="Where teams are applying BRAHMA.">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectsByDomain}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="domain" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" interval={0} angle={-20} height={50} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <RTooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="projects" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Risk distribution" description="Delivery risk across analyzed projects.">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={adminRiskDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {adminRiskDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <RTooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
            {adminRiskDistribution.map((r) => (
              <span key={r.name} className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ backgroundColor: r.color }} aria-hidden />
                {r.name} ({r.value})
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="System health" description="Live platform dependencies.">
          <ul className="space-y-2">
            {adminSystemHealth.map((s) => (
              <li key={s.name} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      s.status === "Operational" ? "bg-[var(--success)]" : "bg-[var(--warning)]",
                    )}
                    aria-hidden
                  />
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.detail}</p>
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Recent activity" description="Platform events across all workspaces.">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminActivity.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{a.time}</TableCell>
                  <TableCell>{a.user}</TableCell>
                  <TableCell className="font-medium">{a.action}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{a.resource}</TableCell>
                  <TableCell>
                    <RiskBadge level={a.severity} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
