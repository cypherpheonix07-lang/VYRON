/**
 * PROJECT BRAHMA — KAGGLE PROXY EDGE FUNCTION (PHASE K.2, FL-02-C)
 * Proxies Kaggle public API requests with Basic Auth and rate limiting (10 req/min).
 * Credentials stay on the server; the browser never accesses Kaggle API directly.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// In-memory rate limiting bucket per IP (10 req/min)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 60_000 });
    return true;
  }

  if (entry.count >= 10) {
    return false;
  }

  entry.count += 1;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for") || "unknown-client";
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded. Max 10 Kaggle requests per minute allowed.",
        code: "BRA-604-RATE-LIMIT",
      }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { action, params } = await req.json();
    const username = Deno.env.get("KAGGLE_USERNAME");
    const key = Deno.env.get("KAGGLE_API_KEY");

    if (!username || !key) {
      return new Response(
        JSON.stringify({
          error: "Kaggle credentials not configured in Supabase environment secrets.",
          code: "BRA-KAGGLE-NO-CREDS",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = `Basic ${btoa(`${username}:${key}`)}`;
    const baseUrl = "https://www.kaggle.com/api/v1";

    if (action === "search") {
      const query = encodeURIComponent(params?.query || "software code quality");
      const maxResults = params?.maxResults || 20;
      const res = await fetch(`${baseUrl}/datasets/list?search=${query}&sort=hottest&maxResults=${maxResults}`, {
        headers: { Authorization: authHeader },
      });

      if (!res.ok) {
        throw new Error(`Kaggle API returned status ${res.status}`);
      }

      const raw = await res.json();
      const datasets = (raw || []).map((item: any) => ({
        ref: item.ref,
        title: item.title || item.ref,
        subtitle: item.subtitle || "",
        url: item.url || `https://www.kaggle.com/datasets/${item.ref}`,
        totalBytes: item.totalBytes || 0,
        usabilityRating: item.usabilityRating || 0,
        tags: (item.tags || []).map((t: any) => (typeof t === "string" ? t : t.name)),
        ownerName: item.ownerName || item.ownerRef || "Kaggle Contributor",
      }));

      return new Response(JSON.stringify({ datasets }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "files") {
      const { datasetRef } = params;
      const [owner, name] = datasetRef.split("/");
      const res = await fetch(`${baseUrl}/datasets/${owner}/${name}/files`, {
        headers: { Authorization: authHeader },
      });

      if (!res.ok) throw new Error(`Kaggle API returned status ${res.status}`);
      const raw = await res.json();
      return new Response(JSON.stringify({ files: raw.datasetFiles || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "download") {
      const { datasetRef, fileName } = params;
      const [owner, name] = datasetRef.split("/");
      const res = await fetch(`${baseUrl}/datasets/${owner}/${name}/download/${fileName}`, {
        headers: { Authorization: authHeader },
      });

      if (!res.ok) throw new Error(`Kaggle API returned status ${res.status}`);
      const csv = await res.text();
      return new Response(JSON.stringify({ csv: csv.slice(0, 1_000_000) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: `Unknown action: ${action}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: msg, code: "BRA-KAGGLE-PROXY-ERROR" }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
