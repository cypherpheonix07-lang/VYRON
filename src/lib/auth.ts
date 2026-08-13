import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { authService } from "../services/authService";

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
  avatarUrl?: string;
  isDemo?: boolean;
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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // Helper to fetch profile details from Supabase
  const fetchProfile = async (userId: string, email: string): Promise<User> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, role, onboarded, avatar_url")
        .eq("id", userId)
        .single();

      if (error || !data) {
        console.error("Error fetching user profile:", error);
        return {
          id: userId,
          email,
          name: email.split("@")[0] || "User",
          role: "Student",
          onboarded: false,
        };
      }

      return {
        id: userId,
        email,
        name: data.full_name || email.split("@")[0] || "User",
        role: dbRoleToAppRole(data.role),
        onboarded: !!data.onboarded,
        avatarUrl: data.avatar_url || undefined,
      };
    } catch (e) {
      console.error("Profile query failed:", e);
      return {
        id: userId,
        email,
        name: email.split("@")[0] || "User",
        role: "Student",
        onboarded: false,
      };
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await authService.getSession();
        if (session?.user) {
          if (authService.isDemoMode()) {
            setUser(session.user as unknown as User);
          } else {
            const profile = await fetchProfile(
              (session.user as { id: string; email?: string }).id,
              (session.user as { id: string; email?: string }).email || "",
            );
            setUser(profile);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Supabase session check failed:", err);
        setUser(null);
      } finally {
        setReady(true);
      }
    };

    initAuth();

    // Listen to auth events via authService
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        if (authService.isDemoMode()) {
          setUser(session.user as unknown as User);
        } else {
          const profile = await fetchProfile(
            (session.user as { id: string; email?: string }).id,
            (session.user as { id: string; email?: string }).email || "",
          );
          setUser(profile);
        }
      } else {
        setUser(null);
      }
      setReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refresh = useCallback(async () => {
    const {
      data: { session },
    } = await authService.getSession();
    if (session?.user) {
      if (authService.isDemoMode()) {
        setUser(session.user as unknown as User);
      } else {
        const profile = await fetchProfile(
          (session.user as { id: string; email?: string }).id,
          (session.user as { id: string; email?: string }).email || "",
        );
        setUser(profile);
      }
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  return {
    user,
    ready,
    isAuthenticated: !!user,
    isAdmin: user?.role === "Admin",
    logout,
    refresh,
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
