import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { BlueprintViewer } from "@/components/studio/BlueprintViewer";
import { useWebsiteGeneration } from "@/hooks/useWebsiteGeneration";

export const Route = createFileRoute("/app/studio/$id/blueprint")({
  head: () => ({
    meta: [
      { title: "Website Blueprint — Project Brahma" },
      { name: "description", content: "Interactive frontend, backend, tech stack, and seed data blueprint." },
    ],
  }),
  component: WebsiteBlueprintPage,
});

function WebsiteBlueprintPage() {
  const { id } = useParams({ from: "/app/studio/$id/blueprint" });
  const navigate = useNavigate();
  const {
    project,
    setProject,
    previewHtml,
  } = useWebsiteGeneration(id);

  if (!project) {
    return (
      <div className="container mx-auto py-16 text-center text-xs text-muted-foreground">
        Loading website blueprint specifications...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <BlueprintViewer
        project={project}
        previewHtml={previewHtml}
        onProjectUpdated={(updated) => setProject(updated)}
        onNavigatePreview={() =>
          navigate({
            to: "/app/studio/$id/preview",
            params: { id },
          })
        }
        onNavigateExport={() =>
          navigate({
            to: "/app/studio/$id/export",
            params: { id },
          })
        }
      />
    </div>
  );
}
