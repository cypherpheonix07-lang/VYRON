import { createFileRoute } from "@tanstack/react-router";
import { ProjectRealityMap } from "@/components/discovery/ProjectRealityMap";

export const Route = createFileRoute("/app/reality-map")({
  head: () => ({
    meta: [
      { title: "Project Reality Map — VYRON" },
      {
        name: "description",
        content:
          "Observed project entities, verified dependency relationships, and AI-inferred architectural links.",
      },
    ],
  }),
  component: RealityMapPage,
});

function RealityMapPage() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      <ProjectRealityMap />
    </div>
  );
}
