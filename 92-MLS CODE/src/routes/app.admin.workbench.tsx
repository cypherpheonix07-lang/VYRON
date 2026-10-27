import { createFileRoute } from "@tanstack/react-router";
import { LiveSystemTestWorkbench } from "@/components/testing/LiveSystemTestWorkbench";

export const Route = createFileRoute("/app/admin/workbench")({
  head: () => ({
    meta: [
      { title: "Live Test Workbench — VYRON" },
      {
        name: "description",
        content:
          "Interactive live test console for Supabase Realtime listeners, 4 user personas, and RLS security probes.",
      },
    ],
  }),
  component: AdminWorkbenchPage,
});

function AdminWorkbenchPage() {
  return <LiveSystemTestWorkbench />;
}
