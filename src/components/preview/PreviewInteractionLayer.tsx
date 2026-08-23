import { useState } from "react";
import {
  Sparkles,
  Send,
  Check,
  X,
  FileCode,
  Folder,
  FolderOpen,
  Terminal,
  Play,
  Layers,
  Palette,
  Sliders,
  Columns,
  MessageSquare,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface PreviewInteractionLayerProps {
  toolId: string;
  toolName: string;
  accentColor: string;
}

export function PreviewInteractionLayer({
  toolId,
  toolName,
  accentColor,
}: PreviewInteractionLayerProps) {
  // Common interaction states
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // V0 Demo State
  const [v0ComponentVariant, setV0ComponentVariant] = useState<"primary" | "outline" | "danger">("primary");
  const [v0Title, setV0Title] = useState("Enterprise Analytics Gate");

  // Bolt Demo State
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ src: true, components: true });
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "✓ WebContainer initialized (Node 22 WASM)",
    "✓ Dependencies resolved in 140ms",
    "➜ Local: http://localhost:5173",
  ]);

  // Lovable Demo State
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "user", text: "Add a Supabase auth guard to the project dashboard" },
    { sender: "ai", text: "✓ Modifying src/routes/app.tsx with beforeLoad session check.\n✓ Updating profiles schema and RLS policies." },
  ]);

  // Cursor Demo State
  const [diffAccepted, setDiffAccepted] = useState<boolean | null>(null);

  // Linear Demo State
  const [tasks, setTasks] = useState<{ id: string; title: string; col: "todo" | "doing" | "done" }[]>([
    { id: "1", title: "Implement GitHub Webhook Edge Function", col: "doing" },
    { id: "2", title: "Add strict RLS policy tests", col: "done" },
    { id: "3", title: "Optimize Recharts SVG render tree", col: "todo" },
  ]);

  // Subframe Demo State
  const [tokenRadius, setTokenRadius] = useState<number>(8);
  const [tokenColor, setTokenColor] = useState<string>("#06B6D4");

  // 1. V0 PROMPT DEMO
  if (toolId === "v0-vercel") {
    const handleV0Submit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!promptInput.trim()) return;
      setIsGenerating(true);
      setTimeout(() => {
        setV0Title(promptInput);
        setIsGenerating(false);
        setPromptInput("");
      }, 700);
    };

    return (
      <div className="p-4 rounded-xl border border-cyan-500/30 bg-zinc-950/70 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              v0 Interactive Component Synthesizer
            </h4>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-zinc-700">
            JSX + Tailwind
          </Badge>
        </div>

        {/* Live Generated Component Preview */}
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
          <div className="space-y-1 text-center sm:text-left">
            <Badge className="bg-cyan-950 text-cyan-400 border border-cyan-800/50 text-[9px]">
              LIVE PREVIEW
            </Badge>
            <h5 className="text-sm font-bold text-white mt-1">{v0Title}</h5>
            <p className="text-xs text-zinc-400">Synthesized Radix UI card with responsive actions.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className={
                v0ComponentVariant === "primary"
                  ? "bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold"
                  : v0ComponentVariant === "danger"
                  ? "bg-rose-600 text-white hover:bg-rose-500"
                  : "border border-zinc-700 bg-zinc-800 text-zinc-200"
              }
            >
              Action CTA
            </Button>
            <div className="flex items-center bg-zinc-950 rounded-lg p-0.5 border border-zinc-800">
              <button
                onClick={() => setV0ComponentVariant("primary")}
                className={`px-2 py-0.5 text-[10px] rounded ${v0ComponentVariant === "primary" ? "bg-cyan-500 text-zinc-950 font-bold" : "text-zinc-400"}`}
              >
                Cyan
              </button>
              <button
                onClick={() => setV0ComponentVariant("outline")}
                className={`px-2 py-0.5 text-[10px] rounded ${v0ComponentVariant === "outline" ? "bg-zinc-700 text-white" : "text-zinc-400"}`}
              >
                Ghost
              </button>
              <button
                onClick={() => setV0ComponentVariant("danger")}
                className={`px-2 py-0.5 text-[10px] rounded ${v0ComponentVariant === "danger" ? "bg-rose-600 text-white font-bold" : "text-zinc-400"}`}
              >
                Alert
              </button>
            </div>
          </div>
        </div>

        {/* Prompt Input */}
        <form onSubmit={handleV0Submit} className="flex gap-2">
          <Input
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Type a component prompt (e.g., 'Hero section with CTA badge')..."
            className="bg-zinc-900 border-zinc-800 text-xs text-white placeholder-zinc-500"
          />
          <Button
            type="submit"
            size="sm"
            disabled={isGenerating}
            className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold shrink-0"
          >
            {isGenerating ? <RefreshCw className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
          </Button>
        </form>
      </div>
    );
  }

  // 2. BOLT FILETREE & TERMINAL DEMO
  if (toolId === "bolt-new") {
    const runCommand = () => {
      setTerminalOutput((prev) => [...prev, "$ npm run build", "✓ Compiled 14 modules in 32ms", "✓ Ready for deployment"]);
    };

    return (
      <div className="p-4 rounded-xl border border-blue-500/30 bg-zinc-950/70 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Bolt WebContainer File Explorer &amp; Terminal
            </h4>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={runCommand}
            className="h-6 text-[10px] border-blue-500/40 text-blue-300 bg-blue-950/40 hover:bg-blue-900/60 font-mono gap-1"
          >
            <Play className="size-2.5" /> Execute Build
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          {/* File Tree */}
          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/60 space-y-1">
            <div
              className="flex items-center gap-1.5 text-zinc-300 cursor-pointer hover:text-white"
              onClick={() => setOpenFolders((p) => ({ ...p, ["src"]: !p["src"] }))}
            >
              {openFolders["src"] ? <FolderOpen className="size-3.5 text-amber-400" /> : <Folder className="size-3.5 text-amber-400" />}
              <span className="font-semibold">src/</span>
            </div>
            {openFolders["src"] && (
              <div className="pl-4 space-y-1">
                <div
                  className="flex items-center gap-1.5 text-zinc-400 cursor-pointer hover:text-white"
                  onClick={() => setOpenFolders((p) => ({ ...p, ["components"]: !p["components"] }))}
                >
                  {openFolders["components"] ? <FolderOpen className="size-3 text-amber-400" /> : <Folder className="size-3 text-amber-400" />}
                  <span>components/</span>
                </div>
                {openFolders["components"] && (
                  <div className="pl-4 space-y-1 text-zinc-500">
                    <div className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300">
                      <FileCode className="size-3" /> AppShell.tsx
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400 hover:text-white">
                      <FileCode className="size-3" /> Navigation.tsx
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <FileCode className="size-3" /> router.tsx
                </div>
              </div>
            )}
          </div>

          {/* Terminal Console */}
          <div className="p-3 rounded-lg border border-zinc-800 bg-black/90 text-zinc-300 space-y-1 overflow-y-auto max-h-[140px]">
            <div className="text-[10px] text-zinc-500 flex items-center gap-1 border-b border-zinc-800 pb-1 mb-1">
              <Terminal className="size-3 text-blue-400" /> In-Browser WASM Terminal
            </div>
            {terminalOutput.map((out, idx) => (
              <div key={idx} className="text-[11px] text-emerald-400">
                {out}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. LOVABLE CONVERSATIONAL CHAT DEMO
  if (toolId === "lovable-dev") {
    const handleLovableSend = (e: React.FormEvent) => {
      e.preventDefault();
      if (!promptInput.trim()) return;
      const userText = promptInput;
      setMessages((prev) => [...prev, { sender: "user", text: userText }]);
      setPromptInput("");
      setIsGenerating(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: `✓ Analyzed instructions for "${userText}".\n✓ Executing multi-file patch across components and route tree.\n✓ Hot reload updated preview in 220ms.`,
          },
        ]);
        setIsGenerating(false);
      }, 800);
    };

    return (
      <div className="p-4 rounded-xl border border-pink-500/30 bg-zinc-950/70 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Lovable Iterative AI Chat Agent
            </h4>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-pink-500/40 text-pink-400 bg-pink-950/30">
            Git Sync Active
          </Badge>
        </div>

        {/* Message Thread */}
        <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-2.5 max-h-[160px] overflow-y-auto">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-2 text-xs ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              {m.sender === "ai" && <Bot className="size-4 text-pink-400 shrink-0 mt-0.5" />}
              <div
                className={`p-2.5 rounded-xl max-w-[80%] whitespace-pre-line leading-relaxed ${
                  m.sender === "user" ? "bg-pink-600 text-white font-medium" : "bg-zinc-800 text-zinc-200 border border-zinc-700"
                }`}
              >
                {m.text}
              </div>
              {m.sender === "user" && <User className="size-4 text-zinc-400 shrink-0 mt-0.5" />}
            </div>
          ))}
          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-pink-400 font-mono animate-pulse">
              <RefreshCw className="size-3.5 animate-spin" /> Synthesizing multi-file patch...
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleLovableSend} className="flex gap-2">
          <Input
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Ask Lovable to modify buttons, layouts, or schemas..."
            className="bg-zinc-900 border-zinc-800 text-xs text-white placeholder-zinc-500"
          />
          <Button
            type="submit"
            size="sm"
            disabled={isGenerating}
            className="bg-pink-600 hover:bg-pink-500 text-white font-bold shrink-0"
          >
            <Send className="size-3.5" />
          </Button>
        </form>
      </div>
    );
  }

  // 4. CURSOR CODE DIFF DEMO
  if (toolId === "cursor-ai") {
    return (
      <div className="p-4 rounded-xl border border-zinc-700 bg-zinc-950/80 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Cursor Inline Composer Diff Review
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={() => setDiffAccepted(true)}
              className="h-6 px-2 text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1"
            >
              <Check className="size-3" /> Accept (⌘Y)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDiffAccepted(false)}
              className="h-6 px-2 text-[10px] border-zinc-700 text-zinc-400 hover:text-white bg-zinc-900 gap-1"
            >
              <X className="size-3" /> Reject (⌘N)
            </Button>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-zinc-800 bg-black font-mono text-[11px] leading-relaxed space-y-0.5">
          <div className="text-zinc-500">// src/services/authService.ts</div>
          <div className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded flex items-center justify-between">
            <span>- const token = localStorage.getItem("token");</span>
            <span className="text-[9px] uppercase font-bold text-rose-400">REMOVED</span>
          </div>
          <div className="bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded flex items-center justify-between">
            <span>+ const {`{ data: { session } }`} = await supabase.auth.getSession();</span>
            <span className="text-[9px] uppercase font-bold text-emerald-400">AI PROPOSED</span>
          </div>
          <div className="text-zinc-400 pl-2">return session?.access_token;</div>
        </div>

        {diffAccepted !== null && (
          <div className={`text-xs font-semibold p-2 rounded-lg text-center ${diffAccepted ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60" : "bg-zinc-900 text-zinc-400"}`}>
            {diffAccepted ? "✓ Changes committed to local buffer" : "✕ Diff rejected by user"}
          </div>
        )}
      </div>
    );
  }

  // 5. LINEAR KANBAN DEMO
  if (toolId === "linear-ai") {
    const moveTask = (id: string, nextCol: "todo" | "doing" | "done") => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, col: nextCol } : t)));
    };

    return (
      <div className="p-4 rounded-xl border border-indigo-500/30 bg-zinc-950/70 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Linear Interactive Sprint Kanban
            </h4>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-indigo-500/40 text-indigo-300">
            Sprint 42
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          {(["todo", "doing", "done"] as const).map((colName) => (
            <div key={colName} className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="font-bold text-[10px] uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                <span>{colName}</span>
                <span className="text-zinc-600 font-mono">
                  {tasks.filter((t) => t.col === colName).length}
                </span>
              </div>
              <div className="space-y-1.5">
                {tasks
                  .filter((t) => t.col === colName)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-2 rounded-md bg-zinc-950 border border-zinc-800/80 hover:border-indigo-500/40 transition-colors space-y-1.5"
                    >
                      <p className="text-[11px] text-zinc-200 font-medium leading-snug">{task.title}</p>
                      <div className="flex justify-end gap-1">
                        {colName !== "todo" && (
                          <button
                            onClick={() => moveTask(task.id, "todo")}
                            className="text-[9px] text-zinc-500 hover:text-zinc-300 px-1 rounded bg-zinc-900"
                          >
                            &larr;
                          </button>
                        )}
                        {colName !== "doing" && (
                          <button
                            onClick={() => moveTask(task.id, "doing")}
                            className="text-[9px] text-indigo-400 hover:text-indigo-300 px-1 rounded bg-zinc-900"
                          >
                            Doing
                          </button>
                        )}
                        {colName !== "done" && (
                          <button
                            onClick={() => moveTask(task.id, "done")}
                            className="text-[9px] text-emerald-400 hover:text-emerald-300 px-1 rounded bg-zinc-900"
                          >
                            &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. SUBFRAME TOKEN DEMO
  if (toolId === "subframe") {
    return (
      <div className="p-4 rounded-xl border border-emerald-500/30 bg-zinc-950/70 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Subframe Design Token System
            </h4>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-300">
            Tailwind v4 @theme
          </Badge>
        </div>

        {/* Live Token Controlled Component */}
        <div className="p-5 bg-zinc-900/60 rounded-xl border border-zinc-800 flex items-center justify-between">
          <div className="space-y-1">
            <div
              className="text-xs font-bold px-3 py-1 text-zinc-950 inline-block font-mono"
              style={{ borderRadius: `${tokenRadius}px`, backgroundColor: tokenColor }}
            >
              TOKEN BADGE
            </div>
            <p className="text-xs text-zinc-400">Dynamic border radius: {tokenRadius}px</p>
          </div>

          <div className="space-y-2 text-right">
            <div className="flex items-center gap-2 justify-end">
              <label className="text-[10px] font-mono text-zinc-400">Radius</label>
              <input
                type="range"
                min="0"
                max="24"
                value={tokenRadius}
                onChange={(e) => setTokenRadius(Number(e.target.value))}
                className="w-24 accent-cyan-400"
              />
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              {["#06B6D4", "#10B981", "#8B5CF6", "#F59E0B"].map((c) => (
                <button
                  key={c}
                  onClick={() => setTokenColor(c)}
                  className={`size-4 rounded-full border border-white/20 transition-transform ${tokenColor === c ? "scale-125 ring-2 ring-white" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT / GENERIC AI PROMPT DEMO
  return (
    <div className="p-4 rounded-xl border border-border bg-zinc-950/70 space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            {toolName} Simulator
          </h4>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-zinc-700">
          Simulation
        </Badge>
      </div>

      <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-2 text-xs">
        <p className="text-zinc-300 font-medium">Test {toolName} prompt execution engine:</p>
        <div className="flex gap-2">
          <Input
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder={`Instruct ${toolName} to generate or analyze...`}
            className="bg-zinc-950 border-zinc-800 text-xs text-white"
          />
          <Button
            size="sm"
            onClick={() => {
              setIsGenerating(true);
              setTimeout(() => setIsGenerating(false), 600);
            }}
            className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold shrink-0"
          >
            {isGenerating ? <RefreshCw className="size-3.5 animate-spin" /> : "Run"}
          </Button>
        </div>
      </div>
    </div>
  );
}
