import { createFileRoute } from "@tanstack/react-router";
import { EnterpriseDomainView } from "@/components/common/EnterpriseDomainView";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/app/status")({
  head: () => ({
    meta: [{ title: "System Status & Sentinel — VYRON" }],
  }),
  component: SystemStatusRoute,
});

function SystemStatusRoute() {
  return (
    <EnterpriseDomainView
      domainId="status"
      domainTitle="System Status & Sentinel"
      domainSubtitle="Real-time distributed telemetry, node health, database pool latencies, and service mesh uptime."
      badgeLabel="OPERATIONAL HEALTH"
      icon={Activity}
      actionButtonLabel="Audit Mesh Health"
      metrics={[
        { label: "Mesh Uptime", value: "99.98%", change: "+0.02%", status: "good" },
        { label: "P99 Gateway Latency", value: "18ms", change: "-4ms", status: "good" },
        { label: "DB Connection Pool", value: "14/100", change: "Healthy", status: "good" },
        { label: "Active Sentinels", value: "8 Active", change: "100%", status: "good" },
      ]}
      entities={[
        {
          id: "node-edge-01",
          name: "Global Edge Router Gateway",
          status: "Operational",
          description: "High-throughput TLS termination node handling TanStack SSR routing and edge caching.",
          tags: ["Edge", "Vite", "Nitro", "HTTP/3"],
          metrics: { Latency: "12ms", Requests: "14.2k/min", Memory: "112MB" },
        },
        {
          id: "db-pooler-primary",
          name: "Supabase Postgres Transaction Pooler",
          status: "Operational",
          description: "PgBouncer multi-tenant connection broker with query builder verification.",
          tags: ["Database", "Postgres", "PgBouncer"],
          metrics: { Connections: "14", PoolUsage: "14%", Transactions: "980/s" },
        },
        {
          id: "ai-orchestrator-worker",
          name: "ATHER Intelligence Orchestrator",
          status: "Active",
          description: "Cognitive stream coordinator executing multi-agent prompt synthesis.",
          tags: ["AI", "LLM", "Copilot", "OpenRouter"],
          metrics: { ActiveJobs: "2", Latency: "280ms", QueueDepth: "0" },
        },
      ]}
    />
  );
}
