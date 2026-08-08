import { useCallback, useEffect, useState } from "react";

export type Role = "Student" | "Faculty" | "Startup" | "Admin";

export interface User {
  name: string;
  email: string;
  role: Role;
}

const KEY = "brahma.user";
const EVENT = "brahma:auth";

export function readUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function signIn(user: User) {
  window.localStorage.setItem(KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(EVENT));
}

export function signOut() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

/** Mock auth: resolves after a short delay so loading states are visible. */
export function mockAuthRequest<T>(value: T, ms = 900): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setUser(readUser());
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const logout = useCallback(() => signOut(), []);

  return { user, ready, isAuthenticated: !!user, isAdmin: user?.role === "Admin", logout };
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
