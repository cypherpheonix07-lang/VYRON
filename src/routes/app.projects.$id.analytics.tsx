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
  Sparkles,
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
  Bar,
  BarChart,
} from "recharts";

import { PageHeader, SectionCard, StatCard } from "@/components/brahma/primitives";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/app/projects/$id/analytics")({
  head: () => ({
    meta: [
      { title: "Project Analytics — PROJECT BRAHMA" },
      { name: "description", content: "Review latency, compute costs, and performance audits." },
    ],
  }),
  component: ProjectAnalyticsPage,
});

const mockTraffic = [
  { time: "00:00", requests: 120, latency: 180, tokens: 4200 },
  { time: "04:00", requests: 90, latency: 150, tokens: 3100 },
  { time: "08:00", requests: 240, latency: 290, tokens: 8900 },
  { time: "12:00", requests: 420, latency: 310, tokens: 14200 },
  { time: "16:00", requests: 380, latency: 280, tokens: 12800 },
  { time: "20:00", requests: 210, latency: 210, tokens: 7300 },
];

function ProjectAnalyticsPage() {
  const { id } = Route.useParams();

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Performance & Compute Analytics</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor API request traffic, query latencies, and token consumption parameters.
          </p>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="surface">
          <CardContent className="pt-4 space-y-1">
            <span className="text-[9px] uppercase font-mono tracking-widest text-muted-foreground">
              Avg API Latency
            </span>
            <p className="text-xl font-bold text-cyan-400">236ms</p>
            <p className="text-[9px] text-muted-foreground">Global edge response</p>
          </CardContent>
        </Card>

        <Card className="surface">
          <CardContent className="pt-4 space-y-1">
            <span className="text-[9px] uppercase font-mono tracking-widest text-muted-foreground">
              Total Requests (24h)
            </span>
            <p className="text-xl font-bold text-foreground">1,460 reqs</p>
            <p className="text-[9px] text-muted-foreground">Across all endpoints</p>
          </CardContent>
        </Card>

        <Card className="surface">
          <CardContent className="pt-4 space-y-1">
            <span className="text-[9px] uppercase font-mono tracking-widest text-muted-foreground">
              Token Consumption
            </span>
            <p className="text-xl font-bold text-emerald-400">50.4k tokens</p>
            <p className="text-[9px] text-muted-foreground">p95 optimization active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard
            title="Compute Load Metrics"
            description="Requests volume and matching token usage."
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTraffic} margin={{ left: -24, right: 6, top: 6 }}>
                  <defs>
                    <linearGradient id="token-color" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="time"
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
                    dataKey="tokens"
                    name="Tokens Consumed"
                    stroke="var(--primary)"
                    fillOpacity={1}
                    fill="url(#token-color)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        {/* Optimizations */}
        <div className="space-y-4">
          <SectionCard title="AI Recommendations" description="Optimization guidelines.">
            <div className="space-y-3">
              {[
                {
                  title: "Upgrade Database Indexing",
                  desc: "Add telemetry query indexes. Resolves write-heavy latency limits.",
                  gain: "+42% speed",
                },
                {
                  title: "Truncate agent prompts window",
                  desc: "API calls are processing long message context maps. saves tokens.",
                  gain: "-18% cost",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-border/60 p-3.5 rounded-xl surface flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                    <p className="text-[10px] text-muted-foreground leading-normal">{item.desc}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[9px] shrink-0 font-semibold">
                    {item.gain}
                  </Badge>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
