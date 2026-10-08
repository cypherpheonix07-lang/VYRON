import { createFileRoute } from "@tanstack/react-router";
import { AetherControlCenter } from "@/components/aether/AetherControlCenter";

export const Route = createFileRoute("/app/aether")({
  head: () => ({
    meta: [
      { title: "ATHER Cognitive Control Center — VYRON" },
      {
        name: "description",
        content:
          "ATHER interactive cognitive agent operating system interface and closed-loop control center.",
      },
    ],
  }),
  component: AetherPage,
});

function AetherPage() {
  return <AetherControlCenter />;
}
