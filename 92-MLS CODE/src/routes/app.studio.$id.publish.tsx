import { createFileRoute } from "@tanstack/react-router";
import { PublishWizardView } from "@/components/studio/PublishWizardView";

export const Route = createFileRoute("/app/studio/$id/publish")({
  head: () => ({
    meta: [
      { title: "S8: Publish Gate & Release Verifier — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Mathematical proof verification of the 7 canonical release gates prior to production deployment.",
      },
    ],
  }),
  component: PublishStudioRoute,
});

function PublishStudioRoute() {
  const { id } = Route.useParams();
  return <PublishWizardView projectId={id} />;
}
