import { createFileRoute } from "@tanstack/react-router";
import { EnterpriseDomainView } from "@/components/common/EnterpriseDomainView";
import { Cpu } from "lucide-react";

export const Route = createFileRoute("/app/infra")({
  head: () => ({
    meta: [{ title: "Cloud Infrastructure & Container Mesh — VYRON" }],
  }),
  component: CloudInfraRoute,
});

function CloudInfraRoute() {
  return (
    <EnterpriseDomainView
      domainId="infra"
      domainTitle="Cloud Infrastructure & Container Mesh"
      domainSubtitle="Multi-cloud topology visualizer, Kubernetes container workloads, FinOps cost governance, and resource quotas."
      badgeLabel="INFRASTRUCTURE MESH"
      icon={Cpu}
      actionButtonLabel="Inspect Cluster State"
      metrics={[
        { label: "Cluster Nodes", value: "8 Active", change: "100% Healthy", status: "good" },
        { label: "CPU Utilization", value: "34%", change: "Optimal", status: "good" },
        { label: "Memory Footprint", value: "18.2 GB", change: "42% Free", status: "good" },
        { label: "Cloud Spend", value: "$182/mo", change: "-$24", status: "good" },
      ]}
      entities={[
        {
          id: "k8s-control-plane",
          name: "Kubernetes Microservice Mesh",
          status: "Healthy",
          description: "High-availability control plane orchestrating worker pods, ingress routers, and persistent volumes.",
          tags: ["K8s", "Containers", "Istio", "Pods"],
          metrics: { ActivePods: "36", Restarts: "0", CPU: "28%" },
        },
        {
          id: "finops-cost-governor",
          name: "FinOps Multi-Cloud Cost Governor",
          status: "Optimized",
          description: "Identifies underutilized spot instances, orphaned EBS volumes, and unattached elastic IPs.",
          tags: ["FinOps", "AWS", "GCP", "Optimization"],
          metrics: { MonthlySavings: "$140", WasteRatio: "1.2%", Efficiency: "98.8%" },
        },
        {
          id: "infra-iac-drift",
          name: "Terraform IaC State Sentinel",
          status: "In-Sync",
          description: "Detects unauthorized cloud resource mutations against version-controlled Terraform state files.",
          tags: ["Terraform", "IaC", "Drift", "GitOps"],
          metrics: { ResourcesManaged: "148", DriftCount: "0", StateLock: "Active" },
        },
      ]}
    />
  );
}
