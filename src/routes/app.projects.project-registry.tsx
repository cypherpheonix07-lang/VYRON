import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/projects/project-registry")({
  head: () => ({
    meta: [
      { title: "Project Registry — Projects & Workspaces — VYRON" },
      { name: "description", content: "Centralized workspace catalog, ownership metadata, and active blueprint registry." },
    ],
  }),
  component: () => <SubpageWorkspace slug="project-registry" categoryGroup="N13" />,
});
