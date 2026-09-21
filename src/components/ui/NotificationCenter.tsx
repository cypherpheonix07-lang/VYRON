import React, { useState } from "react";
import { Bell, CheckCheck, Info, AlertTriangle, ShieldCheck } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open notifications"
          className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary animate-pulse" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 surface border border-border/80 rounded-2xl p-2 shadow-2xl space-y-1"
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-xs font-bold text-foreground">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              type="button"
              className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <CheckCheck className="size-3" /> Mark all read
            </button>
          )}
        </div>

        <DropdownMenuSeparator className="bg-border/60" />

        <div className="max-h-80 overflow-y-auto space-y-1 py-1">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No new notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={cn(
                  "p-2.5 rounded-xl text-xs space-y-1 cursor-pointer transition-colors border",
                  n.is_read
                    ? "bg-card/30 border-transparent hover:bg-muted/40 text-muted-foreground"
                    : "bg-primary/5 border-primary/20 hover:bg-primary/10 text-foreground",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-foreground truncate">{n.title}</span>
                  {!n.is_read && <span className="size-1.5 rounded-full bg-primary shrink-0" />}
                </div>
                {n.content && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{n.content}</p>
                )}
                <span className="text-[10px] font-mono text-muted-foreground block pt-0.5">
                  {new Date(n.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
