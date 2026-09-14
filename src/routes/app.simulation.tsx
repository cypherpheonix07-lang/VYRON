/**
 * PROJECT BRAHMA — SIMULATION LAB ROUTE
 */

import { createFileRoute } from "@tanstack/react-router";
import { SimulationLabView } from "@/components/demo/SimulationLabView";

export const Route = createFileRoute("/app/simulation")({
  head: () => ({
    meta: [
      { title: "Engineering Simulation Lab — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Interactive failure and regression simulation lab powered by genuine orchestration.",
      },
    ],
  }),
  component: SimulationPage,
});

function SimulationPage() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <SimulationLabView />
    </div>
  );
}
