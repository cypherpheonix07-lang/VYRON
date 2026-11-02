import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/projects/archive-recovery")({
  head: () => ({
    meta: [
      { title: "Archive & Recovery — Projects & Workspaces — VYRON" },
      { name: "description", content: "Point-in-time workspace snapshot restoration and soft-deleted project recovery." },
    ],
  }),
  component: () => <SubpageWorkspace slug="archive-recovery" categoryGroup="N13" />,
});
