import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CreditCard,
  Layers,
  Database,
  Cpu,
  Clock,
  AlertCircle,
  TrendingUp,
  Download,
  Filter,
  CheckCircle2,
  DollarSign,
  Info,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/app/billing/usage")({
  head: () => ({
    meta: [
      { title: "Compute & LLM Usage Attribution — VYRON" },
      {
        name: "description",
        content:
          "Granular resource consumption, budget reservations, and mission cost attribution.",
      },
    ],
  }),
  component: BillingUsagePage,
});

interface MissionAttribution {
  id: string;
  missionName: string;
  projectSlug: string;
  estimatedCost: number;
  meteredUsage: number;
  budgetReservation: number;
  invoicedSettlement: number;
  tokensTotal: string;
  computeHours: string;
  status: "SETTLED" | "IN_FLIGHT" | "PENDING_RECONCILIATION";
  syncLagNotice?: string;
}

const MISSIONS_BILLING: MissionAttribution[] = [
  {
    id: "m-01",
    missionName: "Zero-Trust Architecture Synthesis",
    projectSlug: "apex-enterprise-saas",
    estimatedCost: 14.5,
    meteredUsage: 12.8,
    budgetReservation: 20.0,
    invoicedSettlement: 12.8,
    tokensTotal: "1.42M tokens",
    computeHours: "4.2 hrs",
    status: "SETTLED",
  },
  {
    id: "m-02",
    missionName: "Live 12-Stage Forensics Deep Scan",
    projectSlug: "vyron-core-engine",
    estimatedCost: 8.2,
    meteredUsage: 6.45,
    budgetReservation: 10.0,
    invoicedSettlement: 6.45,
    tokensTotal: "780K tokens",
    computeHours: "2.1 hrs",
    status: "SETTLED",
  },
  {
    id: "m-03",
    missionName: "Counterfactual Failure Simulation Twin",
    projectSlug: "simulation-twin-lab",
    estimatedCost: 22.0,
    meteredUsage: 18.9,
    budgetReservation: 25.0,
    invoicedSettlement: 0.0,
    tokensTotal: "2.15M tokens",
    computeHours: "6.8 hrs",
    status: "IN_FLIGHT",
    syncLagNotice: "15m provider reconciliation delay",
  },
  {
    id: "m-04",
    missionName: "GitHub Repository AST Ingestion & Mirroring",
    projectSlug: "vcs-mirror-pipeline",
    estimatedCost: 5.0,
    meteredUsage: 3.15,
    budgetReservation: 8.0,
    invoicedSettlement: 0.0,
    tokensTotal: "340K tokens",
    computeHours: "1.0 hrs",
    status: "PENDING_RECONCILIATION",
    syncLagNotice: "Pending OpenRouter batch settlement",
  },
];

function BillingUsagePage() {
  const [filterProject, setFilterProject] = useState<string>("ALL");

  const totalEstimated = MISSIONS_BILLING.reduce((acc, m) => acc + m.estimatedCost, 0);
  const totalMetered = MISSIONS_BILLING.reduce((acc, m) => acc + m.meteredUsage, 0);
  const totalReserved = MISSIONS_BILLING.reduce((acc, m) => acc + m.budgetReservation, 0);
  const totalInvoiced = MISSIONS_BILLING.reduce((acc, m) => acc + m.invoicedSettlement, 0);

  const filtered = MISSIONS_BILLING.filter((m) =>
    filterProject === "ALL" ? true : m.projectSlug === filterProject,
  );

  return (
    <div className="space-y-6">
      {/* Delayed / Incomplete Cost Disclosure Banner (N2.11) */}
      <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Clock className="size-4 text-amber-400 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-300">
              Provider Metering Freshness &amp; Latency Notice:
            </span>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Cloud runtime and LLM gateway metrics (OpenRouter, OpenAI Direct) report with a 15-minute telemetry sync lag. Figures below distinguish provisional flight reservations from finalized invoices to avoid premature budget exhaustion.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-amber-500/40 text-amber-300 shrink-0 font-mono text-[10px]">
          SYNC LAG: ~15 MINS
        </Badge>
      </div>

      {/* 4-Bucket Financial Breakdown (N2.11) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>PRE-RUN ESTIMATES</span>
            <TrendingUp className="size-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-300">
            ${totalEstimated.toFixed(2)}
          </div>
          <p className="text-[10px] text-muted-foreground">Projected baseline cost</p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>METERED USAGE</span>
            <Cpu className="size-4 text-primary" />
          </div>
          <div className="text-2xl font-black font-mono text-primary">
            ${totalMetered.toFixed(2)}
          </div>
          <p className="text-[10px] text-muted-foreground">Real-time compute consumed</p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>BUDGET RESERVATIONS</span>
            <DollarSign className="size-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-300">
            ${totalReserved.toFixed(2)}
          </div>
          <p className="text-[10px] text-muted-foreground">Pre-authorized ceiling</p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>ACTUAL INVOICED</span>
            <CheckCircle2 className="size-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            ${totalInvoiced.toFixed(2)}
          </div>
          <p className="text-[10px] text-muted-foreground">Settled Stripe billing charges</p>
        </div>
      </div>

      {/* Attribution Table by Mission / Project */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-md">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                <span>Resource Consumption by Mission &amp; Project</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Granular attribution breakdown separating model tokens, execution runtime, and invoice settlements.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success("Exported billing attribution ledger.")}
                className="h-7 text-xs border-border/60 gap-1"
              >
                <Download className="size-3" />
                <span>Export Ledger</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="divide-y divide-border/20 rounded-xl border border-border/40 overflow-hidden">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:bg-white/[0.02] transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{item.missionName}</span>
                    <Badge variant="outline" className="font-mono text-[9px] border-border/60">
                      {item.projectSlug}
                    </Badge>
                    <Badge
                      className={`text-[9px] font-mono ${
                        item.status === "SETTLED"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : item.status === "IN_FLIGHT"
                            ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                            : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                    <span>Tokens: <strong className="text-foreground">{item.tokensTotal}</strong></span>
                    <span>Compute: <strong className="text-foreground">{item.computeHours}</strong></span>
                    {item.syncLagNotice && (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Info className="size-3" /> {item.syncLagNotice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right font-mono shrink-0">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Estimate / Metered</span>
                    <span className="text-foreground font-bold">
                      ${item.estimatedCost.toFixed(2)} / <span className="text-primary">${item.meteredUsage.toFixed(2)}</span>
                    </span>
                  </div>
                  <div className="border-l border-border/40 pl-4">
                    <span className="text-[10px] text-muted-foreground block">Invoiced Settled</span>
                    <span className="text-emerald-400 font-bold">
                      ${item.invoicedSettlement.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
