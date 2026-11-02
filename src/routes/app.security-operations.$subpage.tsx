import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/security-operations/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Security Operations — VYRON` },
      { name: "description", content: "Security Operations vulnerability intelligence, findings, and threat modeling." },
    ],
  }),
  component: SecurityOperationsSubpage,
});

function SecurityOperationsSubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N18" />;
}
