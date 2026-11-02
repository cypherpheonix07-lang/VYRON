import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/security-operations/")({
  component: () => <Navigate to="/app/security-operations/$subpage" params={{ subpage: "vulnerability-intelligence" }} replace />,
});
