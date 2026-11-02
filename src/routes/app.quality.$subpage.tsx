import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/quality/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Testing & Quality — VYRON` },
      { name: "description", content: "Testing & Quality automated verification suite and test runner." },
    ],
  }),
  component: QualitySubpage,
});

function QualitySubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N17" />;
}
