import React, { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Sparkles,
  BarChart3,
  PieChart as PieIcon,
  Sliders,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Bot,
  Users,
  Shield,
  Layers,
  FileText,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { copilotStore } from "@/state/copilot/copilotStore";

export const Route = createFileRoute("/app/projects/$id/risk-business")({
  head: () => ({
    meta: [
      { title: "Business KPI Manager & Delivery Risk — VYRON" },
      {
        name: "description",
        content:
          "Executive KPI governance, cost/schedule variance, what-if Monte Carlo simulation, and engineering capacity allocation.",
      },
    ],
  }),
  component: BusinessKpiWorkspacePage,
});

const RESOURCE_ALLOCATION = [
  { name: "Core Engineering", value: 45, color: "#06b6d4" }, // Cyan
  { name: "Security Hardening", value: 20, color: "#f43f5e" }, // Rose
  { name: "QA & Verification", value: 15, color: "#10b981" }, // Emerald
  { name: "DevOps / Infra", value: 12, color: "#8b5cf6" }, // Violet
  { name: "Tech Debt Remediation", value: 8, color: "#f59e0b" }, // Amber
];

const HISTORICAL_TRENDS = [
  { sprint: "Sprint 1", actualCost: 32000, budgetedCost: 35000, defectDensity: 4.8, velocity: 42 },
  { sprint: "Sprint 2", actualCost: 68000, budgetedCost: 70000, defectDensity: 3.9, velocity: 48 },
  { sprint: "Sprint 3", actualCost: 104000, budgetedCost: 105000, defectDensity: 3.1, velocity: 52 },
  { sprint: "Sprint 4", actualCost: 142000, budgetedCost: 140000, defectDensity: 2.4, velocity: 56 },
  { sprint: "Sprint 5", actualCost: 178000, budgetedCost: 175000, defectDensity: 1.8, velocity: 61 },
  { sprint: "Current", actualCost: 214000, budgetedCost: 210000, defectDensity: 1.2, velocity: 64 },
];

export function BusinessKpiWorkspacePage() {
  const { id } = Route.useParams();

  // Baseline Metrics
  const [budgetBaseline] = useState(250000); // USD
  const [actualSpend, setActualSpend] = useState(214000);
  const [targetReleaseDays] = useState(90);
  const [currentElapsedDays, setCurrentElapsedDays] = useState(72);
  const [qualityIndex, setQualityIndex] = useState(94); // 0-100%
  const [teamVelocity, setTeamVelocity] = useState(64); // Story points per sprint

  // What-If Simulation State
  const [whatIfOpen, setWhatIfOpen] = useState(false);
  const [simBudgetDelta, setSimBudgetDelta] = useState(0); // +/- USD
  const [simScheduleDelta, setSimScheduleDelta] = useState(0); // +/- Days
  const [simTeamDelta, setSimTeamDelta] = useState(0); // +/- Engineers

  // Analysis status
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Derived formulas
  // Cost Performance Index (CPI) = Earned Value / Actual Cost
  const cpi = (budgetBaseline * 0.88) / actualSpend;
  // Schedule Performance Index (SPI) = Earned Value / Planned Value
  const plannedValue = (budgetBaseline / targetReleaseDays) * currentElapsedDays;
  const spi = (budgetBaseline * 0.88) / plannedValue;

  const handleRunKpiAnalysis = () => {
    setIsAnalyzing(true);
    toast.loading("Calculating CPI/SPI variances, milestone projections, and risk distribution...", {
      id: "kpi-calc",
    });

    setTimeout(() => {
      setIsAnalyzing(false);
      toast.dismiss("kpi-calc");
      toast.success("KPI Analysis completed: Cost Performance Index 1.03, Schedule Performance Index 0.98.");
    }, 600);
  };

  const handleGenerateReport = () => {
    const reportData = {
      project_id: id,
      generated_at: new Date().toISOString(),
      cpi: cpi.toFixed(3),
      spi: spi.toFixed(3),
      budget_spent: actualSpend,
      budget_total: budgetBaseline,
      quality_score: qualityIndex,
      team_velocity: teamVelocity,
      resource_allocation: RESOURCE_ALLOCATION,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kpi-analysis-report-${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("KPI Dossier successfully exported.");
  };

  const handleOptimizeResources = () => {
    toast.info("Proposed Resource Rebalancing: Shift +5% from Core to Tech Debt to accelerate Release Gate T-04.");
  };

  const handleAskAther = () => {
    copilotStore.openDrawer();
    copilotStore.sendMessage(
      "CHAT",
      `Analyze the business KPI posture for project ${id}: CPI is ${cpi.toFixed(2)}, SPI is ${spi.toFixed(2)}, budget spent is $${actualSpend.toLocaleString()} of $${budgetBaseline.toLocaleString()}. What are the top delivery risks and recommended schedule mitigations?`,
    );
  };

  // What-If simulated calculations
  const simPredictedCost = actualSpend + simBudgetDelta;
  const simPredictedDays = currentElapsedDays + (targetReleaseDays - currentElapsedDays) + simScheduleDelta;
  const simPredictedVelocity = Math.max(20, teamVelocity + simTeamDelta * 8);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-card via-[#0c1624] to-card shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Business & Executive Governance
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Project ID: {id} · Target: v2.5.0-RC1
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <TrendingUp className="size-6 text-cyan-400" />
              Business KPI Manager & Risk Ledger
            </h1>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Real-time earned value management (EVM), cost and schedule variances (CPI/SPI), team throughput metrics, and predictive scenario simulations grounded in verified delivery records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              onClick={handleRunKpiAnalysis}
              disabled={isAnalyzing}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs px-3.5 py-2 gap-2 rounded-xl shadow-lg shadow-cyan-900/30"
            >
              <Sparkles className="size-3.5 text-cyan-200" />
              Run KPI Analysis
            </Button>
            <Button
              onClick={() => setWhatIfOpen(true)}
              variant="outline"
              className="text-xs border-border/80 hover:bg-secondary/60 gap-1.5 rounded-xl"
            >
              <Sliders className="size-3.5 text-violet-400" />
              Simulate What-If
            </Button>
            <Button
              onClick={handleGenerateReport}
              variant="outline"
              className="text-xs border-border/80 hover:bg-secondary/60 gap-1.5 rounded-xl"
            >
              <Download className="size-3.5 text-emerald-400" />
              Export Dossier
            </Button>
            <Button
              onClick={handleAskAther}
              variant="ghost"
              className="text-xs gap-1.5 text-cyan-400 hover:text-cyan-300"
            >
              <Bot className="size-4" />
              Ask ATHER
            </Button>
          </div>
        </div>

        {/* 4 Core KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-border/40">
          <div className="p-3.5 rounded-xl bg-background/50 border border-border/40 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-[10px] font-mono uppercase">
              <span>Budget Burn (CPI)</span>
              <DollarSign className="size-3.5 text-cyan-400" />
            </div>
            <p className="text-xl font-bold text-foreground">
              ${actualSpend.toLocaleString()}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                / ${budgetBaseline.toLocaleString()}
              </span>
            </p>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-emerald-400 font-bold">CPI: {cpi.toFixed(2)}</span>
              <span className="text-muted-foreground">· Under budget by 3.2%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-background/50 border border-border/40 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-[10px] font-mono uppercase">
              <span>Schedule (SPI)</span>
              <Calendar className="size-3.5 text-violet-400" />
            </div>
            <p className="text-xl font-bold text-foreground">
              Day {currentElapsedDays}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                / {targetReleaseDays} days
              </span>
            </p>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-cyan-400 font-bold">SPI: {spi.toFixed(2)}</span>
              <span className="text-muted-foreground">· 18 days to candidate freeze</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-background/50 border border-border/40 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-[10px] font-mono uppercase">
              <span>Quality Index</span>
              <Shield className="size-3.5 text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-emerald-400">{qualityIndex}%</p>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span>Defect density: 1.2 / KLOC</span>
              <span>· Zero P0 CVEs</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-background/50 border border-border/40 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-[10px] font-mono uppercase">
              <span>Team Velocity</span>
              <Users className="size-3.5 text-amber-400" />
            </div>
            <p className="text-xl font-bold text-foreground">{teamVelocity} pts</p>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="text-emerald-400 font-bold">+12%</span>
              <span>momentum vs baseline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cost vs Budget Burn Trend (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-border/70 bg-card/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="size-4 text-cyan-400" />
                Historical Earned Value & Spend Trajectory
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Comparison of actual cumulative spend versus budgeted plan across consecutive sprint milestones.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">
              Currency: USD ($)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_TRENDS} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="sprint" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    fontSize: "11px",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="actualCost"
                  name="Actual Spend"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#06b6d4" }}
                />
                <Line
                  type="monotone"
                  dataKey="budgetedCost"
                  name="Budget Baseline"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Allocation Breakdown (1 col) */}
        <div className="p-5 rounded-2xl border border-border/70 bg-card/60 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <PieIcon className="size-4 text-violet-400" />
                Engineering Capacity Allocation
              </h2>
              <button
                onClick={handleOptimizeResources}
                className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
              >
                Optimize
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Work stream distribution across current sprint capacity.
            </p>

            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={RESOURCE_ALLOCATION}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    innerRadius={40}
                    paddingAngle={3}
                  >
                    {RESOURCE_ALLOCATION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs">
            {RESOURCE_ALLOCATION.map((res) => (
              <div key={res.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ backgroundColor: res.color }} />
                  <span className="text-muted-foreground">{res.name}</span>
                </div>
                <span className="font-mono font-semibold text-foreground">{res.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Identified Delivery Risks & Recommendations */}
      <div className="p-5 rounded-2xl border border-border/70 bg-card/60 space-y-3.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <AlertTriangle className="size-4 text-amber-400" />
          Active Delivery Risks & Corrective Recommendations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/[0.03] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-amber-400">RISK-DELIV-01</span>
              <Badge variant="outline" className="text-[9px] border-amber-500/40 text-amber-300">
                Medium Impact
              </Badge>
            </div>
            <h4 className="font-semibold text-foreground">
              Third-Party Acquirer Mock Certification Dependency
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Staging integration sign-off from external payment provider is currently delayed by 4 business days, risking the v2.5.0-RC1 deployment gate.
            </p>
            <p className="text-[10px] text-cyan-400 font-mono pt-1">
              Mitigation: Engage digital twin rehearsal test harness to decouple staging sign-off.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-500/[0.03] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">RECOMMENDATION-02</span>
              <Badge variant="outline" className="text-[9px] border-cyan-500/40 text-cyan-300">
                Efficiency Gain
              </Badge>
            </div>
            <h4 className="font-semibold text-foreground">
              Reallocate 5% Core Capacity to Test Coverage Automation
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Increasing automated verification pass rates from 94% to 98% will eliminate an estimated 14 hours of manual pre-release regression verification.
            </p>
            <p className="text-[10px] text-emerald-400 font-mono pt-1">
              Estimated ROI: +4% sprint velocity with zero net budget variance.
            </p>
          </div>
        </div>
      </div>

      {/* What-If Monte Carlo Simulation Dialog */}
      <Dialog open={whatIfOpen} onOpenChange={setWhatIfOpen}>
        <DialogContent className="max-w-lg bg-card border-border/80 text-foreground">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Sliders className="size-4 text-violet-400" />
              Simulate What-If Delivery Scenarios
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Adjust hypothetical budget, deadline, or engineering headcount constraints to forecast delivery impact without modifying approved baselines.
            </p>

            <div className="space-y-3 p-4 rounded-xl bg-background/50 border border-border/60">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                  <span>Additional Budget Injection ($)</span>
                  <span className="font-mono text-cyan-400">
                    {simBudgetDelta >= 0 ? `+$${simBudgetDelta.toLocaleString()}` : `-$${Math.abs(simBudgetDelta).toLocaleString()}`}
                  </span>
                </div>
                <Slider
                  min={-50000}
                  max={50000}
                  step={5000}
                  value={[simBudgetDelta]}
                  onValueChange={(val) => setSimBudgetDelta(val[0] ?? 0)}
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                  <span>Schedule Adjustment (Days)</span>
                  <span className="font-mono text-violet-400">
                    {simScheduleDelta >= 0 ? `+${simScheduleDelta} days` : `${simScheduleDelta} days`}
                  </span>
                </div>
                <Slider
                  min={-20}
                  max={30}
                  step={2}
                  value={[simScheduleDelta]}
                  onValueChange={(val) => setSimScheduleDelta(val[0] ?? 0)}
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                  <span>Team Headcount Delta</span>
                  <span className="font-mono text-emerald-400">
                    {simTeamDelta >= 0 ? `+${simTeamDelta} engineers` : `${simTeamDelta} engineers`}
                  </span>
                </div>
                <Slider
                  min={-3}
                  max={5}
                  step={1}
                  value={[simTeamDelta]}
                  onValueChange={(val) => setSimTeamDelta(val[0] ?? 0)}
                />
              </div>
            </div>

            {/* Simulation Forecast Outcomes */}
            <div className="p-3.5 rounded-xl border border-violet-500/40 bg-violet-500/[0.04] space-y-1.5">
              <p className="font-bold text-violet-300 text-[11px] uppercase tracking-wider">
                Predicted Simulation Outcome:
              </p>
              <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono text-[11px]">
                <div className="p-2 rounded bg-background/60">
                  <p className="text-muted-foreground text-[10px]">Forecast Spend</p>
                  <p className="font-bold text-foreground mt-0.5">
                    ${simPredictedCost.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 rounded bg-background/60">
                  <p className="text-muted-foreground text-[10px]">Target Days</p>
                  <p className="font-bold text-foreground mt-0.5">{simPredictedDays}d</p>
                </div>
                <div className="p-2 rounded bg-background/60">
                  <p className="text-muted-foreground text-[10px]">Velocity</p>
                  <p className="font-bold text-emerald-400 mt-0.5">{simPredictedVelocity} pts</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSimBudgetDelta(0);
                  setSimScheduleDelta(0);
                  setSimTeamDelta(0);
                }}
                className="text-xs gap-1"
              >
                <RotateCcw className="size-3" /> Reset
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setWhatIfOpen(false);
                  toast.success("Scenario simulation retained for active session comparison.");
                }}
                className="bg-violet-600 hover:bg-violet-500 text-white text-xs px-4"
              >
                Close Simulation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
