/**
 * VYRON — SYSTEM FLOW ROUTE
 * Live operational backend telemetry, request waterfall, and OpenAI Sentinel defense.
 */

import { createFileRoute } from "@tanstack/react-router";
import { SystemFlowControlPlane } from "@/components/systemFlow/SystemFlowControlPlane";

export const Route = createFileRoute("/app/system-flow")({
  head: () => ({
    meta: [
      { title: "System Flow & Backend Sentinel — VYRON" },
      {
        name: "description",
        content:
          "Live backend data-flow waterfall, transactional outbox, service topology, and OpenAI Sentinel defense.",
      },
    ],
  }),
  component: SystemFlowPage,
});

function SystemFlowPage() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <SystemFlowControlPlane />
    </div>
  );
}
