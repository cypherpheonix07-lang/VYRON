import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/requirements/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Requirements & Traceability — VYRON` },
      { name: "description", content: "Authoritative requirements and traceability lifecycle workspace." },
    ],
  }),
  component: RequirementsSubpage,
});

function RequirementsSubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N14" />;
}
