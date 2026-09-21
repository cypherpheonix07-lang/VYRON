import React, { useState } from "react";
import { DollarSign, Zap, BarChart3, Clock, AlertTriangle, ShieldAlert, Cpu } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { DEMO_LLM_USAGE } from "@/data/demoSeedData";
import { cn } from "@/lib/utils";

export function LLMSpendMonitor() {
  const [usage, setUsage] = useState(DEMO_LLM_USAGE);
  const remaining = Math.max(0, usage.daily_cap - usage.today_spend);
  const spendPct = (usage.today_spend / usage.daily_cap) * 100;
  const isWarning = spendPct >= 75 && spendPct < 100;
  const isCapReached = spendPct >= 100;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 surface border border-border/80 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">
              LLM Gateway Spend & Budget Governance
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              $2.00 Daily Budget Cap Enforced
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time telemetry on OpenRouter token usage, semantic cache efficiency, and cost
            limits.
          </p>
        </div>
      </div>

      {isWarning && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
          <AlertTriangle className="size-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <span className="font-bold">Spend Cap Warning:</span> You have consumed 75% of your
            $2.00 daily budget. Synthesis will switch to cache-first mode.
          </div>
        </div>
      )}

      {isCapReached && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-start gap-3">
          <ShieldAlert className="size-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-200">
            <span className="font-bold">Daily Cap Reached:</span> The $2.00 limit is active.
            Real-time API synthesis is paused until midnight UTC.
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface p-4 rounded-xl border border-border/80 space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-muted-foreground">
            Today's Spend
          </span>
          <div className="text-2xl font-black font-mono text-primary">
            ${usage.today_spend.toFixed(2)}
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mt-2">
            <div className="bg-primary h-full rounded-full" style={{ width: `${spendPct}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground pt-1">
            {spendPct.toFixed(0)}% of $2.00 daily budget
          </p>
        </div>

        <div className="surface p-4 rounded-xl border border-border/80 space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-muted-foreground">
            Remaining Budget
          </span>
          <div className="text-2xl font-black font-mono text-emerald-400">
            ${remaining.toFixed(2)}
          </div>
          <p className="text-[10px] text-muted-foreground">Projected exhaustion: 23:15 UTC</p>
        </div>

        <div className="surface p-4 rounded-xl border border-border/80 space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-muted-foreground">
            Semantic Cache Hit Rate
          </span>
          <div className="text-2xl font-black font-mono text-cyan-400">{usage.cache_hit_rate}%</div>
          <p className="text-[10px] text-muted-foreground">Saved ~$1.42 in API tokens today</p>
        </div>

        <div className="surface p-4 rounded-xl border border-border/80 space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-muted-foreground">
            Active Model Routing
          </span>
          <div className="text-2xl font-black font-mono text-indigo-400">GPT-4o / Claude</div>
          <p className="text-[10px] text-muted-foreground">Automatic tier downgrading active</p>
        </div>
      </div>

      {/* 30-Day Spend Chart */}
      <div className="surface p-5 rounded-xl border border-border/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">
              30-Day Daily Spend vs $2.00 Cap
            </h3>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">Rolling Usage History</span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usage.daily_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 2.5]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <ReferenceLine
                y={2.0}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                label={{ value: "Cap: $2.00", fill: "#f43f5e", fontSize: 10 }}
              />
              <Bar dataKey="spend" fill="#38bdf8" radius={[3, 3, 0, 0]} name="Daily Spend ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Breakdown + Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Breakdown */}
        <div className="surface p-5 rounded-xl border border-border/80 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="size-4 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">Per-Model Spend Breakdown</h3>
          </div>

          <div className="space-y-3">
            {usage.model_breakdown.map((m) => (
              <div
                key={m.model}
                className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-foreground">{m.model}</span>
                  <span className="font-mono text-primary font-bold">${m.spend.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>{m.requests} requests executed</span>
                  <span>{((m.spend / (usage.today_spend || 1)) * 100).toFixed(0)}% total</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Request Stream */}
        <div className="surface p-5 rounded-xl border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <h3 className="text-xs font-semibold text-foreground">Recent LLM Request Log</h3>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">Live Telemetry</span>
          </div>

          <div className="divide-y divide-border/40 rounded-xl border border-border/60 overflow-hidden bg-card/20 text-xs font-mono">
            {usage.recent_requests.map((r) => (
              <div
                key={r.id}
                className="p-3 flex items-center justify-between gap-3 hover:bg-muted/20 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{r.task}</span>
                    <span className="text-[10px] text-muted-foreground">{r.model}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">
                    {r.timestamp} • {r.tokens} tokens
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={cn(
                      "text-xs font-bold block",
                      r.cached ? "text-cyan-400" : "text-foreground",
                    )}
                  >
                    {r.cached ? "CACHED ($0.00)" : `$${r.cost.toFixed(4)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
