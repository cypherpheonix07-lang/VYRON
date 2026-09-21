import React, { useState, useEffect } from "react";
import { Search, Sparkles, ArrowRight, CornerDownLeft, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DiscoverySearchProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const EXAMPLE_INTENTS = [
  "What AI can turn a research paper into a presentation?",
  "Intelligent code editor with multi-file repo context",
  "High-fidelity voice cloning with realistic emotion",
  "Photorealistic text-to-video for marketing trailers",
  "Autonomous role-playing agents for market analysis",
];

export function DiscoverySearch({
  initialQuery = "",
  onSearch,
  isLoading = false,
}: DiscoverySearchProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSelectExample = (example: string) => {
    setQuery(example);
    onSearch(example);
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center space-y-4 pt-2 pb-6">
      {/* Title & Product Voice */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="size-3.5" />
          <span>Intent-First AI Discovery Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Find the right AI for your task
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Describe what you need in plain natural language. Our semantic vector engine maps your
          intent to specialized AI tools, verified benchmarks, and live telemetry.
        </p>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="relative group max-w-3xl mx-auto">
        <div className="relative flex items-center rounded-2xl border-2 border-border/80 bg-card/60 backdrop-blur-xl shadow-2xl transition-all focus-within:border-primary focus-within:shadow-[0_0_25px_rgba(var(--primary-rgb),0.25)]">
          <div className="pl-4 pr-2 text-muted-foreground flex items-center">
            <Search className="size-5 transition-colors group-focus-within:text-primary" />
          </div>

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. What AI can turn a research paper into a presentation?"
            className="h-14 border-0 bg-transparent text-base sm:text-lg focus-visible:ring-0 focus-visible:ring-offset-0 px-2 placeholder:text-muted-foreground/60"
          />

          <div className="pr-3 flex items-center gap-2">
            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="h-10 px-4 rounded-xl gap-2 font-semibold shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <span>Explore</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </form>

      {/* Suggested Intent Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
        <span className="text-muted-foreground font-medium flex items-center gap-1">
          <Sparkles className="size-3 text-primary" /> Try intent:
        </span>
        {EXAMPLE_INTENTS.map((example, i) => (
          <button
            key={i}
            onClick={() => handleSelectExample(example)}
            className="px-2.5 py-1 rounded-full bg-secondary/50 hover:bg-primary/15 hover:text-primary text-muted-foreground border border-border/60 transition-all text-left text-[11px]"
          >
            &ldquo;{example}&rdquo;
          </button>
        ))}
      </div>
    </div>
  );
}
