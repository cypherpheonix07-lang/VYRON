/**
 * PROJECT BRAHMA — ARCHITECTURE DRIFT ROUTE
 */

import { createFileRoute } from "@tanstack/react-router";
import { ArchitectureDriftView } from "@/components/intelligence/ArchitectureDriftView";

export const Route = createFileRoute("/app/drift")({
  head: () => ({
    meta: [
      { title: "Architecture Drift & Boundary Alignment — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Continuous comparison between architecture blueprint and observed repository AST.",
      },
    ],
  }),
  component: DriftPage,
});

function DriftPage() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <ArchitectureDriftView />
    </div>
  );
}
