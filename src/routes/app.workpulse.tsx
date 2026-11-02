import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { SubpageWorkspace } from "@/components/subpages/SubpageWorkspace";

export const Route = createFileRoute("/app/workpulse")({
  head: () => ({
    meta: [
      { title: "WorkPulse — Engineering Intelligence — VYRON" },
      {
        name: "description",
        content: "Project-backed activity, milestones, timeline, and productivity insights.",
      },
    ],
  }),
  component: WorkPulseContainer,
});

function WorkPulseContainer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // If exactly /app/workpulse, render default activity overview
  if (pathname === "/app/workpulse" || pathname === "/app/workpulse/") {
    return <SubpageWorkspace slug="activity-overview" categoryGroup="N24" />;
  }

  return <Outlet />;
}
