import { supabase } from "../lib/supabaseClient";
import { type Role, dbRoleToAppRole } from "../lib/auth";
import {
  type Session,
  type User as SupabaseUser,
  type AuthChangeEvent as SupabaseAuthChangeEvent,
} from "@supabase/supabase-js";

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
        return { data: { user: null, session: null }, error: { message: "Invalid email format" } };
      }
      if (password.length < 8) {
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
      return { data: { user, session }, error: null };
    }

    return supabase.auth.signInWithPassword({ email: email.trim(), password });
  },

  async signInWithOtp(email: string) {
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

  async signInWithOAuth(provider: "google" | "github") {
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

    return supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
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
        message: "WebAuthn / Passkey sign-in requires domain HTTPS verification and registered WebAuthn credentials.",
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
      type: (type === "magiclink" ? "magiclink" : type === "recovery" ? "recovery" : "signup") as any,
    });
  },

  async resendOtp(email: string, type: "signup" | "signup_user_confirmation" | "sms") {
    if (DEMO_MODE) {
      return { data: { message: "Resent mock OTP verification code" }, error: null };
    }

    return supabase.auth.resend({
      email: email.trim(),
      type: (type === "sms" ? "sms" : "signup") as any,
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

  async signOut() {
    if (DEMO_MODE) {
      localStorage.removeItem(DEMO_KEY);
      notifyDemoListeners("SIGNED_OUT", null);
      window.dispatchEvent(new Event("storage"));
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getSession() {
    if (DEMO_MODE) {
      const raw = localStorage.getItem(DEMO_KEY);
      if (raw) {
        try {
          const user = JSON.parse(raw);
          const session = { user, expires_at: Math.floor(Date.now() / 1000) + 3600 };
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
