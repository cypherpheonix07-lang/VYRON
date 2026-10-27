import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Calculator,
  Shield,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Code2,
  Database,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Sliders,
  ExternalLink,
  ChevronRight,
  Info,
  Terminal,
  Cpu,
  BookOpen,
  Key,
  Flame,
  Scale,
  Download,
  Copy,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// 1. ScorePopover & FormulaCard
export function ScorePopover({
  scoreName,
  scoreValue,
  formula,
  factors,
}: {
  scoreName: string;
  scoreValue: number;
  formula: string;
  factors: {
    name: string;
    weight: string;
    contribution: number;
    status: "good" | "fair" | "warning";
  }[];
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          aria-label={`How is ${scoreName} calculated?`}
        >
          <HelpCircle className="size-3" />
          <span>How is this calculated?</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 space-y-3 text-xs z-50 bg-popover/95 backdrop-blur-md border-border/80 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Calculator className="size-3.5 text-primary" />
            <span>{scoreName} Formula</span>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-mono">
            {scoreValue}/100
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Formula
          </p>
          <code className="block p-2 rounded bg-muted/60 text-primary font-mono text-[11px] border border-border/40">
            {formula}
          </code>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Factor Contributions
          </p>
          {factors.map((f) => (
            <div key={f.name} className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-foreground">
                  {f.name} ({f.weight})
                </span>
                <span className="font-mono text-muted-foreground">{f.contribution}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    f.status === "good"
                      ? "bg-[var(--success)]"
                      : f.status === "fair"
                        ? "bg-[var(--warning)]"
                        : "bg-[var(--critical)]"
                  }`}
                  style={{ width: `${f.contribution}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// 2. TraceabilityMatrix
export function TraceabilityMatrix() {
  const matrix = [
    {
      req: "REQ-01: Token Auth",
      comp: "AuthService",
      code: "authService.ts",
      test: "test_auth_jwt",
      kpi: "Security: 98",
      status: "linked",
    },
    {
      req: "REQ-02: Rate Limiting",
      comp: "RateLimiter",
      code: "rate-limiter.ts",
      test: "test_5_failures",
      kpi: "Reliability: 94",
      status: "linked",
    },
    {
      req: "REQ-03: Realtime Push",
      comp: "RealtimeRelay",
      code: "realtime.ts",
      test: "test_broadcast",
      kpi: "Latency: 88",
      status: "partial",
    },
    {
      req: "REQ-04: PDF Exporter",
      comp: "ExportCenter",
      code: "exports.tsx",
      test: "Pending test suite",
      kpi: "Usability: 91",
      status: "missing",
    },
  ];

  return (
    <Card className="surface">
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Layers className="size-4 text-primary" /> Traceability Matrix
        </CardTitle>
        <CardDescription className="text-xs">
          End-to-end requirement mapping from SRS to code, tests, and target KPIs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground text-left">
                <th className="py-2 px-3">Requirement</th>
                <th className="py-2 px-3">Component</th>
                <th className="py-2 px-3">Code Artifact</th>
                <th className="py-2 px-3">Automated Test</th>
                <th className="py-2 px-3">Target KPI</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              {matrix.map((row) => (
                <tr key={row.req} className="hover:bg-muted/30">
                  <td className="py-2 px-3 font-medium text-foreground">{row.req}</td>
                  <td className="py-2 px-3 text-muted-foreground">{row.comp}</td>
                  <td className="py-2 px-3 text-primary underline cursor-pointer">{row.code}</td>
                  <td className="py-2 px-3 text-muted-foreground">{row.test}</td>
                  <td className="py-2 px-3 text-foreground">{row.kpi}</td>
                  <td className="py-2 px-3">
                    <Badge
                      className={
                        row.status === "linked"
                          ? "bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30 text-[10px]"
                          : row.status === "partial"
                            ? "bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/30 text-[10px]"
                            : "bg-[var(--critical)]/15 text-[var(--critical)] border-[var(--critical)]/30 text-[10px]"
                      }
                    >
                      {row.status.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// 3. EvaluationStudio
export function EvaluationStudio() {
  const [rubricScore, setRubricScore] = useState({
    completeness: 5,
    correctness: 4,
    maintainability: 5,
    documentation: 4,
  });

  const totalScore =
    ((rubricScore.completeness +
      rubricScore.correctness +
      rubricScore.maintainability +
      rubricScore.documentation) /
      20) *
    100;

  return (
    <Card className="surface">
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Scale className="size-4 text-primary" /> Evaluation & Reviewer Studio
        </CardTitle>
        <CardDescription className="text-xs">
          Academic reviewer rubric assessment and comparative baseline evaluation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">
              Completeness (5pt)
            </p>
            <p className="text-xl font-bold text-foreground mt-1">{rubricScore.completeness}/5</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">
              Correctness (5pt)
            </p>
            <p className="text-xl font-bold text-foreground mt-1">{rubricScore.correctness}/5</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">
              Maintainability (5pt)
            </p>
            <p className="text-xl font-bold text-foreground mt-1">
              {rubricScore.maintainability}/5
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">
              Overall Aggregate
            </p>
            <p className="text-xl font-bold text-primary mt-1">{totalScore}%</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => toast.success("Evaluation exported as LaTeX table artifact.")}
          >
            <Download className="size-3.5 mr-1" /> Export LaTeX Table
          </Button>
          <Button
            size="sm"
            className="text-xs"
            onClick={() => toast.success("Reviewer rubric sign-off recorded.")}
          >
            <CheckCircle2 className="size-3.5 mr-1" /> Submit Official Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// 4. ChaosDrillPanel
export function ChaosDrillPanel() {
  const [drills, setDrills] = useState({
    providerOutage: false,
    forgedWebhook: false,
    dbLatency: false,
    realtimeDisconnect: false,
  });

  const toggleDrill = (key: keyof typeof drills) => {
    setDrills((d) => {
      const next = { ...d, [key]: !d[key] };
      toast.info(`Chaos drill '${key}' set to ${next[key] ? "ACTIVE" : "STANDBY"}.`);
      return next;
    });
  };

  return (
    <Card className="surface border-[var(--warning)]/30">
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--warning)]">
          <Flame className="size-4" /> Admin Chaos Drill & Resilience Lab
        </CardTitle>
        <CardDescription className="text-xs">
          Simulate operational faults, network degradation, and security anomalies in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(drills).map(([key, val]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/30"
            >
              <div>
                <p className="text-xs font-semibold text-foreground capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {val ? "Simulation running" : "Normal operation"}
                </p>
              </div>
              <Button
                size="sm"
                variant={val ? "destructive" : "outline"}
                className="text-xs h-7"
                onClick={() => toggleDrill(key as keyof typeof drills)}
              >
                {val ? "Halt Drill" : "Trigger"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 5. LocaleSwitcher
export function LocaleSwitcher() {
  const [locale, setLocale] = useState("en");

  const changeLocale = (loc: string) => {
    setLocale(loc);
    localStorage.setItem("brahma.locale", loc);
    toast.success(
      `Language set to ${loc === "hi" ? "Hindi (हिंदी)" : loc === "ta" ? "Tamil (தமிழ்)" : "English"}`,
    );
  };

  return (
    <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/60">
      <Globe className="size-3.5 ml-1.5 text-muted-foreground" />
      <button
        onClick={() => changeLocale("en")}
        className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${locale === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        EN
      </button>
      <button
        onClick={() => changeLocale("hi")}
        className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${locale === "hi" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        HI
      </button>
      <button
        onClick={() => changeLocale("ta")}
        className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${locale === "ta" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        TA
      </button>
    </div>
  );
}
