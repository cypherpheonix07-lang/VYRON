import { createFileRoute } from "@tanstack/react-router";
import { WorkPulsePage } from "@/components/workpulse/WorkPulsePage";

export const Route = createFileRoute("/app/workpulse")({
  head: () => ({
    meta: [
      { title: "WorkPulse — Engineering Intelligence Platform | VYRON" },
      {
        name: "description",
        content:
          "WorkPulse: Real-time workspace telemetry, project health monitoring, activity analytics, and engineering signal command center.",
      },
    ],
  }),
  component: WorkPulsePage,
});
