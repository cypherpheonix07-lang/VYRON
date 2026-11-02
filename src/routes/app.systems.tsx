import { createFileRoute } from "@tanstack/react-router";
import { BrahmaSystemsOverviewView } from "@/components/systems/BrahmaSystemsOverviewView";

export const Route = createFileRoute("/app/systems")({
  head: () => ({
    meta: [
      { title: "18 Core Systems Topology & Health — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Authoritative control plane and live operational topology for the 18 PROJECT BRAHMA core systems and service nodes.",
      },
    ],
  }),
  component: AppSystemsPage,
});

function AppSystemsPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <BrahmaSystemsOverviewView />
    </div>
  );
}
