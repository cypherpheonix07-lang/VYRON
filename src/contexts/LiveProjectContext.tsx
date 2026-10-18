import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { fetchLiveOverview, type LiveOverview } from "@/services/project/liveOverview";

type ViewState = {
  projectId: string;
  data: LiveOverview | null;
  status: "loading" | "ready" | "error" | "missing";
  error: string | null;
};
type LiveContext = ViewState & { refreshing: boolean; realtime: string; refresh: () => void };
const Context = createContext<LiveContext | null>(null);

export function LiveProjectProvider({ id, children }: { id: string; children: ReactNode }) {
  const [state, setState] = useState<ViewState>({ projectId: id, data: null, status: "loading", error: null });
  const [refreshing, setRefreshing] = useState(false);
  const [realtime, setRealtime] = useState("Connecting; polling every 30 seconds");
  const generation = useRef(0);
  const refreshRef = useRef<() => void>(() => {});
  const refresh = useCallback(() => refreshRef.current(), []);

  useEffect(() => {
    let active = true;
    let authEpoch = 0;
    let inFlight = false;
    let queued = false;
    generation.current++;
    const currentGeneration = generation.current;
    setState({ projectId: id, data: null, status: "loading", error: null });
    setRealtime("Connecting; polling every 30 seconds");
    const load = async () => {
      if (!active) return;
      if (inFlight) { queued = true; return; }
      inFlight = true;
      const epoch = authEpoch;
      setRefreshing(true);
      try {
        const data = await fetchLiveOverview(supabase, id);
        if (active && generation.current === currentGeneration && epoch === authEpoch) {
          setState({ projectId: id, data, status: data ? "ready" : "missing", error: null });
        }
      } catch (error) {
        if (active && generation.current === currentGeneration && epoch === authEpoch) {
          // Fail closed: do not retain data after revoked access or query failure.
          setState({ projectId: id, data: null, status: "error", error: error instanceof Error ? error.message : "Database request failed." });
        }
      } finally {
        inFlight = false;
        if (active) {
          setRefreshing(false);
          if (queued) { queued = false; void load(); }
        }
      }
    };
    refreshRef.current = () => { void load(); };
    void load();

    const channel = supabase.channel(`project-overview:${id}:${currentGeneration}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "projects", filter: `id=eq.${id}` }, () => { void load(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "project_repos", filter: `project_id=eq.${id}` }, () => { void load(); })
      .subscribe((status) => {
        if (!active) return;
        setRealtime(status === "SUBSCRIBED"
          ? "Channel connected; 30-second reconciliation enabled"
          : `Realtime ${status.toLowerCase()}; polling every 30 seconds`);
        if (status === "SUBSCRIBED") void load();
      });
    // Poll even when connected: publication coverage and DELETE delivery can vary.
    const timer = window.setInterval(() => { if (!document.hidden) void load(); }, 30_000);
    const onFocus = () => { void load(); };
    const onVisibility = () => { if (!document.hidden) void load(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "INITIAL_SESSION") return;
      authEpoch++;
      setState({ projectId: id, data: null, status: "loading", error: null });
      // Leave the auth callback before calling getUser (avoids auth lock contention).
      queueMicrotask(() => { if (active) void load(); });
    });
    return () => {
      active = false;
      generation.current++;
      refreshRef.current = () => {};
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      authListener.subscription.unsubscribe();
      void supabase.removeChannel(channel);
    };
  }, [id]);

  // Do not render the previous project's data even during the render before effect cleanup.
  const visible = state.projectId === id ? state : { projectId: id, data: null, status: "loading" as const, error: null };
  return <Context.Provider value={{ ...visible, refreshing, realtime, refresh }}>{children}</Context.Provider>;
}

export function useLiveProject() {
  const value = useContext(Context);
  if (!value) throw new Error("useLiveProject requires LiveProjectProvider");
  return value;
}
