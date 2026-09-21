import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/app/studio/$id/")({
  component: RedirectToPlan,
});

function RedirectToPlan() {
  const navigate = useNavigate();
  const { id } = Route.useParams();

  useEffect(() => {
    navigate({ to: "/app/studio/$id/plan", params: { id } });
  }, [id, navigate]);

  return null;
}
