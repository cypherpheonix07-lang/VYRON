import { createFileRoute } from "@tanstack/react-router";
import {
  Terminal,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Shield,
  ShieldCheck,
  AlertTriangle,
  GitBranch,
  Lock,
  RotateCcw,
  CheckCircle2,
  Info,
} from "lucide-react";
import React, { useState, Fragment } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/app/admin/audit")({
  head: () => ({
    meta: [
      { title: "Audit Trail Ledger — VYRON Governance" },
      {
        name: "description",
        content:
          "Immutable platform audit log tracking actors, operations, targets, revisions, authorization context, and correction actions.",
      },
    ],
  }),
  component: AdminAuditPage,
});

export interface GovernanceAuditEntry {
  id: string;
  actor: string;
  actorRole: string;
  operation: "CREATE_BLUEPRINT" | "SECURITY_SCAN" | "MUTATE_CONFIG" | "CREATE_API_KEY" | "REVERT_REVISION";
  target: string;
  revision: string;
  time: string;
  authorizationContext: string;
  observedOutcome: "SUCCESS" | "BLOCKED_BY_POLICY" | "EXCEPTION_OVERRIDE" | "REMEDIATED";
  correctionInfo: string;
  visibilityRestriction: "RESTRICTED_AUDITOR" | "CONFIDENTIAL_SECURITY" | "TENANT_MEMBER";
  rawPayload: string;
}

const GOVERNANCE_AUDIT_LOGS: GovernanceAuditEntry[] = [
  {
    id: "aud-01",
    actor: "Priya Nair",
    actorRole: "Admin / Security Lead",
    operation: "CREATE_BLUEPRINT",
    target: "Smart Campus Portal",
    revision: "rev_39f01a",
    time: "2026-10-03 16:32:00 UTC",
    authorizationContext: "Scope: project:write • Auth: SSO (Okta MFA)",
    observedOutcome: "SUCCESS",
    correctionInfo: "None required (Pre-flight validation cleared)",
    visibilityRestriction: "RESTRICTED_AUDITOR",
    rawPayload: JSON.stringify({
      actor: "Priya Nair",
      action: "Generated software blueprint",
      target: "Smart Campus Portal",
      ip: "192.168.1.142",
      clarity_score: 92,
      risk_exposure: "low",
      modules: ["auth", "database", "analytics"]
    }, null, 2),
  },
  {
    id: "aud-02",
    actor: "Kernel Daemon / CI/CD Bot",
    actorRole: "System Service Account",
    operation: "SECURITY_SCAN",
    target: "server/routes/api.py",
    revision: "rev_815140",
    time: "2026-10-03 15:45:12 UTC",
    authorizationContext: "Scope: ci:security_scan • Auth: GitHub App Token",
    observedOutcome: "REMEDIATED",
    correctionInfo: "Auto-remediated SQLi parameter interpolation in PR #42",
    visibilityRestriction: "CONFIDENTIAL_SECURITY",
    rawPayload: JSON.stringify({
      actor: "CI/CD Bot",
      action: "Security scan cleared",
      target: "server/routes/api.py",
      cve_tested: ["CWE-89 SQLi"],
      remediation_applied: "Parameterized ORM call verified",
      code_health: 100
    }, null, 2),
  },
  {
    id: "aud-03",
    actor: "Puli Phanindra",
    actorRole: "Platform Architect",
    operation: "MUTATE_CONFIG",
    target: "src/routes/login.tsx",
    revision: "rev_01b44c",
    time: "2026-10-03 14:20:00 UTC",
    authorizationContext: "Scope: repo:admin • Auth: Hardware YubiKey FIDO2",
    observedOutcome: "SUCCESS",
    correctionInfo: "Manual code review signed with GPG key ID 0x82A10F",
    visibilityRestriction: "TENANT_MEMBER",
    rawPayload: JSON.stringify({
      actor: "Puli Phanindra",
      action: "Modified workspace files",
      target: "src/routes/login.tsx",
      lines_added: 12,
      lines_removed: 1,
      policy_audit: "Zero Raw SQL Mandate Enforced"
    }, null, 2),
  },
  {
    id: "aud-04",
    actor: "Priya Nair",
    actorRole: "Admin / Security Lead",
    operation: "CREATE_API_KEY",
    target: "brh_live_••••••••",
    revision: "rev_77d291",
    time: "2026-10-03 12:10:45 UTC",
    authorizationContext: "Scope: api:credentials • Auth: SSO (Okta MFA)",
    observedOutcome: "SUCCESS",
    correctionInfo: "Token bound with 90-day automatic rotation policy",
    visibilityRestriction: "RESTRICTED_AUDITOR",
    rawPayload: JSON.stringify({
      actor: "Priya Nair",
      action: "API Key created",
      target: "brh_live_••••••••",
      scope: ["read", "analyze"],
      expiry: "90 days",
      encryption: "AES-256 GCM in Supabase Vault"
    }, null, 2),
  },
  {
    id: "aud-05",
    actor: "Sentinel Autonomous Defense",
    actorRole: "Kernel Security Daemon",
    operation: "REVERT_REVISION",
    target: "database/migrations/v2_patch.sql",
    revision: "rev_99a80e",
    time: "2026-10-03 11:05:30 UTC",
    authorizationContext: "Scope: sentinel:revert • Auth: Merkle Ledger Signature",
    observedOutcome: "BLOCKED_BY_POLICY",
    correctionInfo: "Blocked raw unescaped DDL migration; auto-reverted to rev_99a80d",
    visibilityRestriction: "CONFIDENTIAL_SECURITY",
    rawPayload: JSON.stringify({
      actor: "OpenAI Backend Sentinel",
      action: "Quarantined unauthorized schema mutation",
      target: "database/migrations/v2_patch.sql",
      violation: "Zero Raw SQL Mandate Violation Detected",
      recovery_action: "Rollback to pristine state"
    }, null, 2),
  },
];

function AdminAuditPage() {
  const [logs] = useState<GovernanceAuditEntry[]>(GOVERNANCE_AUDIT_LOGS);
  const [search, setSearch] = useState("");
  const [operationFilter, setOperationFilter] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.operation.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase()) ||
      log.revision.toLowerCase().includes(search.toLowerCase()) ||
      log.authorizationContext.toLowerCase().includes(search.toLowerCase());

    const matchesOp = operationFilter === "ALL" || log.operation === operationFilter;
    return matchesSearch && matchesOp;
  });

  const handleExport = () => {
    const jsonStr = JSON.stringify(filtered, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `governance-audit-trail-${Date.now()}.json`;
    a.click();
    toast.success("Governance audit ledger bundle exported successfully.");
  };

  return (
    <div className="space-y-6">
      {/* Visibility Restrictions Header (N2.10) */}
      <div className="p-4 rounded-xl border border-border/80 bg-zinc-950/60 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Shield className="size-4 text-primary shrink-0" />
          <div>
            <span className="font-bold text-foreground">
              Governance Audit Ledger &amp; Provenance Chain
            </span>
            <p className="text-[11px] text-muted-foreground">
              Strictly immutable WORM audit trail. Captures actor identity, revision hash, authorization context, and correction forensics.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 bg-cyan-500/10 font-mono text-[10px]">
          RESTRICTED AUDITOR CONTEXT
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              placeholder="Search by actor, revision, target, or context..."
              className="pl-9 h-8 text-xs bg-zinc-950/40 border-border/80"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
            {(["ALL", "CREATE_BLUEPRINT", "SECURITY_SCAN", "MUTATE_CONFIG", "REVERT_REVISION"] as const).map(
              (op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setOperationFilter(op)}
                  className={`px-2 py-1 rounded font-medium shrink-0 transition-all ${
                    operationFilter === op
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {op === "ALL" ? "All Operations" : op.replace("_", " ")}
                </button>
              ),
            )}
          </div>
        </div>

        <Button size="sm" variant="outline" onClick={handleExport} className="text-xs h-8 gap-1.5 border-border/80">
          <Download className="size-3.5" /> Export Forensic Ledger
        </Button>
      </div>

      <SectionCard
        title="Immutable Platform Audit Trail"
        description="Searchable event operations, revision provenance, authorization scopes, and correction status."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Actor &amp; Role</TableHead>
              <TableHead>Operation &amp; Target</TableHead>
              <TableHead>Revision Hash</TableHead>
              <TableHead>Authorization Scope</TableHead>
              <TableHead>Observed Outcome</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((log) => {
              const isExpanded = expandedId === log.id;
              return (
                <Fragment key={log.id}>
                  <TableRow
                    className="cursor-pointer hover:bg-secondary/20 text-xs"
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                  >
                    <TableCell>
                      {isExpanded ? (
                        <ChevronUp className="size-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-3.5 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-foreground truncate">{log.actor}</div>
                        <div className="font-mono text-[10px] text-muted-foreground truncate">
                          {log.actorRole}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-bold text-foreground text-xs">{log.operation}</div>
                        <div className="font-mono text-[11px] text-muted-foreground">{log.target}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[11px] text-cyan-400 font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                        {log.revision}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="text-[10px] font-mono text-muted-foreground truncate block">
                        {log.authorizationContext}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[9px] font-mono ${
                          log.observedOutcome === "SUCCESS"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : log.observedOutcome === "REMEDIATED"
                              ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                              : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {log.observedOutcome}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                      {log.time}
                    </TableCell>
                  </TableRow>

                  {/* Expanded Forensics & Correction Panel */}
                  {isExpanded && (
                    <TableRow key={`${log.id}-expanded`}>
                      <TableCell colSpan={7} className="bg-zinc-950/80 p-4 border-y border-border/40">
                        <div className="space-y-3 text-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-border/30">
                            <span className="font-bold text-foreground flex items-center gap-1.5">
                              <Info className="size-3.5 text-primary" />
                              Correction Forensics &amp; Action Record
                            </span>
                            <Badge variant="outline" className="font-mono text-[9px] border-border/60">
                              Access Restriction: {log.visibilityRestriction}
                            </Badge>
                          </div>

                          <div className="p-3 rounded-lg border border-border/40 bg-background/50 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                              Correction / Remediation Information:
                            </span>
                            <p className="text-foreground font-medium">
                              {log.correctionInfo}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                              Cryptographic Event Payload (JSON)
                            </span>
                            <pre className="font-mono text-[10px] text-cyan-300 bg-black/60 p-3 rounded-lg border border-border/30 leading-relaxed overflow-x-auto select-all max-h-40 scrollbar-thin">
                              {log.rawPayload}
                            </pre>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
