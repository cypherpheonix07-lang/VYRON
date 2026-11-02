import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/agents/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Agent Command Hub — VYRON` },
      { name: "description", content: "Agent Command Hub orchestration, permissions, and evaluation." },
    ],
  }),
  component: AgentsSubpage,
});

function AgentsSubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N22" />;
}
