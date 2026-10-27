import { createFileRoute } from "@tanstack/react-router";
import { ProjectGitHubIntegrationHub } from "@/components/github/ProjectGitHubIntegrationHub";
import { getProject } from "@/lib/mock-data";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { useLiveProject } from "@/contexts/LiveProjectContext";

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
  const { isDemoMode } = useDemoMode();
  return isDemoMode ? <DemoIntegrations /> : <LiveIntegrations />;
}

function LiveIntegrations() {
  const { id } = Route.useParams();
  const { data } = useLiveProject();
  return data ? <ProjectGitHubIntegrationHub projectId={id} projectName={data.project.name} /> : null;
}

function DemoIntegrations() {
  const { id } = Route.useParams();
  const project = getProject(id);

  return (
    <div className="space-y-6">
      <ProjectGitHubIntegrationHub projectId={id} projectName={project.name} />
    </div>
  );
}
