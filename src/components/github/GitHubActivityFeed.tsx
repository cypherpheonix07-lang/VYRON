import { GitHubEventItem } from "@/services/githubService";
import {
  GitCommit,
  GitPullRequest,
  AlertCircle,
  FolderPlus,
  Star,
  GitFork,
  Activity,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GitHubActivityFeedProps {
  events: GitHubEventItem[];
}

export function GitHubActivityFeed({ events }: GitHubActivityFeedProps) {
  if (!events || events.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-border bg-zinc-950/60 space-y-3">
        <Activity className="size-10 text-muted-foreground/40 mx-auto" />
        <h4 className="text-sm font-semibold text-white">No recent GitHub activity</h4>
        <p className="text-xs text-muted-foreground">
          Recent pushes, PRs, and events will appear here.
        </p>
      </div>
    );
  }

  const getEventMeta = (e: GitHubEventItem) => {
    const payload = e.payload || {};
    switch (e.type) {
      case "PushEvent": {
        const commits = (payload["commits"] as unknown[]) || [];
        const commitCount = commits.length || 1;
        const refStr = payload["ref"]
          ? String(payload["ref"]).replace("refs/heads/", "")
          : "branch";
        return {
          icon: GitCommit,
          label: "Pushed",
          badgeColor: "bg-cyan-950 text-cyan-400 border-cyan-800",
          desc: `Pushed ${commitCount} commit${commitCount > 1 ? "s" : ""} to ${refStr}`,
        };
      }
      case "PullRequestEvent": {
        const actionStr = String(payload["action"] || "Opened");
        const prObj = payload["pull_request"] as { number?: number } | undefined;
        return {
          icon: GitPullRequest,
          label: "Pull Request",
          badgeColor: "bg-purple-950 text-purple-400 border-purple-800",
          desc: `${actionStr} pull request #${prObj?.number || ""}`,
        };
      }
      case "IssuesEvent": {
        const actionStr = String(payload["action"] || "Updated");
        const issueObj = payload["issue"] as { number?: number } | undefined;
        return {
          icon: AlertCircle,
          label: "Issue",
          badgeColor: "bg-amber-950 text-amber-400 border-amber-800",
          desc: `${actionStr} issue #${issueObj?.number || ""}`,
        };
      }
      case "WatchEvent":
        return {
          icon: Star,
          label: "Starred",
          badgeColor: "bg-amber-950 text-amber-300 border-amber-800",
          desc: "Starred repository",
        };
      case "ForkEvent":
        return {
          icon: GitFork,
          label: "Forked",
          badgeColor: "bg-emerald-950 text-emerald-400 border-emerald-800",
          desc: "Forked repository",
        };
      default:
        return {
          icon: FolderPlus,
          label: e.type.replace("Event", ""),
          badgeColor: "bg-zinc-800 text-zinc-300 border-zinc-700",
          desc: `Activity on ${e.repo.name}`,
        };
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-zinc-950/70 p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Live GitHub Activity Stream ({events.length})
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 animate-pulse">
          ● REALTIME FEED
        </span>
      </div>

      <div className="divide-y divide-border/40">
        {events.map((event) => {
          const meta = getEventMeta(event);
          const Icon = meta.icon;
          return (
            <div key={event.id} className="py-3.5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <img
                  src={event.actor.avatar_url}
                  alt={event.actor.login}
                  className="size-8 rounded-full border border-zinc-700 shrink-0 mt-0.5"
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white">{event.actor.login}</span>
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-mono px-1.5 h-4 border ${meta.badgeColor}`}
                    >
                      {meta.label}
                    </Badge>
                    <a
                      href={`https://github.com/${event.repo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-cyan-400 hover:underline truncate"
                    >
                      {event.repo.name}
                    </a>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono leading-relaxed">{meta.desc}</p>
                </div>
              </div>

              <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                {new Date(event.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
