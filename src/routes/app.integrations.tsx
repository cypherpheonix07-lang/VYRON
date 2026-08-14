import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/brahma/primitives";
import { IntegrationsCenterHub } from "@/components/brahma/integrations-hub";

export const Route = createFileRoute("/app/integrations")({
  head: () => ({
    meta: [
      { title: "Workspace Integrations & Providers — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Connect code hosting VCS providers, manage repository hooks, and view live webhook pushes.",
      },
    ],
  }),
  component: WorkspaceIntegrationsPage,
});

function WorkspaceIntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Version Control & Pipeline Integrations"
        description="Connect your GitHub, GitLab, and Atlassian workspaces to automatically run code health, security scanning, and traceability checks on push events."
      />
      <IntegrationsCenterHub />
    </div>
  );
}
