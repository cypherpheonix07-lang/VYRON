import { createFileRoute } from "@tanstack/react-router";
import { SchemaDriftDetector } from "@/components/admin/SchemaDriftDetector";

export const Route = createFileRoute("/app/admin/schema")({
  head: () => ({
    meta: [
      { title: "Schema Health & Drift — Admin — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Parity verification between Supabase, FastAPI Pydantic models, and TypeScript interfaces.",
      },
    ],
  }),
  component: SchemaHealthPage,
});

function SchemaHealthPage() {
  return <SchemaDriftDetector />;
}
