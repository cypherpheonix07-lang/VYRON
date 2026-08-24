import { withSupabase } from "npm:@supabase/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
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
      const { code } = await req.json();
      if (!code) {
        return new Response(JSON.stringify({ error: "Missing authorization code" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const clientId = Deno.env.get("GITHUB_CLIENT_ID") || "";
      const clientSecret = Deno.env.get("GITHUB_CLIENT_SECRET") || "";

      if (!clientId || !clientSecret) {
        return new Response(
          JSON.stringify({
            error: "GitHub OAuth credentials not configured on server (GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET missing).",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      // 1. Exchange code for access token
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        return new Response(JSON.stringify({ error: `GitHub OAuth exchange failed: ${errText}` }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;
      const scopes = tokenData.scope ? tokenData.scope.split(",") : ["repo", "read:user"];

      if (!accessToken) {
        return new Response(
          JSON.stringify({ error: tokenData.error_description || "Failed to obtain access token from GitHub" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // 2. Fetch GitHub User Profile
      const userRes = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "PROJECT-BRAHMA-App",
        },
      });

      if (!userRes.ok) {
        return new Response(JSON.stringify({ error: "Failed to retrieve GitHub user details" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const githubUser = await userRes.json();

      // 3. Upsert user_integrations with encrypted token using SQL pgp_sym_encrypt or RPC
      const userId = ctx.user.id;
      const integrationSecret = Deno.env.get("INTEGRATION_SECRET") || "brahma-default-key-sec-2026";

      // Execute upsert query with symmetric token encryption
      const { error: upsertErr } = await ctx.supabase.rpc("upsert_user_integration", {
        p_user_id: userId,
        p_provider: "github",
        p_external_id: String(githubUser.id),
        p_username: githubUser.login,
        p_avatar_url: githubUser.avatar_url,
        p_token: accessToken,
        p_secret: integrationSecret,
        p_scopes: scopes,
        p_repo_count: githubUser.public_repos + (githubUser.total_private_repos || 0),
      });

      if (upsertErr) {
        console.error("RPC integration upsert failed, attempting direct table insert:", upsertErr);
        // Fallback: direct table upsert without encryption function if RPC missing
        const { error: directErr } = await ctx.supabase.from("user_integrations").upsert({
          user_id: userId,
          provider: "github",
          external_id: String(githubUser.id),
          username: githubUser.login,
          avatar_url: githubUser.avatar_url,
          scopes,
          repo_count: githubUser.public_repos + (githubUser.total_private_repos || 0),
          connected_at: new Date().toISOString(),
        });

        if (directErr) {
          return new Response(JSON.stringify({ error: directErr.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      // Return user details ONLY (token is NEVER returned to client)
      return new Response(
        JSON.stringify({
          success: true,
          username: githubUser.login,
          avatar_url: githubUser.avatar_url,
          repo_count: githubUser.public_repos + (githubUser.total_private_repos || 0),
          connected_at: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      console.error("github-exchange exception:", err);
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
};
