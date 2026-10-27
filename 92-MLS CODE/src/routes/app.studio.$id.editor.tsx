import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AppWindow,
  ArrowRight,
  Bot,
  Bug,
  ChevronDown,
  ChevronRight,
  Code2,
  Database,
  Eye,
  FileCode,
  FileText,
  Folder,
  Layers,
  ListFilter,
  Monitor,
  Phone,
  Play,
  RefreshCw,
  Search,
  Send,
  Settings,
  Share2,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Split,
  Tablet,
  Undo2,
  Wand2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProject } from "@/lib/mock-data";

export const Route = createFileRoute("/app/studio/$id/editor")({
  head: () => ({
    meta: [
      { title: "Brahma Code Studio Editor — BRAHMA AI Studio" },
      {
        name: "description",
        content: "Professional three-panel IDE with AI Copilot, preview, and schema editors.",
      },
    ],
  }),
  component: StudioEditorPage,
});

const mockFiles = [
  {
    name: "package.json",
    type: "config",
    content: `{\n  "name": "brahma-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.3.0",\n    "recharts": "^2.12.0"\n  }\n}`,
  },
  {
    name: "src/routes/index.tsx",
    type: "route",
    content: `import { createFileRoute } from '@tanstack/react-router';\n\nexport const Route = createFileRoute('/')({\n  component: LandingPage,\n});\n\nfunction LandingPage() {\n  return (\n    <div className="p-8 text-center bg-slate-900 min-h-screen">\n      <h1 className="text-3xl font-bold">Welcome to Brahma App</h1>\n      <p className="mt-2 text-slate-400">Successfully generated and deployed.</p>\n    </div>\n  );\n}`,
  },
  {
    name: "src/components/MetricCard.tsx",
    type: "component",
    content: `import React from 'react';\n\nexport function MetricCard({ title, value }) {\n  return (\n    <div className="border border-border/80 rounded-xl p-4 surface bg-slate-900/50">\n      <p className="text-xs text-muted-foreground font-semibold">{title}</p>\n      <p className="text-xl font-bold text-foreground mt-1">{value}</p>\n    </div>\n  );\n}`,
  },
  {
    name: "src/components/Navbar.tsx",
    type: "component",
    content: `export function Navbar() {\n  return (\n    <nav className="h-14 border-b border-border/60 flex items-center justify-between px-6 bg-slate-900">\n      <span className="font-bold text-sm tracking-tight text-white">Console</span>\n    </nav>\n  );\n}`,
  },
  {
    name: "server/routes/api.py",
    type: "server",
    content: `from fastapi import FastAPI, Depends\nfrom typing import List\n\napp = FastAPI()\n\n@app.get("/api/v1/metrics")\ndef get_system_metrics():\n    return {"cpu": "22%", "latency": "14ms", "db_pool": "active"}`,
  },
];

function StudioEditorPage() {
  const { id } = Route.useParams();
  const project = getProject(id);

  const [activeFile, setActiveFile] = useState(mockFiles[1]!);
  const [editorMode, setEditorMode] = useState<"code" | "preview" | "split" | "blueprint">("code");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [rolePreview, setRolePreview] = useState("Admin");

  // AI Copilot states
  const [copilotMode, setCopilotMode] = useState("Coder");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      text: "Welcome to BRAHMA Copilot. How can I help build or optimize your code today?",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  // Selected code changes approve state
  const [hasDiff, setHasDiff] = useState(false);

  const handleSelectFile = (file: (typeof mockFiles)[0]) => {
    setActiveFile(file);
    setHasDiff(false);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput;
    setChatHistory((prev) => [...prev, { role: "user", text: query }]);
    setChatInput("");
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      if (query.toLowerCase().includes("component") || query.toLowerCase().includes("card")) {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "I have generated a new metric layout widget featuring security risk badges. Let's look at the generated file diff in `src/components/MetricCard.tsx`:",
          },
        ]);
        // Update file and show diff
        const updatedFile = {
          ...mockFiles[2]!,
          content: `import React from 'react';\nimport { ShieldAlert } from 'lucide-react';\n\nexport function MetricCard({ title, value, risk }) {\n  return (\n    <div className="border border-border/80 rounded-xl p-4 surface bg-slate-900/50 flex justify-between items-center">\n      <div>\n        <p className="text-xs text-muted-foreground font-semibold">{title}</p>\n        <p className="text-xl font-bold text-foreground mt-1">{value}</p>\n      </div>\n      {risk && (\n        <span className="flex items-center gap-1 text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full font-semibold">\n          <ShieldAlert className="size-3" /> Risk Flagged\n        </span>\n      )}\n    </div>\n  );\n}`,
        };
        setActiveFile(updatedFile);
        setHasDiff(true);
        toast.info("AI edit suggestions populated in file view.");
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "I've analyzed the system requirements for payment routing. Let's add a rate-limiter check logic or create a transaction audit table configuration in the data schema studio.",
          },
        ]);
      }
    }, 1200);
  };

  return (
    <div className="border border-border rounded-2xl overflow-hidden flex flex-col surface h-[720px] relative">
      {/* Editor Header / Top Bar */}
      <div className="h-14 border-b border-border/60 px-4 flex items-center justify-between bg-zinc-950/80 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded bg-primary/10 text-primary">
              <Code2 className="size-3.5" aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold text-foreground truncate max-w-40">
              {project.name}
            </span>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1 hidden sm:flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
              aria-label="Undo edit"
            >
              <Undo2 className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
              aria-label="Redo edit"
            >
              <Undo2 className="size-3.5 rotate-180" />
            </Button>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Branch selector */}
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono bg-secondary/40 px-2 py-1 rounded border border-border/40 cursor-pointer hover:border-primary/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>main</span>
            <ChevronDown className="size-3" />
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs text-muted-foreground"
            onClick={() => toast.info("Link generated and copied to clipboard.")}
          >
            <Share2 className="mr-1 size-3.5" /> Share
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs border-primary/20 hover:border-primary/50"
            asChild
          >
            <Link to="/app/studio/$id/publish" params={{ id }}>
              Publish <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Body Panel Container */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Side: File Explorer */}
        <aside className="w-56 border-r border-border/60 flex flex-col bg-zinc-950/20 shrink-0 select-none">
          <div className="p-3 border-b border-border/50 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              File Explorer
            </span>
            <Search className="size-3.5 text-muted-foreground cursor-pointer" />
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-thin">
            {/* Pages & Components folder structure */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold px-2 py-1">
                <Folder className="size-3.5 text-primary/60" /> <span>Source Files</span>
              </div>
              <div className="space-y-0.5 pl-4">
                {mockFiles.map((file) => (
                  <button
                    key={file.name}
                    type="button"
                    onClick={() => handleSelectFile(file)}
                    className={`w-full flex items-center gap-1.5 text-xs text-left px-2 py-1 rounded transition-colors ${
                      activeFile.name === file.name
                        ? "bg-primary/8 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                    }`}
                  >
                    <FileCode className="size-3.5 shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logical nodes folder stubs */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold px-2 py-1">
                <Database className="size-3.5 text-indigo-400/80" /> <span>Database Models</span>
              </div>
              <div className="space-y-0.5 pl-4 text-xs text-muted-foreground">
                <button
                  type="button"
                  className="w-full flex items-center gap-1.5 px-2 py-1 hover:text-foreground text-left"
                  onClick={() => toast.info("Open Data Studio tab to manage SQL databases.")}
                >
                  <Folder className="size-3" /> users.sql
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-1.5 px-2 py-1 hover:text-foreground text-left"
                  onClick={() => toast.info("Open Data Studio tab to manage SQL databases.")}
                >
                  <Folder className="size-3" /> logs.sql
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Panel: Main editor viewport */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0 bg-zinc-950/10">
          {/* Editor Sub-nav Bar */}
          <div className="h-10 border-b border-border/50 px-4 flex items-center justify-between bg-zinc-950/40 shrink-0">
            <div className="flex gap-2">
              {(
                [
                  { id: "code", label: "Code View", icon: Code2 },
                  { id: "preview", label: "Live App Preview", icon: Eye },
                  { id: "split", label: "Split Screen", icon: Split },
                ] as const
              ).map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  className={`h-7 px-3 text-xs gap-1.5 ${
                    editorMode === item.id
                      ? "bg-secondary text-primary font-semibold"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setEditorMode(item.id)}
                >
                  <item.icon className="size-3.5" /> {item.label}
                </Button>
              ))}
            </div>

            {/* Viewport Toggles for Preview */}
            {(editorMode === "preview" || editorMode === "split") && (
              <div className="flex items-center gap-1 bg-secondary/50 p-0.5 rounded border border-border/40">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 p-0 ${viewport === "desktop" ? "text-primary" : "text-muted-foreground"}`}
                  onClick={() => setViewport("desktop")}
                  aria-label="Desktop view"
                >
                  <Monitor className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 p-0 ${viewport === "tablet" ? "text-primary" : "text-muted-foreground"}`}
                  onClick={() => setViewport("tablet")}
                  aria-label="Tablet view"
                >
                  <Tablet className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 p-0 ${viewport === "mobile" ? "text-primary" : "text-muted-foreground"}`}
                  onClick={() => setViewport("mobile")}
                  aria-label="Mobile view"
                >
                  <Smartphone className="size-3.5" />
                </Button>
              </div>
            )}
          </div>

          {/* View Container */}
          <div className="flex-1 overflow-hidden relative">
            {/* CODE MODE */}
            {(editorMode === "code" || editorMode === "split") && (
              <div
                className={`h-full flex flex-col ${editorMode === "split" ? "border-b border-border/60" : ""}`}
              >
                {/* Simulated file tabs bar */}
                <div className="h-8 bg-zinc-950/20 border-b border-border/40 flex items-center px-4 shrink-0 text-[10px] text-muted-foreground font-mono">
                  <span className="text-foreground">{activeFile.name}</span>
                </div>
                <div className="flex-1 p-4 font-mono text-xs text-zinc-300 bg-zinc-950 overflow-y-auto leading-relaxed whitespace-pre select-text selection:bg-primary/20">
                  {activeFile.content}
                </div>

                {/* AI suggestion validation panel */}
                {hasDiff && (
                  <div className="p-3 border-t border-border bg-primary/4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <Bot className="size-4 text-primary shrink-0 animate-bounce" />
                      <span className="text-[10px] text-muted-foreground">
                        Approve new layout code modifications?
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-[10px] text-red-500"
                        onClick={() => setHasDiff(false)}
                      >
                        Discard
                      </Button>
                      <Button
                        size="sm"
                        className="h-6 text-[10px] bg-primary text-primary-foreground"
                        onClick={() => {
                          setHasDiff(false);
                          toast.success("AI edits merged into master tree.");
                        }}
                      >
                        Merge Code
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PREVIEW MODE */}
            {(editorMode === "preview" || editorMode === "split") && (
              <div className="h-full bg-secondary/30 flex items-center justify-center p-4 relative overflow-y-auto">
                <div
                  className={`border border-border/60 rounded-xl bg-background shadow-2xl transition-all ${
                    viewport === "desktop" && "w-full h-full max-h-[480px]"
                  } ${viewport === "tablet" && "w-[600px] h-[400px]"} ${
                    viewport === "mobile" && "w-[360px] h-[460px]"
                  } overflow-hidden flex flex-col`}
                >
                  {/* Mock browser header */}
                  <div className="h-8 bg-zinc-900 border-b border-border/60 px-3 flex items-center justify-between text-[10px] text-muted-foreground">
                    <div className="flex gap-1">
                      <div className="size-2 rounded-full bg-red-500" />
                      <div className="size-2 rounded-full bg-amber-500" />
                      <div className="size-2 rounded-full bg-green-500" />
                    </div>
                    <span className="bg-zinc-800 px-4 py-0.5 rounded text-[9px] truncate max-w-60">
                      brahma-app-v2.staging.dev/
                    </span>
                    <RefreshCw className="size-3" />
                  </div>

                  {/* Mock browser inner viewport */}
                  <div className="flex-1 bg-slate-950 p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center text-primary">
                      <Wand2 className="size-5" />
                    </div>
                    <h3 className="text-sm font-semibold">Active Preview: {project.name}</h3>
                    <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                      Generated template components render live here in sandboxed iframe views.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[10px]"
                        onClick={() => toast.info("Refreshed sandboxed canvas.")}
                      >
                        Refresh View
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-[10px]"
                        onClick={() => toast.success("Live preview synced to dev server.")}
                      >
                        Update Build
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Side: AI Copilot Drawer */}
        <aside className="w-80 border-l border-border/60 flex flex-col bg-zinc-950/20 shrink-0">
          {/* Chat Mode Switcher */}
          <div className="p-3 border-b border-border/50 flex items-center justify-between shrink-0">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
              <Bot className="size-4 text-primary" /> AI Copilot
            </span>
            <Select value={copilotMode} onValueChange={setCopilotMode}>
              <SelectTrigger className="h-6 text-[10px] w-24 bg-transparent border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Coder", "Architect", "Tester", "Security Analyst", "Business Analyst"].map(
                  (opt) => (
                    <SelectItem key={opt} value={opt} className="text-xs">
                      {opt}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Chat Message Logs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed scrollbar-thin">
            {chatHistory.map((msg, i) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={i}
                  className={`flex gap-2 max-w-[85%] ${
                    isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
                  }`}
                >
                  {isAssistant && (
                    <span className="grid size-6 place-items-center rounded bg-primary/10 text-primary shrink-0 h-6">
                      <Bot className="size-3.5" />
                    </span>
                  )}
                  <div
                    className={`rounded-xl p-3 border ${
                      isAssistant
                        ? "bg-secondary/40 border-border/60 text-muted-foreground"
                        : "bg-primary border-primary/20 text-primary-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex gap-2 mr-auto max-w-[85%]">
                <span className="grid size-6 place-items-center rounded bg-primary/10 text-primary shrink-0 h-6">
                  <Bot className="size-3.5 animate-spin" />
                </span>
                <div className="rounded-xl p-3 border bg-secondary/40 border-border/60 text-muted-foreground flex items-center gap-1.5 text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span>Analyzing AST file tree...</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Quick Actions */}
          <div className="p-3 border-t border-border/40 space-y-1.5 shrink-0 bg-zinc-950/20">
            <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
              Suggested Prompts
            </span>
            <div className="flex flex-col gap-1">
              <Button
                variant="outline"
                size="sm"
                className="justify-between h-7 text-[10px] text-left"
                onClick={() => {
                  setChatInput(
                    "Generate a customized MetricCard component showing data sync alerts.",
                  );
                }}
              >
                <span>Generate MetricCard component</span>
                <ChevronRight className="size-3 text-muted-foreground" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-between h-7 text-[10px] text-left"
                onClick={() => {
                  setChatInput("Review src/routes/index.tsx code against vulnerabilities.");
                }}
              >
                <span>Fix security vulnerabilities</span>
                <ChevronRight className="size-3 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendChat}
            className="p-3 border-t border-border/50 flex gap-2 shrink-0 bg-zinc-950/40"
          >
            <Input
              placeholder={`Ask the ${copilotMode} AI...`}
              className="h-8 text-xs bg-background/50 border-border/60"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 shrink-0 bg-primary hover:bg-primary/95 text-primary-foreground"
              aria-label="Send query"
            >
              <Send className="size-3.5" />
            </Button>
          </form>
        </aside>
      </div>
    </div>
  );
}
