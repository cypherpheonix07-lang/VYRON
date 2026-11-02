import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/finops/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — FinOps & Capacity — VYRON` },
      { name: "description", content: "FinOps cloud spend, AI token usage, budget alerts, and capacity plans." },
    ],
  }),
  component: FinopsSubpage,
});

function FinopsSubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N27" />;
}
