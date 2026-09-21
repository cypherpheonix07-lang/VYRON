import React from "react";
import { Lock, Star, Clock, Archive, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export interface GitHubRepoItem {
  full_name: string;
  repo_id: number;
  private: boolean;
  language: string | null;
  default_branch: string;
  updated_at: string;
  stargazers_count: number;
  archived: boolean;
}

export interface GitHubRepoCardProps {
  repo: GitHubRepoItem;
  selected: boolean;
  onToggle: (repo: GitHubRepoItem) => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-400",
  JavaScript: "bg-amber-400",
  Python: "bg-emerald-400",
  Rust: "bg-orange-500",
  Go: "bg-cyan-400",
  Java: "bg-rose-400",
  Ruby: "bg-red-500",
  PHP: "bg-indigo-400",
  "C++": "bg-pink-500",
  C: "bg-slate-400",
  HTML: "bg-orange-600",
  CSS: "bg-purple-400",
};

function formatRelativeTime(dateStr: string): string {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths}mo ago`;
  } catch {
    return "recently";
  }
}

export function GitHubRepoCard({ repo, selected, onToggle }: GitHubRepoCardProps) {
  const isArchived = repo.archived;
  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || "bg-zinc-400" : "bg-zinc-600";

  return (
    <div
      id={`repo-card-${repo.repo_id}`}
      onClick={() => !isArchived && onToggle(repo)}
      className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 select-none ${
        isArchived
          ? "border-border/40 bg-zinc-950/30 opacity-60 cursor-not-allowed"
          : selected
            ? "border-primary bg-primary/10 ring-1 ring-primary/40 shadow-lg cursor-pointer transform -translate-y-0.5"
            : "border-border/70 bg-zinc-950/50 hover:border-primary/50 hover:bg-zinc-900/60 hover:shadow-md cursor-pointer"
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Checkbox
              id={`repo-checkbox-${repo.repo_id}`}
              checked={selected}
              disabled={isArchived}
              onCheckedChange={() => !isArchived && onToggle(repo)}
              className="mt-0.5 border-border/80 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground shrink-0"
            />
            <span
              title={repo.full_name}
              className="truncate text-sm font-bold text-foreground tracking-tight group-hover:text-primary transition-colors"
            >
              {repo.full_name}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {repo.private && (
              <span
                title="Private Repository"
                className="grid size-5 place-items-center rounded bg-amber-500/10 text-amber-400 border border-amber-500/20"
              >
                <Lock className="size-3" />
              </span>
            )}
            {isArchived && (
              <Badge
                variant="secondary"
                className="text-[10px] bg-zinc-800 text-zinc-400 border-zinc-700 px-1.5 py-0 flex items-center gap-1"
              >
                <Archive className="size-2.5" /> Archived
              </Badge>
            )}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          Branch: <span className="text-zinc-300 font-semibold">{repo.default_branch}</span>
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5 text-xs text-muted-foreground font-mono">
        <div className="flex items-center gap-2">
          {repo.language ? (
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-300">
              <span className={`size-2 rounded-full ${langColor}`} />
              {repo.language}
            </span>
          ) : (
            <span className="text-[11px] text-zinc-500">—</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] text-zinc-400">
            <Star className="size-3 text-amber-400/80" />
            {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-zinc-500">
            <Clock className="size-3" />
            {formatRelativeTime(repo.updated_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
