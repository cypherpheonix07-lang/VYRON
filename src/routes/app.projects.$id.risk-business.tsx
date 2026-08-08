import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { ScoreGauge, SectionCard, StatCard } from "@/components/brahma/primitives";
import { businessRecommendations, impactMatrix, riskBusiness } from "@/lib/mock-data";

export const Route = createFileRoute("/app/projects/$id/risk-business")({
  head: () => ({
    meta: [
      { title: "Risk and business impact — PROJECT BRAHMA" },
      { name: "description", content: "Delivery risk, technical debt and release readiness mapped to business KPIs." },
      { property: "og:title", content: "Risk and business impact — PROJECT BRAHMA" },
      { property: "og:description", content: "Technical issues ranked by business impact." },
    ],
  }),
  component: RiskBusinessTab,
});

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

function RiskBusinessTab() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <SectionCard title="Delivery risk" description="Probability of missing the committed date.">
          <div className="flex justify-center"><ScoreGauge value={riskBusiness.deliveryRisk} size={120} sublabel="risk" /></div>
        </SectionCard>
        <SectionCard title="Technical debt" description="Weighted remediation effort.">
          <div className="flex justify-center"><ScoreGauge value={riskBusiness.technicalDebt} size={120} sublabel="debt" /></div>
        </SectionCard>
        <SectionCard title="Release readiness" description="Composite of quality, coverage and security.">
          <div className="flex justify-center"><ScoreGauge value={riskBusiness.releaseReadiness} size={120} sublabel="ready" /></div>
        </SectionCard>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {riskBusiness.kpis.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} hint={k.note} tone={k.tone} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Business impact matrix" description="Technical risk against business impact per module.">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: -14, right: 10, top: 10, bottom: 6 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis type="number" dataKey="technical" name="Technical risk" domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis type="number" dataKey="business" name="Business impact" domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={11} />
                <ZAxis type="number" dataKey="issues" range={[80, 320]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [value, name]} />
                <Scatter data={impactMatrix} fill="var(--chart-1)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Technical issues vs business impact" description="Modules ordered by business weight.">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactMatrix} margin={{ left: -18, right: 6, top: 6 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="module" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-12} height={44} textAnchor="end" />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="issues" name="Open issues" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="business" name="Business impact" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Prioritized recommendations" description="Ordered by business value recovered per engineering hour.">
        <ol className="space-y-3">
          {businessRecommendations.map((r, i) => (
            <li key={r} className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>
                <span className="font-medium">{i + 1}.</span> {r}
              </span>
            </li>
          ))}
        </ol>
      </SectionCard>
    </>
  );
}
