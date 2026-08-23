import { useState } from "react";
import { CodeSnippet } from "./previewData";
import { Copy, Check, Terminal, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PreviewCodePanelProps {
  snippets: CodeSnippet[];
}

export function PreviewCodePanel({ snippets }: PreviewCodePanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!snippets || snippets.length === 0) return null;

  const currentSnippet = snippets[activeTab] || snippets[0];

  const handleCopy = () => {
    if (!currentSnippet) return;
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    toast.success("Code snippet copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border/80 bg-zinc-950/80 overflow-hidden shadow-lg space-y-0">
      {/* Code Header Tabs */}
      <div className="border-b border-border/60 bg-zinc-900/60 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {snippets.map((snip, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === idx
                  ? "bg-zinc-800 text-cyan-400 border border-zinc-700 font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-zinc-800/40"
              }`}
            >
              {snip.language === "bash" ? (
                <Terminal className="size-3" />
              ) : (
                <FileCode className="size-3" />
              )}
              <span>{snip.title}</span>
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2.5 text-[11px] font-mono border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white shrink-0 gap-1.5"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>

      {/* Snippet Description */}
      {currentSnippet?.description && (
        <div className="px-4 py-2 text-[11px] text-muted-foreground border-b border-zinc-900 bg-zinc-950/40 font-mono">
          // {currentSnippet.description}
        </div>
      )}

      {/* Syntax Highlighting Container */}
      <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed max-h-[320px]">
        <pre className="text-zinc-300">
          <code>
            {currentSnippet?.code.split("\n").map((line, lIdx) => (
              <div key={lIdx} className="table-row">
                <span className="table-cell pr-4 text-zinc-600 select-none text-right font-mono text-[10px] w-6">
                  {lIdx + 1}
                </span>
                <span className="table-cell">
                  {line.includes("//") || line.includes("#") ? (
                    <span className="text-zinc-500">{line}</span>
                  ) : line.includes("import") || line.includes("export") || line.includes("function") || line.includes("const") || line.includes("return") ? (
                    <span className="text-purple-400">{line}</span>
                  ) : line.includes("http") || line.includes("npx") ? (
                    <span className="text-cyan-300 font-semibold">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
