import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/platform-admin/")({
  component: () => <Navigate to="/app/platform-admin/$subpage" params={{ subpage: "organization-settings" }} replace />,
});
