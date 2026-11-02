import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/data-storage/")({
  component: () => <Navigate to="/app/data-storage/$subpage" params={{ subpage: "data-sources" }} replace />,
});
