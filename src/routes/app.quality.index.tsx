import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/quality/")({
  component: () => <Navigate to="/app/quality/$subpage" params={{ subpage: "test-suite-explorer" }} replace />,
});
