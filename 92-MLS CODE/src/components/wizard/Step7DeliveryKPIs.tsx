/**
 * PROJECT BRAHMA — STEP 7: DELIVERY KPIS, BUDGET CAP & COST FORMULA
 * Contract: { kpi_targets: {health_min:int(0,100), coverage_min:int(0,100), max_critical:int(0,50)},
 *   budget_cap_usd: number(0.5,50), milestone: date.nullable(),
 *   cadence: enum('weekly','biweekly','monthly') }
 *
 * COST FORMULA ENGINE:
 *   estimate_usd = Σ over enabled ai_tasks of:
 *     (avg_tokens[task] / 1000) × price_per_1k[task from llm_routing chain[0]]
 */

import React from "react";
import {
  DollarSign,
  Calendar,
  Clock,
  Target,
  Calculator,
  ShieldCheck,
  TrendingDown,
  Info,
} from "lucide-react";
import type { WizardPayload, DeliveryCadence } from "@/types/wizard";
import { usePricingCatalog, calculateEstimateUsd, getTaskCostBreakdown } from "@/lib/pricing";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Step7Props {
  payload: WizardPayload;
  onChange: (patch: Partial<WizardPayload>) => void;
  errors: Record<string, string>;
}

const CADENCE_OPTIONS: Array<{ id: DeliveryCadence; label: string; desc: string }> = [
  {
    id: "weekly",
    label: "Weekly Sprint",
    desc: "Release gates evaluated on weekly milestone intervals.",
  },
  { id: "biweekly", label: "Bi-Weekly", desc: "Fortnightly cadence standard for agile scrums." },
  {
    id: "monthly",
    label: "Monthly Governance",
    desc: "Comprehensive architectural health reviews per calendar month.",
  },
];

export const Step7DeliveryKPIs: React.FC<Step7Props> = ({ payload, onChange, errors }) => {
  const { data: pricingTable } = usePricingCatalog();

  // Reactive cost formula calculation
  const estimateUsd = React.useMemo(() => {
    return calculateEstimateUsd(payload.ai_tasks, pricingTable);
  }, [payload.ai_tasks, pricingTable]);

  const taskBreakdown = React.useMemo(() => {
    return getTaskCostBreakdown(payload.ai_tasks, pricingTable);
  }, [payload.ai_tasks, pricingTable]);

  const handleKpiChange = (
    field: "health_min" | "coverage_min" | "max_critical",
    rawVal: string,
  ) => {
    const val = parseInt(rawVal, 10);
    onChange({
      kpi_targets: {
        ...payload.kpi_targets,
        [field]: isNaN(val) ? 0 : val,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* 3.5 CostEstimateCard (Mono, "estimate" badge) */}
      <div className="rounded-xl border border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
              <Calculator className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  Dynamic AI Compute Cost Estimate
                </h3>
                <span className="rounded-full bg-primary/20 border border-primary/40 px-2 py-0.2 text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                  estimate
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Sourced from live <code className="text-primary font-mono">llm_routing</code> model
                tiers. Recomputes on every toggle.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-2xl font-black text-primary block">
              ${estimateUsd.toFixed(4)}{" "}
              <span className="text-xs font-sans text-muted-foreground font-normal">/ run</span>
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              Cap: ${(payload.budget_cap_usd || 15).toFixed(2)} USD
            </span>
          </div>
        </div>

        {/* Breakdown of enabled AI tasks */}
        {taskBreakdown.length > 0 ? (
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-semibold uppercase text-muted-foreground block">
              Active Task Token Breakdown:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {taskBreakdown.map((item) => (
                <div
                  key={item.task}
                  className="rounded-lg border border-border/60 bg-background/60 p-2.5 text-xs flex flex-col justify-between"
                >
                  <div className="truncate">
                    <span className="font-semibold text-foreground truncate block">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground truncate block">
                      {item.model}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono border-t border-border/30 pt-1.5">
                    <span className="text-muted-foreground">{item.avgTokens} tk</span>
                    <span className="text-primary font-bold">${item.costUsd.toFixed(4)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border/50 bg-background/40 p-3 text-xs text-muted-foreground text-center">
            Zero AI compute tasks enabled in Step 5. Estimate is $0.0000 / run.
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
          <Info className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>
            <strong>Formula:</strong> Σ (avg_tokens / 1000) × price_per_1k across{" "}
            {taskBreakdown.length} active AI worker tasks.
          </span>
        </div>
      </div>

      {/* 1. KPI Target Inputs (Mono, Range-Validated) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Quality Gate KPI Target Benchmarks</Label>
          <span className="text-xs text-muted-foreground">
            Monitored continuously by AST automated scanners
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Health Min */}
          <div className="space-y-1.5 rounded-xl border border-border/70 bg-card/40 p-3.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="health-min" className="text-xs font-semibold text-foreground">
                Min Health Score
              </Label>
              <Target className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <Input
              id="health-min"
              type="number"
              min={0}
              max={100}
              value={payload.kpi_targets.health_min}
              onChange={(e) => handleKpiChange("health_min", e.target.value)}
              className="h-9 font-mono text-sm font-bold text-emerald-400"
            />
            <p className="text-[11px] text-muted-foreground">0–100 scale (default 80)</p>
          </div>

          {/* Coverage Min */}
          <div className="space-y-1.5 rounded-xl border border-border/70 bg-card/40 p-3.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="coverage-min" className="text-xs font-semibold text-foreground">
                Min Code Coverage %
              </Label>
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <Input
              id="coverage-min"
              type="number"
              min={0}
              max={100}
              value={payload.kpi_targets.coverage_min}
              onChange={(e) => handleKpiChange("coverage_min", e.target.value)}
              className="h-9 font-mono text-sm font-bold text-cyan-400"
            />
            <p className="text-[11px] text-muted-foreground">
              Unit test coverage floor (default 75%)
            </p>
          </div>

          {/* Max Critical CVEs */}
          <div className="space-y-1.5 rounded-xl border border-border/70 bg-card/40 p-3.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-critical" className="text-xs font-semibold text-foreground">
                Max Critical Flaws Allowed
              </Label>
              <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <Input
              id="max-critical"
              type="number"
              min={0}
              max={50}
              value={payload.kpi_targets.max_critical}
              onChange={(e) => handleKpiChange("max_critical", e.target.value)}
              className="h-9 font-mono text-sm font-bold text-rose-400"
            />
            <p className="text-[11px] text-muted-foreground">Critical CVEs ceiling (default 0)</p>
          </div>
        </div>
      </div>

      {/* 2. Budget Cap Slider ($0.50–$50.00, Step 0.50, Mono) */}
      <div className="space-y-3 rounded-xl border border-border/70 bg-card/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <Label htmlFor="budget-cap-slider" className="text-sm font-semibold">
              Daily LLM & Telemetry Budget Cap (USD)
            </Label>
          </div>
          <span className="rounded bg-primary/20 border border-primary/40 px-3 py-0.5 text-sm font-mono font-bold text-primary">
            ${(payload.budget_cap_usd || 15).toFixed(2)} USD / day
          </span>
        </div>

        <input
          id="budget-cap-slider"
          type="range"
          min={0.5}
          max={50}
          step={0.5}
          value={payload.budget_cap_usd || 15}
          onChange={(e) => onChange({ budget_cap_usd: parseFloat(e.target.value) })}
          className="w-full accent-primary cursor-pointer h-2 bg-secondary rounded-lg appearance-none"
        />

        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>$0.50 (Dev PoC)</span>
          <span>$25.00 (Standard)</span>
          <span>$50.00 (High Volume Industrial)</span>
        </div>

        {errors["budget_cap_usd"] && (
          <p className="text-xs text-destructive font-medium" role="alert">
            {errors["budget_cap_usd"]}
          </p>
        )}
      </div>

      {/* 3. Milestone Calendar & Cadence Select */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Milestone Date */}
        <div className="space-y-2 rounded-xl border border-border/70 bg-card/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="milestone-date" className="text-sm font-medium">
                Initial Delivery Milestone
              </Label>
            </div>
            {payload.milestone && (
              <button
                type="button"
                onClick={() => onChange({ milestone: null })}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear
              </button>
            )}
          </div>
          <Input
            id="milestone-date"
            type="date"
            value={payload.milestone || ""}
            onChange={(e) => onChange({ milestone: e.target.value || null })}
            className="h-10 font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">Target audit gate completion deadline.</p>
        </div>

        {/* Cadence Select */}
        <div className="space-y-2 rounded-xl border border-border/70 bg-card/40 p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Quality Evaluation Cadence</Label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {CADENCE_OPTIONS.map(({ id, label }) => {
              const isSelected = payload.cadence === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChange({ cadence: id })}
                  aria-pressed={isSelected}
                  className={`rounded-lg border p-2.5 text-center text-xs font-semibold transition-all ${
                    isSelected
                      ? "border-primary bg-primary/20 text-primary ring-1 ring-primary/40"
                      : "border-border/60 bg-background/50 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {CADENCE_OPTIONS.find((c) => c.id === payload.cadence)?.desc}
          </p>
        </div>
      </div>
    </div>
  );
};
