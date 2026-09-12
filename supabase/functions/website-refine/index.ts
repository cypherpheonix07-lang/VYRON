import { withSupabase } from "npm:@supabase/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RefineRequest {
  project_id?: string;
  user_feedback: string;
  target_section?: "frontend" | "backend" | "design" | "features" | "auto";
  current_project?: any;
}

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    try {
      const body: RefineRequest = await req.json().catch(() => ({ user_feedback: "" }));
      const feedback = body.user_feedback || "Refine blueprint";

      let project = body.current_project;
      if (!project && body.project_id && ctx.supabase) {
        const { data } = await ctx.supabase
          .from("website_projects")
          .select("*")
          .eq("id", body.project_id)
          .maybeSingle();
        project = data;
      }

      if (!project) {
        return new Response(
          JSON.stringify({ error: "Project not found for refinement" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const lower = feedback.toLowerCase();
      const updates: Record<string, any> = { updated_at: new Date().toISOString() };
      const changeSummaries: string[] = [];

      // Determine target section
      let section = body.target_section || "auto";
      if (section === "auto") {
        if (lower.includes("color") || lower.includes("theme") || lower.includes("font") || lower.includes("palette")) {
          section = "design";
        } else if (lower.includes("api") || lower.includes("route") || lower.includes("sql") || lower.includes("database") || lower.includes("table")) {
          section = "backend";
        } else if (lower.includes("page") || lower.includes("component") || lower.includes("ui") || lower.includes("modal")) {
          section = "frontend";
        } else {
          section = "frontend";
        }
      }

      // Perform partial mutation without wiping other sections
      if (section === "design") {
        const currentDs = project.design_system || {};
        if (lower.includes("violet") || lower.includes("purple")) {
          updates.design_system = {
            ...currentDs,
            presetName: "Midnight Violet",
            colors: {
              ...(currentDs.colors || {}),
              primary: "oklch(0.70 0.22 300)",
              secondary: "oklch(0.55 0.20 280)",
              accent: "oklch(0.75 0.18 160)",
            },
          };
          changeSummaries.push("Updated design system preset to Midnight Violet");
        } else {
          updates.design_system = {
            ...currentDs,
            colors: {
              ...(currentDs.colors || {}),
              primary: "oklch(0.78 0.19 160)",
            },
          };
          changeSummaries.push("Updated primary brand color token");
        }
      } else if (section === "backend") {
        const currentBackend = project.backend_blueprint || { apiRoutes: [], databaseSchema: { tables: [] } };
        const newRoute = {
          method: "POST" as const,
          path: "/api/export/csv",
          handlerName: "exportDataTableCsv",
          summary: "Streams formatted CSV file attachment with gzip compression.",
          authRequired: true,
        };

        updates.backend_blueprint = {
          ...currentBackend,
          apiRoutes: [...(currentBackend.apiRoutes || []), newRoute],
        };
        changeSummaries.push("Appended new POST /api/export/csv backend endpoint");
      } else {
        // Frontend mutation
        const currentFrontend = project.frontend_blueprint || { components: [], pages: [] };
        const newComp = {
          id: `comp-custom-${Date.now()}`,
          name: "ExportDataModal",
          type: "molecule" as const,
          purpose: "Modal dialog configuring CSV/JSON export options and column filters.",
          props: [
            { name: "isOpen", type: "boolean", required: true },
            { name: "onExport", type: "(format: string) => void", required: true },
          ],
          usedInPages: ["page-home", "page-catalog"],
        };

        updates.frontend_blueprint = {
          ...currentFrontend,
          components: [...(currentFrontend.components || []), newComp],
        };
        changeSummaries.push("Added new ExportDataModal component to frontend blueprint");
      }

      // Increment generation number
      let nextGenNumber = 4;
      if (ctx.supabase && body.project_id) {
        const { count } = await ctx.supabase
          .from("website_generations")
          .select("id", { count: "exact", head: true })
          .eq("website_project_id", body.project_id);

        nextGenNumber = (count || 0) + 1;

        await ctx.supabase
          .from("website_projects")
          .update(updates)
          .eq("id", body.project_id);

        await ctx.supabase.from("website_generations").insert({
          website_project_id: body.project_id,
          generation_number: nextGenNumber,
          trigger_type: "refinement",
          user_feedback: feedback,
          input_snapshot: { feedback, section },
          output_snapshot: updates,
          llm_metadata: { refiner: "brahma-refine-loop-v1" },
        });
      }

      return new Response(
        JSON.stringify({
          ok: true,
          section_modified: section,
          generation_number: nextGenNumber,
          summaries: changeSummaries,
          updated_project: {
            ...project,
            ...updates,
          },
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } catch (err: any) {
      console.error("[website-refine] Error:", err);
      return new Response(
        JSON.stringify({ error: err?.message || "Refinement failed" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  }),
};
