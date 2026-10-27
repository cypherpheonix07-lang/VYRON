import { createFileRoute } from "@tanstack/react-router";
import { GitHubDashboard } from "@/components/github/GitHubDashboard";

export const Route = createFileRoute("/github")({
  head: () => ({
    meta: [
      { title: "GitHub Live Account Mirror & Clone Engine — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Mirror your repositories, explore file trees, track live commits and clone directly into your workspace.",
      },
    ],
  }),
  component: GitHubPage,
});

function GitHubPage() {
  return <GitHubDashboard />;
}
