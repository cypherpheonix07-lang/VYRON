import { createFileRoute } from "@tanstack/react-router";
import { ReportViewerPage } from "@/components/reports/ReportViewerPage";

export const Route = createFileRoute("/app/reports/$id/view")({
  head: () => ({
    meta: [
      { title: "Report Studio — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Executive Summary and Architecture Report Document Viewer.",
      },
    ],
  }),
  component: ReportViewRouteComponent,
});

function ReportViewRouteComponent() {
  const { id } = Route.useParams();
  return <ReportViewerPage reportId={id} />;
}
