import { createFileRoute } from "@tanstack/react-router";
import { EnterpriseDomainView } from "@/components/common/EnterpriseDomainView";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/app/forensics")({
  head: () => ({
    meta: [{ title: "Vulnerability Threat Matrix — VYRON" }],
  }),
  component: ForensicsRoute,
});

function ForensicsRoute() {
  return (
    <EnterpriseDomainView
      domainId="forensics"
      domainTitle="Vulnerability Threat Matrix"
      domainSubtitle="Static code analysis forensics, tainted data-flow tracking, STRIDE threat correlation, and zero-day defense."
      badgeLabel="ANALYSIS FORENSICS"
      icon={ShieldAlert}
      actionButtonLabel="Execute STRIDE Audit"
      metrics={[
        { label: "Audited Lines", value: "342k LOC", change: "+12k LOC", status: "good" },
        { label: "Critical Findings", value: "0 Blocker", change: "Zero Alert", status: "good" },
        { label: "Taint Analysis", value: "100% Guarded", change: "Verified", status: "good" },
        { label: "STRIDE Posture", value: "A+ Grade", change: "Passing", status: "good" },
      ]}
      entities={[
        {
          id: "scan-sqli-guard",
          name: "SQL Injection Taint Guard (Zero SQL Mandate)",
          status: "Passed",
          description: "Ensures all database queries utilize Supabase client query builders with parameter binding.",
          tags: ["SAST", "SQLi", "Zero-Fiction", "Compliance"],
          metrics: { Violations: "0", CheckedCalls: "482", Status: "VERIFIED" },
        },
        {
          id: "scan-xss-csrf",
          name: "XSS & CSRF Token Validation Engine",
          status: "Operational",
          description: "Validates PKCE challenge parameters and sanitizes untrusted input across public endpoints.",
          tags: ["WebSecurity", "CSRF", "XSS", "OWASP"],
          metrics: { AttackSurface: "Protected", StateTokensChecked: "128", Escapes: "Clean" },
        },
        {
          id: "scan-secrets-entropy",
          name: "High-Entropy Secret Detection Sentinel",
          status: "Passed",
          description: "Scans repository commits and staging areas for exposed private keys, OAuth tokens, and bearer credentials.",
          tags: ["Secrets", "Entropy", "Zero-Leak", "Pre-Commit"],
          metrics: { CommitsInspected: "1.4k", LeakedSecrets: "0", Coverage: "100%" },
        },
      ]}
    />
  );
}
