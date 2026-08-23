import { createFileRoute } from "@tanstack/react-router";
import { PreviewEngine } from "@/components/preview/PreviewEngine";

export const Route = createFileRoute("/preview")({
  head: () => ({
    meta: [
      { title: "AI Ecosystem Showcase & Preview Engine — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Explore, inspect and benchmark 20+ generative AI development platforms and UI design engines in real time.",
      },
    ],
  }),
  component: PreviewPage,
});

function PreviewPage() {
  return <PreviewEngine />;
}
