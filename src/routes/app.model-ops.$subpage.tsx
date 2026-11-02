import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/model-ops/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Model Operations — VYRON` },
      { name: "description", content: "Model Operations registry, routing, prompts, and safety evaluations." },
    ],
  }),
  component: ModelOpsSubpage,
});

function ModelOpsSubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N23" />;
}
