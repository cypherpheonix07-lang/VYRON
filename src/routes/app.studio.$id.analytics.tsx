import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  Activity,
  Users,
  AlertTriangle,
  Cpu,
  Coins,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader, SectionCard, StatCard } from "@/components/brahma/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProject } from "@/lib/mock-data";

export const Route = createFileRoute("/app/studio/$id/analytics")({
  head: () => ({
    meta: [
      { title: "Live Analytics — BRAHMA AI Studio" },
      {
        name: "description",
        content: "Post-publish metrics, server latency, API costs, and user logs.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const mockTraffic = [
  { name: "Mon", visits: 84, latency: 12 },
  { name: "Tue", visits: 124, latency: 15 },
  { name: "Wed", visits: 142, latency: 14 },
  { name: "Thu", visits: 110, latency: 18 },
  { name: "Fri", visits: 168, latency: 13 },
  { name: "Sat", visits: 195, latency: 14 },
  { name: "Sun", visits: 240, latency: 15 },
];

function AnalyticsPage() {
  const { id } = Route.useParams();
  const project = getProject(id);

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="App Status"
          value="Live"
          tone="success"
          icon={ShieldCheck}
          hint="Staging environment active"
        />
        <StatCard label="Active Users" value="142" icon={Users} hint="Direct session logs" />
        <StatCard label="Avg Response Latency" value="14ms" icon={Cpu} hint="Region: ap-south-1" />
        <StatCard
          label="LLM Token Cost"
          value="$18.42"
          icon={Coins}
          hint="234k context tokens used"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Interactive Area Chart */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard
            title="Active Traffic Volume"
            description="Daily user sessions count over the past week."
          >
            <div className="h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTraffic}>
                  <defs>
                    <linearGradient id="visits-color" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
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
                    dataKey="visits"
                    stroke="var(--primary)"
                    fillOpacity={1}
                    fill="url(#visits-color)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        {/* Right: AI Optimization Recommendations */}
        <div className="space-y-4">
          <SectionCard title="AI Improvements" description="Automatic recommendations.">
            <div className="space-y-3">
              {[
                {
                  title: "Upgrade SQLite to PostgreSQL timescaledb",
                  desc: "Sensor telemetry reads are reaching write boundaries. Shifting to timescaledb will reduce latency by ~40%.",
                  gain: "+42% speed",
                },
                {
                  title: "Reduce context size window inside AI agents",
                  desc: "API metrics show high LLM token costs on simple summaries. Limiting system prompt length saves token count parameters.",
                  gain: "-18% cost",
                },
              ].map((rec) => (
                <div
                  key={rec.title}
                  className="border border-border/60 p-4 rounded-xl surface space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-semibold text-foreground leading-normal max-w-[70%]">
                      {rec.title}
                    </h4>
                    <Badge
                      className="bg-primary/10 text-primary text-[9px] border-primary/20"
                      variant="outline"
                    >
                      {rec.gain}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{rec.desc}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-0 text-[10px] text-primary hover:bg-transparent"
                  >
                    Deploy Refactor <ArrowUpRight className="ml-0.5 size-3" />
                  </Button>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* KPI Mappings */}
      <SectionCard
        title="Business Alignment Diagnostics"
        description="Check module mappings against target business outcomes."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [
              "Daily Attendance Logging",
              "Enrollment Sync",
              "Reduced classroom checkout times by 40%",
            ],
            [
              "Email Notification Alerts",
              "Parent Communication",
              "SLA delay indicators resolved within 5 mins",
            ],
            [
              "Executive PDF Summary Output",
              "Academic Reporting",
              "Saves administrators 12 hours of compilation weekly",
            ],
          ].map(([modName, process, outcome]) => (
            <div key={modName} className="border border-border/60 p-4 rounded-xl surface space-y-1">
              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">
                {process}
              </span>
              <h4 className="text-xs font-semibold text-foreground mt-0.5">{modName}</h4>
              <p className="text-xs text-[var(--success)] mt-2 font-medium flex items-center gap-1">
                <Sparkles className="size-3.5" /> {outcome}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
