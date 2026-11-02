import { createFileRoute } from "@tanstack/react-router";
import { PremiumAuthShell } from "@/components/auth/PremiumAuthShell";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — VYRON Engineering Intelligence" },
      {
        name: "description",
        content: "Join VYRON to access multi-provider authentication and workspace intelligence.",
      },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  return <PremiumAuthShell initialMode="signup" />;
}
