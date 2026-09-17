import { createFileRoute } from "@tanstack/react-router";
import { AnalysisDashboardView } from "@/components/analysis/AnalysisDashboardView";

export const Route = createFileRoute("/app/analysis")({
  head: () => ({
    meta: [
      { title: "Live 12-Stage Analysis — VYRON" },
      {
        name: "description",
        content:
          "Execute 12-stage analysis pipeline with IQR anomaly detection, entity centrality, and SHAP attribution.",
      },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  return <AnalysisDashboardView />;
}
