import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/brahma/app-shell";
import { BrahmaChatBot } from "@/components/chatbot/BrahmaChatBot";

export const Route = createFileRoute("/app")({
  component: () => (
    <AppShell>
      <Outlet />
      <BrahmaChatBot />
    </AppShell>
  ),
});
