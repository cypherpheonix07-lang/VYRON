/**
 * PROJECT BRAHMA — ANALYSIS PLUGIN (PHASE B.1)
 * MCP Tool "run_analysis": Dual-mode pipeline execution.
 * Enforces zero direct Supabase imports (received via PluginContext).
 */

import { PluginTool, PluginContext, ToolResult } from "./types";
import { fixtureStore } from "@/services/fixtureStore";

export const analysisPluginTool: PluginTool = {
  name: "run_analysis",
  description: "Executes 8-stage architectural analysis pipeline (Requirements, Architecture, Tech Compare, Backend BP, Mock Data, AST Scan, Gate Eval, Report).",
  inputSchema: {
    type: "object",
    properties: {
      projectId: { type: "string", description: "Target project ID to analyze" },
      stages: {
        type: "array",
        description: "List of analysis stages to execute",
      },
    },
    required: ["projectId"],
  },
  handler: async (args: unknown, ctx: PluginContext): Promise<ToolResult> => {
    const { projectId, stages } = (args as { projectId?: string; stages?: string[] }) || {};

    if (ctx.isDemo) {
      // In demo mode: load fixture data and produce realistic stage outputs
      const domain = ctx.projectId ? "fintech" : "fintech";
      const fixture = fixtureStore.get(domain);

      return {
        isError: false,
        content: [
          {
            type: "text",
            value: `Demo Analysis Pipeline completed 8 stages for project '${fixture.project.name}' [${projectId || fixture.project.id}].`,
            metadata: {
              healthScore: fixture.project.healthScore,
              gateStatus: "RELEASE_BLOCKED",
              stagesCount: 8,
              simulated: true,
            },
          },
          {
            type: "artifact",
            value: JSON.stringify(
              {
                summary: `Evaluated 8 stages with 47 findings. Gate failures: Security (45/80), AST Complexity (61/70).`,
                vulnerabilitiesCount: fixture.vulnerabilities.length,
                findingsCount: fixture.codeFindings.length,
                nodesCount: fixture.blueprintNodes.length,
                healthScore: fixture.project.healthScore,
              },
              null,
              2
            ),
            metadata: {
              artifactType: "json",
              title: "Analysis Execution Summary",
            },
          },
          {
            type: "citation",
            value: "cite:sha256:d8c104e7a329b884102c91823a",
            metadata: {
              sha256: "d8c104e7a329b884102c91823a",
              label: "Gate Evaluation Record",
              source: "DemoStageRunner:fintech",
            },
          },
        ],
      };
    }

    // Live mode: call Supabase Edge function or compute engine
    try {
      const { data, error } = await ctx.supabase.functions.invoke("run-analysis", {
        body: { project_id: projectId, stages },
      });

      if (error) {
        // Fallback to FastAPI engine if Edge Function is in local setup
        const response = await fetch("http://localhost:8000/analyze/repo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repo_url: "https://github.com/demo/project" }),
        }).catch(() => null);

        if (response && response.ok) {
          const json = await response.json();
          return {
            isError: false,
            content: [
              {
                type: "text",
                value: `Analysis dispatched to Leviathan Engine (Task ID: ${json.task_id}).`,
                metadata: { taskId: json.task_id },
              },
            ],
          };
        }

        return {
          isError: true,
          content: [
            {
              type: "text",
              value: `Failed to execute live analysis: ${error.message || "Unknown error"}`,
            },
          ],
        };
      }

      return {
        isError: false,
        content: [
          {
            type: "text",
            value: "Live analysis completed successfully.",
          },
          {
            type: "artifact",
            value: typeof data === "string" ? data : JSON.stringify(data, null, 2),
            metadata: { artifactType: "json", title: "Live Analysis Output" },
          },
        ],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: "text", value: `Live analysis execution error: ${message}` }],
      };
    }
  },
};
