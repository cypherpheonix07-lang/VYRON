import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/workpulse/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — WorkPulse — VYRON` },
      { name: "description", content: "WorkPulse activity, tasks, timeline, workload, and productivity." },
    ],
  }),
  component: WorkPulseSubpage,
});

function WorkPulseSubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N24" />;
}
