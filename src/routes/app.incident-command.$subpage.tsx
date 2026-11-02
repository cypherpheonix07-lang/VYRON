import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/incident-command/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Incident Command — VYRON` },
      { name: "description", content: "Incident Command queue, RCA workbench, and recovery playbooks." },
    ],
  }),
  component: IncidentCommandSubpage,
});

function IncidentCommandSubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N21" />;
}
