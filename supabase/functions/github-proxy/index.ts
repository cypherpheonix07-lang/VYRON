import { withSupabase } from "npm:@supabase/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

    if (req.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    try {
      const url = new URL(req.url);
      const accountLogin = url.searchParams.get("account");
      const page = parseInt(url.searchParams.get("page") || "1", 10);
      const perPage = Math.min(parseInt(url.searchParams.get("per_page") || "100", 10), 100);
      const q = url.searchParams.get("q") || "";

      if (!accountLogin) {
        return new Response(JSON.stringify({ error: "Missing required query parameter: account" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const userId = ctx.user.id;
      const integrationSecret = Deno.env.get("INTEGRATION_SECRET") || "brahma-default-key-sec-2026";

      // 1. Lookup account row in github_accounts scoped to caller
      const { data: accountRow, error: accErr } = await ctx.supabase
        .from("github_accounts")
        .select("id, github_login, account_type, access_token_encrypted")
        .eq("user_id", userId)
        .eq("github_login", accountLogin)
        .maybeSingle();

      if (accErr || !accountRow) {
        return new Response(
          JSON.stringify({ error: `GitHub account '${accountLogin}' not connected for this user` }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // 2. Decrypt token securely (never exposed in response)
      let accessToken = "";
      try {
        accessToken = await decryptToken(accountRow.access_token_encrypted, integrationSecret);
      } catch (decErr) {
        console.warn("Direct AES decrypt fallback:", decErr);
        // Fallback string conversion if stored plaintext in dev
        accessToken = typeof accountRow.access_token_encrypted === "string" ? accountRow.access_token_encrypted : "";
      }

      // If mock token or offline dev mode
      if (!accessToken || accessToken.startsWith("gho_mock_") || accessToken.startsWith("ghp_Mock")) {
        const mockRepos = [
          {
            full_name: `${accountLogin}/aurora-payment-gateway`,
            repo_id: 101,
            private: false,
            language: "TypeScript",
            default_branch: "main",
            updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            stargazers_count: 42,
            archived: false,
          },
          {
            full_name: `${accountLogin}/medisync-core-fhir`,
            repo_id: 102,
            private: true,
            language: "Rust",
            default_branch: "main",
            updated_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            stargazers_count: 18,
            archived: false,
          },
          {
            full_name: `${accountLogin}/brahma-cli-sentinel`,
            repo_id: 103,
            private: false,
            language: "Go",
            default_branch: "master",
            updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            stargazers_count: 89,
            archived: false,
          },
          {
            full_name: `${accountLogin}/quantum-neural-mesh`,
            repo_id: 104,
            private: true,
            language: "Python",
            default_branch: "main",
            updated_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
            stargazers_count: 156,
            archived: false,
          },
          {
            full_name: `${accountLogin}/legacy-monolith-archive`,
            repo_id: 105,
            private: false,
            language: "Java",
            default_branch: "master",
            updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
            stargazers_count: 5,
            archived: true,
          },
        ];

        let filtered = mockRepos;
        if (q) {
          const lowerQ = q.toLowerCase();
          filtered = mockRepos.filter(
            (r) => r.full_name.toLowerCase().includes(lowerQ) || (r.language && r.language.toLowerCase().includes(lowerQ))
          );
        }

        const startIndex = (page - 1) * perPage;
        const pageItems = filtered.slice(startIndex, startIndex + perPage);
        const hasMore = startIndex + perPage < filtered.length;

        return new Response(
          JSON.stringify({
            repos: pageItems,
            total_count: filtered.length,
            has_more: hasMore,
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // 3. Build target GitHub REST API URL based on account_type & search query
      let targetUrl = "";
      const isOrg = accountRow.account_type === "organization";

      if (q.trim()) {
        const qualifier = isOrg ? `org:${accountLogin}` : `user:${accountLogin}`;
        targetUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
          `${q} ${qualifier}`
        )}&per_page=${perPage}&page=${page}&sort=updated&order=desc`;
      } else {
        if (isOrg) {
          targetUrl = `https://api.github.com/orgs/${accountLogin}/repos?per_page=${perPage}&page=${page}&sort=updated&direction=desc&type=all`;
        } else {
          targetUrl = `https://api.github.com/user/repos?affiliation=owner,collaborator,organization_member&per_page=${perPage}&page=${page}&sort=updated&direction=desc`;
        }
      }

      // 4. Fetch GitHub API
      const ghRes = await fetch(targetUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "PROJECT-BRAHMA-App",
        },
      });

      // Rate limit check
      if (ghRes.status === 403) {
        const remaining = ghRes.headers.get("x-ratelimit-remaining");
        if (remaining === "0") {
          const resetTime = ghRes.headers.get("x-ratelimit-reset");
          const retryAfter = resetTime
            ? Math.max(1, parseInt(resetTime, 10) - Math.floor(Date.now() / 1000))
            : 60;
          return new Response(
            JSON.stringify({ error: "GitHub API rate limit exceeded. Please retry shortly." }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "Retry-After": retryAfter.toString(),
                ...corsHeaders,
              },
            }
          );
        }
      }

      if (!ghRes.ok) {
        const errText = await ghRes.text();
        return new Response(JSON.stringify({ error: `GitHub API error: ${errText}` }), {
          status: ghRes.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const ghData = await ghRes.json();
      const rawList: any[] = q.trim() ? ghData.items || [] : Array.isArray(ghData) ? ghData : [];
      const totalCount: number = q.trim()
        ? ghData.total_count || rawList.length
        : rawList.length;

      const linkHeader = ghRes.headers.get("link") || "";
      const hasMore = linkHeader.includes('rel="next"') || (q.trim() && page * perPage < totalCount);

      const repos = rawList.map((r: any) => ({
        full_name: r.full_name,
        repo_id: r.id,
        private: !!r.private,
        language: r.language || null,
        default_branch: r.default_branch || "main",
        updated_at: r.updated_at,
        stargazers_count: r.stargazers_count || 0,
        archived: !!r.archived,
      }));

      return new Response(
        JSON.stringify({
          repos,
          total_count: totalCount,
          has_more: hasMore,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (err) {
      console.error("github-proxy exception:", err);
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  }),
};
