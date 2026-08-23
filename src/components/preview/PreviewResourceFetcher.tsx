import { useState } from "react";
import { ExternalResource } from "./previewData";
import { ExternalLink, RefreshCw, Star, Layers, BookOpen, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PreviewResourceFetcherProps {
  toolName: string;
  resources: ExternalResource[];
  changelog: { version: string; date: string; summary: string }[];
}

export function PreviewResourceFetcher({
  toolName,
  resources,
  changelog,
}: PreviewResourceFetcherProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetched, setLastFetched] = useState("Just now");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastFetched("Just now");
      toast.success(`Refreshed ${toolName} live resources and templates`);
    }, 600);
  };

  return (
    <div className="rounded-xl border border-border/80 bg-zinc-950/60 p-4 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="size-3.5 text-cyan-400" />
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Live Templates &amp; Ecosystem Resources
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
            <Clock className="size-3" /> {lastFetched}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            title="Refresh Feeds"
          >
            <RefreshCw className={`size-3 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Resource Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {resources.map((res) => (
          <a
            key={res.id}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-lg border border-border/60 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-cyan-500/30 transition-all flex items-start justify-between gap-2"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className="text-[9px] uppercase font-mono px-1 py-0 h-4 border-zinc-700 text-zinc-400"
                >
                  {res.type}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{res.updatedAt}</span>
              </div>
              <h5 className="text-xs font-semibold text-foreground group-hover:text-cyan-400 transition-colors truncate">
                {res.title}
              </h5>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-muted-foreground group-hover:text-foreground">
              {res.stars && (
                <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
                  <Star className="size-2.5 fill-amber-400" />
                  <span>{res.stars}</span>
                </div>
              )}
              <ExternalLink className="size-3" />
            </div>
          </a>
        ))}
      </div>

      {/* Latest Changelog Badge */}
      {changelog && changelog.length > 0 && (
        <div className="border-t border-border/40 pt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-mono shrink-0">
              {changelog[0]?.version}
            </Badge>
            <span className="text-[11px] text-muted-foreground truncate">{changelog[0]?.summary}</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground shrink-0">{changelog[0]?.date}</span>
        </div>
      )}
    </div>
  );
}
