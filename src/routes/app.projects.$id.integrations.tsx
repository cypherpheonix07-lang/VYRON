import { createFileRoute } from "@tanstack/react-router";
import { ProjectGitHubIntegrationHub } from "@/components/github/ProjectGitHubIntegrationHub";
import { getProject } from "@/lib/mock-data";

export const Route = createFileRoute("/app/projects/$id/integrations")({
  head: () => ({
    meta: [
      { title: "Project Integrations & GitHub Repositories — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Multi-account GitHub connector and scoped repository bindings for active project.",
      },
    ],
  }),
  component: ProjectIntegrationsPage,
});

function ProjectIntegrationsPage() {
  const { id } = Route.useParams();
  const project = getProject(id);

  return (
    <div className="space-y-6">
      <ProjectGitHubIntegrationHub projectId={id} projectName={project.name} />
    </div>
  );
}
