import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/code-quality/")({
  component: () => <Navigate to="/app/code-quality/$subpage" params={{ subpage: "repository-analysis" }} replace />,
});
