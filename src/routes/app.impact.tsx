/**
 * PROJECT BRAHMA — CHANGE IMPACT ROUTE
 */

import { createFileRoute } from "@tanstack/react-router";
import { ChangeImpactView } from "@/components/intelligence/ChangeImpactView";

export const Route = createFileRoute("/app/impact")({
  head: () => ({
    meta: [
      { title: "Change Impact & Blast Radius — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Predictive blast radius analysis of code commits, pull requests, and dependencies.",
      },
    ],
  }),
  component: ImpactPage,
});

function ImpactPage() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <ChangeImpactView />
    </div>
  );
}
