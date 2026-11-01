import { createFileRoute } from "@tanstack/react-router";
import { IntelligenceOverviewView } from "@/components/intelligence/IntelligenceOverviewView";

export const Route = createFileRoute("/app/intelligence")({
  head: () => ({
    meta: [
      { title: "Architecture Intelligence & Knowledge Graph — VYRON" },
      {
        name: "description",
        content:
          "Version-aware entity relationships, provenance auditing, drift detection, and predictive recommendations.",
      },
    ],
  }),
  component: IntelligencePage,
});

function IntelligencePage() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      <IntelligenceOverviewView />
    </div>
  );
}
