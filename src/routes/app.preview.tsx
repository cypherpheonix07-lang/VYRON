import { createFileRoute } from "@tanstack/react-router";
import { PreviewEngine } from "@/components/preview/PreviewEngine";

export const Route = createFileRoute("/app/preview")({
  head: () => ({
    meta: [
      { title: "AI Tool Showcase — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Interactive preview and comparison engine for generative AI tools.",
      },
    ],
  }),
  component: AppPreviewPage,
});

function AppPreviewPage() {
  return <PreviewEngine />;
}
