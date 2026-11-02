import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/observability/")({
  component: () => <Navigate to="/app/observability/$subpage" params={{ subpage: "live-telemetry" }} replace />,
});
