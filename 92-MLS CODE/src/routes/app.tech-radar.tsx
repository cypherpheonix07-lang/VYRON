import { createFileRoute } from "@tanstack/react-router";
import { EnterpriseDomainView } from "@/components/common/EnterpriseDomainView";
import { Target } from "lucide-react";

export const Route = createFileRoute("/app/tech-radar")({
  head: () => ({
    meta: [{ title: "Technology Stack Radar — VYRON" }],
  }),
  component: TechRadarRoute,
});

function TechRadarRoute() {
  return (
    <EnterpriseDomainView
      domainId="tech-radar"
      domainTitle="Technology Stack Radar"
      domainSubtitle="Autonomous library lifecycle tracker, deprecation alerts, framework drift, and supply-chain adoption rings."
      badgeLabel="DISCOVERY RADAR"
      icon={Target}
      actionButtonLabel="Scan Dependencies"
      metrics={[
        { label: "Tracked Libraries", value: "84 PKGs", change: "+6 new", status: "good" },
        { label: "Adopt Ring", value: "38 Tools", change: "Verified", status: "good" },
        { label: "Trial Ring", value: "14 Tools", change: "In Sandbox", status: "neutral" },
        { label: "Deprecation Risk", value: "0 Flags", change: "Zero CVE", status: "good" },
      ]}
      entities={[
        {
          id: "lib-react-19",
          name: "React 19 & Server Components",
          status: "Active",
          description: "Core UI component foundation with Concurrent Mode and React Server DOM.",
          tags: ["Adopt", "UI", "React 19", "Zero-Deprecation"],
          metrics: { Ring: "ADOPT", Version: "19.2.0", ProjectsUsing: "12" },
        },
        {
          id: "lib-tanstack-router",
          name: "TanStack Router (Type-Safe Routing)",
          status: "Operational",
          description: "100% type-safe file-based client router with search parameter schema validation.",
          tags: ["Adopt", "Routing", "TanStack", "Type-Safe"],
          metrics: { Ring: "ADOPT", Version: "1.170.38", Routes: "109" },
        },
        {
          id: "lib-tailwind-v4",
          name: "TailwindCSS v4 (Engine & Tokens)",
          status: "Active",
          description: "CSS utility framework operating with dynamic design tokens and zero config compilation.",
          tags: ["Adopt", "Styles", "Tailwind 4", "CSS-Next"],
          metrics: { Ring: "ADOPT", BuildTime: "14ms", UtilityCoverage: "94%" },
        },
      ]}
    />
  );
}
