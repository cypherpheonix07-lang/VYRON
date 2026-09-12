import { createFileRoute } from "@tanstack/react-router";
import { Eye, Monitor, Smartphone, Tablet, RefreshCw, Layers } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProject } from "@/lib/mock-data";
import { useWebsiteGeneration } from "@/hooks/useWebsiteGeneration";
import { LivePreviewFrame } from "@/components/studio/LivePreviewFrame";
import { RefinementChat } from "@/components/studio/RefinementChat";
import { Sparkles, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/app/studio/$id/preview")({
  head: () => ({
    meta: [
      { title: "Standalone App Preview — BRAHMA AI Studio" },
      {
        name: "description",
        content: "Interactive preview framework testing multiple viewport breakpoints.",
      },
    ],
  }),
  component: StandalonePreviewPage,
});

function StandalonePreviewPage() {
  const { id } = Route.useParams();
  const legacyProject = getProject(id);
  const { project, setProject, previewHtml, reloadProject } = useWebsiteGeneration(id);

  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [rolePreview, setRolePreview] = useState("Admin");
  const [showRefiner, setShowRefiner] = useState(false);

  // If this is a website_project from our AI website generation system:
  if (project) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-border/60 bg-card/40">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="size-5 text-cyan-400" /> {project.name} — Live Sandboxed Preview
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Testing synthesized responsive web application with active mock data and custom OKLCH tokens.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRefiner(!showRefiner)}
              className={`text-xs border-purple-500/40 hover:bg-purple-950/20 text-purple-300 ${
                showRefiner ? "bg-purple-950/40 ring-1 ring-purple-500" : ""
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
              {showRefiner ? "Close Refiner" : "Iterate with AI"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className={showRefiner ? "lg:col-span-8" : "lg:col-span-12"}>
            <LivePreviewFrame
              project={project}
              customHtml={previewHtml}
              onRefresh={reloadProject}
            />
          </div>

          {showRefiner && (
            <div className="lg:col-span-4 sticky top-6">
              <RefinementChat
                project={project}
                onProjectUpdated={(updated) => setProject(updated)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Eye className="size-5 text-primary" /> Application Preview Canvas
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test responsive viewports and role-based permissions in real-time.
          </p>
        </div>

        {/* Configurations Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Viewport controls */}
          <div className="flex items-center gap-1 bg-secondary/50 p-0.5 rounded border border-border/40 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 p-0 ${viewport === "desktop" ? "text-primary bg-background" : "text-muted-foreground"}`}
              onClick={() => setViewport("desktop")}
              aria-label="Desktop viewport"
            >
              <Monitor className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 p-0 ${viewport === "tablet" ? "text-primary bg-background" : "text-muted-foreground"}`}
              onClick={() => setViewport("tablet")}
              aria-label="Tablet viewport"
            >
              <Tablet className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 p-0 ${viewport === "mobile" ? "text-primary bg-background" : "text-muted-foreground"}`}
              onClick={() => setViewport("mobile")}
              aria-label="Mobile viewport"
            >
              <Smartphone className="size-3.5" />
            </Button>
          </div>

          {/* Role switcher */}
          <Select value={rolePreview} onValueChange={setRolePreview}>
            <SelectTrigger className="h-8 text-xs w-28 bg-transparent border-border/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Admin", "User", "Reviewer", "Guest"].map((opt) => (
                <SelectItem key={opt} value={opt} className="text-xs">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => toast.success("Refreshed compiler sandbox.")}
          >
            <RefreshCw className="mr-1.5 size-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="border border-border/60 bg-zinc-950/20 rounded-2xl p-6 flex justify-center items-center h-[520px] overflow-hidden">
        <div
          className={`border border-border bg-background shadow-2xl transition-all duration-300 ${
            viewport === "desktop" && "w-full h-full max-w-4xl"
          } ${viewport === "tablet" && "w-[640px] h-[440px]"} ${
            viewport === "mobile" && "w-[360px] h-[480px]"
          } rounded-xl overflow-hidden flex flex-col`}
        >
          {/* Mock browser top navbar */}
          <div className="h-9 bg-zinc-900 border-b border-border/60 px-3 flex items-center justify-between text-[10px] text-muted-foreground shrink-0 select-none">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-zinc-700" />
              <div className="size-2.5 rounded-full bg-zinc-700" />
              <div className="size-2.5 rounded-full bg-zinc-700" />
            </div>
            <span className="bg-zinc-800 px-4 py-0.5 rounded text-[9px] truncate max-w-60">
              brahma-app-v2.staging.dev/
            </span>
            <div className="w-10" />
          </div>

          {/* Sandbox Render Container */}
          <div className="flex-1 bg-slate-950 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Layers className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">Active Standalone Preview Canvas</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                You are currently viewing the sandbox rendering under the context of the{" "}
                <span className="font-semibold text-foreground">{rolePreview}</span> role.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={() => toast.info("Opening full screen external preview...")}
              >
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
