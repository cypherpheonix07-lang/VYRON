import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebsiteConfigWizard } from "@/components/studio/WebsiteConfigWizard";

export const Route = createFileRoute("/app/studio/create-website")({
  head: () => ({
    meta: [
      { title: "AI Website Generator — Project Brahma" },
      { name: "description", content: "Synthesize full-stack web applications with interactive blueprints and live preview." },
    ],
  }),
  component: CreateWebsitePage,
});

function CreateWebsitePage() {
  const navigate = useNavigate();

  const handleComplete = (projectId: string) => {
    navigate({
      to: "/app/studio/$id/generating",
      params: { id: projectId },
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/app/studio" })}
              className="text-xs text-muted-foreground hover:text-foreground h-7 px-2 -ml-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Studio
            </Button>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            AI Website Generation Studio
          </h1>
          <p className="text-xs text-muted-foreground">
            Configure requirements, design tokens, tech stack, and capabilities to synthesize a production-ready codebase.
          </p>
        </div>
      </div>

      {/* Interactive Wizard */}
      <WebsiteConfigWizard onComplete={handleComplete} />
    </div>
  );
}
