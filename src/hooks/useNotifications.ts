import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useDemoMode } from "@/contexts/DemoModeContext";

export interface NotificationItem {
  id: string;
  title: string;
  content: string | null;
  is_read: boolean;
  created_at: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Release Gate Approved",
    content:
      "Project 'FinTech Ledger Gateway' passed all 7 release gate checks with a score of 94/100.",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "notif-2",
    title: "AST Scan Complete",
    content: "Deep static analysis completed for commit #7f55b9a. 0 high severity findings.",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
  },
  {
    id: "notif-3",
    title: "GitHub Webhook Connected",
    content: "Real-time push event synchronization active for repo 'brahma-core'.",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
];

export function useNotifications() {
  const { isDemoMode } = useDemoMode();
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (isDemoMode) {
      setNotifications(DEFAULT_NOTIFICATIONS);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      if (data && data.length > 0) {
        setNotifications(data as NotificationItem[]);
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
      }
    } catch {
      setNotifications(DEFAULT_NOTIFICATIONS);
    }
  }, [isDemoMode]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    if (!isDemoMode) {
      await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    if (!isDemoMode) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .neq("id", "00000000-0000-0000-0000-000000000000");
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}
