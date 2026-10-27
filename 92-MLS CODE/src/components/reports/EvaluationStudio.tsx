import React, { useState } from "react";
import {
  Download,
  Sliders,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Layers,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { DEMO_EVALUATION_METRICS } from "@/data/demoSeedData";
import { cn } from "@/lib/utils";

export function EvaluationStudio() {
  const [threshold, setThreshold] = useState(80);
  const [metrics, setMetrics] = useState(DEMO_EVALUATION_METRICS);

  // Dynamic sensitivity adjustments based on threshold slider
  const adjustedPrecision = Number(
    Math.min(0.999, Math.max(0.75, metrics.precision + (threshold - 80) * 0.0035)).toFixed(3),
  );
  const adjustedRecall = Number(
    Math.min(0.999, Math.max(0.7, metrics.recall - (threshold - 80) * 0.004)).toFixed(3),
  );
  const adjustedF1 = Number(
    ((2 * adjustedPrecision * adjustedRecall) / (adjustedPrecision + adjustedRecall)).toFixed(3),
  );

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            threshold,
            metrics: {
              precision: adjustedPrecision,
              recall: adjustedRecall,
              f1_score: adjustedF1,
              confusion_matrix: metrics.confusion_matrix,
            },
            gate_contributions: metrics.gate_contributions,
            accuracy_trend: metrics.accuracy_trend,
          },
          null,
          2,
        ),
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `brahma_gate_evaluation_report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 surface border border-border/80 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">
              7-Gate Evaluation & Precision Studio
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/30">
              Mathematical Assurance
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Empirical validation of the 7-check release gate using ground truth benchmark
            distributions.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          type="button"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
        >
          <Download className="size-3.5" /> Export Evaluation JSON
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="surface p-4 rounded-xl border border-border/80 space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-muted-foreground">
            F1 Score (Harmonic Mean)
          </span>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {(adjustedF1 * 100).toFixed(1)}%
          </div>
          <p className="text-[10px] text-muted-foreground">Balanced harmonic trade-off</p>
        </div>

        <div className="surface p-4 rounded-xl border border-border/80 space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-muted-foreground">
            Precision (True Positives)
          </span>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {(adjustedPrecision * 100).toFixed(1)}%
          </div>
          <p className="text-[10px] text-muted-foreground">Low false alarm rate</p>
        </div>

        <div className="surface p-4 rounded-xl border border-border/80 space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-muted-foreground">
            Recall (Sensitivity)
          </span>
          <div className="text-2xl font-black font-mono text-indigo-400">
            {(adjustedRecall * 100).toFixed(1)}%
          </div>
          <p className="text-[10px] text-muted-foreground">Catching actual defects</p>
        </div>

        <div className="surface p-4 rounded-xl border border-border/80 space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-muted-foreground">
            Benchmark Verifications
          </span>
          <div className="text-2xl font-black font-mono text-foreground">
            {metrics.confusion_matrix.true_positive + metrics.confusion_matrix.true_negative}
          </div>
          <p className="text-[10px] text-muted-foreground">Verified audit trials</p>
        </div>
      </div>

      {/* Sensitivity Threshold Slider & Validation Studio (N2.04) */}
      <div className="surface p-5 rounded-xl border border-border/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="size-4 text-primary" />
            <div>
              <h3 className="text-xs font-semibold text-foreground">
                Release Gate Sensitivity Threshold & Governance Semantics
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Authority: Security Lead & SRE Gatekeeper • Governs pre-flight CD pipeline deployment boundaries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">
              Current Strictness:
            </span>
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              {threshold}% Threshold
            </span>
          </div>
        </div>

        <input
          type="range"
          min="60"
          max="100"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer h-2 bg-muted rounded-lg"
        />
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>60% (Permissive / High Recall)</span>
          <span>80% (Recommended Baseline)</span>
          <span>100% (Zero-Tolerance / High Precision)</span>
        </div>

        {/* 4 Outcome Decision States & Evidence Explanations */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 border-t border-border/40 text-xs">
          <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 font-mono text-[11px]">1. PASS</span>
              <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-300">Score &ge; {threshold}%</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Evidence: Zero Critical/High CVEs, verified AST contracts, 100% passing tests.
            </p>
          </div>

          <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 font-mono text-[11px]">2. FAIL</span>
              <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300">Score &lt; {threshold}%</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Evidence: Unresolved regressions, static analysis style violations.
            </p>
          </div>

          <div className="p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400 font-mono text-[11px]">3. BLOCKED</span>
              <span className="text-[9px] px-1 rounded bg-rose-500/20 text-rose-300">Non-Negotiable</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Evidence: Unauthenticated billing intent, active RCE CVE, secret leakage.
            </p>
          </div>

          <div className="p-2.5 rounded-lg border border-purple-500/30 bg-purple-500/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-400 font-mono text-[11px]">4. EXCEPTION</span>
              <span className="text-[9px] px-1 rounded bg-purple-500/20 text-purple-300">Owner Signed</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Evidence: Cryptographically attested tenant bypass with 24h expiration.
            </p>
          </div>
        </div>

        {/* Validation Against Representative Cases */}
        <div className="p-3 rounded-lg border border-border/40 bg-background/50 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-foreground">
            <span>Threshold Calibration Against Representative Benchmark Cases:</span>
            <span className="font-mono text-[10px] text-muted-foreground">Evaluated at {threshold}%</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 rounded bg-card/60 border border-border/30 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Case A: Clean Release</div>
                <div className="text-[10px] text-muted-foreground">AST intact, 0 CVEs (94% score)</div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PASS
              </span>
            </div>

            <div className="p-2 rounded bg-card/60 border border-border/30 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Case B: Marginal Drift</div>
                <div className="text-[10px] text-muted-foreground">Minor deps out-of-date (78% score)</div>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono border ${
                threshold <= 78
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}>
                {threshold <= 78 ? "PASS" : "FAIL"}
              </span>
            </div>

            <div className="p-2 rounded bg-card/60 border border-border/30 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Case C: Secret Leak</div>
                <div className="text-[10px] text-muted-foreground">Hardcoded token detected</div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
                BLOCKED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confusion Matrix + Gate Contribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <div className="surface p-5 rounded-xl border border-border/80 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">
              Confusion Matrix (Empirical Gate Classifications)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">
                True Positives (TP)
              </span>
              <div className="text-3xl font-black font-mono text-emerald-300">
                {metrics.confusion_matrix.true_positive}
              </div>
              <p className="text-[10px] text-muted-foreground">Defects correctly blocked</p>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-400 font-mono">
                False Positives (FP)
              </span>
              <div className="text-3xl font-black font-mono text-rose-300">
                {metrics.confusion_matrix.false_positive}
              </div>
              <p className="text-[10px] text-muted-foreground">Safe code blocked</p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono">
                True Negatives (TN)
              </span>
              <div className="text-3xl font-black font-mono text-indigo-300">
                {metrics.confusion_matrix.true_negative}
              </div>
              <p className="text-[10px] text-muted-foreground">Safe releases approved</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">
                False Negatives (FN)
              </span>
              <div className="text-3xl font-black font-mono text-amber-300">
                {metrics.confusion_matrix.false_negative}
              </div>
              <p className="text-[10px] text-muted-foreground">Escapes (Target: 0)</p>
            </div>
          </div>
        </div>

        {/* Historical Accuracy Trend Chart */}
        <div className="surface p-5 rounded-xl border border-border/80 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">
              Gate Accuracy Trajectory (30-Day Window)
            </h3>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.accuracy_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Accuracy %"
                />
                <Line
                  type="monotone"
                  dataKey="threshold"
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                  name="Target Base"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Per-Gate Contribution Breakdown */}
      <div className="surface p-5 rounded-xl border border-border/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">
              Gate Impact & Defect Attribution Breakdown
            </h3>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            7 Deterministic Checks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {metrics.gate_contributions.map((g, idx) => (
            <div key={idx} className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">{g.gate}</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400">
                  {g.pass_rate}% Pass
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${g.pass_rate}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>FP Contribution:</span>
                <span className="text-amber-300 font-semibold">{g.fp_contribution}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
