import React, { useState } from "react";
import {
  Play,
  Eye,
  GitCommit,
  ShieldCheck,
  Activity,
  Layers,
  ArrowLeftRight,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useAnalysis } from "@/hooks/useAnalysis";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";

export interface ASTScanRecord {
  id: string;
  created_at: string;
  complexity_avg: number;
  security_findings_high: number;
  security_findings_med: number;
  coverage_pct: number;
  health_score: number;
  status: string;
  commit_sha: string;
}

export interface ASTScanTimelineProps {
  projectId: string;
}

export function ASTScanTimeline({ projectId }: ASTScanTimelineProps) {
  const { history, isScanning, latestResult, triggerScan } = useAnalysis(projectId);
  const [selectedScan, setSelectedScan] = useState<ASTScanRecord | null>(
    (history[history.length - 1] as unknown as ASTScanRecord) || null,
  );
  const [repoInput, setRepoInput] = useState("https://github.com/brahma/sample-core");

  const handleTrigger = () => {
    triggerScan(repoInput, projectId);
  };

  const chartData = history.map((h, i) => ({
    name: `Scan #${i + 1}`,
    date: new Date(h.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    complexity: h.complexity_avg,
    securityFindings: h.security_findings_high + h.security_findings_med,
    coverage: h.coverage_pct,
    healthScore: h.health_score,
    raw: h,
  }));

  return (
    <div className="space-y-6">
      {/* Header bar with Scan Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 surface border border-border/80 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">
              AST Scan History & Trajectory Timeline
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/30">
              Lizard & Bandit AST Engine
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Historical progression of cyclomatic complexity, code coverage, and vulnerability
            surfaces across commits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            placeholder="GitHub repository URL..."
            className="px-3 py-1.5 rounded-xl border border-border bg-card/60 text-xs text-foreground placeholder:text-muted-foreground w-64 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleTrigger}
            disabled={isScanning}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
          >
            {isScanning ? (
              <LoadingSpinner size="sm" label="Scanning..." />
            ) : (
              <Play className="size-3.5 fill-current" />
            )}
            <span>Trigger AST Scan</span>
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complexity AreaChart */}
        <div className="surface p-5 rounded-xl border border-border/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-foreground">
              Cyclomatic Complexity Over Time (Lizard)
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">Target: ≤ 15.0</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="complexity"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fill="url(#compGrad)"
                  name="Avg Complexity"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coverage LineChart */}
        <div className="surface p-5 rounded-xl border border-border/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-foreground">Test Coverage Trajectory %</h3>
            <span className="text-[10px] font-mono text-indigo-400 font-bold">Target: ≥ 70%</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} />
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
                  dataKey="coverage"
                  stroke="#818cf8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Coverage %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Score BarChart */}
        <div className="surface p-5 rounded-xl border border-border/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-foreground">
              Composite Health Score Progression
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              Latest: 94 / 100
            </span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Bar
                  dataKey="healthScore"
                  fill="#34d399"
                  radius={[4, 4, 0, 0]}
                  name="Health Score"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Security Findings LineChart */}
        <div className="surface p-5 rounded-xl border border-border/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-foreground">
              Bandit Security Findings Count
            </h3>
            <span className="text-[10px] font-mono text-rose-400 font-bold">
              Target: 0 Critical
            </span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
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
                  dataKey="securityFindings"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Total Findings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail Drawer / Selected Scan Inspect */}
      {selectedScan && (
        <div className="surface p-5 rounded-xl border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitCommit className="size-4 text-primary" />
              <h3 className="text-xs font-semibold text-foreground">
                Detailed Scan Inspector — Commit{" "}
                <span className="font-mono text-primary">#{selectedScan.commit_sha}</span>
              </h3>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {new Date(selectedScan.created_at).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-muted/20 border border-border/60">
              <span className="text-muted-foreground text-[10px] block">Complexity Avg</span>
              <span className="font-bold text-foreground">{selectedScan.complexity_avg}</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/20 border border-border/60">
              <span className="text-muted-foreground text-[10px] block">
                High Security Findings
              </span>
              <span className="font-bold text-emerald-400">
                {selectedScan.security_findings_high}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-muted/20 border border-border/60">
              <span className="text-muted-foreground text-[10px] block">Coverage</span>
              <span className="font-bold text-foreground">{selectedScan.coverage_pct}%</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/20 border border-border/60">
              <span className="text-muted-foreground text-[10px] block">Health Score</span>
              <span className="font-bold text-emerald-400">{selectedScan.health_score}/100</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
