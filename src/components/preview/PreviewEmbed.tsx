import { useState } from "react";
import { ExternalLink, RefreshCw, Smartphone, Tablet, Monitor, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PreviewEmbedProps {
  toolName: string;
  url: string;
  category: string;
}

export function PreviewEmbed({ toolName, url, category }: PreviewEmbedProps) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [key, setKey] = useState(0);
  const [hasFrameError, setHasFrameError] = useState(false);

  const getWidth = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-[375px]";
      case "tablet":
        return "max-w-[768px]";
      default:
        return "w-full";
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-zinc-950/60 overflow-hidden flex flex-col shadow-xl">
      {/* Browser Chrome Header */}
      <div className="border-b border-border/60 bg-zinc-900/80 px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Mac OS Window Dots */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="size-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="size-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="size-2.5 rounded-full bg-emerald-500/80 inline-block" />
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-lg bg-zinc-950/90 border border-zinc-800 rounded-lg px-3 py-1 text-[11px] font-mono text-zinc-400 flex items-center justify-between truncate">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="size-3 text-emerald-400 shrink-0" />
            <span className="truncate text-zinc-300">{url}</span>
          </div>
          <Badge variant="outline" className="h-4 text-[9px] border-zinc-700 px-1 ml-2 shrink-0">
            {category}
          </Badge>
        </div>

        {/* Viewport & Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800 p-0.5">
            <button
              onClick={() => setViewport("desktop")}
              className={`p-1 rounded ${viewport === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              title="Desktop (100%)"
            >
              <Monitor className="size-3.5" />
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={`p-1 rounded ${viewport === "tablet" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              title="Tablet (768px)"
            >
              <Tablet className="size-3.5" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`p-1 rounded ${viewport === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              title="Mobile (375px)"
            >
              <Smartphone className="size-3.5" />
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setKey((k) => k + 1)}
            className="h-7 w-7 text-zinc-400 hover:text-white"
            title="Reload Embed"
          >
            <RefreshCw className="size-3.5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-7 px-2 text-[11px] border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white gap-1"
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              <span>Open</span>
              <ExternalLink className="size-3" />
            </a>
          </Button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-zinc-950 p-4 flex justify-center items-center min-h-[460px] overflow-hidden">
        <div className={`w-full transition-all duration-300 flex flex-col justify-center items-center ${getWidth()}`}>
          {!hasFrameError ? (
            <iframe
              key={key}
              src={url}
              title={`${toolName} Live Frame`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onError={() => setHasFrameError(true)}
              className="w-full h-[520px] rounded-xl border border-zinc-800/80 bg-zinc-950 shadow-2xl"
            />
          ) : (
            <div className="p-8 text-center max-w-md space-y-3 bg-zinc-900/60 rounded-2xl border border-zinc-800">
              <AlertTriangle className="size-8 text-amber-400 mx-auto" />
              <h4 className="text-sm font-semibold text-white">Direct Embedding Restricted by Provider</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {toolName} enforces an <code>X-Frame-Options: SAMEORIGIN</code> security policy preventing in-page frame execution. You can explore the live service directly in an external tab.
              </p>
              <Button asChild size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Launch {toolName} in new tab &rarr;
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
