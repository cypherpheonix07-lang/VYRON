import { createFileRoute } from "@tanstack/react-router";
import { ASTScanTimeline } from "@/components/brahma/ASTScanTimeline";

export const Route = createFileRoute("/app/projects/$id/scans")({
  head: () => ({
    meta: [
      { title: "Scan History & AST Timeline — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Track cyclomatic complexity, Bandit security findings, and test coverage trajectory over time.",
      },
    ],
  }),
  component: ProjectScansPage,
});

function ProjectScansPage() {
  const { id } = Route.useParams();
  return <ASTScanTimeline projectId={id} />;
}
