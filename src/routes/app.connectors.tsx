import { createFileRoute } from "@tanstack/react-router";
import { ConnectorRegistryView } from "@/components/connectors/ConnectorRegistryView";

export const Route = createFileRoute("/app/connectors")({
  head: () => ({
    meta: [
      { title: "MCP Connectors — VYRON" },
      {
        name: "description",
        content: "Manage Model Context Protocol integrations and granular tool authorizations.",
      },
    ],
  }),
  component: ConnectorsPage,
});

function ConnectorsPage() {
  return <ConnectorRegistryView />;
}
