import { createFileRoute } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/data-storage/$subpage")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subpage} — Data & Storage — VYRON` },
      { name: "description", content: "Data & Storage schema explorer, storage browser, and data lineage." },
    ],
  }),
  component: DataStorageSubpage,
});

function DataStorageSubpage() {
  const { subpage } = Route.useParams();
  return <SubpageWorkspace slug={subpage} categoryGroup="N19" />;
}
