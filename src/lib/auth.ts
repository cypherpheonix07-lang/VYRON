import { useCallback, useEffect, useState, useMemo } from "react";
import { supabase } from "./supabase";
import { authService, type DemoUser } from "../services/authService";

export type Role = "Student" | "Faculty" | "Startup" | "Admin" | "Reviewer";

export const studioFeatures = {
  auth: true,
  onboarding: true,
  promptToBlueprint: true,
  templateGallery: true,
  importSources: true,
  visualEditor: true,
  codeEditor: true,
  dataStudio: true,
  integrationStudio: true,
  testingStudio: true,
  securityStudio: true,
  collaboration: true,
  publishWizard: true,
  analytics: true,
  adminStudio: true,
  billing: false,
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  onboarded: boolean;
  avatarUrl?: string | undefined;
  isDemo?: boolean | undefined;
  emailConfirmedAt?: string | undefined;
  createdAt?: string | undefined;
  lastSignInAt?: string | undefined;
}

const DEMO_KEY = "brahma.demo_user";

// Helper to convert lowercase DB roles to PascalCase frontend roles
export function dbRoleToAppRole(dbRole: string | null | undefined): Role {
  if (!dbRole) return "Student";
  const normalized = dbRole.toLowerCase();
  switch (normalized) {
    case "student":
      return "Student";
    case "faculty":
      return "Faculty";
    case "startup":
      return "Startup";
    case "admin":
      return "Admin";
    case "reviewer":
      return "Reviewer";
    default:
      return "Student";
  }
}

// Helper to convert PascalCase frontend roles to lowercase DB roles
export function appRoleToDbRole(appRole: Role): string {
  return appRole.toLowerCase();
}

/**
 * Client-safe profile bootstrap helper
 * Calls ensure_profile RPC if present, or performs a safe insert
 */
export async function ensureProfile(
  userId: string,
  email: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  if (authService.isDemoMode()) return;

  try {
    const { error: rpcError } = await supabase.rpc("ensure_profile");
    if (!rpcError) return;
  } catch {
    // RPC may not exist in database yet, proceed to direct check
  }

  try {
    const fullName =
      (metadata?.["full_name"] as string) ||
      (metadata?.["name"] as string) ||
      email.split("@")[0] ||
      "User";

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (!existing) {
      await supabase.from("profiles").insert({
        id: userId,
        email,
        full_name: fullName,
        display_name: fullName,
        role: "student",
        onboarded: false,
      });
    }
  } catch (e) {
    console.warn("[auth] ensureProfile bootstrap warning:", e);
  }
}

export interface AuthSessionState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  userId: string | undefined;
  email: string | undefined;
  emailConfirmedAt: string | undefined;
  sessionExpiresAt: number | undefined;
  createdAt: string | undefined;
  lastSignInAt: string | undefined;
  error: string | null;
  ready: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * useAuthSession — Primary hook for session lifecycle & profile state
 */
export function useAuthSession(): AuthSessionState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | undefined>(undefined);
  const [emailConfirmedAt, setEmailConfirmedAt] = useState<string | undefined>(undefined);
  const [createdAt, setCreatedAt] = useState<string | undefined>(undefined);
  const [lastSignInAt, setLastSignInAt] = useState<string | undefined>(undefined);

  // Helper to fetch profile details from Supabase
  const fetchProfile = useCallback(
    async (
      userId: string,
      email: string,
      sessionUserMeta?: {
        confirmed_at?: string;
        created_at?: string;
        last_sign_in_at?: string;
        user_metadata?: Record<string, unknown>;
      },
    ): Promise<User> => {
      try {
        // Try fetching profile with single retry
        let data: {
          full_name?: string | null;
          role?: string | null;
          onboarded?: boolean | null;
          avatar_url?: string | null;
        } | null = null;
        let fetchErr = null;

        const res = await supabase
          .from("profiles")
          .select("full_name, role, onboarded, avatar_url")
          .eq("id", userId)
          .maybeSingle();

        data = res.data;
        fetchErr = res.error;

        // If profile row is missing, bootstrap it and try once more
        if (!data && !fetchErr) {
          await ensureProfile(userId, email, sessionUserMeta?.user_metadata);
          const retryRes = await supabase
            .from("profiles")
            .select("full_name, role, onboarded, avatar_url")
            .eq("id", userId)
            .maybeSingle();
          data = retryRes.data;
          fetchErr = retryRes.error;
        }

        if (fetchErr) {
          console.warn("[auth] Profile fetch warning:", fetchErr.message);
        }

        const resolvedName =
          data?.full_name ||
          (sessionUserMeta?.user_metadata?.["full_name"] as string) ||
          email.split("@")[0] ||
          "User";

        return {
          id: userId,
          email,
          name: resolvedName,
          role: dbRoleToAppRole(data?.role),
          onboarded: !!data?.onboarded,
          avatarUrl:
            data?.avatar_url ||
            (sessionUserMeta?.user_metadata?.["avatar_url"] as string) ||
            undefined,
          emailConfirmedAt: sessionUserMeta?.confirmed_at,
          createdAt: sessionUserMeta?.created_at,
          lastSignInAt: sessionUserMeta?.last_sign_in_at,
        };
      } catch (e) {
        console.error("[auth] Profile query exception:", e);
        return {
          id: userId,
          email,
          name: email.split("@")[0] || "User",
          role: "Student",
          onboarded: false,
          emailConfirmedAt: sessionUserMeta?.confirmed_at,
          createdAt: sessionUserMeta?.created_at,
          lastSignInAt: sessionUserMeta?.last_sign_in_at,
        };
      }
    },
    [],
  );

  const syncSession = useCallback(async () => {
    try {
      setError(null);
      const result = await authService.getSession();
      if (!result.ok && result.error) {
        setError(result.error.message);
      }
      const session = result.ok ? result.data : null;

      if (session && (session as { user?: unknown }).user) {
        const sUser = (
          session as {
            user: {
              id: string;
              email?: string;
              confirmed_at?: string;
              created_at?: string;
              last_sign_in_at?: string;
              user_metadata?: Record<string, unknown>;
            };
            expires_at?: number;
          }
        ).user;

        setSessionExpiresAt(session.expires_at);
        setEmailConfirmedAt(sUser.confirmed_at);
        setCreatedAt(sUser.created_at);
        setLastSignInAt(sUser.last_sign_in_at);

        if (authService.isDemoMode() || Boolean((session as any)?.user?.isDemo)) {
          const demoUser = (session as unknown as { user: DemoUser }).user;
          setUser({
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            role: dbRoleToAppRole(demoUser.role),
            onboarded: true,
            avatarUrl: demoUser.avatarUrl,
            isDemo: true,
          });
        } else {
          const profile = await fetchProfile(sUser.id, sUser.email ?? "", sUser);
          setUser(profile);
        }
      } else {
        setUser(null);
        setSessionExpiresAt(undefined);
        setEmailConfirmedAt(undefined);
      }
    } catch (err) {
      console.error("[auth] Session sync failed:", err);
      setError(err instanceof Error ? err.message : String(err));
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    let isMounted = true;

    syncSession();

    // Listen to Supabase auth events
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        if (authService.isDemoMode() || Boolean((session as any)?.user?.isDemo)) {
          const raw = session.user as any;
          setUser({
            id: raw.id,
            email: raw.email || "",
            name: raw.name || "Demo User",
            role: dbRoleToAppRole(raw.role),
            onboarded: true,
            avatarUrl: raw.avatarUrl,
            isDemo: true,
          });
        } else {
          const sUser = session.user as {
            id: string;
            email?: string;
            confirmed_at?: string;
            created_at?: string;
            last_sign_in_at?: string;
            user_metadata?: Record<string, unknown>;
          };
          setSessionExpiresAt((session as { expires_at?: number }).expires_at);
          setEmailConfirmedAt(sUser.confirmed_at);
          setCreatedAt(sUser.created_at);
          setLastSignInAt(sUser.last_sign_in_at);

          const profile = await fetchProfile(sUser.id, sUser.email ?? "", sUser);
          if (isMounted) setUser(profile);
        }
      } else {
        const hasDemoStorage =
          typeof window !== "undefined" && Boolean(localStorage.getItem("brahma_demo_session"));
        if (!authService.isDemoMode() && !hasDemoStorage) {
          if (isMounted) {
            setUser(null);
            setSessionExpiresAt(undefined);
            setEmailConfirmedAt(undefined);
          }
        }
      }
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [syncSession, fetchProfile]);

  const logout = useCallback(async () => {
    await authService.signOut();
    setUser(null);
    setSessionExpiresAt(undefined);
  }, []);

  return {
    isLoading,
    isAuthenticated: !!user,
    user,
    userId: user?.id,
    email: user?.email,
    emailConfirmedAt,
    sessionExpiresAt,
    createdAt,
    lastSignInAt,
    error,
    ready: !isLoading,
    isAdmin: user?.role === "Admin",
    refresh: syncSession,
    logout,
  };
}

/**
 * useAuth — Compatible wrapper for useAuthSession
 */
export function useAuth() {
  const session = useAuthSession();
  return {
    user: session.user,
    ready: session.ready,
    isLoading: session.isLoading,
    isAuthenticated: session.isAuthenticated,
    isAdmin: session.isAdmin,
    error: session.error,
    userId: session.userId,
    email: session.email,
    sessionExpiresAt: session.sessionExpiresAt,
    logout: session.logout,
    refresh: session.refresh,
  };
}

// ---------- Theme ----------

export type Theme = "dark" | "light" | "system";
const THEME_KEY = "brahma.theme";

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const prefersLight =
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches;
  const resolved = theme === "system" ? (prefersLight ? "light" : "dark") : theme;
  const root = document.documentElement;
  root.classList.toggle("light", resolved === "light");
  root.classList.toggle("dark", resolved === "dark");
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = (window.localStorage.getItem(THEME_KEY) as Theme | null) ?? "dark";
    setThemeState(stored);
    applyTheme(stored);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }, []);

  const toggle = useCallback(() => {
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "dark" : "light");
  }, [setTheme]);

  return { theme, setTheme, toggle };
}
