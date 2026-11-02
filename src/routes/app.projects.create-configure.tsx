import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/projects/create-configure")({
  head: () => ({
    meta: [
      { title: "Create & Configure — Projects & Workspaces — VYRON" },
      { name: "description", content: "Interactive wizard to scaffold new workspaces with template blueprints." },
    ],
  }),
  component: () => <SubpageWorkspace slug="create-configure" categoryGroup="N13" />,
});
