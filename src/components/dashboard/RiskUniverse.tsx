/**
 * VYRON — INTERACTIVE RISK UNIVERSE (PHASE 05)
 * Multidimensional risk exploration across severity, impact, confidence, exposure,
 * recoverability, category, owner, and blast radius.
 * Supports Distribution (Donut), Matrix (Impact vs Severity grid), and Table views.
 * Exposes the full mitigation chain:
 * RISK → SOURCE → EVIDENCE → AFFECTED COMPONENTS → DEPENDENCIES → BLAST RADIUS → RELEASE IMPACT → MITIGATION → VALIDATION.
 * Strictly ZERO SQL. Strictly Zero Capital 'B' "Brahma" branding.
 */

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommandCenter } from "@/state/commandCenter/commandCenterStore";
import { generateVerificationHash } from "@/services/ai/cryptoUtils";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Filter,
  Layers,
  LayoutGrid,
  ListFilter,
  PieChart as PieIcon,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";

export interface RiskItem {
  id: string;
  name: string;
  category: "Security" | "Complexity" | "Reliability" | "Compliance";
  severity: "Critical" | "High" | "Medium" | "Low";
  impactScore: number; // 0 to 100
  confidence: number; // 0 to 1
  exposure: "Public" | "Internal" | "Air-gapped";
  recoverability: "Automated" | "Manual" | "High-Effort";
  source: string;
  affectedComponents: string[];
  dependencies: string[];
  blastRadius: "CRITICAL_BLAST_RADIUS" | "HIGH_BLAST_RADIUS" | "MODERATE" | "LOCALIZED";
  releaseImpact: "BLOCKING" | "WARNING" | "ADVISORY";
  mitigation: string;
  validationMethod: string;
  evidenceHash: string;
}

const RISK_DATA: RiskItem[] = [
  {
    id: "RISK-01",
    name: "SQL Injection via Dynamic Where Clause (CWE-89)",
    category: "Security",
    severity: "Critical",
    impactScore: 94,
    confidence: 0.98,
    exposure: "Public",
    recoverability: "Manual",
    source: "finledger/payment/processor.py:142",
    affectedComponents: ["srv-settlement", "srv-gateway"],
    dependencies: ["PostgreSQL 15", "GoTrue Auth"],
    blastRadius: "CRITICAL_BLAST_RADIUS",
    releaseImpact: "BLOCKING",
    mitigation: "Replace raw parameter interpolation with typed prepared statements.",
    validationMethod: "Bandit AST Security Scanner CI Suite",
    evidenceHash: generateVerificationHash("RISK-01:CWE-89:BLOCKING"),
  },
  {
    id: "RISK-02",
    name: "High Cyclomatic Complexity in Multi-Currency Settlement (CCN 34)",
    category: "Complexity",
    severity: "High",
    impactScore: 78,
    confidence: 0.95,
    exposure: "Internal",
    recoverability: "Manual",
    source: "finledger/risk/engine.py:88",
    affectedComponents: ["srv-settlement", "srv-risk"],
    dependencies: ["Redis Cluster", "FX Rate Stream"],
    blastRadius: "HIGH_BLAST_RADIUS",
    releaseImpact: "WARNING",
    mitigation: "Decompose into pipeline stages: validation, FX conversion, ledger commitment.",
    validationMethod: "Lizard AST Cyclomatic CCN Analyzer",
    evidenceHash: generateVerificationHash("RISK-02:CCN-34:WARNING"),
  },
  {
    id: "RISK-03",
    name: "Acquirer Callback Timeout During Network Latency Spikes",
    category: "Reliability",
    severity: "Medium",
    impactScore: 62,
    confidence: 0.89,
    exposure: "Public",
    recoverability: "Automated",
    source: "services/gateway/proxy.ts:114",
    affectedComponents: ["srv-gateway"],
    dependencies: ["Bank Acquirer API", "Webhook Dispatcher"],
    blastRadius: "MODERATE",
    releaseImpact: "ADVISORY",
    mitigation: "Implement Redis distributed idempotency keys with exponential backoff.",
    validationMethod: "Chaos Simulation Twin Latency Wave",
    evidenceHash: generateVerificationHash("RISK-03:TIMEOUT:ADVISORY"),
  },
  {
    id: "RISK-04",
    name: "Orphaned Idempotency Retry Requirement (FR-02)",
    category: "Compliance",
    severity: "Medium",
    impactScore: 56,
    confidence: 0.92,
    exposure: "Internal",
    recoverability: "Automated",
    source: "requirements/traceability.matrix:42",
    affectedComponents: ["req-idem-02", "srv-settlement"],
    dependencies: ["EARS Requirements Engine"],
    blastRadius: "MODERATE",
    releaseImpact: "WARNING",
    mitigation: "Tag implementing service in EARS traceability matrix and execute unit suite.",
    validationMethod: "Bidirectional Requirement Traceability Policy (POL-REQ-01)",
    evidenceHash: generateVerificationHash("RISK-04:ORPHAN:WARNING"),
  },
  {
    id: "RISK-05",
    name: "Insecure Fallback JWT Secret in Test Environment Config",
    category: "Security",
    severity: "Low",
    impactScore: 35,
    confidence: 0.99,
    exposure: "Air-gapped",
    recoverability: "Automated",
    source: "finledger/auth/token_manager.py:48",
    affectedComponents: ["srv-auth"],
    dependencies: ["GoTrue Auth Server"],
    blastRadius: "LOCALIZED",
    releaseImpact: "ADVISORY",
    mitigation: "Throw runtime exception if JWT_SECRET is omitted in environment.",
    validationMethod: "Bandit AST Hardcoded Secret Rule B106",
    evidenceHash: generateVerificationHash("RISK-05:JWT_SECRET:ADVISORY"),
  },
];

const riskDistributionData = [
  { name: "Low", value: 6, color: "var(--success)" },
  { name: "Medium", value: 4, color: "var(--warning)" },
  { name: "High", value: 2, color: "oklch(0.7 0.19 45)" },
  { name: "Critical", value: 1, color: "var(--critical)" },
];

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

export function RiskUniverse() {
  const { selectEntity } = useCommandCenter();
  const [viewMode, setViewMode] = useState<"distribution" | "matrix" | "table">("distribution");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [selectedRisk, setSelectedRisk] = useState<RiskItem>(RISK_DATA[0]!);

  const filteredRisks = useMemo(() => {
    if (categoryFilter === "ALL") return RISK_DATA;
    return RISK_DATA.filter((r) => r.category === categoryFilter);
  }, [categoryFilter]);

  const handleSelectRisk = (risk: RiskItem) => {
    setSelectedRisk(risk);
  };

  const handleInspectInDrawer = (risk: RiskItem) => {
    selectEntity({
      type: "risk",
      id: risk.id,
      name: risk.name,
      severity: risk.severity.toUpperCase() as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      category: risk.category,
      confidence: risk.confidence,
      details: `${risk.name}. Source: ${risk.source}. Mitigation: ${risk.mitigation}`,
      evidenceHash: risk.evidenceHash,
      metadata: {
        impactScore: risk.impactScore,
        exposure: risk.exposure,
        blastRadius: risk.blastRadius,
        releaseImpact: risk.releaseImpact,
        affectedComponents: risk.affectedComponents,
        mitigation: risk.mitigation,
        validationMethod: risk.validationMethod,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* HEADER CONTROLS: CATEGORIES & VIEW SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg border border-border/40 bg-zinc-950/40 text-xs">
        <div className="flex items-center gap-1">
          <Filter className="size-3 text-muted-foreground mr-1" />
          {["ALL", "Security", "Complexity", "Reliability", "Compliance"].map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
              className="h-6 px-2 text-[10px] font-mono"
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "distribution" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("distribution")}
            className="h-6 px-2 text-[10px] font-mono gap-1"
          >
            <PieIcon className="size-2.5" /> Donut
          </Button>
          <Button
            variant={viewMode === "matrix" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("matrix")}
            className="h-6 px-2 text-[10px] font-mono gap-1"
          >
            <LayoutGrid className="size-2.5" /> Matrix
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="h-6 px-2 text-[10px] font-mono gap-1"
          >
            <ListFilter className="size-2.5" /> Table
          </Button>
        </div>
      </div>

      {/* VIEW 1: DONUT DISTRIBUTION */}
      {viewMode === "distribution" && (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskDistributionData}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={82}
                paddingAngle={3}
                stroke="var(--background)"
                onClick={(entry) => {
                  const match = RISK_DATA.find(
                    (r) => r.severity.toLowerCase() === entry.name.toLowerCase(),
                  );
                  if (match) handleSelectRisk(match);
                }}
              >
                {riskDistributionData.map((d) => (
                  <Cell key={d.name} fill={d.color} className="cursor-pointer hover:opacity-80 transition-opacity" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* VIEW 2: 4x4 SEVERITY VS IMPACT MATRIX */}
      {viewMode === "matrix" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {filteredRisks.map((risk) => (
            <div
              key={risk.id}
              onClick={() => handleSelectRisk(risk)}
              className={cn(
                "p-3 rounded-lg border text-xs space-y-1.5 cursor-pointer transition-all",
                selectedRisk.id === risk.id
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border/40 bg-zinc-950/30 hover:border-border",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-muted-foreground">{risk.id}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] font-mono",
                    risk.severity === "Critical" && "text-rose-400 border-rose-500/30 bg-rose-500/10",
                    risk.severity === "High" && "text-orange-400 border-orange-500/30 bg-orange-500/10",
                    risk.severity === "Medium" && "text-amber-400 border-amber-500/30 bg-amber-500/10",
                    risk.severity === "Low" && "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                  )}
                >
                  {risk.severity}
                </Badge>
              </div>
              <div className="font-semibold text-foreground line-clamp-1">{risk.name}</div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Impact: {risk.impactScore}</span>
                <span>Blast: {risk.blastRadius.replace("_BLAST_RADIUS", "")}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: TABLE / LIST */}
      {viewMode === "table" && (
        <div className="space-y-1.5 max-h-56 overflow-y-auto">
          {filteredRisks.map((risk) => (
            <div
              key={risk.id}
              onClick={() => handleSelectRisk(risk)}
              className={cn(
                "flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors",
                selectedRisk.id === risk.id
                  ? "border-primary bg-primary/10"
                  : "border-border/30 bg-zinc-950/40 hover:bg-zinc-900/40",
              )}
            >
              <div className="min-w-0 pr-2">
                <div className="font-semibold text-foreground truncate">{risk.name}</div>
                <div className="text-[10px] text-muted-foreground font-mono">{risk.source}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="text-[9px] font-mono">
                  {risk.category}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] font-mono",
                    risk.severity === "Critical" && "text-rose-400",
                    risk.severity === "High" && "text-orange-400",
                    risk.severity === "Medium" && "text-amber-400",
                    risk.severity === "Low" && "text-emerald-400",
                  )}
                >
                  {risk.severity}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPLETE MITIGATION CHAIN: RISK → SOURCE → EVIDENCE → AFFECTED COMPONENTS → DEPENDENCIES → BLAST RADIUS → RELEASE IMPACT → MITIGATION → VALIDATION */}
      <div className="p-3.5 rounded-lg border border-primary/20 bg-zinc-950/60 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <ShieldAlert className="size-3.5 text-rose-400" /> Active Risk Chain: {selectedRisk.id}
            </span>
            <Badge variant="outline" className="text-[10px] font-mono text-rose-400 bg-rose-500/10">
              {selectedRisk.severity} ({selectedRisk.impactScore}/100)
            </Badge>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-6 px-2 text-[10px] gap-1 font-mono"
            onClick={() => handleInspectInDrawer(selectedRisk)}
          >
            <Sparkles className="size-2.5 text-primary" /> Inspect Risk in Universal Drawer
          </Button>
        </div>

        {/* HORIZONTAL SCROLLABLE CHAIN */}
        <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono p-2 rounded border border-border/30 bg-zinc-900/40 overflow-x-auto">
          <span className="text-rose-400 font-bold">RISK: {selectedRisk.id}</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-muted-foreground font-bold truncate max-w-[120px]">SOURCE: {selectedRisk.source}</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-primary font-bold">EVIDENCE: {selectedRisk.evidenceHash.slice(0, 8)}...</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-indigo-300 font-bold">COMPONENTS: {selectedRisk.affectedComponents.join(", ")}</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-amber-400 font-bold">BLAST: {selectedRisk.blastRadius}</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-orange-400 font-bold">RELEASE: {selectedRisk.releaseImpact}</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-emerald-400 font-bold truncate max-w-[140px]">MITIGATION: {selectedRisk.mitigation}</span>
        </div>
      </div>
    </div>
  );
}
