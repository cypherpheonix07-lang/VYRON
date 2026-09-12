/**
 * PROJECT BRAHMA — LIVE CONTEXT BUILDER (FL-03-B STEP 1)
 * Assembles project metadata, scan findings, and gate evaluations from Supabase into grounded RAG context.
 */

import { supabase } from "@/lib/supabaseClient";

export interface LiveChatContext {
  userId: string;
  projectId?: string | undefined;
  systemPrompt: string;
  projectSummary?: string | undefined;
}

export async function buildLiveChatContext(
  userId: string,
  projectId?: string
): Promise<LiveChatContext> {
  let projectSnippet = "No specific project selected.";
  let scanSnippet = "No recent scans available.";
  let gateSnippet = "Gates not evaluated yet.";

  try {
    if (projectId) {
      const { data: project } = await supabase
        .from("projects")
        .select("id, name, description, health_score, status")
        .eq("id", projectId)
        .maybeSingle();

      if (project) {
        projectSnippet = `Active Project: "${project.name}" (ID: ${project.id})\nStatus: ${project.status}, Health Score: ${project.health_score ?? "N/A"}/100\nDescription: ${project.description || "N/A"}`;
      }

      const { data: scan } = await supabase
        .from("scans")
        .select("id, total_findings, critical_count, high_count, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (scan) {
        scanSnippet = `Latest Scan: ${scan.total_findings} findings (${scan.high_count || 0} HIGH, ${scan.critical_count || 0} CRITICAL) run on ${scan.created_at}`;
      }

      const { data: gates } = await supabase
        .from("gate_evaluations")
        .select("gate_name, passed, score, threshold")
        .eq("project_id", projectId)
        .order("gate_id", { ascending: true });

      if (gates && gates.length > 0) {
        gateSnippet = `Gate Evaluations:\n` + gates.map((g: any) => `- ${g.gate_name}: ${g.passed ? "PASS" : "FAIL"} (${g.score}/${g.threshold})`).join("\n");
      }
    }
  } catch (err) {
    console.warn("[liveContextBuilder] Context gathering error:", err);
  }

  const systemPrompt = `You are the PROJECT BRAHMA AI Architecture and Quality Assistant.
Ground your responses strictly in verified telemetry and architectural facts.

CONTEXT:
${projectSnippet}

${scanSnippet}

${gateSnippet}

INVARIANTS:
- Cite findings when referring to specific vulnerabilities or metrics using [cite:label:source:sha256].
- When asked about release gates, verify against the score thresholds before stating pass/fail.
- Maintain professional, precise, and direct engineering guidance.`;

  return {
    userId,
    projectId,
    systemPrompt,
    projectSummary: projectSnippet,
  };
}
