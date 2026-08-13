import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/app/admin/")({
  component: RedirectToStudio,
});

function RedirectToStudio() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/app/admin/studio" });
  }, [navigate]);

  return null;
}
