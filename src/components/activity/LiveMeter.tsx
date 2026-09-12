import { Activity, Pause, Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { PresenceUser } from "@/hooks/useActivityRealtime";

interface LiveMeterProps {
  eventsPerMinute: number;
  isPaused: boolean;
  onTogglePause: () => void;
  presenceUsers: PresenceUser[];
}

export function LiveMeter({
  eventsPerMinute,
  isPaused,
  onTogglePause,
  presenceUsers,
}: LiveMeterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-card/40 px-3 py-1.5 backdrop-blur-sm">
      {/* Rate Indicator */}
      <div className="flex items-center gap-2">
        <span className="relative flex size-2.5">
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isPaused ? "bg-amber-400 animate-none" : "bg-emerald-400 animate-ping"
            }`}
          />
          <span
            className={`relative inline-flex size-2.5 rounded-full ${
              isPaused ? "bg-amber-500" : "bg-emerald-500"
            }`}
          />
        </span>

        <span className="text-xs font-mono font-medium text-foreground">
          {eventsPerMinute.toFixed(1)} <span className="text-muted-foreground text-[10px]">evt/min</span>
        </span>
      </div>

      {/* Freeze / Resume Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onTogglePause}
        className={`h-6 px-2 text-[11px] gap-1 rounded transition-colors ${
          isPaused
            ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {isPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
        {isPaused ? "Resuming stream" : "Pause live updates"}
      </Button>

      {/* Live Presence Avatars */}
      {presenceUsers.length > 0 && (
        <div className="flex items-center gap-1.5 border-l border-border/60 pl-3">
          <Users className="size-3 text-muted-foreground" />
          <div className="flex -space-x-1.5 overflow-hidden">
            {presenceUsers.slice(0, 4).map((user, i) => (
              <Tooltip key={user.userId || i}>
                <TooltipTrigger asChild>
                  <div className="inline-block size-5 rounded-full ring-1 ring-background bg-secondary text-[9px] font-mono font-semibold flex items-center justify-center text-foreground cursor-pointer">
                    {user.userName.substring(0, 2).toUpperCase()}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-mono">
                  {user.userName} (connected)
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          {presenceUsers.length > 4 && (
            <span className="text-[10px] font-mono text-muted-foreground pl-1">
              +{presenceUsers.length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
