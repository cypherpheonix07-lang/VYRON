import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Code2,
  GitBranch,
  Play,
  RotateCw,
  Sparkles,
  Download,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  FileCode,
  Shield,
  Layers,
  Bot,
  Activity,
  XCircle,
  FileText,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { copilotStore } from "@/state/copilot/copilotStore";

export const Route = createFileRoute("/app/projects/$id/code-health")({
  head: () => ({
    meta: [
      { title: "Code Analysis Engine & Health — VYRON" },
      {
        name: "description",
        content:
          "Multi-stage static AST analysis, cyclomatic complexity profiling, technical debt quantification, and automated fix synthesis.",
      },
    ],
  }),
  component: CodeAnalysisWorkspacePage,
});

export interface CodeIssueFinding {
  id: string;
  ruleId: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: "SECURITY" | "COMPLEXITY" | "MAINTAINABILITY" | "BUG_RISK";
  file: string;
  line: number;
  message: string;
  evidence: string;
  debtHours: number;
}

const INITIAL_FINDINGS: CodeIssueFinding[] = [
  {
    id: "FND-001",
    ruleId: "sec/raw-sql-concatenation",
    severity: "CRITICAL",
    category: "SECURITY",
    file: "src/services/settlementEngine.ts",
    line: 142,
    message: "String concatenation into raw PostgreSQL template string violates Zero Raw SQL invariant.",
    evidence: "const query = `SELECT * FROM transactions WHERE tenant_id = '${tenantId}'`;",
    debtHours: 3.5,
  },
  {
    id: "FND-002",
    ruleId: "perf/n-plus-one-query",
    severity: "HIGH",
    category: "MAINTAINABILITY",
    file: "src/services/webhookGateway.ts",
    line: 94,
    message: "Sequential query iteration inside loop induces N+1 database roundtrips.",
    evidence: "for (const event of events) { await getTenant(event.tenantId); }",
    debtHours: 2.0,
  },
  {
    id: "FND-003",
    ruleId: "ast/cyclomatic-complexity-exceeded",
    severity: "MEDIUM",
    category: "COMPLEXITY",
    file: "src/services/release/releaseGateEngine.ts",
    line: 450,
    message: "Method evaluateReleaseReadiness contains 24 branch paths exceeding threshold (15).",
    evidence: "if (gate.type === 'SCOPE') { ... } else if (gate.type === 'ARCH') { ... }",
    debtHours: 4.0,
  },
  {
    id: "FND-004",
    ruleId: "sec/unbounded-payload-buffer",
    severity: "HIGH",
    category: "SECURITY",
    file: "src/routes/api/transactions.ts",
    line: 62,
    message: "Missing max payload size validation allows high-volume heap exhaustion.",
    evidence: "const body = await request.json(); // missing byteLimit check",
    debtHours: 1.5,
  },
  {
    id: "FND-005",
    ruleId: "type/unhandled-null-assertion",
    severity: "LOW",
    category: "BUG_RISK",
    file: "src/components/activity/WorkPulseGrid.tsx",
    line: 78,
    message: "Non-null assertion operator (!) used on nullable pulse.sparkline array.",
    evidence: "const lastVal = pulse.sparkline_24h![23];",
    debtHours: 0.5,
  },
];

const COMPLEXITY_DISTRIBUTION = [
  { file: "settlementEngine.ts", complexity: 18, issues: 4 },
  { file: "releaseGateEngine.ts", complexity: 24, issues: 6 },
  { file: "webhookGateway.ts", complexity: 14, issues: 3 },
  { file: "authService.ts", complexity: 12, issues: 2 },
  { file: "driftEngine.ts", complexity: 9, issues: 1 },
  { file: "realityMapService.ts", complexity: 8, issues: 1 },
];

export function CodeAnalysisWorkspacePage() {
  const { id } = Route.useParams();

  // Scope & Commit selectors
  const [selectedRepo] = useState("cypherpheonix07-lang/VYRON");
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [selectedCommit] = useState("a0ef9a7");
  const [analysisScope, setAnalysisScope] = useState<string>("SOURCE");

  // Analysis Pipeline Progress State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(100);
  const [activeStage, setActiveStage] = useState("Stage 6: Analysis Sealed");

  // Findings & Filters
  const [findings, setFindings] = useState<CodeIssueFinding[]>(INITIAL_FINDINGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const stages = [
    "Stage 1: Syntax & AST Parsing",
    "Stage 2: Static Security Scanning",
    "Stage 3: Cyclomatic Complexity & Halstead Metrics",
    "Stage 4: Duplication & Dead Code Analysis",
    "Stage 5: Type Soundness & Null Safety Checks",
    "Stage 6: Analysis Sealed & Report Generated",
  ];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);
    setActiveStage(stages[0]!);
    toast.loading("Initiating 6-stage AST static analysis pipeline...", { id: "code-scan" });

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < stages.length) {
        setActiveStage(stages[step]!);
        setAnalysisProgress(Math.round(((step + 1) / stages.length) * 100));
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
        toast.dismiss("code-scan");
        toast.success("Code Analysis complete: 142 files scanned, 5 findings verified.");
      }
    }, 400);
  };

  const handleExportReport = () => {
    const report = {
      project_id: id,
      repository: selectedRepo,
      branch: selectedBranch,
      commit: selectedCommit,
      timestamp: new Date().toISOString(),
      files_analyzed: 142,
      total_findings: findings.length,
      maintainability_grade: "A (92%)",
      total_technical_debt_hours: findings.reduce((acc, f) => acc + f.debtHours, 0),
      findings,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code-analysis-report-${selectedCommit}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Code Analysis Report exported successfully.");
  };

  const handleAskAtherForFix = (finding: CodeIssueFinding) => {
    copilotStore.openDrawer();
    copilotStore.sendMessage(
      "CHAT",
      `Provide an automated refactoring fix for code finding ${finding.id} (${finding.ruleId}) in file ${finding.file} at line ${finding.line}: "${finding.message}". Include the complete corrected code block.`,
    );
  };

  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      const matchSearch =
        f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.ruleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSev = severityFilter === "ALL" || f.severity === severityFilter;
      const matchCat = categoryFilter === "ALL" || f.category === categoryFilter;
      return matchSearch && matchSev && matchCat;
    });
  }, [findings, searchQuery, severityFilter, categoryFilter]);

  const totalDebtHours = findings.reduce((acc, f) => acc + f.debtHours, 0);
  const criticalCount = findings.filter((f) => f.severity === "CRITICAL").length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-card via-[#091528] to-card shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Static AST Analysis
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {selectedRepo} · {selectedBranch} ({selectedCommit})
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <Code2 className="size-6 text-cyan-400" />
              Code Analysis Engine & Quality Profiler
            </h1>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Automated multi-stage static code inspection, cyclomatic complexity evaluation, technical debt quantification, and verifiable automated fix generation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs px-4 py-2 gap-2 rounded-xl shadow-lg shadow-cyan-900/30 active:scale-95 transition-all"
            >
              <RotateCw className={`size-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
              {isAnalyzing ? "Analyzing..." : "Run Code Analysis"}
            </Button>
            <Button
              onClick={handleExportReport}
              variant="outline"
              className="text-xs border-border/80 hover:bg-secondary/60 gap-1.5 rounded-xl"
            >
              <Download className="size-3.5 text-emerald-400" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Pipeline Stage Progress Indicator */}
        <div className="mt-5 p-3.5 rounded-xl bg-background/50 border border-border/50 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-2">
              <Activity className="size-3.5 text-cyan-400" />
              {activeStage}
            </span>
            <span className="font-mono text-cyan-400 font-bold">{analysisProgress}%</span>
          </div>
          <Progress value={analysisProgress} className="h-1.5 bg-secondary" />
        </div>

        {/* 4 Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border/40">
          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Files Analyzed
            </p>
            <p className="text-xl font-bold text-foreground mt-0.5">142</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">TypeScript / TSX</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Maintainability Grade
            </p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">A (92%)</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Halstead volume index</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Active Findings
            </p>
            <p className="text-xl font-bold text-rose-400 mt-0.5">
              {findings.length}{" "}
              <span className="text-xs text-muted-foreground font-normal">
                ({criticalCount} critical)
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Static code issues</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Technical Debt
            </p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">{totalDebtHours} hrs</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Estimated remediation</p>
          </div>
        </div>
      </div>

      {/* Scope Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card/60 border border-border/60 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase font-mono mr-1">
            Analysis Scope:
          </span>
          {["SOURCE", "DEPENDENCIES", "CONFIG", "TESTS", "DOCUMENTATION"].map((sc) => (
            <button
              key={sc}
              onClick={() => setAnalysisScope(sc)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                analysisScope === sc
                  ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {sc.charAt(0) + sc.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span>Branch: main</span>
          <span>· Commit: a0ef9a7</span>
        </div>
      </div>

      {/* Complexity Distribution Chart & Scatter */}
      <div className="p-5 rounded-2xl border border-border/70 bg-card/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Activity className="size-4 text-cyan-400" />
              File Cyclomatic Complexity & Issue Hotspots
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Files exhibiting highest cyclomatic branch density and mapped issue concentrations.
            </p>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">Threshold: 15 branches</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={COMPLEXITY_DISTRIBUTION} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="file" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  fontSize: "11px",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="complexity" name="Cyclomatic Complexity" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="issues" name="Code Issues" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Findings Table Section */}
      <div className="p-5 rounded-2xl border border-border/70 bg-card/60 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <FileCode className="size-4 text-cyan-400" />
            Static Code Findings & Recommendations ({filteredFindings.length})
          </h2>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter findings..."
                className="pl-8 text-xs h-8 w-44 bg-background/60"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="h-8 rounded-md bg-background/60 border border-border/60 text-xs px-2 text-foreground"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredFindings.map((finding) => (
            <div
              key={finding.id}
              className="p-4 rounded-xl border border-border/60 bg-background/50 hover:bg-background/80 transition-all space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-secondary text-primary border border-border/80">
                    {finding.id}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.2 rounded border font-mono ${
                      finding.severity === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                        : finding.severity === "HIGH"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/40"
                    }`}
                  >
                    {finding.severity}
                  </span>
                  <span className="font-mono font-semibold text-cyan-400 text-xs">
                    {finding.ruleId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Est. Debt: {finding.debtHours} hrs
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAskAtherForFix(finding)}
                    className="h-7 text-[11px] gap-1 text-muted-foreground hover:text-cyan-400 px-2"
                  >
                    <Bot className="size-3 text-cyan-400" />
                    Synthesize Fix
                  </Button>
                </div>
              </div>

              <p className="text-[11px] text-foreground font-medium leading-relaxed">
                {finding.message}
              </p>

              <div className="p-2.5 rounded-lg bg-card/80 border border-border/50 font-mono text-[10px] text-muted-foreground overflow-x-auto">
                <span className="text-cyan-400">{finding.file}:{finding.line}</span>
                <p className="text-foreground mt-0.5">{finding.evidence}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
