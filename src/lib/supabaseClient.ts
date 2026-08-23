import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Guard against SSR contexts where import.meta.env may be undefined
// (TanStack Start evaluates this module on the server during hydration)
const _env =
  typeof import.meta !== "undefined" && typeof import.meta.env !== "undefined"
    ? import.meta.env
    : ({} as Record<string, string>);

const supabaseUrl: string = _env["VITE_SUPABASE_URL"] ?? process.env?.["VITE_SUPABASE_URL"] ?? "";
const supabaseAnonKey: string =
  _env["VITE_SUPABASE_ANON_KEY"] ??
  _env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
  process.env?.["VITE_SUPABASE_ANON_KEY"] ??
  process.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
  "";

// HARD VALIDATION — FAIL FAST, FAIL LOUD
if (!supabaseUrl && typeof window !== "undefined") {
  throw new Error(
    "[BRAHMA] VITE_SUPABASE_URL is not set. The app cannot function without it. Check your .env file.",
  );
}

if (!supabaseAnonKey && typeof window !== "undefined") {
  throw new Error(
    "[BRAHMA] VITE_SUPABASE_ANON_KEY is not set. The app cannot function without it. Check your .env file.",
  );
}

// Validate URL format if provided
if (supabaseUrl && typeof window !== "undefined") {
  try {
    new URL(supabaseUrl);
  } catch {
    throw new Error(`[BRAHMA] VITE_SUPABASE_URL is malformed: "${supabaseUrl}"`);
  }
}

// THE SINGLETON
let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  _client = createClient(supabaseUrl || "https://hbbunfizlwgvripgwzdo.supabase.co", supabaseAnonKey || "sb_publishable_placeholder", {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      storageKey: "brahma-auth-token",
      flowType: "pkce",
    },
    global: {
      headers: {
        "x-client-info": "brahma-insights/1.0",
      },
    },
    db: {
      schema: "public",
    },
  });

  return _client;
}

// Named export for convenience — same singleton every time
export const supabase = getSupabaseClient();

// Type export for use in components
export type { SupabaseClient };
