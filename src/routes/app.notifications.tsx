import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  CheckCircle,
  Filter,
  ShieldAlert,
  FileCode,
  FileText,
  AlertTriangle,
  XCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  User,
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [
      { title: "System Alert — VYRON Engineering Intelligence" },
      {
        name: "description",
        content:
          "System Alert ledger with user selection, trigger rule provenance, and qualified root-cause explanations.",
      },
    ],
  }),
  component: SystemAlertPage,
});

export type AlertCategory = "All" | "Security" | "Analysis" | "Report" | "Risk" | "System";

export interface SystemAlertItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  category: "Security" | "Analysis" | "Report" | "Risk" | "System";
  unread: boolean;
  severity: "Critical" | "High" | "Medium" | "Low";
  targetUser: string;
  sourceEvent: string;
  affectedContext: string;
  triggerRule: string;
  supportingObservations: string;
  unresolvedCauseHypotheses: string;
  epistemicStatus: "PROVISIONAL_HYPOTHESIS" | "VERIFIED_DEFECT" | "TELEMETRY_TRIGGER";
}

const initialAlerts: SystemAlertItem[] = [
  {
    id: "alt-01",
    title: "Critical vulnerability detected in authentication module",
    detail: "Hardcoded JWT signing secret detected in VaultLedger auth token serializer.",
    time: "12 mins ago",
    category: "Security",
    unread: true,
    severity: "Critical",
    targetUser: "Priya Nair (Platform Admin)",
    sourceEvent: "EVT-SEC-9901 (AST Bandit Scan)",
    affectedContext: "srv-vault-ledger: /src/auth/tokenSigner.ts (Lines 42-48)",
    triggerRule: "Bandit AST Rule B105 / CWE-798 (Hardcoded Password or Key)",
    supportingObservations: "Literal bearer signature string assignment detected in committed abstract syntax tree.",
    unresolvedCauseHypotheses: "Provisional hypothesis: Developer committed test fixture secret directly to trunk branch without environment variable substitution.",
    epistemicStatus: "VERIFIED_DEFECT",
  },
  {
    id: "alt-02",
    title: "12-Stage Forensics analysis completed with 0 regressions",
    detail: "Aurora Payments Gateway health score certified at 91/100 across 12 pipeline stages.",
    time: "1 hour ago",
    category: "Analysis",
    unread: true,
    severity: "Low",
    targetUser: "Priya Nair (Platform Admin)",
    sourceEvent: "EVT-ANL-1204 (Pipeline Completion)",
    affectedContext: "project-aurora-payments: Stage 12 Delivery & Continuity",
    triggerRule: "Forensic Quality Policy POL-QG-12 (All 12 stages exit code 0)",
    supportingObservations: "Zero Lizard cyclomatic complexity violations (CCN < 10); 100% test contract assertion passes.",
    unresolvedCauseHypotheses: "Operational state confirmed: Baseline performance is stable with no unresolved architectural drift.",
    epistemicStatus: "TELEMETRY_TRIGGER",
  },
  {
    id: "alt-03",
    title: "Canonical architecture export report published",
    detail: "MediSync Customer Database Schema is archived and available in the Export Center.",
    time: "3 hours ago",
    category: "Report",
    unread: true,
    severity: "Medium",
    targetUser: "DevOps Automation (CI/CD Bot)",
    sourceEvent: "EVT-RPT-0082 (Report Archival)",
    affectedContext: "MediSync-Core / Export Center (Artifact ID: rep-medisync-2026)",
    triggerRule: "Report Generation Schedule Cron (0 12 * * *)",
    supportingObservations: "PostgREST schema introspection artifact compiled with SHA-256 seal 8f9b2d...",
    unresolvedCauseHypotheses: "Routine reporting cycle completed successfully; scheduled next run in 24 hours.",
    epistemicStatus: "TELEMETRY_TRIGGER",
  },
  {
    id: "alt-04",
    title: "Architecture clarity warning threshold breached",
    detail: "Refund flow clarity index dropped to 48%. Missing interface contract schemas detected.",
    time: "5 hours ago",
    category: "Risk",
    unread: false,
    severity: "High",
    targetUser: "DevOps Automation (CI/CD Bot)",
    sourceEvent: "EVT-RSK-4419 (EARS Requirements Linter)",
    affectedContext: "srv-settlement / API Endpoint /v1/refunds",
    triggerRule: "Clarity Minimum Threshold Policy (Threshold: >= 75%, Observed: 48%)",
    supportingObservations: "2 of 4 request fields lack typed JSON schema constraints in OpenAPI definition.",
    unresolvedCauseHypotheses: "Qualified hypothesis: Recent PR merged without updated contract definitions, causing schema drift between client and handler.",
    epistemicStatus: "PROVISIONAL_HYPOTHESIS",
  },
  {
    id: "alt-05",
    title: "System settings synchronized across cluster",
    detail: "Copilot model parameters re-routed to default workspace fallback.",
    time: "1 day ago",
    category: "System",
    unread: false,
    severity: "Low",
    targetUser: "System Service Account (Kernel Daemon)",
    sourceEvent: "EVT-SYS-0019 (Gateway Heartbeat)",
    affectedContext: "cluster-global: Model Gateway Router v2.4",
    triggerRule: "Router Keepalive & Fallback Chain Check",
    supportingObservations: "OpenRouter primary endpoint responded with HTTP 200 OK within 142ms latency budget.",
    unresolvedCauseHypotheses: "Normal operational failover check; zero user disruption observed.",
    epistemicStatus: "TELEMETRY_TRIGGER",
  },
];

const severityColors: Record<string, string> = {
  Critical: "bg-red-500/10 text-red-400 border border-red-500/20",
  High: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  Low: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
};

const epistemicBadges: Record<string, { label: string; color: string }> = {
  VERIFIED_DEFECT: {
    label: "Verified Defect",
    color: "bg-red-950/60 text-red-300 border-red-700/50",
  },
  PROVISIONAL_HYPOTHESIS: {
    label: "Provisional Hypothesis",
    color: "bg-amber-950/60 text-amber-300 border-amber-700/50",
  },
  TELEMETRY_TRIGGER: {
    label: "Telemetry Trigger",
    color: "bg-blue-950/60 text-blue-300 border-blue-700/50",
  },
};

function SystemAlertPage() {
  const [alerts, setAlerts] = useState<SystemAlertItem[]>(initialAlerts);
  const [catFilter, setCatFilter] = useState<AlertCategory>("All");
  const [userFilter, setUserFilter] = useState<string>("ALL");
  const [expandedAlerts, setExpandedAlerts] = useState<Record<string, boolean>>({
    "alt-01": true, // Default open the critical one
  });

  const unreadCount = alerts.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All system alerts marked as read");
  };

  const handleMarkRead = (id: string) => {
    setAlerts((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedAlerts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleClearAll = () => {
    setAlerts([]);
    toast.success("Cleared system alert ledger.");
  };

  // N1.02 filter categories: All, Security, Analysis, Report, Risk, and System
  const categories: AlertCategory[] = ["All", "Security", "Analysis", "Report", "Risk", "System"];

  const filtered = useMemo(() => {
    return alerts.filter((item) => {
      const matchCat = catFilter === "All" || item.category === catFilter;
      const matchUser =
        userFilter === "ALL" ||
        (userFilter === "ADMIN" && item.targetUser.includes("Priya Nair")) ||
        (userFilter === "BOT" && item.targetUser.includes("CI/CD Bot")) ||
        (userFilter === "SYSTEM" && item.targetUser.includes("System Service Account"));
      return matchCat && matchUser;
    });
  }, [alerts, catFilter, userFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Alert"
        description="Source-grounded alert explanations, trigger rule provenance, and user selection ledger."
      />

      {/* User Selection Ledger & Controls Bar (N1.02) */}
      <div className="p-3.5 bg-card/60 backdrop-blur border border-border/70 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-primary shrink-0" />
          <span className="font-semibold text-foreground">User Selection Ledger:</span>
          <div className="flex flex-wrap gap-1.5 ml-1">
            {[
              { id: "ALL", label: "All Users" },
              { id: "ADMIN", label: "Priya Nair (Admin)" },
              { id: "BOT", label: "CI/CD Bot" },
              { id: "SYSTEM", label: "Kernel Daemon" },
            ].map((usr) => (
              <Button
                key={usr.id}
                size="sm"
                variant={userFilter === usr.id ? "default" : "secondary"}
                className="h-6 text-[10px] px-2"
                onClick={() => setUserFilter(usr.id)}
              >
                {usr.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground text-xs h-7"
              onClick={handleMarkAllRead}
            >
              Mark all read ({unreadCount})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs text-[var(--critical)] hover:bg-[var(--critical)]/10"
            onClick={handleClearAll}
          >
            <Trash2 className="size-3 mr-1" /> Clear Ledger
          </Button>
        </div>
      </div>

      {/* Categories Filter Tabs (N1.02: All, Security, Analysis, Report, Risk, System) */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const count = alerts.filter((a) => cat === "All" || a.category === cat).length;
          return (
            <Button
              key={cat}
              size="sm"
              variant={catFilter === cat ? "default" : "outline"}
              className="h-8 text-xs font-medium px-3"
              onClick={() => setCatFilter(cat)}
            >
              <span>{cat}</span>
              <span className="ml-1.5 text-[10px] opacity-70">({count})</span>
            </Button>
          );
        })}
      </div>

      {/* Alert Ledger Card with Explanations (N1.03) */}
      <SectionCard
        title="System Alert Ledger"
        description="Click an alert to inspect source event, trigger rule, and qualified root-cause hypotheses."
      >
        {filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3 border border-dashed border-border rounded-xl">
            <Bell className="size-10 text-muted-foreground/30 mx-auto" />
            <h4 className="text-xs font-semibold text-foreground">No alerts in this category</h4>
            <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">
              No active alerts match category &quot;{catFilter}&quot; under the selected user ledger.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filtered.map((item) => {
              const isExpanded = !!expandedAlerts[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => handleMarkRead(item.id)}
                  className={`py-4 space-y-3 cursor-pointer first:pt-0 last:pb-0 transition-colors rounded-lg px-2 hover:bg-muted/30 ${
                    item.unread ? "opacity-100" : "opacity-85"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.unread && (
                          <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
                        )}
                        <h4
                          className={`text-xs text-foreground ${
                            item.unread ? "font-bold" : "font-semibold"
                          }`}
                        >
                          {item.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`text-[9px] px-2 py-0.5 h-4 font-mono ${
                            severityColors[item.severity]
                          }`}
                        >
                          {item.severity}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[9px] px-2 py-0.5 h-4 border font-mono ${
                            epistemicBadges[item.epistemicStatus]?.color
                          }`}
                        >
                          {epistemicBadges[item.epistemicStatus]?.label}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>

                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                        <span>{item.time}</span>
                        <span>&bull;</span>
                        <span className="text-foreground/80 font-medium">Category: {item.category}</span>
                        <span>&bull;</span>
                        <span>Target: {item.targetUser}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                        onClick={(e) => toggleExpand(item.id, e)}
                      >
                        {isExpanded ? (
                          <>
                            Less <ChevronUp className="size-3" />
                          </>
                        ) : (
                          <>
                            Explain <ChevronDown className="size-3" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* N1.03 Deep Explanation Box */}
                  {isExpanded && (
                    <div className="p-3.5 bg-muted/40 border border-border/80 rounded-lg space-y-2.5 text-xs animate-in fade-in-50 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                            Source Event
                          </span>
                          <div className="font-mono text-foreground font-medium bg-background/60 p-1.5 rounded border border-border/50 text-[11px]">
                            {item.sourceEvent}
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                            Affected Context
                          </span>
                          <div className="font-mono text-foreground font-medium bg-background/60 p-1.5 rounded border border-border/50 text-[11px]">
                            {item.affectedContext}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                          Trigger Rule (Immediate Policy / Scanner)
                        </span>
                        <div className="text-foreground bg-background/60 p-1.5 rounded border border-border/50 font-mono text-[11px]">
                          {item.triggerRule}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                          Supporting Observations (AST / Telemetry Evidence)
                        </span>
                        <div className="text-muted-foreground bg-background/60 p-1.5 rounded border border-border/50">
                          {item.supportingObservations}
                        </div>
                      </div>

                      <div className="space-y-0.5 pt-1 border-t border-border/50">
                        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="size-3" /> Qualified Root Cause Hypotheses
                        </span>
                        <p className="text-xs text-foreground/90 italic bg-amber-500/10 p-2 rounded border border-amber-500/20 leading-relaxed">
                          {item.unresolvedCauseHypotheses}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
export default SystemAlertPage;
