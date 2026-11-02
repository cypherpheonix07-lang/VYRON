import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/knowledge/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Knowledge & Docs — VYRON` },
      { name: "description", content: "Knowledge Base, architecture decisions, API documentation, and runbooks." },
    ],
  }),
  component: KnowledgeSubpage,
});

function KnowledgeSubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N26" />;
}
