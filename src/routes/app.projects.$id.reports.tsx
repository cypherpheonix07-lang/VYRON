import { createFileRoute } from "@tanstack/react-router";

import { ReportsView } from "@/components/brahma/reports-view";

export const Route = createFileRoute("/app/projects/$id/reports")({
  head: () => ({
    meta: [
      { title: "Reports and export — PROJECT BRAHMA" },
      { name: "description", content: "Generate and download academic, technical and executive reports for this project." },
      { property: "og:title", content: "Reports and export — PROJECT BRAHMA" },
      { property: "og:description", content: "Report history with preview and PDF export." },
    ],
  }),
  component: () => <ReportsView />,
});
