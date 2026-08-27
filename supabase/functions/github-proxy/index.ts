import { withSupabase } from "npm:@supabase/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    try {
      const url = new URL(req.url);
      const apiPath = url.searchParams.get("path") || "/user/repos";
      const userId = ctx.user.id;
      const integrationSecret = Deno.env.get("INTEGRATION_SECRET") || "brahma-default-key-sec-2026";

      // 1. Retrieve user's integration record
      const { data: integration, error: intErr } = await ctx.supabase
        .from("user_integrations")
        .select("access_token, username, provider")
        .eq("user_id", userId)
        .eq("provider", "github")
        .single();

      if (intErr || !integration) {
        return new Response(
          JSON.stringify({ error: "GitHub account not connected for this user" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // If token is encrypted or plaintext
      let token = "";
      if (integration.access_token) {
        try {
          // Attempt decrypt RPC if token is bytea
          const { data: decToken, error: decErr } = await ctx.supabase.rpc("decrypt_user_token", {
            p_user_id: userId,
            p_provider: "github",
            p_secret: integrationSecret,
          });
          token = decToken || "";
        } catch {
          // Fallback to direct token if stored directly in dev
          token = typeof integration.access_token === "string" ? integration.access_token : "";
        }
      }

      // 2. Call GitHub REST API with the decrypted token
      const targetUrl = `https://api.github.com${apiPath.startsWith("/") ? apiPath : `/${apiPath}`}`;
      const ghRes = await fetch(targetUrl, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "PROJECT-BRAHMA-App",
        },
      });

      if (!ghRes.ok) {
        const errBody = await ghRes.text();
        return new Response(JSON.stringify({ error: `GitHub API error: ${errBody}` }), {
          status: ghRes.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = await ghRes.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("github-proxy exception:", err);
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
};
