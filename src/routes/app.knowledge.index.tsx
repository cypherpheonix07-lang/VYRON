import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/knowledge/")({
  component: () => <Navigate to="/app/knowledge/$subpage" params={{ subpage: "knowledge-base" }} replace />,
});
