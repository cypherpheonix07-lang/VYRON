// Supabase Edge Function: github-webhook
// Validates incoming GitHub push webhook with HMAC-SHA256 signature and records push events into integration_events table.
import { withSupabase } from "npm:@supabase/server";

async function verifySignature(secret: string, headerSig: string | null, payload: string): Promise<boolean> {
  if (!headerSig || !headerSig.startsWith("sha256=")) return false;
  const signature = headerSig.replace("sha256=", "");

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const hex = Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hex === signature;
}

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const webhookSecret = Deno.env.get("GITHUB_WEBHOOK_SECRET") || "brahma-webhook-secret-2026";
      const signatureHeader = req.headers.get("x-hub-signature-256");
      const rawPayload = await req.text();

      // Verify HMAC signature
      const isValid = await verifySignature(webhookSecret, signatureHeader, rawPayload);
      if (!isValid) {
        return new Response(JSON.stringify({ error: "Unauthorized: Invalid HMAC signature" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const eventType = req.headers.get("x-github-event");
      const eventData = JSON.parse(rawPayload);

      if (eventType === "push") {
        const repoName = eventData.repository?.full_name || "unknown/repo";
        const branch = eventData.ref ? eventData.ref.replace("refs/heads/", "") : "main";
        const headCommit = eventData.head_commit || (eventData.commits && eventData.commits[0]);
        const commitSha = headCommit?.id?.substring(0, 7) || "HEAD";
        const message = headCommit?.message || "Repository push";
        const author = headCommit?.author?.name || eventData.pusher?.name || "GitHub User";
        const githubUsername = eventData.sender?.login || "";

        // Resolve user_id from user_integrations table
        let targetUserId: string | null = null;
        if (githubUsername) {
          const { data: userInt } = await ctx.supabase
            .from("user_integrations")
            .select("user_id")
            .eq("provider", "github")
            .ilike("username", githubUsername)
            .limit(1)
            .maybeSingle();

          targetUserId = userInt?.user_id || null;
        }

        if (!targetUserId) {
          // If no specific user mapped, take first active integration or log with system marker
          const { data: anyUser } = await ctx.supabase.from("user_integrations").select("user_id").limit(1).maybeSingle();
          targetUserId = anyUser?.user_id || null;
        }

        if (targetUserId) {
          const { error: insErr } = await ctx.supabase.from("integration_events").insert({
            user_id: targetUserId,
            provider: "github",
            repo: repoName,
            branch,
            commit_sha: commitSha,
            message,
            author,
            created_at: new Date().toISOString(),
          });

          if (insErr) {
            console.error("Failed to insert integration event:", insErr);
          }
        }
      }

      return new Response(JSON.stringify({ received: true, event: eventType }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("github-webhook error:", err);
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
};
