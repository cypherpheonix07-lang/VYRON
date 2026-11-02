import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/agents/")({
  component: () => <Navigate to="/app/agents/$subpage" params={{ subpage: "agent-registry" }} replace />,
});
