import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportPanel } from "@/components/studio/ExportPanel";
import { useWebsiteGeneration } from "@/hooks/useWebsiteGeneration";

export const Route = createFileRoute("/app/studio/$id/export")({
  head: () => ({
    meta: [
      { title: "Export Codebase — Project Brahma" },
      { name: "description", content: "Download runnable production codebase package bundle." },
    ],
  }),
  component: WebsiteExportPage,
});

function WebsiteExportPage() {
  const { id } = useParams({ from: "/app/studio/$id/export" });
  const navigate = useNavigate();
  const { project } = useWebsiteGeneration(id);

  if (!project) {
    return (
      <div className="container mx-auto py-16 text-center text-xs text-muted-foreground">
        Loading export bundle configuration...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            navigate({
              to: "/app/studio/$id/blueprint",
              params: { id },
            })
          }
          className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Blueprint
        </Button>
      </div>

      <ExportPanel project={project} />
    </div>
  );
}
