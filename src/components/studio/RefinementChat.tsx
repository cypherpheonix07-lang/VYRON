import React, { useState } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  RefreshCw,
  Clock,
  Layers,
  Cpu,
  Palette,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import type { WebsiteProject } from "@/types/websiteStudio";
import { refineBlueprint } from "@/lib/websiteSynthesis";

export interface RefinementMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  affectedSection?: "frontend" | "backend" | "design" | "features";
  changes?: string[];
  generationNumber?: number;
}

const QUICK_CHIPS = [
  { label: "Add CSV export to data tables", section: "frontend" },
  { label: "Switch design to Midnight Violet", section: "design" },
  { label: "Add webhook signature verification route", section: "backend" },
  { label: "Add multi-currency price conversion", section: "features" },
];

interface RefinementChatProps {
  project: WebsiteProject;
  onProjectUpdated: (updated: WebsiteProject) => void;
}

export const RefinementChat: React.FC<RefinementChatProps> = ({
  project,
  onProjectUpdated,
}) => {
  const [messages, setMessages] = useState<RefinementMessage[]>([
    {
      id: "msg-init",
      sender: "ai",
      text: `Hello! I'm your Project Brahma architectural copilot. Your initial website blueprints and mock data have been generated. What would you like to refine?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  const handleSend = async (feedbackText: string, suggestedSection?: string) => {
    if (!feedbackText.trim() || isRefining) return;

    const userMsg: RefinementMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: feedbackText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsRefining(true);

    try {
      const { data, error } = await supabase.functions.invoke("website-refine", {
        body: {
          project_id: project.id,
          user_feedback: feedbackText.trim(),
          target_section: suggestedSection || "auto",
          current_project: project,
        },
      });

      if (error || !data?.ok) {
        throw new Error(error?.message || "Failed to refine blueprint");
      }

      const aiMsg: RefinementMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: `Refinement applied! I have updated the ${data.section_modified} layer without altering unrelated sections.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        affectedSection: data.section_modified,
        changes: data.summaries || ["Updated blueprint specification"],
        generationNumber: data.generation_number,
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (data.updated_project) {
        onProjectUpdated(data.updated_project);
      }
      toast.success("Blueprint updated and preview refreshed!");
    } catch (err: any) {
      console.error("[RefinementChat] Error, using local fallback:", err);
      const targetSec = (suggestedSection as any) || "auto";
      const { updatedProject, affectedSection, changeSummaries } = refineBlueprint(
        project,
        feedbackText,
        targetSec
      );

      const nextGen = (project.generation_step || 1) + 1;
      const fallbackAiMsg: RefinementMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: `Applied targeted update based on your feedback: "${feedbackText}". Preview has been re-synchronized.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        affectedSection: affectedSection as any,
        changes: changeSummaries,
        generationNumber: nextGen,
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
      onProjectUpdated(updatedProject);
      toast.info("Refinement preview synchronized");
    } finally {
      setIsRefining(false);
    }
  };

  const getSectionBadge = (sec?: string) => {
    switch (sec) {
      case "frontend":
        return <Badge variant="outline" className="text-[10px] border-cyan-500/40 text-cyan-400 bg-cyan-500/10">Frontend</Badge>;
      case "backend":
        return <Badge variant="outline" className="text-[10px] border-purple-500/40 text-purple-400 bg-purple-500/10">Backend</Badge>;
      case "design":
        return <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-400 bg-amber-500/10">Design System</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[750px] rounded-2xl border border-border/60 bg-card/40 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-border/60 bg-card/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Iterative Refinement Studio</h3>
            <p className="text-[11px] text-muted-foreground">
              Natural language section targeting • Preserves untouched code
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          Gen #{project.generation_step || 1}
        </Badge>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === "user"
                  ? "bg-cyan-600 text-white"
                  : "bg-purple-950/60 border border-purple-500/40 text-purple-400"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-3.5 space-y-2 text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-cyan-600 text-white rounded-tr-none shadow-md"
                  : "bg-muted/40 border border-border/60 text-foreground rounded-tl-none"
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-[10px] text-muted-foreground">
                <span className={msg.sender === "user" ? "text-cyan-100" : ""}>
                  {msg.sender === "user" ? "You" : "Brahma Copilot"}
                </span>
                <span className={msg.sender === "user" ? "text-cyan-200" : ""}>{msg.timestamp}</span>
              </div>

              <p>{msg.text}</p>

              {msg.changes && msg.changes.length > 0 && (
                <div className="pt-2 mt-2 border-t border-border/40 space-y-1.5">
                  <div className="flex items-center gap-2">
                    {getSectionBadge(msg.affectedSection)}
                    {msg.generationNumber && (
                      <span className="text-[10px] font-mono text-muted-foreground">
                        Iteration v{msg.generationNumber}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1">
                    {msg.changes.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        {isRefining && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 animate-pulse">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Analyzing request & mutating targeted blueprint section...</span>
          </div>
        )}
      </div>

      {/* Quick-Prompt Chips */}
      <div className="p-3 border-t border-border/40 bg-card/30 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider shrink-0 font-semibold">
          Suggestions:
        </span>
        {QUICK_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.label, chip.section)}
            disabled={isRefining}
            className="text-[11px] px-2.5 py-1 rounded-full border border-border/60 bg-card hover:border-cyan-500/50 hover:bg-cyan-950/20 text-muted-foreground hover:text-foreground shrink-0 transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-border/60 bg-card/60 flex items-center gap-2">
        <Input
          placeholder="Describe your desired refinement (e.g. 'Add a search bar to products', 'Make borders rounded')..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(inputValue);
            }
          }}
          disabled={isRefining}
          className="bg-background/60 text-xs h-9"
        />
        <Button
          size="sm"
          onClick={() => handleSend(inputValue)}
          disabled={!inputValue.trim() || isRefining}
          className="bg-cyan-600 hover:bg-cyan-500 text-white h-9 px-3 shrink-0"
        >
          {isRefining ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};
