import { createFileRoute } from "@tanstack/react-router";
import { GitHubDashboard } from "@/components/github/GitHubDashboard";

export const Route = createFileRoute("/app/github")({
  head: () => ({
    meta: [
      { title: "GitHub Mirror — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Live GitHub repository catalog and file tree explorer.",
      },
    ],
  }),
  component: AppGitHubPage,
});

function AppGitHubPage() {
  return <GitHubDashboard />;
}
