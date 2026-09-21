import { createFileRoute } from "@tanstack/react-router";
import { TaskQueueMonitor } from "@/components/admin/TaskQueueMonitor";

export const Route = createFileRoute("/app/admin/queue")({
  head: () => ({
    meta: [
      { title: "Task Queue Monitor — Admin — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Celery distributed workers, active AST scan tasks, and queue depth.",
      },
    ],
  }),
  component: TaskQueueMonitorPage,
});

function TaskQueueMonitorPage() {
  return <TaskQueueMonitor />;
}
