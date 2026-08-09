import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/brahma/primitives";
import { ReportsView } from "@/components/brahma/reports-view";

export const Route = createFileRoute("/app/reports")({
  head: () => ({
    meta: [
      { title: "Reports — PROJECT BRAHMA" },
      { name: "description", content: "All generated academic, technical and executive reports across your workspace." },
      { property: "og:title", content: "Reports — PROJECT BRAHMA" },
      { property: "og:description", content: "Workspace-wide report history with preview and PDF export." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Every report generated across your workspace projects." />
      <ReportsView />
    </div>
  ),
});
