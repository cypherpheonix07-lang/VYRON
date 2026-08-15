import { createClient } from "@supabase/supabase-js";

// Guard against SSR contexts where import.meta.env may be undefined
// (TanStack Start evaluates this module on the server during hydration)
const _env =
  typeof import.meta !== "undefined" && typeof import.meta.env !== "undefined"
    ? import.meta.env
    : ({} as Record<string, string>);

// Load Supabase configuration from environment variables
const supabaseUrl: string = _env["VITE_SUPABASE_URL"] ?? "";
const supabaseAnonKey: string =
  _env["VITE_SUPABASE_ANON_KEY"] ?? _env["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== "undefined") {
    console.warn(
      "[brahma] Supabase configuration missing — ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env",
    );
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "brahma.supabase.auth",
  },
});
