import { createFileRoute } from "@tanstack/react-router";
import { PremiumAuthShell } from "@/components/auth/PremiumAuthShell";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Select Workspace — VYRON Engineering Intelligence" },
      {
        name: "description",
        content: "Select or switch your student, faculty, professional, or admin workspace context.",
      },
    ],
  }),
  component: WorkspacePage,
});

function WorkspacePage() {
  return <PremiumAuthShell initialMode="workspace" />;
}
