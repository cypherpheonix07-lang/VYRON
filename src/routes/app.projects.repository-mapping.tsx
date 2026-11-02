import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/projects/repository-mapping")({
  head: () => ({
    meta: [
      { title: "Repository Mapping — Projects & Workspaces — VYRON" },
      { name: "description", content: "GitHub and Git provider branch linkages, commit webhooks, and monorepo path boundaries." },
    ],
  }),
  component: () => <SubpageWorkspace slug="repository-mapping" categoryGroup="N13" />,
});
