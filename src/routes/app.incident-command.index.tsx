import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/incident-command/")({
  component: () => <Navigate to="/app/incident-command/$subpage" params={{ subpage: "incident-queue" }} replace />,
});
