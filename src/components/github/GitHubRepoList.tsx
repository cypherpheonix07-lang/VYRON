import { useState, useMemo } from "react";
import { GitHubRepoItem, GITHUB_LANG_COLORS, githubService } from "@/services/githubService";
import {
  Search,
  FolderGit2,
  Star,
  GitFork,
  Eye,
  Lock,
  Globe,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Download,
  Copy,
  Terminal,
  ExternalLink,
  ChevronRight,
  Code2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface GitHubRepoListProps {
  repos: GitHubRepoItem[];
  onSelectRepo: (repo: GitHubRepoItem) => void;
}

export function GitHubRepoList({ repos, onSelectRepo }: GitHubRepoListProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "public" | "private" | "forks" | "archived">("all");
  const [sortBy, setSortBy] = useState<"updated" | "stars" | "name" | "size">("updated");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredRepos = useMemo(() => {
    return repos
      .filter((r) => {
        const q = search.toLowerCase().trim();
        const matchesQuery =
          !q ||
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.language && r.language.toLowerCase().includes(q));

        if (typeFilter === "public") return matchesQuery && !r.private;
        if (typeFilter === "private") return matchesQuery && r.private;
        if (typeFilter === "forks") return matchesQuery && r.fork;
        if (typeFilter === "archived") return matchesQuery && r.archived;
        return matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "stars") return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "size") return (b.size || 0) - (a.size || 0);
        return new Date(b.pushed_at || b.updated_at).getTime() - new Date(a.pushed_at || a.updated_at).getTime();
      });
  }, [repos, search, typeFilter, sortBy]);

  const handleCopyClone = (e: React.MouseEvent, repo: GitHubRepoItem) => {
    e.stopPropagation();
    const cmd = `git clone ${repo.clone_url}`;
    navigator.clipboard.writeText(cmd);
    toast.success(`Copied: ${cmd}`);
  };

  return (
    <div className="space-y-5">
      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-950/70 p-3.5 rounded-2xl border border-border/80 shadow-md">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repositories by name, language, or topic..."
            className="pl-9 h-8 text-xs bg-zinc-900/60 border-border/80 focus-visible:ring-cyan-500/50 rounded-lg text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter Pills */}
          <div className="flex items-center rounded-lg border border-border/60 bg-zinc-900/50 p-0.5 text-xs">
            {(["all", "public", "private", "forks", "archived"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors font-medium ${
                  typeFilter === type
                    ? "bg-cyan-500/20 text-cyan-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="h-8 w-36 text-xs bg-zinc-900/60 border-border/80">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-border text-xs">
              <SelectItem value="updated">Recently Updated</SelectItem>
              <SelectItem value="stars">Most Stars</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="size">Repository Size</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-border/60 bg-zinc-900/50 p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-zinc-800 text-white" : "text-zinc-500"}`}
              title="Grid View"
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-zinc-800 text-white" : "text-zinc-500"}`}
              title="List View"
            >
              <List className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* REPOSITORY GRID / LIST */}
      {filteredRepos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-border bg-zinc-950/60 space-y-3">
          <FolderGit2 className="size-10 text-muted-foreground/40 mx-auto" />
          <h4 className="text-sm font-semibold text-white">No repositories match your criteria</h4>
          <p className="text-xs text-muted-foreground">Try clearing your filters or search keywords.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              onClick={() => onSelectRepo(repo)}
              className="group rounded-2xl border border-border/80 bg-zinc-950/70 p-5 hover:border-cyan-500/40 hover:bg-zinc-900/40 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FolderGit2 className="size-4 text-cyan-400 shrink-0" />
                    <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {repo.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {repo.private ? (
                      <Badge variant="outline" className="text-[9px] border-amber-800/60 text-amber-400 bg-amber-950/30 px-1 py-0 h-4 flex items-center gap-0.5">
                        <Lock className="size-2.5" /> Private
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[9px] border-zinc-700 text-zinc-400 px-1 py-0 h-4">
                        Public
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed min-h-[32px]">
                  {repo.description || "No repository description provided."}
                </p>

                {/* Topics */}
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-800/40"
                      >
                        {topic}
                      </span>
                    ))}
                    {repo.topics.length > 3 && (
                      <span className="text-[9px] text-zinc-500 font-mono">+{repo.topics.length - 3}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-border/40 pt-3 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-3">
                  {repo.language && (
                    <div className="flex items-center gap-1 text-[11px] font-mono">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: GITHUB_LANG_COLORS[repo.language] || "#888" }}
                      />
                      <span>{repo.language}</span>
                    </div>
                  )}
                  {repo.stargazers_count > 0 && (
                    <div className="flex items-center gap-1 text-amber-400 text-[11px] font-mono">
                      <Star className="size-3 fill-amber-400" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                  )}
                  {repo.forks_count > 0 && (
                    <div className="flex items-center gap-1 text-[11px] font-mono">
                      <GitFork className="size-3" />
                      <span>{repo.forks_count}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleCopyClone(e, repo)}
                    className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Copy Git Clone Command"
                  >
                    <Copy className="size-3.5" />
                  </button>
                  <ChevronRight className="size-4 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // LIST VIEW
        <div className="divide-y divide-border/60 rounded-2xl border border-border/80 bg-zinc-950/70 overflow-hidden shadow-lg">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              onClick={() => onSelectRepo(repo)}
              className="p-4 hover:bg-zinc-900/50 transition-colors cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="size-4 text-cyan-400 shrink-0" />
                  <span className="text-xs font-bold text-white hover:text-cyan-400 transition-colors truncate">
                    {repo.name}
                  </span>
                  {repo.private && (
                    <Badge variant="outline" className="text-[8px] h-3.5 border-amber-800 text-amber-400">
                      Private
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-zinc-400 truncate max-w-xl">
                  {repo.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-xs font-mono">
                {repo.language && (
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: GITHUB_LANG_COLORS[repo.language] || "#888" }}
                    />
                    <span>{repo.language}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-amber-400 text-[11px]">
                  <Star className="size-3 fill-amber-400" />
                  <span>{repo.stargazers_count}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleCopyClone(e, repo)}
                  className="h-7 px-2 text-[11px] border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white"
                >
                  <Copy className="size-3 mr-1" /> Clone
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
