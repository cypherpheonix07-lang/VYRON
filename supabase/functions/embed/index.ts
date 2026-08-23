// Supabase Edge Function: embed
// Feature extraction via Hugging Face Inference API (sentence-transformers/all-MiniLM-L6-v2)
import { withSupabase } from "npm:@supabase/server";

const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const HF_API_URL = `https://api-inference.huggingface.co/pipeline/feature-extraction/${HF_MODEL}`;

// Deterministic fallback embedding generator (384-dimensional normalized vector) when HF is offline
function generateDeterministicEmbedding(text: string): number[] {
  const dim = 384;
  const vec = new Array<number>(dim).fill(0);
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  words.forEach((word) => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = ((hash << 5) - hash + word.charCodeAt(i)) | 0;
    }
    const idx = Math.abs(hash) % dim;
    vec[idx] += 1;
    for (let i = 0; i < word.length - 2; i++) {
      const sub = word.substring(i, i + 3);
      let subHash = 0;
      for (let j = 0; j < sub.length; j++) subHash = ((subHash << 5) - subHash + sub.charCodeAt(j)) | 0;
      const subIdx = Math.abs(subHash) % dim;
      vec[subIdx] += 0.5;
    }
  });
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
        },
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: { code: "BRA-405", message: "Method not allowed" } }), {
        status: 405,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    try {
      const body = await req.json();
      const texts: string[] = body?.texts;

      if (!texts || !Array.isArray(texts) || texts.length === 0) {
        return new Response(
          JSON.stringify({ error: { code: "BRA-400", message: "Missing or invalid 'texts' array parameter." } }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          },
        );
      }

      const hfToken = Deno.env.get("HF_TOKEN") || Deno.env.get("HUGGINGFACE_TOKEN");

      if (!hfToken) {
        // Fallback gracefully to deterministic embeddings for local test/offline scenarios
        const fallbackEmbeddings = texts.map((t) => generateDeterministicEmbedding(t));
        return new Response(
          JSON.stringify({
            ok: true,
            embeddings: fallbackEmbeddings,
            model: HF_MODEL,
            dim: 384,
            provider: "deterministic-fallback",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          },
        );
      }

      const hfRes = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: texts,
          options: { wait_for_model: true },
        }),
      });

      if (!hfRes.ok) {
        const errText = await hfRes.text();
        console.warn(`HF Inference error (${hfRes.status}): ${errText}`);

        if (hfRes.status === 429 || hfRes.status === 503) {
          // Graceful fallback so dedup/caching doesn't crash
          const fallbackEmbeddings = texts.map((t) => generateDeterministicEmbedding(t));
          return new Response(
            JSON.stringify({
              ok: true,
              embeddings: fallbackEmbeddings,
              model: HF_MODEL,
              dim: 384,
              provider: "deterministic-fallback",
              warning: `Hugging Face returned ${hfRes.status}. Degrading to local normalized feature vectors.`,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            },
          );
        }

        return new Response(
          JSON.stringify({
            ok: false,
            error: { code: "BRA-503", message: `Hugging Face API error: ${errText}` },
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          },
        );
      }

      const result = await hfRes.json();
      return new Response(
        JSON.stringify({
          ok: true,
          embeddings: result,
          model: HF_MODEL,
          dim: 384,
          provider: "huggingface",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        },
      );
    } catch (err) {
      console.error("embed edge function exception:", err);
      return new Response(
        JSON.stringify({
          ok: false,
          error: { code: "BRA-500", message: (err as Error).message },
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        },
      );
    }
  }),
};
