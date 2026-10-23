import { createFileRoute } from "@tanstack/react-router";
import { EnterpriseDomainView } from "@/components/common/EnterpriseDomainView";
import { Database } from "lucide-react";

export const Route = createFileRoute("/app/data")({
  head: () => ({
    meta: [{ title: "Enterprise Data Platform & Ingestion — VYRON" }],
  }),
  component: DataPlatformRoute,
});

function DataPlatformRoute() {
  return (
    <EnterpriseDomainView
      domainId="data-platform"
      domainTitle="Enterprise Data Platform & Ingestion"
      domainSubtitle="Data ingestion streaming, vector embedding stores, Supabase schema migrations, and real-time ETL monitoring."
      badgeLabel="DATA CONTROL PLANE"
      icon={Database}
      actionButtonLabel="Synchronize Data Pipelines"
      metrics={[
        { label: "Vector Index Size", value: "248k Docs", change: "+12k", status: "good" },
        { label: "ETL Ingestion Rate", value: "4.8 MB/s", change: "Steady", status: "good" },
        { label: "Schema Migrations", value: "98 Applied", change: "Zero Drift", status: "good" },
        { label: "Replication Lag", value: "4ms", change: "-2ms", status: "good" },
      ]}
      entities={[
        {
          id: "vector-store-pgvector",
          name: "PgVector Architecture Embeddings",
          status: "Synchronized",
          description: "HNSW index storing code chunk embeddings and cognitive memory representations for ATHER.",
          tags: ["pgvector", "HNSW", "Embeddings", "Cosine"],
          metrics: { Dimensions: "1536", QueryP99: "8ms", Recalls: "99.1%" },
        },
        {
          id: "stream-etl-coordinator",
          name: "CDC Stream Processor",
          status: "Streaming",
          description: "Real-time change data capture extracting project commits, logs, and telemetry into the data lake.",
          tags: ["CDC", "Postgres-WAL", "Kafka", "Stream"],
          metrics: { EventsPerSec: "850", Lag: "4ms", Dropped: "0" },
        },
        {
          id: "migration-sentinel",
          name: "Declarative Schema Sentinel",
          status: "Audited",
          description: "Validates Postgres DDL migrations against Zero Raw SQL and Supabase best practice constraints.",
          tags: ["Migrations", "Supabase", "DDL", "Safe"],
          metrics: { Applied: "98", Pending: "0", LockTime: "<50ms" },
        },
      ]}
    />
  );
}
