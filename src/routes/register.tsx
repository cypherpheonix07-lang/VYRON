import { createFileRoute } from "@tanstack/react-router";
import { PremiumAuthShell } from "@/components/auth/PremiumAuthShell";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create an Account — VYRON Engineering Intelligence" },
      {
        name: "description",
        content:
          "Create a VYRON account to turn project requirements and architecture into verified blueprints.",
      },
      { property: "og:title", content: "Create an Account — VYRON Engineering Intelligence" },
      {
        property: "og:description",
        content: "Start with a validated architecture blueprint across 30 engineering domains.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return <PremiumAuthShell initialMode="signup" />;
}
