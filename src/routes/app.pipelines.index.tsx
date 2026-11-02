import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/pipelines/")({
  component: () => <Navigate to="/app/pipelines/$subpage" params={{ subpage: "build-pipelines" }} replace />,
});
