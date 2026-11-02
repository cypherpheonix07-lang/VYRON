import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/finops/")({
  component: () => <Navigate to="/app/finops/$subpage" params={{ subpage: "cloud-spend" }} replace />,
});
