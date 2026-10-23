import { createFileRoute } from "@tanstack/react-router";
import { EnterpriseDomainView } from "@/components/common/EnterpriseDomainView";
import { Server } from "lucide-react";

export const Route = createFileRoute("/app/api-gateway")({
  head: () => ({
    meta: [{ title: "API Gateway & Service Mesh — VYRON" }],
  }),
  component: ApiGatewayRoute,
});

function ApiGatewayRoute() {
  return (
    <EnterpriseDomainView
      domainId="api-gateway"
      domainTitle="API Gateway & Service Mesh"
      domainSubtitle="Universal API endpoint catalog, OpenAPI contract verification, token bucket rate limiters, and GraphQL federation."
      badgeLabel="SERVICE FABRIC"
      icon={Server}
      actionButtonLabel="Audit API Endpoints"
      metrics={[
        { label: "Active Routes", value: "84 Registered", change: "100% Up", status: "good" },
        { label: "Rate Limit Rejections", value: "0.02%", change: "Normal", status: "good" },
        { label: "Gateway P95 Latency", value: "14ms", change: "-2ms", status: "good" },
        { label: "OpenAPI Compliance", value: "100%", change: "Spec v3.1", status: "good" },
      ]}
      entities={[
        {
          id: "gw-edge-proxy",
          name: "Reverse Proxy & TLS Termination",
          status: "Active",
          description: "Edge load balancer with HTTP/2 and HTTP/3 multiplexing and automatic header sanitization.",
          tags: ["Edge", "TLS 1.3", "HTTP/3", "CORS"],
          metrics: { ActiveStreams: "320", CertExpiry: "84d", Bandwidth: "12MB/s" },
        },
        {
          id: "gw-rate-limiter",
          name: "Token Bucket Distributed Limiter",
          status: "Enforcing",
          description: "Redis-backed rate limiting per API key and IP address to mitigate denial-of-service abuse.",
          tags: ["RateLimit", "Redis", "LeakyBucket", "DDoS"],
          metrics: { MaxBurst: "200/s", Policy: "Sliding Window", Blocked: "14" },
        },
        {
          id: "gw-contract-tester",
          name: "OpenAPI Spec Contract Validator",
          status: "Validating",
          description: "Performs runtime schema assertion on incoming requests and outgoing responses against OpenAPI 3.1 specs.",
          tags: ["Contracts", "OpenAPI", "Zod", "Schema"],
          metrics: { ValidatedCalls: "48,200", SchemaMismatches: "0", Compliance: "100%" },
        },
      ]}
    />
  );
}
