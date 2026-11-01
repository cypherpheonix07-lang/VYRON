import { createFileRoute } from "@tanstack/react-router";
import { SentinelMonitoringView } from "@/components/monitoring/SentinelMonitoringView";

export const Route = createFileRoute("/app/monitoring")({
  head: () => ({
    meta: [
      { title: "Sentinel Operational Monitoring — VYRON" },
      {
        name: "description",
        content:
          "Real-time backend telemetry, p95 latency percentiles, error rate tracking, and automated sentinel defense loops.",
      },
    ],
  }),
  component: MonitoringPage,
});

function MonitoringPage() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      <SentinelMonitoringView />
    </div>
  );
}
