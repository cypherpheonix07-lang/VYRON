import { createFileRoute, Link } from "@tanstack/react-router";
import { PublishWizardPage } from "../app.studio.$id.publish";

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
  component: PublishWizardPage,
});
