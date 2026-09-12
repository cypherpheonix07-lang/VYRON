import React, { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  Shield,
  Activity,
  Play,
  Zap,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useCopilot } from "@/state/copilot/useCopilot";
import { aiRouter } from "@/services/ai/aiRouter";
import { AIModelType, CopilotAction } from "@/state/copilot/copilotStore";
import { analysisOrchestrator } from "@/services/orchestrator/analysisOrchestrator";
import { eventSimulator } from "@/services/demo/eventSimulator";
import { cn } from "@/lib/utils";

export function CopilotDrawer() {
  const {
    mode,
    isDrawerOpen,
    session,
    messages,
    isLoading,
    activeModel,
    setDrawerOpen,
    setModel,
    sendMessage,
    addAssistantMessage,
    setLoading,
    clearMessages,
  } = useCopilot();

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || isLoading) return;

    setInputText("");
    sendMessage(text);
    setLoading(true);

    try {
      const response = await aiRouter.routeAndComplete({
        taskType: mode === "DEMO" ? "DEMO_SIMULATION" : "REASONING",
        modelOverride: activeModel,
        messages: [
          ...messages.slice(-5).map((m) => ({
            role: (m.sender === "USER"
              ? "user"
              : m.sender === "ASSISTANT"
                ? "assistant"
                : "system") as "user" | "assistant" | "system",
            content: m.text,
          })),
          { role: "user", content: text },
        ],
        systemPrompt:
          mode === "NORMAL"
            ? "You are Brahma AI Copilot (Normal Production Mode). You assist with 12-stage pipeline analytics, data contracts, and architectural synthesis."
            : "You are Brahma AI Copilot (Demo Mode). You assist with evaluating simulated anomaly events, benchmark datasets, and fraud metrics.",
      });

      addAssistantMessage(response.text, {
        model: response.model,
        verificationHash: response.verificationHash,
        reasoningDurationMs: response.durationMs,
        suggestedActions:
          mode === "NORMAL"
            ? [{ id: "act_1", label: "Execute 12-Stage Pipeline", actionType: "RUN_ANALYSIS" }]
            : [
                {
                  id: "act_demo_1",
                  label: "Inject Anomaly Surge (6 Events)",
                  actionType: "INJECT_ANOMALY",
                },
              ],
      });
    } catch (err) {
      addAssistantMessage(
        "I encountered an issue processing your request. Please check model connectivity.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAction = (action: CopilotAction) => {
    if (action.actionType === "RUN_ANALYSIS") {
      analysisOrchestrator.runPipeline({ mode, speedMultiplier: 1.5 });
      addAssistantMessage(`Pipeline run triggered for ${mode} mode.`);
    } else if (action.actionType === "INJECT_ANOMALY") {
      eventSimulator.injectAnomalyWave(6);
      addAssistantMessage("Injected 6 high-risk anomaly events into the simulator feed.");
    }
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-card/95 backdrop-blur-2xl border-l border-border/60 p-0 flex flex-col h-full shadow-2xl"
      >
        {/* Drawer Header */}
        <SheetHeader className="p-4 border-b border-border/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                <Bot className="size-4" />
              </div>
              <div>
                <SheetTitle className="text-sm font-bold flex items-center gap-1.5">
                  <span>Brahma Copilot</span>
                  <span
                    className={cn(
                      "px-2 py-0.2 rounded-full text-[10px] font-mono font-bold",
                      mode === "DEMO"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-primary/20 text-primary border border-primary/40",
                    )}
                  >
                    {mode} MODE
                  </span>
                </SheetTitle>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={clearMessages}
              title="Clear session history"
              className="size-7 text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>

          {/* Model Selector */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-muted-foreground text-[11px]">Engine:</span>
            <select
              value={activeModel}
              onChange={(e) => setModel(e.target.value as AIModelType)}
              className="text-xs rounded-md bg-secondary/60 border border-border/60 text-foreground px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="CLAUDE_SONNET">Claude 3.7 Sonnet</option>
              <option value="KIMI_K3">Kimi K3 MoE</option>
              <option value="OPENAI_GPT4O">GPT-4o</option>
              <option value="MOCK_DETERMINISTIC">Deterministic Mock</option>
            </select>
          </div>
        </SheetHeader>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col space-y-1.5 max-w-[88%]",
                msg.sender === "USER" ? "ml-auto items-end" : "mr-auto items-start",
              )}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                {msg.sender === "USER" ? (
                  <span>You</span>
                ) : (
                  <>
                    <Sparkles className="size-3 text-primary" />
                    <span>{msg.metadata?.model || "Brahma AI"}</span>
                  </>
                )}
                <span>•</span>
                <span>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div
                className={cn(
                  "p-3 rounded-2xl text-xs leading-relaxed",
                  msg.sender === "USER"
                    ? "bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/20"
                    : "bg-secondary/70 text-foreground border border-border/50 rounded-tl-none",
                )}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Suggested Inline Actions */}
                {msg.metadata?.suggestedActions && msg.metadata.suggestedActions.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-border/30 space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                      Recommended Next Step:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.metadata.suggestedActions.map((act) => (
                        <button
                          key={act.id}
                          onClick={() => handleExecuteAction(act)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-background/80 hover:bg-background text-foreground border border-border/60 transition-all flex items-center gap-1 shadow-sm"
                        >
                          <Zap className="size-3 text-amber-400 fill-current" />
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.metadata?.verificationHash && (
                <div className="text-[9px] font-mono text-muted-foreground truncate max-w-[200px]">
                  Hash: {msg.metadata.verificationHash.slice(0, 16)}...
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="mr-auto flex items-center gap-2 p-3 rounded-2xl bg-secondary/50 border border-border/40 text-xs text-muted-foreground">
              <Activity className="size-3.5 text-primary animate-spin" />
              <span>Synthesizing analytical response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-border/40 bg-card/60 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={
              mode === "NORMAL"
                ? "Ask Brahma about pipeline, contracts, or data..."
                : "Ask Demo Copilot to inject anomalies or explain IQR..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-secondary/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!inputText.trim() || isLoading}
            className="h-8 px-3 rounded-xl bg-primary text-primary-foreground font-bold"
          >
            <Send className="size-3.5" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
