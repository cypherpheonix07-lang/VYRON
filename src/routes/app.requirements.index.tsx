import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/requirements/")({
  component: () => <Navigate to="/app/requirements/$subpage" params={{ subpage: "srs-intake" }} replace />,
});
