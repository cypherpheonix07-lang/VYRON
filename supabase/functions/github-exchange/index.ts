import { withSupabase } from "npm:@supabase/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function encryptToken(token: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.digest("SHA-256", enc.encode(secret));
  const key = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(token)
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  let hex = "\\x";
  for (let i = 0; i < combined.length; i++) {
    hex += combined[i].toString(16).padStart(2, "0");
  }
  return hex;
}

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
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const clientId = Deno.env.get("GITHUB_CLIENT_ID") || "";
      const clientSecret = Deno.env.get("GITHUB_CLIENT_SECRET") || "";
      const integrationSecret = Deno.env.get("INTEGRATION_SECRET") || "brahma-default-key-sec-2026";
      const userId = ctx.user.id;

      let accessToken = "";
      let scopes = ["repo", "read:org", "read:user"];
      let githubUser: { id: number | string; login: string; avatar_url: string } | null = null;
      let orgs: Array<{ id: number | string; login: string; avatar_url: string }> = [];

      // If mock code in testing/dev environment
      if (code.startsWith("mock_") || (!clientId && code.startsWith("test_"))) {
        accessToken = `gho_mock_${code}_${Date.now()}`;
        githubUser = {
          id: 8821941,
          login: "brahma-developer",
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        };
        orgs = [
          {
            id: 991122,
            login: "brahma-labs",
            avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
          },
        ];
      } else {
        if (!clientId || !clientSecret) {
          return new Response(
            JSON.stringify({
              error: "GitHub OAuth credentials not configured (GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET missing).",
            }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // 1. Exchange code for access token with GitHub OAuth
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
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        const tokenData = await tokenRes.json();
        accessToken = tokenData.access_token;
        if (tokenData.scope) {
          scopes = tokenData.scope.split(",").map((s: string) => s.trim());
        }

        if (!accessToken) {
          return new Response(
            JSON.stringify({
              error: tokenData.error_description || "Failed to obtain access token from GitHub",
            }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // 2. Fetch GitHub Personal User Profile
        const userRes = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "PROJECT-BRAHMA-App",
          },
        });

        if (!userRes.ok) {
          return new Response(JSON.stringify({ error: "Failed to retrieve GitHub user profile" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }
        githubUser = await userRes.json();

        // 3. Fetch Organization Memberships
        const orgsRes = await fetch("https://api.github.com/user/orgs", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "PROJECT-BRAHMA-App",
          },
        });

        if (orgsRes.ok) {
          orgs = await orgsRes.json();
        }
      }

      if (!githubUser) {
        return new Response(JSON.stringify({ error: "Unable to identify GitHub account" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // 4. Build accounts array: [{login, type:'user'|'organization', avatar_url}]
      const accounts = [
        {
          login: githubUser.login,
          type: "user" as const,
          avatar_url: githubUser.avatar_url,
        },
        ...orgs.map((org) => ({
          login: org.login,
          type: "organization" as const,
          avatar_url: org.avatar_url,
        })),
      ];

      // 5. Encrypt access_token with symmetric AES-GCM / pgp_sym_encrypt using INTEGRATION_SECRET
      const encryptedToken = await encryptToken(accessToken, integrationSecret);

      // 6. Upsert into github_accounts table for each discovered identity
      for (const acc of accounts) {
        const { error: upsertErr } = await ctx.supabase
          .from("github_accounts")
          .upsert(
            {
              user_id: userId,
              github_login: acc.login,
              account_type: acc.type,
              avatar_url: acc.avatar_url,
              access_token_encrypted: encryptedToken,
              scopes,
              created_at: new Date().toISOString(),
            },
            { onConflict: "user_id,github_login" }
          );

        if (upsertErr) {
          console.error(`Failed to upsert github_account for ${acc.login}:`, upsertErr);
          throw upsertErr;
        }
      }

      // 7. Return discovered accounts to frontend (TOKEN NEVER RETURNED)
      return new Response(
        JSON.stringify({
          success: true,
          accounts,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (err) {
      console.error("github-exchange fatal exception:", err);
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  }),
};
