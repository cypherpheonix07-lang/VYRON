import { ArrowUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewEventsPillProps {
  count: number;
  onClick: () => void;
}

export function NewEventsPill({ count, onClick }: NewEventsPillProps) {
  if (count <= 0) return null;

  return (
    <div className="sticky top-4 z-30 flex justify-center mb-4">
      <Button
        onClick={onClick}
        size="sm"
        className="group flex items-center gap-2 rounded-full bg-primary/95 text-primary-foreground px-4 py-1.5 shadow-lg ring-2 ring-primary/40 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-primary"
      >
        <ArrowUp className="size-3.5 animate-bounce group-hover:-translate-y-0.5 transition-transform" />
        <span className="font-mono text-xs font-semibold">{count}</span>
        <span className="text-xs">new {count === 1 ? "event" : "events"} buffered</span>
        <Sparkles className="size-3 text-primary-foreground/70" />
      </Button>
    </div>
  );
}
