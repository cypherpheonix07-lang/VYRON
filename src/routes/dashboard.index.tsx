import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth, resolvePostLoginRoute } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndexPage,
});

function DashboardIndexPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const target = resolvePostLoginRoute(user?.role);
    navigate({ to: target as any, replace: true });
  }, [user, navigate]);

  return null;
}
