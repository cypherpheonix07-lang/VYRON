import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/collaboration/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Collaboration — VYRON` },
      { name: "description", content: "Collaboration team spaces, reviews, approvals, and handoffs." },
    ],
  }),
  component: CollaborationSubpage,
});

function CollaborationSubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N25" />;
}
