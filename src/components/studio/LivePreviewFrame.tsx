import React, { useState, useRef } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Globe,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { WebsiteProject } from "@/types/websiteStudio";

interface LivePreviewFrameProps {
  project?: Partial<WebsiteProject> | undefined;
  customHtml?: string | undefined;
  onRefresh?: (() => void) | undefined;
}

export const LivePreviewFrame: React.FC<LivePreviewFrameProps> = ({
  project,
  customHtml,
  onRefresh,
}) => {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoom, setZoom] = useState<number>(100);
  const [currentVirtualRoute, setCurrentVirtualRoute] = useState<string>("/");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getWidth = () => {
    switch (deviceMode) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      case "desktop":
      default:
        return "100%";
    }
  };

  const getHeight = () => {
    switch (deviceMode) {
      case "mobile":
        return "667px";
      case "tablet":
        return "1024px";
      case "desktop":
      default:
        return "800px";
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = iframeRef.current.srcdoc;
    }
    if (onRefresh) onRefresh();
    toast.success("Live preview reloaded");
  };

  const handlePopout = () => {
    if (!customHtml) {
      toast.error("No preview bundle available to pop out.");
      return;
    }
    const blob = new Blob([customHtml], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
    toast.info("Opened preview in new tab");
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="p-3 rounded-xl border border-border/60 bg-card/50 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/50">
          <Button
            variant={deviceMode === "desktop" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setDeviceMode("desktop")}
            className={`h-7 px-2.5 text-xs ${deviceMode === "desktop" ? "bg-cyan-500/20 text-cyan-400 font-semibold" : ""}`}
          >
            <Monitor className="w-3.5 h-3.5 mr-1.5" /> Desktop
          </Button>
          <Button
            variant={deviceMode === "tablet" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setDeviceMode("tablet")}
            className={`h-7 px-2.5 text-xs ${deviceMode === "tablet" ? "bg-cyan-500/20 text-cyan-400 font-semibold" : ""}`}
          >
            <Tablet className="w-3.5 h-3.5 mr-1.5" /> Tablet
          </Button>
          <Button
            variant={deviceMode === "mobile" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setDeviceMode("mobile")}
            className={`h-7 px-2.5 text-xs ${deviceMode === "mobile" ? "bg-cyan-500/20 text-cyan-400 font-semibold" : ""}`}
          >
            <Smartphone className="w-3.5 h-3.5 mr-1.5" /> Mobile
          </Button>
        </div>

        {/* Virtual URL Bar */}
        <div className="flex-1 max-w-md mx-auto hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-background/60 border border-border/50 text-xs font-mono text-muted-foreground">
          <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">https://preview.brahma.dev{currentVirtualRoute}</span>
          <Badge variant="outline" className="ml-auto text-[9px] py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
            SSL Valid
          </Badge>
        </div>

        {/* Zoom & Window Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded-lg border border-border/50 text-xs">
            <button
              onClick={() => setZoom((z) => Math.max(z - 15, 50))}
              className="p-1 hover:text-cyan-400 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="font-mono text-[11px] w-10 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(z + 15, 150))}
              className="p-1 hover:text-cyan-400 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-7 w-7 p-0 border-border/60 hover:bg-card"
            title="Reload Preview"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePopout}
            className="h-7 px-2 text-xs border-border/60 hover:bg-card flex items-center gap-1"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Pop Out</span>
          </Button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="w-full flex justify-center items-start bg-slate-950/80 p-6 rounded-2xl border border-border/50 min-h-[820px] overflow-auto shadow-inner">
        <div
          style={{
            width: getWidth(),
            height: getHeight(),
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "width 0.25s ease, height 0.25s ease, transform 0.15s ease",
          }}
          className={`relative bg-background rounded-xl overflow-hidden border shadow-2xl ${
            deviceMode === "mobile"
              ? "border-slate-700 ring-8 ring-slate-900"
              : deviceMode === "tablet"
              ? "border-slate-700 ring-4 ring-slate-900"
              : "border-border/60"
          }`}
        >
          {customHtml ? (
            <iframe
              ref={iframeRef}
              srcDoc={customHtml}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              className="w-full h-full border-none"
              title="Project Brahma Website Preview"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
              <p className="font-semibold text-sm text-foreground">Rendering Sandboxed Preview...</p>
              <p className="text-xs max-w-sm">
                Generating self-contained HTML/CSS/JS bundle with selected design system and seed mock data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
