import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/developer-experience/")({
  component: () => <Navigate to="/app/developer-experience/$subpage" params={{ subpage: "local-environments" }} replace />,
});
