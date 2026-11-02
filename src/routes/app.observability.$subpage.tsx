import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/observability/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Observability — VYRON` },
      { name: "description", content: "Observability live telemetry, logs, traces, and performance health." },
    ],
  }),
  component: ObservabilitySubpage,
});

function ObservabilitySubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N20" />;
}
