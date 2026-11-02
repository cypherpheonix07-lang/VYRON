import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/platform-admin/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Platform Admin — VYRON` },
      { name: "description", content: "Organization settings, feature flags, credentials, and access policies." },
    ],
  }),
  component: PlatformAdminSubpage,
});

function PlatformAdminSubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N29" />;
}
