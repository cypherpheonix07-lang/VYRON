import { createFileRoute } from "@tanstack/react-router";
import { PremiumAuthShell } from "@/components/auth/PremiumAuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — VYRON Engineering Intelligence" },
      {
        name: "description",
        content:
          "Sign in to VYRON to review architecture blueprints, code health, security AST, and delivery risk.",
      },
      { property: "og:title", content: "Sign In — VYRON Engineering Intelligence" },
      { property: "og:description", content: "Access your engineering intelligence workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return <PremiumAuthShell initialMode="signin" />;
}
