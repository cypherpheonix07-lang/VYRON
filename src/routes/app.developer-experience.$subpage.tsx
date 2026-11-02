import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/developer-experience/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Developer Experience — VYRON` },
      { name: "description", content: "Developer environments, CLI & SDKs, templates, and diagnostics." },
    ],
  }),
  component: DevExpSubpage,
});

function DevExpSubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N30" />;
}
