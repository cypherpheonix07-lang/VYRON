import { createFileRoute } from "@tanstack/react-router";
import { PremiumAuthShell } from "@/components/auth/PremiumAuthShell";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Authenticate — VYRON Engineering Intelligence" },
      {
        name: "description",
        content:
          "Sign in, create an account, or select your engineering workspace in VYRON.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  return <PremiumAuthShell initialMode="signin" />;
}
