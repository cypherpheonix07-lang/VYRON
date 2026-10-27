import { createFileRoute } from "@tanstack/react-router";
import { EnterpriseDomainView } from "@/components/common/EnterpriseDomainView";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/app/obs")({
  head: () => ({
    meta: [{ title: "Distributed Observability & Tracing — VYRON" }],
  }),
  component: ObservabilityRoute,
});

function ObservabilityRoute() {
  return (
    <EnterpriseDomainView
      domainId="obs"
      domainTitle="Distributed Observability & Tracing"
      domainSubtitle="OpenTelemetry distributed traces, structured log forensics, metric sentinel dashboards, and incident alert manager."
      badgeLabel="TELEMETRY CONTROL"
      icon={Activity}
      actionButtonLabel="Analyze Trace Bottlenecks"
      metrics={[
        { label: "Trace Spans Ingested", value: "2.4M / day", change: "100% Retained", status: "good" },
        { label: "Avg Service Latency", value: "24ms", change: "-3ms", status: "good" },
        { label: "Error Log Ratio", value: "0.004%", change: "Zero Critical", status: "good" },
        { label: "Active Monitors", value: "32 Rules", change: "All Passing", status: "good" },
      ]}
      entities={[
        {
          id: "otel-trace-collector",
          name: "OpenTelemetry Span Collector",
          status: "Ingesting",
          description: "Captures end-to-end distributed transaction traces across client, API gateway, edge workers, and database.",
          tags: ["OTel", "Traces", "Distributed", "Jaeger"],
          metrics: { SpansPerSec: "1,400", P99Trace: "48ms", Dropped: "0" },
        },
        {
          id: "log-forensics-stream",
          name: "Structured JSON Log Pipeline",
          status: "Streaming",
          description: "Indexes structured application logs with correlation IDs, stack traces, and request context.",
          tags: ["Logs", "JSON", "Correlation-ID", "ClickHouse"],
          metrics: { IndexRate: "8.4k logs/s", Retention: "30 Days", SearchP50: "18ms" },
        },
        {
          id: "alert-manager-sentinel",
          name: "Proactive Incident Alert Manager",
          status: "Guarding",
          description: "Evaluates anomaly detection algorithms to notify on latency anomalies, error rate spikes, or pod crashes.",
          tags: ["Alerts", "PagerDuty", "Slack", "Anomaly"],
          metrics: { RulesActive: "32", FiredLast24h: "0", Muted: "0" },
        },
      ]}
    />
  );
}
