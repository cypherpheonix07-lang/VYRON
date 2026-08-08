import { Link } from "@tanstack/react-router";
import { Hexagon } from "lucide-react";

export function BrahmaLogo({ compact }: { compact?: boolean | undefined }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="PROJECT BRAHMA home">
      <span className="relative grid size-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
        <Hexagon className="size-4" aria-hidden />
      </span>
      {!compact ? (
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold leading-tight tracking-tight">
            PROJECT BRAHMA
          </span>
          <span className="block truncate text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Engineering Intelligence
          </span>
        </span>
      ) : null}
    </Link>
  );
}
