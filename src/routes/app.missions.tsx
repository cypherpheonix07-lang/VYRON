/**
 * PROJECT BRAHMA — MISSION CENTER ROUTE
 */

import { createFileRoute } from "@tanstack/react-router";
import { MissionCenterView } from "@/components/missions/MissionCenterView";

export const Route = createFileRoute("/app/missions")({
  head: () => ({
    meta: [
      { title: "Engineering Mission Center — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Goal-oriented autonomous engineering missions orchestrating multi-agent delegation and release seals.",
      },
    ],
  }),
  component: MissionsPage,
});

function MissionsPage() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <MissionCenterView />
    </div>
  );
}
