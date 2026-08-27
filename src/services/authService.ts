/**
 * authService — canonical authentication service
 *
 * LAWS:
 *  - This is the ONLY module that calls supabase.auth.* (besides supabaseClient.ts itself).
 *  - No method throws. Every method returns AuthResponse<T>.
 *  - All UI pages must consume this module exclusively.
 *  - ZERO MOCK LOGIC. All methods make real Supabase authentication calls.
 */

import { supabase } from "../lib/supabaseClient";
import type { Session, AuthChangeEvent, User } from "@supabase/supabase-js";
import type { Role } from "../lib/auth";
import { logAuthEvent } from "../lib/api";

export { logAuthEvent };

// ─── Constants ──────────────────────────────────────────────────────────────

const getRedirectUrl = (): string => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`;
  }
  return (import.meta.env["VITE_APP_URL"] ?? "http://localhost:8080") + "/auth/callback";
};

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
  raw?: string | undefined;
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
  avatarUrl?: string | undefined;
  isDemo?: boolean | undefined;
}

export interface DemoSession {
  user: DemoUser;
  expires_at: number;
  access_token?: string | undefined;
  refresh_token?: string | undefined;
}

// ─── Error Classifier ────────────────────────────────────────────────────────

const classify = (raw?: string): AuthErrorCode => {
  const m = (raw ?? "").toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid credentials"))
    return "invalid_credentials";
  if (m.includes("email not confirmed")) return "email_not_confirmed";
  if (m.includes("already registered") || m.includes("user already registered"))
    return "email_exists";
  if (m.includes("rate limit") || m.includes("too many")) return "rate_limited";
  if (m.includes("api key") || m.includes("anon key") || m.includes("invalid key"))
    return "invalid_api_key";
  if (m.includes("failed to fetch") || m.includes("network") || m.includes("fetch"))
    return "network";
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

const fail = <T>(raw?: string): AuthResponse<T> => {
  const code = classify(raw);
  return { ok: false, error: { code, message: HUMAN[code], raw } };
};

// ─── authService ─────────────────────────────────────────────────────────────

export const authService = {
  // ── Identity & Feature Helpers ──────────────────────────────────────────

  isDemoMode(): boolean {
    return false;
  },

  isOAuthProviderEnabled(provider: "google" | "github" | "gitlab"): boolean {
    if (provider === "google") return import.meta.env["VITE_OAUTH_GOOGLE"] !== "false";
    if (provider === "github") return import.meta.env["VITE_OAUTH_GITHUB"] !== "false";
    if (provider === "gitlab") return import.meta.env["VITE_OAUTH_GITLAB"] === "true";
    return false;
  },

  // ── 1. signUp ────────────────────────────────────────────────────────────

  async signUp(
    email: string,
    password: string,
    options?: { data?: Record<string, unknown> },
  ): Promise<AuthResponse<{ user: User | null; session: Session | null }>> {
    const cleanEmail = email.trim();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: getRedirectUrl(),
          data: options?.data ?? {},
        },
      });
      if (error) {
        logAuthEvent({
          event: "sign_up",
          method: "Password",
          status: "failed",
          email: cleanEmail,
        }).catch(() => undefined);
        return fail(error.message);
      }
      logAuthEvent({
        event: "sign_up",
        method: "Password",
        status: "success",
        email: cleanEmail,
        user_id: data.user?.id,
      }).catch(() => undefined);
      return { ok: true, data: { user: data.user, session: data.session } };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  // ── 2. signIn / signInWithPassword ──────────────────────────────────────

  async signIn(email: string, password: string): Promise<AuthResponse<Session>> {
    return this.signInWithPassword(email, password);
  },

  async signInWithPassword(email: string, password: string): Promise<AuthResponse<Session>> {
    const cleanEmail = email.trim();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) {
        logAuthEvent({
          event: "failed_password",
          method: "Password",
          status: "failed",
          email: cleanEmail,
        }).catch(() => undefined);
        return fail(error.message);
      }
      logAuthEvent({
        event: "signed_in",
        method: "Password",
        status: "success",
        email: cleanEmail,
        user_id: data.user?.id,
      }).catch(() => undefined);
      return { ok: true, data: data.session as Session };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  // ── 3. signInWithGoogle ─────────────────────────────────────────────────

  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getRedirectUrl(),
          scopes: "email profile openid",
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });
      if (error) {
        logAuthEvent({
          event: "oauth",
          method: "GOOGLE OAuth",
          status: "failed",
          email: "oauth.google@brahma.dev",
        }).catch(() => undefined);
        return fail(error.message);
      }
      return { ok: true };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  // ── 4. signInWithGitHub ─────────────────────────────────────────────────

  async signInWithGitHub(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: getRedirectUrl(),
          scopes: "read:user user:email",
        },
      });
      if (error) {
        logAuthEvent({
          event: "oauth",
          method: "GITHUB OAuth",
          status: "failed",
          email: "oauth.github@brahma.dev",
        }).catch(() => undefined);
        return fail(error.message);
      }
      return { ok: true };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  async signInWithOAuth(provider: "google" | "github" | "gitlab"): Promise<AuthResponse> {
    if (provider === "google") return this.signInWithGoogle();
    if (provider === "github") return this.signInWithGitHub();
    return fail(`OAuth provider ${provider} is not configured.`);
  },

  // ── 5. signOut ──────────────────────────────────────────────────────────

  async signOut(scope: "local" | "others" | "global" = "local"): Promise<AuthResponse> {
    try {
      let emailForLog = "unknown@brahma.dev";
      const { data: sd } = await supabase.auth.getSession();
      if (sd?.session?.user?.email) emailForLog = sd.session.user.email;

      const { error } = await supabase.auth.signOut({ scope });
      if (error) return fail(error.message);

      logAuthEvent({
        event: "sign_out",
        method: scope === "others" ? "Revoke Other Sessions" : "Session",
        status: "success",
        email: emailForLog,
      }).catch(() => undefined);
      return { ok: true };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  // ── 6. getSession ────────────────────────────────────────────────────────

  async getSession(): Promise<AuthResponse<Session | null>> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return error ? fail(error.message) : { ok: true, data: data.session };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  // ── 7. getUser ───────────────────────────────────────────────────────────

  async getUser(): Promise<AuthResponse<User | null>> {
    try {
      const { data, error } = await supabase.auth.getUser();
      return error ? fail(error.message) : { ok: true, data: data.user };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  // ── 8. resetPassword / resetPasswordForEmail ─────────────────────────────

  async resetPasswordForEmail(email: string): Promise<AuthResponse> {
    const cleanEmail = email.trim();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/reset-password`,
      });
      return error ? fail(error.message) : { ok: true };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  async resetPassword(email: string): Promise<AuthResponse> {
    return this.resetPasswordForEmail(email);
  },

  // ── 9. updatePassword ────────────────────────────────────────────────────

  async updatePassword(password: string): Promise<AuthResponse> {
    if (password.length < 8) {
      return fail("Password must be at least 8 characters");
    }
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return error ? fail(error.message) : { ok: true };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  // ── 10. onAuthStateChange ────────────────────────────────────────────────

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // ── Additional Helpers ───────────────────────────────────────────────────

  async setSession(tokens: {
    access_token: string;
    refresh_token: string;
  }): Promise<AuthResponse<Session | null>> {
    try {
      const { data, error } = await supabase.auth.setSession(tokens);
      return error ? fail(error.message) : { ok: true, data: data.session };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  async sendMagicLink(email: string): Promise<AuthResponse> {
    return this.signInWithOtp(email);
  },

  async signInWithOtp(email: string): Promise<AuthResponse> {
    const cleanEmail = email.trim();
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { emailRedirectTo: getRedirectUrl() },
      });
      if (error) return fail(error.message);
      logAuthEvent({
        event: "magic_link",
        method: "Magic Link",
        status: "success",
        email: cleanEmail,
      }).catch(() => undefined);
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

  async signInWithSSO(domain: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signInWithSSO({
        domain: domain.trim(),
        options: { redirectTo: getRedirectUrl() },
      });
      return error ? fail(error.message) : { ok: true };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  async signInWithPasskey(): Promise<AuthResponse> {
    return fail(
      "WebAuthn / Passkey sign-in requires domain HTTPS verification and registered WebAuthn credentials.",
    );
  },

  async exchangeCodeForSession(code: string): Promise<AuthResponse<Session | null>> {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      return error ? fail(error.message) : { ok: true, data: data.session };
    } catch (e: unknown) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  },

  async bootstrapProfile(user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  }): Promise<AuthResponse> {
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
