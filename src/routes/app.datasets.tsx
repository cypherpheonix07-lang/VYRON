import { createFileRoute } from "@tanstack/react-router";
import { KaggleDatasetPanel } from "@/components/datasets/KaggleDatasetPanel";

export const Route = createFileRoute("/app/datasets")({
  head: () => ({
    meta: [
      { title: "Kaggle Ingestion Hub — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Discover verified Kaggle datasets, inspect column schemas, and ingest directly into analysis.",
      },
    ],
  }),
  component: DatasetsPage,
});

function DatasetsPage() {
  return <KaggleDatasetPanel />;
}
