import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/collaboration/")({
  component: () => <Navigate to="/app/collaboration/$subpage" params={{ subpage: "team-spaces" }} replace />,
});
