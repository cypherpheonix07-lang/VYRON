import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/workpulse")({
  head: () => ({
    meta: [
      { title: "Work Pulse Consolidated — VYRON" },
      {
        name: "description",
        content:
          "Work Pulse has been retired and consolidated into the Activity Stream and Command Center.",
      },
    ],
  }),
  component: WorkPulseRetiredPage,
});

function WorkPulseRetiredPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
        <Activity className="size-6" />
      </div>
      <h2 className="text-lg font-bold text-foreground">Work Pulse Has Been Consolidated</h2>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Per the architecture change specification (N1.05), standalone Work Pulse has been removed
        from top-level navigation. Its live telemetry and signal feeds are preserved directly in the
        Activity Stream and Command Center.
      </p>
      <div className="pt-2">
        <Button
          onClick={() => navigate({ to: "/app/activity" })}
          className="gap-2 text-xs"
        >
          Go to Activity Stream <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export default WorkPulseRetiredPage;
