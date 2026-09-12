import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { activityService } from "@/services/activityService";
import type { ActivityEvent, ActivityFilterState } from "@/types/activity";

export interface PresenceUser {
  userId: string;
  userName: string;
  avatarUrl?: string;
  onlineAt: string;
}

export function useActivityRealtime(filters?: Partial<ActivityFilterState>) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [pendingBuffer, setPendingBuffer] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [eventsPerMinute, setEventsPerMinute] = useState(1.4);
  const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>([]);

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // 1. Initial Data Fetch
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await activityService.fetchEvents(filtersRef.current);
      setEvents(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData, filters?.projectId, filters?.eventType, filters?.severity, filters?.timeRange]);

  // 2. Realtime Subscription & Presence Channel
  useEffect(() => {
    const channelName = filters?.projectId && filters.projectId !== "all"
      ? `activity_feed:project:${filters.projectId}`
      : "activity_feed:global";

    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: "brahma-session-" + Math.random().toString(36).substring(2, 9),
        },
      },
    });

    // Handle Postgres Changes INSERT
    const changeConfig = filters?.projectId && filters.projectId !== "all"
      ? {
          event: "INSERT" as const,
          schema: "public",
          table: "activity_events",
          filter: `project_id=eq.${filters.projectId}`,
        }
      : {
          event: "INSERT" as const,
          schema: "public",
          table: "activity_events",
        };

    channel.on(
      "postgres_changes",
      changeConfig,
      (payload) => {
        const newEvent = payload.new as ActivityEvent;

        // LAW: Incoming rows go to a PENDING BUFFER, not direct render
        setPendingBuffer((prev) => [newEvent, ...prev]);

        // Calculate live events per minute meter
        setEventsPerMinute((prev) => Math.min(18.0, Number((prev + 0.5).toFixed(1))));
      },
    );

    // Handle Presence
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users: PresenceUser[] = [];
        for (const k in state) {
          const arr = state[k] as Array<Record<string, unknown>>;
          arr.forEach((u) => {
            const userObj: PresenceUser = {
              userId: String(u["userId"] || k),
              userName: String(u["userName"] || "Operator"),
              onlineAt: String(u["onlineAt"] || new Date().toISOString()),
            };
            if (u["avatarUrl"]) {
              userObj.avatarUrl = String(u["avatarUrl"]);
            }
            users.push(userObj);
          });
        }
        setPresenceUsers(users);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            userId: "current-user",
            userName: "You (Active)",
            onlineAt: new Date().toISOString(),
          });
        }
      });

    // Decay rate meter every 15s
    const decayInterval = setInterval(() => {
      setEventsPerMinute((prev) => Math.max(0.8, Number((prev * 0.9).toFixed(1))));
    }, 15000);

    return () => {
      clearInterval(decayInterval);
      supabase.removeChannel(channel);
    };
  }, [filters?.projectId]);

  // 3. Apply Pending Events into the Visible Stream (FLIP / Prepend)
  const applyPending = useCallback(() => {
    if (pendingBuffer.length === 0) return;
    setEvents((prev) => [...pendingBuffer, ...prev]);
    setPendingBuffer([]);
  }, [pendingBuffer]);

  // 4. Toggle Pause / Freeze Mode
  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      // If unpausing and there are pending events, user can choose to apply or flush
      return next;
    });
  }, []);

  return {
    events,
    pendingBuffer,
    pendingCount: pendingBuffer.length,
    isLoading,
    isPaused,
    eventsPerMinute,
    presenceUsers,
    applyPending,
    togglePause,
    refresh: loadInitialData,
  };
}
