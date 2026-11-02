import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/model-ops/")({
  component: () => <Navigate to="/app/model-ops/$subpage" params={{ subpage: "model-registry" }} replace />,
});
