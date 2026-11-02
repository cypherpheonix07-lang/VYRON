import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/architecture-studio/")({
  component: () => <Navigate to="/app/architecture-studio/$subpage" params={{ subpage: "blueprint-designer" }} replace />,
});
