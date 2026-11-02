import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/pipelines/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Pipeline Operations — VYRON` },
      { name: "description", content: "CI pipelines, quality gates, release readiness, and artifacts." },
    ],
  }),
  component: PipelinesSubpage,
});

function PipelinesSubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N28" />;
}
