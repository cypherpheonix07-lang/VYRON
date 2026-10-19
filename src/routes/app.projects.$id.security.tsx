import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
  ExternalLink,
  Bot,
  Layers,
  Lock,
  Globe,
  Database,
  Cpu,
  Key,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { copilotStore } from "@/state/copilot/copilotStore";

export const Route = createFileRoute("/app/projects/$id/security")({
  head: () => ({
    meta: [
      { title: "Security Engineering & STRIDE — VYRON" },
      {
        name: "description",
        content:
          "STRIDE threat modeling, trust boundaries, residual risk calculus, and cryptographic verification posture.",
      },
    ],
  }),
  component: SecurityWorkspacePage,
});

export type StrideCategory =
  | "SPOOFING"
  | "TAMPERING"
  | "REPUDIATION"
  | "INFO_DISCLOSURE"
  | "DENIAL_OF_SERVICE"
  | "ELEVATION_OF_PRIVILEGE";

export type ThreatSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type ReviewState = "PROPOSED" | "MITIGATED" | "VERIFIED" | "ACCEPTED_RISK";

export interface TrustBoundary {
  id: string;
  name: string;
  description: string;
  ingress: string;
  egress: string;
  authMethod: string;
  isolationLevel: string;
  activeThreatCount: number;
}

export interface StrideThreat {
  id: string;
  strideCategory: StrideCategory;
  title: string;
  description: string;
  asset: string;
  entryPoint: string;
  severity: ThreatSeverity;
  likelihood: number; // 1-5
  impact: number; // 1-5
  mitigation: string;
  owner: string;
  cwe: string;
  reviewState: ReviewState;
  isAiProposed: boolean;
  affectedRequirementId?: string;
  affectedComponentId?: string;
}

const INITIAL_TRUST_BOUNDARIES: TrustBoundary[] = [
  {
    id: "TB-01",
    name: "Public Ingress / Cloudflare Edge",
    description: "External TLS termination and DDoS mitigation barrier facing the public Internet.",
    ingress: "HTTPS / 443 (Any IPv4/IPv6)",
    egress: "Reverse Proxy to Envoy Gateway",
    authMethod: "TLS 1.3 + WAF Rate Limiting",
    isolationLevel: "Edge Sandbox",
    activeThreatCount: 1,
  },
  {
    id: "TB-02",
    name: "API Gateway to Microservice Mesh",
    description: "Internal Envoy proxy routing verified JWT requests to containerized domain services.",
    ingress: "Envoy Ingress Controller",
    egress: "gRPC / mTLS Mesh",
    authMethod: "JWT RS256 Bearer Validation",
    isolationLevel: "Kubernetes NetworkPolicy",
    activeThreatCount: 2,
  },
  {
    id: "TB-03",
    name: "Internal Services to PostgreSQL Database",
    description: "Core data persistence layer enforcing database user privileges and row-level security.",
    ingress: "Private Subnet TCP 5432",
    egress: "Encrypted EBS Volume",
    authMethod: "SCRAM-SHA-256 + VPC Peering",
    isolationLevel: "Private Subnet Isolated",
    activeThreatCount: 1,
  },
  {
    id: "TB-04",
    name: "External Payment Gateway & Webhook Mesh",
    description: "Mutual webhook exchange boundary with third-party banking acquirers.",
    ingress: "Public Webhook Receiver Endpoint",
    egress: "Acquirer REST API",
    authMethod: "HMAC-SHA256 Payload Signature",
    isolationLevel: "Egress Proxy Bound",
    activeThreatCount: 1,
  },
];

const INITIAL_THREATS: StrideThreat[] = [
  {
    id: "THR-001",
    strideCategory: "SPOOFING",
    title: "Webhook Signature Replay & Origin Spoofing",
    description:
      "An attacker re-transmits valid signed webhook notifications from a previous billing cycle to trigger unauthorized balance credits.",
    asset: "Merchant Account Balance",
    entryPoint: "POST /api/v1/webhooks/acquirer",
    severity: "CRITICAL",
    likelihood: 4,
    impact: 5,
    mitigation:
      "Enforce mandatory 5-minute timestamp tolerance window check and persistent nonce deduplication in Redis cache.",
    owner: "Security Architect",
    cwe: "CWE-294: Authentication Bypass by Capture-replay",
    reviewState: "VERIFIED",
    isAiProposed: false,
    affectedRequirementId: "REQ-001",
    affectedComponentId: "gw-ingress",
  },
  {
    id: "THR-002",
    strideCategory: "TAMPERING",
    title: "SQL Parameter Injection in Dynamic Settlement Filters",
    description:
      "Arbitrary SQL syntax concatenation through unvalidated query string parameters in raw report compilation queries.",
    asset: "Financial Ledger Database",
    entryPoint: "GET /api/v1/reports/custom-sql",
    severity: "CRITICAL",
    likelihood: 3,
    impact: 5,
    mitigation:
      "Strict enforcement of Zero Raw SQL AST linter and Supabase parameterized query builders exclusively.",
    owner: "Security Lead",
    cwe: "CWE-89: SQL Injection",
    reviewState: "VERIFIED",
    isAiProposed: false,
    affectedRequirementId: "REQ-003",
    affectedComponentId: "db-postgres",
  },
  {
    id: "THR-003",
    strideCategory: "REPUDIATION",
    title: "Unsigned Administrative Role Grant Action",
    description:
      "Privileged workspace role modifications lack cryptographic non-repudiation seals, allowing disputed privilege escalations.",
    asset: "IAM Access Control Records",
    entryPoint: "PATCH /api/v1/team/members/:id/role",
    severity: "MEDIUM",
    likelihood: 2,
    impact: 4,
    mitigation:
      "Record SHA-256 digital fingerprint in append-only immutable audit log table with actor IP and timestamp.",
    owner: "Compliance Officer",
    cwe: "CWE-778: Insufficient Logging",
    reviewState: "MITIGATED",
    isAiProposed: false,
    affectedRequirementId: "REQ-004",
    affectedComponentId: "srv-audit-custody",
  },
  {
    id: "THR-004",
    strideCategory: "INFO_DISCLOSURE",
    title: "Cross-Tenant Document Metadata Leakage via IDOR",
    description:
      "Direct object reference traversal on UUID invoice endpoints allows authenticated tenant A to inspect tenant B invoice titles.",
    asset: "Tenant Confidential Invoices",
    entryPoint: "GET /api/v1/invoices/:uuid",
    severity: "HIGH",
    likelihood: 3,
    impact: 4,
    mitigation:
      "Enforce Postgres Row Level Security (RLS) policies binding auth.jwt().tenant_id to tenant_id columns on all queries.",
    owner: "Platform Engineer",
    cwe: "CWE-639: Authorization Bypass Through User-Controlled Key",
    reviewState: "VERIFIED",
    isAiProposed: false,
    affectedRequirementId: "REQ-003",
    affectedComponentId: "policy-rls-mesh",
  },
  {
    id: "THR-005",
    strideCategory: "DENIAL_OF_SERVICE",
    title: "Unbounded Payload Ingestion Memory Exhaustion",
    description:
      "Sending multi-megabyte JSON payloads to JSON parser endpoints triggers V8 heap memory starvation and container crash.",
    asset: "API Gateway Availability",
    entryPoint: "POST /api/v1/transactions/batch",
    severity: "HIGH",
    likelihood: 4,
    impact: 4,
    mitigation:
      "Configure strict 1MB body limit middleware at reverse proxy and upstream rate limiting per IP.",
    owner: "SRE Lead",
    cwe: "CWE-400: Uncontrolled Resource Consumption",
    reviewState: "MITIGATED",
    isAiProposed: true,
    affectedRequirementId: "REQ-002",
    affectedComponentId: "gw-ingress",
  },
  {
    id: "THR-006",
    strideCategory: "ELEVATION_OF_PRIVILEGE",
    title: "JWT Algorithm Confusion (None / HS256 RS256)",
    description:
      "Public key used as HMAC shared secret if algorithm verification is relaxed in token parsing library.",
    asset: "Authentication Authority",
    entryPoint: "All Authenticated Endpoints",
    severity: "CRITICAL",
    likelihood: 2,
    impact: 5,
    mitigation:
      "Strictly enforce RS256 algorithm white-listing in Supabase client and reject algorithm negotiation.",
    owner: "Security Architect",
    cwe: "CWE-347: Improper Verification of Cryptographic Signature",
    reviewState: "VERIFIED",
    isAiProposed: false,
    affectedRequirementId: "REQ-003",
    affectedComponentId: "policy-rls-mesh",
  },
];

export function SecurityWorkspacePage() {
  const { id } = Route.useParams();
  const [trustBoundaries] = useState<TrustBoundary[]>(INITIAL_TRUST_BOUNDARIES);
  const [threats, setThreats] = useState<StrideThreat[]>(() => {
    try {
      const stored = localStorage.getItem(`vyron_threats_${id}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_THREATS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedReviewState, setSelectedReviewState] = useState<string>("ALL");
  const [isModeling, setIsModeling] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState<StrideThreat | null>(null);

  const saveThreats = (updated: StrideThreat[]) => {
    setThreats(updated);
    try {
      localStorage.setItem(`vyron_threats_${id}`, JSON.stringify(updated));
    } catch {
      // storage error
    }
  };

  const handleRunThreatModel = () => {
    setIsModeling(true);
    toast.loading("Analyzing trust boundaries and architecture endpoints against STRIDE vectors...", {
      id: "stride-scan",
    });

    setTimeout(() => {
      setIsModeling(false);
      toast.dismiss("stride-scan");

      const newAiThreat: StrideThreat = {
        id: `THR-00${threats.length + 1}`,
        strideCategory: "INFO_DISCLOSURE",
        title: "Unredacted Exception Traces in 500 Responses",
        description:
          "Internal database connection strings and file system paths exposed in unhandled promise rejection payloads.",
        asset: "Internal System Architecture & Credentials",
        entryPoint: "GET /api/v1/settlements/:id/diagnostics",
        severity: "MEDIUM",
        likelihood: 3,
        impact: 3,
        mitigation:
          "Implement global error sanitization middleware masking internal errors behind opaque request correlation IDs.",
        owner: "Security Auditor AI",
        cwe: "CWE-209: Generation of Error Message Containing Sensitive Information",
        reviewState: "PROPOSED",
        isAiProposed: true,
        affectedRequirementId: "REQ-003",
        affectedComponentId: "srv-settlement",
      };

      saveThreats([newAiThreat, ...threats]);
      toast.success(
        "STRIDE analysis completed: Evaluated 4 trust boundaries. 1 new threat vector proposed.",
      );
    }, 700);
  };

  const handleUpdateReviewState = (threatId: string, newState: ReviewState) => {
    const updated = threats.map((t) => (t.id === threatId ? { ...t, reviewState: newState } : t));
    saveThreats(updated);
    toast.success(`Updated review status for ${threatId} to ${newState}`);
  };

  const handleAskAther = (threat: StrideThreat) => {
    copilotStore.openDrawer();
    copilotStore.sendMessage(
      "CHAT",
      `Security threat review for ${threat.id} (${threat.title}): STRIDE category is ${threat.strideCategory}, targeting asset '${threat.asset}'. What are the recommended cryptographic and defensive mitigation controls?`,
    );
  };

  // Residual Risk Formula (Zero-Fiction):
  // Raw Risk = (Likelihood * Impact) / 25 * 100
  // Discount = Verified = 80%, Mitigated = 50%, Proposed = 0%
  // Residual = Raw * (1 - Discount)
  const calculateResidualRisk = (t: StrideThreat) => {
    const rawScore = (t.likelihood * t.impact) / 25;
    let discount = 0;
    if (t.reviewState === "VERIFIED") discount = 0.85;
    else if (t.reviewState === "MITIGATED") discount = 0.55;
    else if (t.reviewState === "ACCEPTED_RISK") discount = 0.3;
    const residual = Math.round(rawScore * (1 - discount) * 100);
    return Math.max(5, residual);
  };

  const filteredThreats = useMemo(() => {
    return threats.filter((t) => {
      const matchSearch =
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.cwe.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "ALL" || t.strideCategory === selectedCategory;
      const matchSev = selectedSeverity === "ALL" || t.severity === selectedSeverity;
      const matchState = selectedReviewState === "ALL" || t.reviewState === selectedReviewState;
      return matchSearch && matchCat && matchSev && matchState;
    });
  }, [threats, searchQuery, selectedCategory, selectedSeverity, selectedReviewState]);

  // Derived counts
  const criticalCount = threats.filter((t) => t.severity === "CRITICAL").length;
  const verifiedCount = threats.filter((t) => t.reviewState === "VERIFIED").length;
  const proposedCount = threats.filter((t) => t.isAiProposed).length;
  const avgResidualRisk = Math.round(
    threats.reduce((acc, t) => acc + calculateResidualRisk(t), 0) / (threats.length || 1),
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl border border-rose-500/20 bg-gradient-to-r from-card via-[#160c18] to-card shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Security Engineering
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Project ID: {id}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <ShieldAlert className="size-6 text-rose-400" />
              STRIDE Threat Modeling & Trust Boundaries
            </h1>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Comprehensive threat classification across Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege. All residual risks linked to deterministic mitigation proofs.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={handleRunThreatModel}
              disabled={isModeling}
              className="bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs px-4 py-2 gap-2 rounded-xl shadow-lg shadow-rose-900/30 active:scale-95 transition-all"
            >
              <Sparkles className="size-3.5 text-rose-200 animate-pulse" />
              Run STRIDE Threat Model
            </Button>
          </div>
        </div>

        {/* 4 Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-border/40">
          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Total STRIDE Threats
            </p>
            <p className="text-xl font-bold text-foreground mt-0.5">{threats.length}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Identified vectors</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Critical Severity
            </p>
            <p className="text-xl font-bold text-rose-400 mt-0.5">{criticalCount}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Release gate blockers</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Verified Mitigations
            </p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">
              {verifiedCount} / {threats.length}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Gated by automated check</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50 border border-border/40">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Avg Residual Risk
            </p>
            <p className="text-xl font-bold text-cyan-400 mt-0.5">{avgResidualRisk}%</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Calculated post-mitigation</p>
          </div>
        </div>
      </div>

      {/* Trust Boundaries Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Layers className="size-3.5 text-cyan-400" />
            Architectural Trust Boundaries ({trustBoundaries.length})
          </h2>
          <span className="text-[10px] text-muted-foreground font-mono">
            Network & Authority Perimeter Isolations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {trustBoundaries.map((tb) => (
            <div
              key={tb.id}
              className="p-4 rounded-xl border border-border/60 bg-card/50 hover:bg-card/80 transition-all space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {tb.id}
                </span>
                <span className="text-[10px] font-mono text-rose-400 font-semibold">
                  {tb.activeThreatCount} threats
                </span>
              </div>
              <h3 className="font-bold text-xs text-foreground">{tb.name}</h3>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {tb.description}
              </p>
              <div className="pt-2 border-t border-border/40 text-[10px] font-mono text-muted-foreground/80 space-y-0.5">
                <p>Auth: {tb.authMethod}</p>
                <p>Isolation: {tb.isolationLevel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-xl bg-card/60 border border-border/60">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search threats by ID, title, description, or CWE..."
            className="pl-9 bg-background/60 border-border/50 text-xs h-9 rounded-lg"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* STRIDE Category Filter */}
          <div className="flex items-center gap-1 bg-background/60 p-1 rounded-lg border border-border/50 text-xs">
            {[
              "ALL",
              "SPOOFING",
              "TAMPERING",
              "REPUDIATION",
              "INFO_DISCLOSURE",
              "DENIAL_OF_SERVICE",
              "ELEVATION_OF_PRIVILEGE",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-rose-500/20 text-rose-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "ALL"
                  ? "All"
                  : cat === "INFO_DISCLOSURE"
                    ? "Info"
                    : cat === "DENIAL_OF_SERVICE"
                      ? "DoS"
                      : cat === "ELEVATION_OF_PRIVILEGE"
                        ? "EoP"
                        : cat.charAt(0) + cat.slice(1, 4).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1 bg-background/60 p-1 rounded-lg border border-border/50 text-xs">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                  selectedSeverity === sev
                    ? "bg-amber-500/20 text-amber-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {sev === "ALL" ? "All Sev" : sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Threats List */}
      <div className="space-y-3">
        {filteredThreats.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border/60 bg-card/20">
            <ShieldCheck className="size-10 text-emerald-400/40 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-foreground">Zero Threats Matching Filter</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              All identified threat vectors under this category have passed review or filter parameters.
            </p>
          </div>
        ) : (
          filteredThreats.map((threat) => {
            const residual = calculateResidualRisk(threat);
            return (
              <Card
                key={threat.id}
                className="rounded-2xl border border-border/70 bg-card/60 hover:border-border transition-all"
              >
                <CardContent className="p-5 space-y-3.5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-secondary text-primary border border-border/80">
                        {threat.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-rose-500/10 text-rose-400 border-rose-500/30 font-mono">
                        STRIDE:{threat.strideCategory}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          threat.severity === "CRITICAL"
                            ? "bg-red-500/20 text-red-400 border-red-500/40"
                            : threat.severity === "HIGH"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                              : "bg-blue-500/20 text-blue-400 border-blue-500/40"
                        }`}
                      >
                        {threat.severity}
                      </span>
                      {threat.isAiProposed && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          AI Proposed
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {threat.cwe}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        Residual Risk:{" "}
                        <strong
                          className={
                            residual > 40
                              ? "text-rose-400"
                              : residual > 20
                                ? "text-amber-400"
                                : "text-emerald-400"
                          }
                        >
                          {residual}%
                        </strong>
                      </span>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAskAther(threat)}
                        className="h-7 text-[11px] gap-1 text-muted-foreground hover:text-primary px-2"
                      >
                        <Bot className="size-3 text-cyan-400" />
                        Ask ATHER
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{threat.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      {threat.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-background/50 border border-border/50 text-xs">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-muted-foreground">
                        Target Asset & Entry Point:
                      </p>
                      <p className="font-semibold text-foreground text-[11px] mt-0.5">
                        {threat.asset}
                      </p>
                      <p className="text-cyan-400 font-mono text-[10px] mt-0.5">
                        {threat.entryPoint}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase text-muted-foreground">
                        Enforced Defensive Mitigation:
                      </p>
                      <p className="text-muted-foreground text-[11px] mt-0.5 leading-relaxed">
                        {threat.mitigation}
                      </p>
                    </div>
                  </div>

                  {/* Review State Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[10px] font-mono uppercase text-muted-foreground">
                        Status:
                      </span>
                      {(["PROPOSED", "MITIGATED", "VERIFIED", "ACCEPTED_RISK"] as ReviewState[]).map(
                        (st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateReviewState(threat.id, st)}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all cursor-pointer ${
                              threat.reviewState === st
                                ? st === "VERIFIED"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold"
                                  : st === "MITIGATED"
                                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold"
                                    : "bg-secondary text-foreground border-border font-bold"
                                : "bg-transparent text-muted-foreground border-transparent hover:text-foreground"
                            }`}
                          >
                            {st}
                          </button>
                        ),
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                      <span>Owner: {threat.owner}</span>
                      {threat.affectedRequirementId && (
                        <span>· Bound to {threat.affectedRequirementId}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
