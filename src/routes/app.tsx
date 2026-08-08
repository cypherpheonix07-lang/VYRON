import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/brahma/app-shell";

export const Route = createFileRoute("/app")({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
