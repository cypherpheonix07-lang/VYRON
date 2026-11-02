import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/architecture-studio/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Architecture Studio — VYRON` },
      { name: "description", content: "Architecture Studio visual workspace and system topology." },
    ],
  }),
  component: ArchitectureStudioSubpage,
});

function ArchitectureStudioSubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N15" />;
}
