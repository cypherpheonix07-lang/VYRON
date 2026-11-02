import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/projects/workspace-sessions")({
  head: () => ({
    meta: [
      { title: "Workspace Sessions — Projects & Workspaces — VYRON" },
      { name: "description", content: "Live engineering session monitor, active developer nodes, and memory cache checkpoints." },
    ],
  }),
  component: () => <SubpageWorkspace slug="workspace-sessions" categoryGroup="N13" />,
});
