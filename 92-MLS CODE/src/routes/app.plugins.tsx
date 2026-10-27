import { createFileRoute } from "@tanstack/react-router";
import { PluginCenterView } from "@/components/plugins/PluginCenterView";

export const Route = createFileRoute("/app/plugins")({
  head: () => ({
    meta: [
      { title: "Plugin Center — VYRON" },
      {
        name: "description",
        content: "Discover, configure, and govern modular AI plugins, tools, and agent skills.",
      },
    ],
  }),
  component: PluginsPage,
});

function PluginsPage() {
  return <PluginCenterView />;
}
