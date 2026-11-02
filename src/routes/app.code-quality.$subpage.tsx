import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/code-quality/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Code Quality Lab — VYRON` },
      { name: "description", content: "Code Quality Lab AST analysis, maintainability, and health scores." },
    ],
  }),
  component: CodeQualitySubpage,
});

function CodeQualitySubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N16" />;
}
