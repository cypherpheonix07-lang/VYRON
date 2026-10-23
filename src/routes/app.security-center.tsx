import { createFileRoute } from "@tanstack/react-router";
import { EnterpriseDomainView } from "@/components/common/EnterpriseDomainView";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/app/security-center")({
  head: () => ({
    meta: [{ title: "Enterprise Security Posture & Secrets — VYRON" }],
  }),
  component: SecurityCenterRoute,
});

function SecurityCenterRoute() {
  return (
    <EnterpriseDomainView
      domainId="security-center"
      domainTitle="Enterprise Security Posture & Secrets"
      domainSubtitle="Automated threat modeling, zero-leak secrets scanning, SBOM integrity verification, and SOC2/HIPAA compliance controls."
      badgeLabel="ENTERPRISE SECURITY"
      icon={ShieldAlert}
      actionButtonLabel="Run Deep Vulnerability Scan"
      metrics={[
        { label: "Security Health Score", value: "98/100", change: "+3 pts", status: "good" },
        { label: "Zero-Secret Leaks", value: "0 Detected", change: "Clean", status: "good" },
        { label: "Open CVEs", value: "0 Critical", change: "1 Low", status: "good" },
        { label: "SBOM Coverage", value: "100%", change: "SLSA Level 3", status: "good" },
      ]}
      entities={[
        {
          id: "sec-secrets-scanner",
          name: "High-Entropy Secret Detection Engine",
          status: "Active",
          description: "Scans commits, environment payloads, and memory buffers for exposed tokens, private keys, and API credentials.",
          tags: ["Secrets", "Entropy", "Zero-Leak", "Pre-Commit"],
          metrics: { ScannedBlobs: "18,400", Violations: "0", ScanTime: "420ms" },
        },
        {
          id: "sec-sbom-generator",
          name: "CycloneDX SBOM & License Ledger",
          status: "Compliant",
          description: "Generates cryptographic software bill of materials and verifies transitive dependency licenses.",
          tags: ["SBOM", "CycloneDX", "SPDX", "Permissive"],
          metrics: { Packages: "412", Permissive: "100%", Copyleft: "0" },
        },
        {
          id: "sec-threat-model",
          name: "STRIDE Threat Matrix Analyzer",
          status: "Audited",
          description: "Evaluates application boundaries, authentication token exchanges, and privilege escalation vectors.",
          tags: ["STRIDE", "Threat-Modeling", "OWASP", "IAM"],
          metrics: { TrustBoundaries: "14", Mitigated: "100%", ResidualRisk: "Low" },
        },
      ]}
    />
  );
}
