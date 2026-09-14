import { createFileRoute } from "@tanstack/react-router";
import { PublishWizardView } from "@/components/studio/PublishWizardView";

export const Route = createFileRoute("/app/projects/$id/publish")({
  head: () => ({
    meta: [
      { title: "Publish Gatekeeper — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Verify canonical 7 release gates with mathematical evidence before deployment.",
      },
    ],
  }),
  component: PublishProjectRoute,
});

function PublishProjectRoute() {
  const { id } = Route.useParams();
  return <PublishWizardView projectId={id} />;
}
