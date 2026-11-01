import { createFileRoute } from "@tanstack/react-router";
import { PolicyAsCodeView } from "@/components/governance/PolicyAsCodeView";

export const Route = createFileRoute("/app/policies")({
  head: () => ({
    meta: [
      { title: "Governance & Policy-as-Code — VYRON" },
      {
        name: "description",
        content:
          "Fine-grained role authorization, environment restrictions, and blast radius guards governing system mutations.",
      },
    ],
  }),
  component: PoliciesPage,
});

function PoliciesPage() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      <PolicyAsCodeView />
    </div>
  );
}
