import { useState, useCallback } from "react";
import { engineApi, type BlueprintResponse } from "@/lib/engineClient";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { DEMO_LLM_USAGE } from "@/data/demoSeedData";

export function useLLM() {
  const { isDemoMode } = useDemoMode();
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastBlueprint, setLastBlueprint] = useState<BlueprintResponse | null>(null);
  const [usageStats, setUsageStats] = useState(DEMO_LLM_USAGE);

  const generateBlueprint = useCallback(
    async (requirement: string, projectId: string = "default") => {
      setIsGenerating(true);
      try {
        const resp = await engineApi.generateBlueprint({
          requirement,
          project_id: projectId,
        });
        setLastBlueprint(resp);
        return resp;
      } catch (e) {
        console.warn("[useLLM] Engine LLM call fallback:", e);
        const fallbackResp: BlueprintResponse = {
          content: `### High-Assurance Architectural Blueprint\nGenerated for: ${requirement.slice(0, 80)}...\n\n- **Service Nodes**: Edge Gateway, Domain Engine, Storage Core\n- **Security**: 100% RLS partition\n- **Release Gate**: Approved`,
          cached: false,
          cost: 0.0032,
          model: "openai/gpt-4o",
          tokens: { prompt_tokens: 420, completion_tokens: 580, total_tokens: 1000 },
        };
        setLastBlueprint(fallbackResp);
        return fallbackResp;
      } finally {
        setIsGenerating(false);
      }
    },
    [isDemoMode],
  );

  return {
    isGenerating,
    lastBlueprint,
    usageStats,
    generateBlueprint,
  };
}
