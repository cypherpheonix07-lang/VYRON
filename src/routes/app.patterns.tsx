import { createFileRoute } from "@tanstack/react-router";
import { EnterpriseDomainView } from "@/components/common/EnterpriseDomainView";
import { Layers } from "lucide-react";

export const Route = createFileRoute("/app/patterns")({
  head: () => ({
    meta: [{ title: "Architecture Patterns Catalog — VYRON" }],
  }),
  component: PatternsRoute,
});

function PatternsRoute() {
  return (
    <EnterpriseDomainView
      domainId="patterns"
      domainTitle="Architecture Patterns Catalog"
      domainSubtitle="Canonical enterprise scaffolding blueprints, Clean Architecture, DDD, Event-Driven, and Microservice pattern engines."
      badgeLabel="ENGINEERING BLUEPRINTS"
      icon={Layers}
      actionButtonLabel="Validate Scaffolding"
      metrics={[
        { label: "Cataloged Patterns", value: "26 Patterns", change: "+4 new", status: "good" },
        { label: "Active Conformance", value: "98.4%", change: "Healthy", status: "good" },
        { label: "Microservice Blueprints", value: "12 Blueprints", change: "Ready", status: "good" },
        { label: "Pattern Deviations", value: "0 Drift", change: "Verified", status: "good" },
      ]}
      entities={[
        {
          id: "pat-hexagonal-01",
          name: "Hexagonal / Ports & Adapters Architecture",
          status: "Operational",
          description: "Strict isolation of core domain logic from external transport layers and database drivers.",
          tags: ["DDD", "Hexagonal", "Decoupled", "Core"],
          metrics: { Compliance: "100%", TestIsolation: "99.2%", InUse: "8 Workspaces" },
        },
        {
          id: "pat-event-driven-02",
          name: "Reactive Event-Driven Architecture",
          status: "Active",
          description: "Asynchronous pub/sub message brokers with idempotent consumers and dead-letter queues.",
          tags: ["Events", "Kafka", "Idempotent", "Reactive"],
          metrics: { MessageThroughput: "4.2k/s", ErrorRate: "0.00%", Consumers: "16" },
        },
        {
          id: "pat-cqrs-03",
          name: "CQRS Command Query Segregation",
          status: "Operational",
          description: "Separation of write-side domain mutations from read-side material views and projections.",
          tags: ["CQRS", "EventSourcing", "HighThroughput"],
          metrics: { ReadLatency: "4ms", WriteLatency: "19ms", Projections: "6" },
        },
      ]}
    />
  );
}
