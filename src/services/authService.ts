import { supabase } from "../lib/supabaseClient";
import { type Role, dbRoleToAppRole } from "../lib/auth";
import { logAuthEvent } from "../lib/api";
import {
  type Session,
  type AuthChangeEvent as SupabaseAuthChangeEvent,
} from "@supabase/supabase-js";

export { logAuthEvent };

export const DEMO_KEY = "brahma.demo_user";
export const DEMO_MODE = import.meta.env["VITE_DEMO_MODE"] === "true";

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

// Global list of callbacks for mock onAuthStateChange
type AuthChangeEvent = SupabaseAuthChangeEvent | "INITIAL_SESSION";
type AuthStateCallback = (event: AuthChangeEvent, session: { user: unknown } | null) => void;
const demoListeners = new Set<AuthStateCallback>();

function notifyDemoListeners(event: AuthChangeEvent, session: { user: unknown } | null) {
  demoListeners.forEach((cb) => {
    try {
      cb(event, session);
    } catch (e) {
      console.error("Error triggering auth listener:", e);
    }
  });
}

// Watch localStorage changes to sync demo state across tabs if DEMO_MODE is true
if (typeof window !== "undefined" && DEMO_MODE) {
  window.addEventListener("storage", (e) => {
    if (e.key === DEMO_KEY) {
      if (e.newValue) {
        try {
          const user = JSON.parse(e.newValue);
          notifyDemoListeners("SIGNED_IN", { user });
        } catch {
          notifyDemoListeners("SIGNED_OUT", null);
        }
      } else {
        notifyDemoListeners("SIGNED_OUT", null);
      }
    }
  });
}

export const authService = {
  isDemoMode() {
    return DEMO_MODE;
  },

  async signInWithPassword(email: string, password: string) {
    if (DEMO_MODE) {
      if (!email.includes("@")) {
        await logAuthEvent({
          event: "failed_password",
          method: "Password",
          status: "failed",
          email: email.trim(),
        });
        return { data: { user: null, session: null }, error: { message: "Invalid email format" } };
      }
      if (password.length < 8) {
        await logAuthEvent({
          event: "failed_password",
          method: "Password",
          status: "failed",
          email: email.trim(),
        });
        return {
          data: { user: null, session: null },
          error: { message: "Password must be at least 8 characters" },
        };
      }

      const user: DemoUser = {
        id: "demo-student-id",
        email: email.trim(),
        name: email.split("@")[0] || "Demo User",
        role: "Student",
        onboarded: false,
        isDemo: true,
      };

      localStorage.setItem(DEMO_KEY, JSON.stringify(user));
      const session = { user, expires_at: Math.floor(Date.now() / 1000) + 3600 };
      notifyDemoListeners("SIGNED_IN", session);
      window.dispatchEvent(new Event("storage"));
      await logAuthEvent({
        event: "signed_in",
        method: "Password",
        status: "success",
        email: email.trim(),
        user_id: user.id,
      });
      return { data: { user, session }, error: null };
    }

    const res = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (res.error) {
      await logAuthEvent({
        event: "failed_password",
        method: "Password",
        status: "failed",
        email: email.trim(),
      });
    } else if (res.data.user) {
      await logAuthEvent({
        event: "signed_in",
        method: "Password",
        status: "success",
        email: email.trim(),
        user_id: res.data.user.id,
      });
    }
    return res;
  },

  async signInWithOtp(email: string) {
    await logAuthEvent({
      event: "magic_link",
      method: "Magic Link",
      status: "success",
      email: email.trim(),
    });
    if (DEMO_MODE) {
      return { data: { message: "Mock OTP magic link sent to " + email }, error: null };
    }

    return supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },

  isOAuthProviderEnabled(provider: "google" | "github" | "gitlab"): boolean {
    if (provider === "google") {
      return import.meta.env["VITE_OAUTH_GOOGLE"] !== "false";
    }
    if (provider === "github") {
      return import.meta.env["VITE_OAUTH_GITHUB"] !== "false";
    }
    if (provider === "gitlab") {
      return import.meta.env["VITE_OAUTH_GITLAB"] === "true";
    }
    return false;
  },

  async signInWithOAuth(provider: "google" | "github" | "gitlab") {
    const isEnabled = this.isOAuthProviderEnabled(provider);
    if (!isEnabled) {
      await logAuthEvent({
        event: "oauth",
        method: `${provider.toUpperCase()} OAuth`,
        status: "failed",
        email: `oauth.${provider}@brahma.dev`,
      });
      return {
        data: null,
        error: {
          message: `OAuth misconfigured — invalid_client. Admin: verify provider console. (${provider} is disabled)`,
        },
      };
    }

    await logAuthEvent({
      event: "oauth",
      method: `${provider.toUpperCase()} OAuth`,
      status: "success",
      email: `${provider}.user@brahma.dev`,
    });

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
      const session = { user, expires_at: Math.floor(Date.now() / 1000) + 3600 };
      notifyDemoListeners("SIGNED_IN", session);
      window.dispatchEvent(new Event("storage"));
      return { data: { user, session }, error: null };
    }

    const options: { redirectTo: string; queryParams?: { [key: string]: string } } = {
      redirectTo: `${window.location.origin}/auth/callback`,
    };
    if (provider === "google") {
      options.queryParams = { access_type: "offline", prompt: "consent" };
    }

    return supabase.auth.signInWithOAuth({
      provider: provider as "google" | "github",
      options,
    });
  },

  async exchangeCodeForSession(code: string) {
    if (DEMO_MODE) {
      return this.getSession();
    }
    return supabase.auth.exchangeCodeForSession(code);
  },

  async bootstrapProfile(user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  }) {
    if (DEMO_MODE) {
      return { data: null, error: null };
    }
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
          .update({
            full_name: fullName,
            avatar_url: avatarUrl || undefined,
          })
          .eq("id", user.id);
      }
      return { data: existing, error: null };
    } catch (err) {
      console.error("Profile bootstrap exception:", err);
      return { data: null, error: err as Error };
    }
  },

  async signInWithSSO(domain: string) {
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
      const session = { user, expires_at: Math.floor(Date.now() / 1000) + 3600 };
      notifyDemoListeners("SIGNED_IN", session);
      window.dispatchEvent(new Event("storage"));
      return { data: { user, session }, error: null };
    }

    return supabase.auth.signInWithSSO({
      domain: domain.trim(),
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },

  async signInWithPasskey() {
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
      const session = { user, expires_at: Math.floor(Date.now() / 1000) + 3600 };
      notifyDemoListeners("SIGNED_IN", session);
      window.dispatchEvent(new Event("storage"));
      return { data: { user, session }, error: null };
    }

    return {
      data: null,
      error: {
        message:
          "WebAuthn / Passkey sign-in requires domain HTTPS verification and registered WebAuthn credentials.",
      },
    };
  },

  async signUp(email: string, password: string, options?: { data?: Record<string, unknown> }) {
    if (DEMO_MODE) {
      if (!email.includes("@")) {
        return { data: { user: null, session: null }, error: { message: "Invalid email format" } };
      }
      if (password.length < 8) {
        return {
          data: { user: null, session: null },
          error: { message: "Password must be at least 8 characters" },
        };
      }

      const role = (options?.data?.["role"] as Role) || "Student";
      const name = (options?.data?.["full_name"] as string) || email.split("@")[0] || "User";

      const user: DemoUser = {
        id: "demo-signup-id",
        email: email.trim(),
        name,
        role,
        onboarded: false,
        isDemo: true,
      };

      localStorage.setItem(DEMO_KEY, JSON.stringify(user));
      const session = { user, expires_at: Math.floor(Date.now() / 1000) + 3600 };
      notifyDemoListeners("SIGNED_IN", session);
      window.dispatchEvent(new Event("storage"));
      return { data: { user, session }, error: null };
    }

    return supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: options?.data || {},
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },

  async verifyOtp(
    email: string,
    token: string,
    type: "signup" | "recovery" | "invite" | "magiclink" | "email",
  ) {
    if (DEMO_MODE) {
      if (token.length !== 6) {
        return { data: null, error: { message: "OTP code must be exactly 6 digits." } };
      }

      const stored = localStorage.getItem(DEMO_KEY);
      let user: DemoUser;
      if (stored) {
        user = JSON.parse(stored);
        user.onboarded = true;
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
      window.dispatchEvent(new Event("storage"));
      return { data: { user, session }, error: null };
    }

    return supabase.auth.verifyOtp({
      email: email.trim(),
      token: token.trim(),
      type: (type === "magiclink" ? "magiclink" : type === "recovery" ? "recovery" : "signup") as
        "magiclink" | "recovery" | "signup",
    });
  },

  async resendOtp(email: string, type: "signup" | "signup_user_confirmation" | "sms") {
    if (DEMO_MODE) {
      return { data: { message: "Resent mock OTP verification code" }, error: null };
    }

    return supabase.auth.resend({
      email: email.trim(),
      type: "signup",
    });
  },

  async resetPasswordForEmail(email: string) {
    if (DEMO_MODE) {
      return { data: { message: "Reset code sent to " + email }, error: null };
    }

    return supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  async updatePassword(password: string) {
    if (DEMO_MODE) {
      if (password.length < 8) {
        return { data: null, error: { message: "Password must be at least 8 characters" } };
      }
      return { data: { message: "Password updated successfully" }, error: null };
    }

    return supabase.auth.updateUser({ password });
  },

  async signOut(options?: { scope?: "global" | "local" | "others" }) {
    await logAuthEvent({
      event: "sign_out",
      method: options?.scope === "others" ? "Revoke Other Sessions" : "Session",
      status: "success",
      email: "user@brahma.dev",
    });
    if (DEMO_MODE) {
      if (options?.scope !== "others") {
        localStorage.removeItem(DEMO_KEY);
        notifyDemoListeners("SIGNED_OUT", null);
        window.dispatchEvent(new Event("storage"));
      }
      return { error: null };
    }

    const { error } = await supabase.auth.signOut(options);
    return { error };
  },

  async setSession(currentSession: { access_token: string; refresh_token: string }) {
    if (DEMO_MODE) {
      return { data: { session: null, user: null }, error: null };
    }
    return supabase.auth.setSession(currentSession);
  },

  async getSession() {
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
          return { data: { session }, error: null };
        } catch {
          return { data: { session: null }, error: null };
        }
      }
      return { data: { session: null }, error: null };
    }

    return supabase.auth.getSession();
  },

  onAuthStateChange(callback: AuthStateCallback) {
    if (DEMO_MODE) {
      demoListeners.add(callback);
      const raw = localStorage.getItem(DEMO_KEY);
      if (raw) {
        try {
          const user = JSON.parse(raw);
          callback("INITIAL_SESSION", { user });
        } catch {
          callback("INITIAL_SESSION", null);
        }
      } else {
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
      callback as unknown as (event: SupabaseAuthChangeEvent, session: Session | null) => void,
    );
  },
};
