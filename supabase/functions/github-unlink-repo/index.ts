import { withSupabase } from "npm:@supabase/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "DELETE, POST, OPTIONS",
};

async function decryptToken(hexString: string, secret: string): Promise<string> {
  let cleanHex = hexString;
  if (cleanHex.startsWith("\\x")) cleanHex = cleanHex.slice(2);
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  const iv = bytes.slice(0, 12);
  const ciphertext = bytes.slice(12);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.digest("SHA-256", enc.encode(secret));
  const key = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "DELETE" && req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    try {
      const body = await req.json();
      const { project_repo_id } = body;

      if (!project_repo_id) {
        return new Response(JSON.stringify({ error: "Missing required parameter: project_repo_id" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const userId = ctx.user.id;
      const integrationSecret = Deno.env.get("INTEGRATION_SECRET") || "brahma-default-key-sec-2026";

      // 1. Fetch project_repos row and check project ownership
      const { data: repoRow, error: repoErr } = await ctx.supabase
        .from("project_repos")
        .select(`
          id,
          project_id,
          github_account_id,
          repo_full_name,
          webhook_id,
          projects!inner(owner_id),
          github_accounts(access_token_encrypted)
        `)
        .eq("id", project_repo_id)
        .maybeSingle();

      if (repoErr || !repoRow) {
        return new Response(JSON.stringify({ error: "Project repository binding not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Check owner
      const projectOwnerId = (repoRow.projects as any)?.owner_id;
      if (projectOwnerId !== userId) {
        return new Response(
          JSON.stringify({ error: "Unauthorized: Caller does not own the project associated with this repository" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // 2. Delete webhook on GitHub if webhook_id exists
      const webhookId = repoRow.webhook_id;
      const rawToken = (repoRow.github_accounts as any)?.access_token_encrypted;

      if (webhookId && rawToken) {
        try {
          const accessToken = await decryptToken(rawToken, integrationSecret);
          if (accessToken && !accessToken.startsWith("gho_mock_") && !accessToken.startsWith("ghp_Mock")) {
            await fetch(`https://api.github.com/repos/${repoRow.repo_full_name}/hooks/${webhookId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "PROJECT-BRAHMA-App",
              },
            });
          }
        } catch (hookDelErr) {
          console.warn(`Could not delete remote webhook on GitHub for ${repoRow.repo_full_name}:`, hookDelErr);
        }
      }

      // 3. Delete row from project_repos table
      const { error: delErr } = await ctx.supabase
        .from("project_repos")
        .delete()
        .eq("id", project_repo_id);

      if (delErr) {
        throw delErr;
      }

      return new Response(JSON.stringify({ unlinked: true, id: project_repo_id }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } catch (err) {
      console.error("github-unlink-repo exception:", err);
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  }),
};
