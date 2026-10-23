import { createFileRoute } from "@tanstack/react-router";
import { EnterpriseDomainView } from "@/components/common/EnterpriseDomainView";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/app/release/pipelines")({
  head: () => ({
    meta: [{ title: "Deployment Pipelines & Rollback Sentinel — VYRON" }],
  }),
  component: DeploymentPipelinesRoute,
});

function DeploymentPipelinesRoute() {
  return (
    <EnterpriseDomainView
      domainId="release-pipelines"
      domainTitle="Deployment Pipelines & Rollback Sentinel"
      domainSubtitle="Continuous verification gates, zero-downtime blue/green rollouts, canary traffic sharding, and automated rollback ledgers."
      badgeLabel="CD ORCHESTRATION"
      icon={ShieldCheck}
      actionButtonLabel="Trigger Pipeline Audit"
      metrics={[
        { label: "Pipeline Success Rate", value: "99.4%", change: "+0.8%", status: "good" },
        { label: "Avg Deployment Duration", value: "3m 42s", change: "-25s", status: "good" },
        { label: "Active Deployments", value: "1 In-Flight", change: "Staging", status: "good" },
        { label: "Rollback Health", value: "0 Rollbacks", change: "Last 14d", status: "good" },
      ]}
      entities={[
        {
          id: "pipe-prod-canary",
          name: "Production Canary Gate v4.2",
          status: "Healthy",
          description: "Progressive traffic migration pipeline with automated P99 latency abort triggers.",
          tags: ["Canary", "Production", "Zero-Downtime", "ArgoCD"],
          metrics: { TrafficShare: "15%", ErrorRate: "0.001%", Health: "Optimal" },
        },
        {
          id: "pipe-staging-preview",
          name: "Ephemeral Staging Preview Engine",
          status: "Running",
          description: "Isolated preview container orchestrator spinning up dynamic subdomains per branch.",
          tags: ["Ephemeral", "Vite", "Docker", "Preview"],
          metrics: { ActiveEnvs: "6", BootTime: "18s", Cleanups: "12 Today" },
        },
        {
          id: "pipe-audit-evidence",
          name: "Cryptographic Release Evidence Lock",
          status: "Passed",
          description: "Verifies git SHA checksums, SBOM signatures, and test gate approvals prior to deployment.",
          tags: ["Security", "SLSA-3", "Cosign", "Audit"],
          metrics: { Signatures: "Verified", Blockers: "0", Compliance: "100%" },
        },
      ]}
    />
  );
}
