import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { GenerationProgress } from "@/components/studio/GenerationProgress";
import { useWebsiteGeneration } from "@/hooks/useWebsiteGeneration";

export const Route = createFileRoute("/app/studio/$id/generating")({
  head: () => ({
    meta: [
      { title: "Synthesizing Website — Project Brahma" },
      { name: "description", content: "Autonomous full-stack blueprint synthesis in progress." },
    ],
  }),
  component: WebsiteGeneratingPage,
});

function WebsiteGeneratingPage() {
  const { id } = useParams({ from: "/app/studio/$id/generating" });
  const navigate = useNavigate();
  const {
    project,
    stages,
    isLoading,
    error,
    runGenerationPipeline,
  } = useWebsiteGeneration(id);

  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (project && !hasStartedRef.current && project.status !== "previewing" && project.status !== "exported") {
      hasStartedRef.current = true;
      runGenerationPipeline(project);
    }
  }, [project, runGenerationPipeline]);

  const handleContinue = () => {
    navigate({
      to: "/app/studio/$id/blueprint",
      params: { id },
    });
  };

  const handleRetry = () => {
    hasStartedRef.current = false;
    if (project) {
      runGenerationPipeline(project);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <GenerationProgress
        stages={stages}
        isLoading={isLoading}
        error={error}
        onContinue={handleContinue}
        onRetry={handleRetry}
      />
    </div>
  );
}
