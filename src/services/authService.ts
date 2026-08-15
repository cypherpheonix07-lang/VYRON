/**
 * authService — canonical authentication service
 *
 * LAWS:
 *  - This is the ONLY module that calls supabase.auth.* (besides supabaseClient.ts itself).
 *  - No method throws. Every method returns AuthResponse<T>.
 *  - All UI pages must consume this module exclusively.
 *
 * DEMO_MODE: controlled by VITE_DEMO_MODE env var. When false (production), all demo
 * branches are dead code. They are kept for local testing convenience.
 */

import { supabase } from "../lib/supabaseClient";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import type { Role } from "../lib/auth";
import { logAuthEvent } from "../lib/api";

export { logAuthEvent };

// ─── Constants ──────────────────────────────────────────────────────────────

const DEMO_MODE = import.meta.env["VITE_DEMO_MODE"] === "true";
const APP_URL =
  typeof window !== "undefined"
    ? (import.meta.env["VITE_APP_URL"] ?? window.location.origin)
    : import.meta.env["VITE_APP_URL"] ?? "http://localhost:8081";

export const DEMO_KEY = "brahma.demo_user";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AuthErrorCode =
  | "invalid_credentials"
  | "email_not_confirmed"
  | "email_exists"
  | "rate_limited"
  | "invalid_api_key"
  | "network"
  | "weak_password"
  | "provider_error"
  | "not_implemented"
  | "unknown";

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  raw?: string;
}

export interface AuthResponse<T = undefined> {
  ok: boolean;
  data?: T;
  error?: AuthError;
}

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  onboarded: boolean;
  avatarUrl?: string;
  isDemo?: boolean;
}

export interface DemoSession {
  user: DemoUser;
  expires_at: number;
  access_token?: string;
  refresh_token?: string;
}

// ─── Error Classifier ────────────────────────────────────────────────────────

const classify = (raw?: string): AuthErrorCode => {
  const m = (raw ?? "").toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid credentials")) return "invalid_credentials";
  if (m.includes("email not confirmed")) return "email_not_confirmed";
  if (m.includes("already registered") || m.includes("user already registered")) return "email_exists";
  if (m.includes("rate limit") || m.includes("too many")) return "rate_limited";
  if (m.includes("api key") || m.includes("anon key") || m.includes("invalid key")) return "invalid_api_key";
  if (m.includes("failed to fetch") || m.includes("network") || m.includes("fetch")) return "network";
  if (m.includes("password") && m.includes("weak")) return "weak_password";
  if (m.includes("provider") || m.includes("oauth")) return "provider_error";
  return "unknown";
};

const HUMAN: Record<AuthErrorCode, string> = {
  invalid_credentials: "Incorrect email or password.",
  email_not_confirmed: "Email not confirmed. Check your inbox.",
  email_exists: "Already registered. Sign in instead.",
  rate_limited: "Too many attempts. Wait 30 seconds and retry.",
  invalid_api_key: "Supabase key misconfigured — contact support.",
  network: "Network error. Check your connection.",
  weak_password: "Password too weak. Use uppercase, numbers, and symbols.",
  provider_error: "OAuth provider misconfigured — check the Supabase dashboard.",
  not_implemented: "This feature is not enabled in this build.",
  unknown: "Unexpected authentication error.",
};

const fail = <T,>(raw?: string): AuthResponse<T> => {
  const code = classify(raw);
  return { ok: false, error: { code, message: HUMAN[code], raw } };
};

// ─── Demo Listener Registry ──────────────────────────────────────────────────

type AuthStateCallback = (
  event: AuthChangeEvent | "INITIAL_SESSION",
  session: { user: unknown } | null,
) => void;
const demoListeners = new Set<AuthStateCallback>();

function notifyDemoListeners(
  event: AuthChangeEvent | "INITIAL_SESSION",
  session: { user: unknown } | null,
) {
  demoListeners.forEach((cb) => {
    try {
      cb(event, session);
    } catch (e) {
      console.error("[authService] Demo listener error:", e);
    }
  });
}

// Sync demo state across tabs
if (typeof window !== "undefined" && DEMO_MODE) {
  window.addEventListener("storage", (e) => {
    if (e.key === DEMO_KEY) {
      if (e.newValue) {
        try {
          notifyDemoListeners("SIGNED_IN", { user: JSON.parse(e.newValue) });
        } catch {
          notifyDemoListeners("SIGNED_OUT", null);
        }
      } else {
        notifyDemoListeners("SIGNED_OUT", null);
      }
    }
  });
}

// ─── authService ─────────────────────────────────────────────────────────────

export const authService = {
  // ── Identity helpers ─────────────────────────────────────────────────────

  isDemoMode(): boolean {
    return DEMO_MODE;
  },

  isOAuthProviderEnabled(provider: "google" | "github" | "gitlab"): boolean {
    if (provider === "google") return import.meta.env["VITE_OAUTH_GOOGLE"] !== "false";
    if (provider === "github") return import.meta.env["VITE_OAUTH_GITHUB"] !== "false";
    if (provider === "gitlab") return import.meta.env["VITE_OAUTH_GITLAB"] === "true";
    return false;
  },

  // ── Session ──────────────────────────────────────────────────────────────

  async getSession(): Promise<AuthResponse<Session | null>> {
    if (DEMO_MODE) {
      const raw = localStorage.getItem(DEMO_KEY);
      if (raw) {
        try {
          const user = JSON.parse(raw);
          const session: DemoSession = {
            user,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            access_token: "demo-bearer-token",
          };
          return { ok: true, data: session as unknown as Session };
        } catch {
          return { ok: true, data: null };
        }
      }
      return { ok: true, data: null };
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      return error ? fail(error.message) : { ok: true, data: data.session };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  onAuthStateChange(callback: AuthStateCallback) {
    if (DEMO_MODE) {
      demoListeners.add(callback);
      const raw = localStorage.getItem(DEMO_KEY);
      try {
        const user = raw ? JSON.parse(raw) : null;
        callback("INITIAL_SESSION", user ? { user } : null);
      } catch {
        callback("INITIAL_SESSION", null);
      }
      return {
        data: {
          subscription: {
            unsubscribe() {
              demoListeners.delete(callback);
            },
          },
        },
      };
    }

    return supabase.auth.onAuthStateChange(
      callback as unknown as (event: AuthChangeEvent, session: Session | null) => void,
    );
  },

  async setSession(tokens: {
    access_token: string;
    refresh_token: string;
  }): Promise<AuthResponse<Session | null>> {
    if (DEMO_MODE) return { ok: true, data: null };
    try {
      const { data, error } = await supabase.auth.setSession(tokens);
      return error ? fail(error.message) : { ok: true, data: data.session };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  // ── Password Auth ─────────────────────────────────────────────────────────

  async signInWithPassword(
    email: string,
    password: string,
  ): Promise<AuthResponse<Session>> {
    if (DEMO_MODE) {
      if (!email.includes("@"))
        return fail("Invalid email format");
      if (password.length < 8)
        return fail("Password must be at least 8 characters");

      let role: Role = "Student";
      const stored = localStorage.getItem(DEMO_KEY);
      if (stored) {
        try { role = (JSON.parse(stored) as DemoUser).role || role; } catch { /* ignore */ }
      }
      const user: DemoUser = {
        id: "demo-student-id",
        email: email.trim(),
        name: email.split("@")[0] || "Demo User",
        role,
        onboarded: false,
        isDemo: true,
      };
      localStorage.setItem(DEMO_KEY, JSON.stringify(user));
      const session = { user, expires_at: Math.floor(Date.now() / 1000) + 3600 };
      notifyDemoListeners("SIGNED_IN", session);
      return { ok: true, data: session as unknown as Session };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        logAuthEvent({ event: "failed_password", method: "Password", status: "failed", email: email.trim() }).catch(() => undefined);
        return fail(error.message);
      }
      logAuthEvent({ event: "signed_in", method: "Password", status: "success", email: email.trim(), user_id: data.user?.id }).catch(() => undefined);
      return { ok: true, data: data.session as Session };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  async signUp(
    emailOrFullName: string,
    passwordOrEmail: string,
    options?: { data?: Record<string, unknown> },
  ): Promise<AuthResponse<{ session: Session | null }>> {
    // Support both old (email, password, opts) and new (fullName, email, password) signatures
    // Current callers use old signature: signUp(email, password, { data: {...} })
    const email = emailOrFullName.trim();
    const password = passwordOrEmail;

    if (DEMO_MODE) {
      if (!email.includes("@"))
        return fail("Invalid email format");
      if (password.length < 8)
        return fail("Password must be at least 8 characters");

      const role = (options?.data?.["role"] as Role) || "Student";
      const name =
        (options?.data?.["full_name"] as string) || email.split("@")[0] || "User";
      const user: DemoUser = {
        id: "demo-signup-id",
        email,
        name,
        role,
        onboarded: false,
        isDemo: true,
      };
      localStorage.setItem(DEMO_KEY, JSON.stringify(user));
      const session = { user, expires_at: Math.floor(Date.now() / 1000) + 3600 };
      notifyDemoListeners("SIGNED_IN", session);
      return { ok: true, data: { session: session as unknown as Session } };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${APP_URL}/auth/callback`,
          data: options?.data ?? {},
        },
      });
      if (error) {
        logAuthEvent({ event: "sign_up", method: "Password", status: "failed", email }).catch(() => undefined);
        return fail(error.message);
      }
      logAuthEvent({ event: "sign_up", method: "Password", status: "success", email, user_id: data.user?.id }).catch(() => undefined);
      return { ok: true, data: { session: data.session } };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  // ── Magic Link / OTP ──────────────────────────────────────────────────────

  async sendMagicLink(email: string): Promise<AuthResponse> {
    return this.signInWithOtp(email);
  },

  async signInWithOtp(email: string): Promise<AuthResponse> {
    if (DEMO_MODE) {
      logAuthEvent({ event: "magic_link", method: "Magic Link", status: "success", email: email.trim() }).catch(() => undefined);
      return { ok: true };
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${APP_URL}/auth/callback` },
      });
      if (error) return fail(error.message);
      logAuthEvent({ event: "magic_link", method: "Magic Link", status: "success", email: email.trim() }).catch(() => undefined);
      return { ok: true };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  async verifyOtp(
    email: string,
    token: string,
    type: "email" | "magiclink" | "signup" | "recovery" | "invite" = "email",
  ): Promise<AuthResponse<Session>> {
    if (DEMO_MODE) {
      if (token.length !== 6) return fail("OTP code must be exactly 6 digits.");
      const stored = localStorage.getItem(DEMO_KEY);
      let user: DemoUser;
      if (stored) {
        user = { ...JSON.parse(stored), onboarded: true };
      } else {
        user = {
          id: "demo-otp-user",
          email: email.trim(),
          name: email.split("@")[0] || "User",
          role: "Student",
          onboarded: true,
          isDemo: true,
        };
      }
      localStorage.setItem(DEMO_KEY, JSON.stringify(user));
      const session = { user, expires_at: Math.floor(Date.now() / 1000) + 3600 };
      notifyDemoListeners("SIGNED_IN", session);
      return { ok: true, data: session as unknown as Session };
    }

    try {
      const otpType =
        type === "magiclink" ? "magiclink" : type === "recovery" ? "recovery" : "signup";
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: token.trim(),
        type: otpType,
      });
      return error ? fail(error.message) : { ok: true, data: data.session as Session };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  async resendOtp(
    email: string,
    type: "signup" | "signup_user_confirmation" | "sms" = "signup",
  ): Promise<AuthResponse> {
    if (DEMO_MODE) return { ok: true };
    try {
      const { error } = await supabase.auth.resend({
        email: email.trim(),
        type: type as "signup",
      });
      return error ? fail(error.message) : { ok: true };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  // ── OAuth ─────────────────────────────────────────────────────────────────

  async signInWithOAuth(
    provider: "google" | "github" | "gitlab",
  ): Promise<AuthResponse> {
    if (!this.isOAuthProviderEnabled(provider)) {
      logAuthEvent({ event: "oauth", method: `${provider.toUpperCase()} OAuth`, status: "failed", email: `oauth.${provider}@brahma.dev` }).catch(() => undefined);
      return fail(`OAuth misconfigured — ${provider} is disabled in this environment.`);
    }

    if (DEMO_MODE) {
      const user: DemoUser = {
        id: `demo-${provider}-user`,
        email: `${provider}.user@brahma.dev`,
        name: provider === "github" ? "GitHub Developer" : "Google Operator",
        role: "Startup",
        onboarded: true,
        isDemo: true,
      };
      localStorage.setItem(DEMO_KEY, JSON.stringify(user));
      notifyDemoListeners("SIGNED_IN", { user });
      return { ok: true };
    }

    try {
      const options: { redirectTo: string; queryParams?: Record<string, string> } = {
        redirectTo: `${APP_URL}/auth/callback`,
      };
      if (provider === "google") {
        options.queryParams = { access_type: "offline", prompt: "consent" };
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as "google" | "github",
        options,
      });
      if (error) {
        logAuthEvent({ event: "oauth", method: `${provider.toUpperCase()} OAuth`, status: "failed", email: `oauth.${provider}@brahma.dev` }).catch(() => undefined);
        return fail(error.message);
      }
      return { ok: true };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  async signInWithSSO(domain: string): Promise<AuthResponse> {
    if (DEMO_MODE) {
      const user: DemoUser = {
        id: "demo-sso-user",
        email: `operator@${domain.trim()}`,
        name: "Enterprise Operator",
        role: "Admin",
        onboarded: true,
        isDemo: true,
      };
      localStorage.setItem(DEMO_KEY, JSON.stringify(user));
      notifyDemoListeners("SIGNED_IN", { user });
      return { ok: true };
    }
    try {
      const { error } = await supabase.auth.signInWithSSO({
        domain: domain.trim(),
        options: { redirectTo: `${APP_URL}/auth/callback` },
      });
      return error ? fail(error.message) : { ok: true };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  async signInWithPasskey(): Promise<AuthResponse> {
    if (DEMO_MODE) {
      const user: DemoUser = {
        id: "demo-passkey-user",
        email: "passkey.user@brahma.dev",
        name: "Biometric Operator",
        role: "Admin",
        onboarded: true,
        isDemo: true,
      };
      localStorage.setItem(DEMO_KEY, JSON.stringify(user));
      notifyDemoListeners("SIGNED_IN", { user });
      return { ok: true };
    }
    return fail(
      "WebAuthn / Passkey sign-in requires domain HTTPS verification and registered WebAuthn credentials.",
    );
  },

  // ── PKCE Code Exchange ────────────────────────────────────────────────────

  async exchangeCodeForSession(code: string): Promise<AuthResponse<Session | null>> {
    if (DEMO_MODE) return this.getSession();
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      return error ? fail(error.message) : { ok: true, data: data.session };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  // ── Password Reset ────────────────────────────────────────────────────────

  async resetPasswordForEmail(email: string): Promise<AuthResponse> {
    if (DEMO_MODE) return { ok: true };
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${APP_URL}/reset-password`,
      });
      return error ? fail(error.message) : { ok: true };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  async updatePassword(password: string): Promise<AuthResponse> {
    if (DEMO_MODE) {
      if (password.length < 8) return fail("Password must be at least 8 characters");
      return { ok: true };
    }
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return error ? fail(error.message) : { ok: true };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  // ── Sign Out ──────────────────────────────────────────────────────────────

  async signOut(scope: "local" | "others" | "global" = "local"): Promise<AuthResponse> {
    if (DEMO_MODE) {
      if (scope !== "others") {
        localStorage.removeItem(DEMO_KEY);
        notifyDemoListeners("SIGNED_OUT", null);
      }
      logAuthEvent({ event: "sign_out", method: scope === "others" ? "Revoke Other Sessions" : "Session", status: "success", email: "demo@brahma.dev" }).catch(() => undefined);
      return { ok: true };
    }

    try {
      // Get current email for audit log before signing out
      let emailForLog = "unknown@brahma.dev";
      const { data: sd } = await supabase.auth.getSession();
      if (sd?.session?.user?.email) emailForLog = sd.session.user.email;

      const { error } = await supabase.auth.signOut({ scope });
      if (error) return fail(error.message);

      logAuthEvent({ event: "sign_out", method: scope === "others" ? "Revoke Other Sessions" : "Session", status: "success", email: emailForLog }).catch(() => undefined);
      return { ok: true };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  // ── Profile Bootstrap (called from auth/callback) ─────────────────────────

  async bootstrapProfile(user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  }): Promise<AuthResponse> {
    if (DEMO_MODE) return { ok: true };
    try {
      const fullName =
        (user.user_metadata?.["full_name"] as string) ||
        (user.user_metadata?.["name"] as string) ||
        "";
      const avatarUrl =
        (user.user_metadata?.["avatar_url"] as string) ||
        (user.user_metadata?.["picture"] as string) ||
        "";
      const { data: existing } = await supabase
        .from("profiles")
        .select("id, onboarded, full_name, role")
        .eq("id", user.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("profiles").insert({
          id: user.id,
          display_name: fullName || user.email?.split("@")[0] || "User",
          full_name: fullName,
          avatar_url: avatarUrl || undefined,
          role: "student",
          onboarded: Boolean(fullName),
        });
      } else if (fullName && !existing.full_name) {
        await supabase
          .from("profiles")
          .update({ full_name: fullName, avatar_url: avatarUrl || undefined })
          .eq("id", user.id);
      }
      return { ok: true };
    } catch (e: unknown) {
      console.error("[authService] bootstrapProfile error:", e);
      return fail(e instanceof Error ? e.message : String(e));
    }
  },
};
