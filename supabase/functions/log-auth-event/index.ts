// Supabase Edge Function: log-auth-event
// Ingests auth events, resolves IP/Geo, parses UA, and records into auth_events table.
import { withSupabase } from "npm:@supabase/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-forwarded-for, cf-connecting-ip, x-real-ip",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
};

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    // 1. Handle CORS Preflight OPTIONS Request
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
      const body = await req.json();
      const { event, method, status, user_id, email, user_agent } = body;

      if (!event || !method || !status || !email) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Extract client IP from headers
      const clientIp =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("cf-connecting-ip") ||
        req.headers.get("x-real-ip") ||
        "127.0.0.1";

      // Server-side User Agent parsing
      const ua = user_agent || req.headers.get("user-agent") || "";
      let device_type = "desktop";
      if (/mobile|iphone|ipod|android/i.test(ua)) device_type = "mobile";
      else if (/ipad|tablet/i.test(ua)) device_type = "tablet";

      let browser = "Chrome";
      if (/edg/i.test(ua)) browser = "Edge";
      else if (/firefox/i.test(ua)) browser = "Firefox";
      else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
      else if (/opr|opera/i.test(ua)) browser = "Opera";

      let os = "Windows";
      if (/macintosh|mac os x/i.test(ua)) os = "macOS";
      else if (/linux/i.test(ua)) os = "Linux";
      else if (/android/i.test(ua)) os = "Android";
      else if (/iphone|ipad|ios/i.test(ua)) os = "iOS";

      // Geographic lookup (best-effort)
      let country = "India";
      let city = "Bengaluru";

      if (clientIp && clientIp !== "127.0.0.1" && !clientIp.startsWith("192.168.") && !clientIp.startsWith("10.")) {
        try {
          const geoRes = await fetch(`https://ipwho.is/${clientIp}`, { signal: AbortSignal.timeout(1500) });
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.success) {
              country = geoData.country || country;
              city = geoData.city || city;
            }
          }
        } catch {
          // Fallback to default geo
        }
      }

      // Insert event into public.auth_events using service client
      const { error } = await ctx.supabase.from("auth_events").insert({
        user_id: user_id || null,
        email,
        event,
        method,
        status,
        ip: clientIp,
        country,
        city,
        device_type,
        browser,
        os,
        user_agent: ua,
      });

      if (error) {
        console.error("Failed to insert auth event:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      return new Response(JSON.stringify({ success: true, logged_event: event }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } catch (err) {
      console.error("log-auth-event exception:", err);
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  }),
};
