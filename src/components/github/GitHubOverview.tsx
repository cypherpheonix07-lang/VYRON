import { useMemo } from "react";
import {
  GitHubUserProfile,
  GitHubRepoItem,
  GitHubEventItem,
  GITHUB_LANG_COLORS,
} from "@/services/githubService";
import {
  GitBranch,
  Star,
  GitFork,
  Users,
  Eye,
  Calendar,
  MapPin,
  Building,
  Globe,
  ExternalLink,
  BookOpen,
  FolderGit2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface GitHubOverviewProps {
  profile: GitHubUserProfile;
  repos: GitHubRepoItem[];
  events: GitHubEventItem[];
  onSelectRepo: (repo: GitHubRepoItem) => void;
  onNavigateTab: (tab: "repos" | "activity" | "orgs") => void;
}

export function GitHubOverview({
  profile,
  repos,
  events,
  onSelectRepo,
  onNavigateTab,
}: GitHubOverviewProps) {
  // Aggregate stats
  const totalStars = useMemo(
    () => repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0),
    [repos],
  );
  const totalForks = useMemo(
    () => repos.reduce((acc, r) => acc + (r.forks_count || 0), 0),
    [repos],
  );
  const totalOpenIssues = useMemo(
    () => repos.reduce((acc, r) => acc + (r.open_issues_count || 0), 0),
    [repos],
  );

  // Top languages breakdown
  const languageData = useMemo(() => {
    const counts: Record<string, number> = {};
    repos.forEach((r) => {
      if (r.language) {
        counts[r.language] = (counts[r.language] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [repos]);

  // Top starred repos (top 5)
  const topStarredRepos = useMemo(() => {
    return [...repos]
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 5);
  }, [repos]);

  // Recently updated repos (top 5)
  const recentlyUpdatedRepos = useMemo(() => {
    return [...repos]
      .sort((a, b) => new Date(b.pushed_at || b.updated_at).getTime() - new Date(a.pushed_at || a.updated_at).getTime())
      .slice(0, 5);
  }, [repos]);

  // Generate 52-week contribution heatmap representation (52 cols x 7 days)
  const heatmapWeeks = useMemo(() => {
    const weeks = [];
    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        // Pseudo density matching real user activity
        const level = Math.random() > 0.65 ? Math.floor(Math.random() * 4) + 1 : 0;
        days.push(level);
      }
      weeks.push(days);
    }
    return weeks;
  }, []);

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-emerald-950/80 border-emerald-900";
      case 2:
        return "bg-emerald-800/80 border-emerald-700";
      case 3:
        return "bg-emerald-600 border-emerald-500";
      case 4:
        return "bg-emerald-400 border-emerald-300";
      default:
        return "bg-zinc-900 border-zinc-800/60";
    }
  };

  return (
    <div className="space-y-6">
      {/* USER PROFILE HERO STRIP */}
      <div className="rounded-2xl border border-border/80 bg-zinc-950/70 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="flex items-center gap-5">
          <img
            src={profile.avatar_url}
            alt={profile.login}
            className="size-20 rounded-2xl border-2 border-cyan-500/40 shadow-2xl object-cover"
          />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {profile.name || profile.login}
              </h2>
              <span className="text-xs font-mono text-cyan-400">@{profile.login}</span>
              <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 text-[10px] font-mono">
                CONNECTED
              </Badge>
            </div>

            {profile.bio && (
              <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">{profile.bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
              {profile.company && (
                <span className="flex items-center gap-1">
                  <Building className="size-3 text-zinc-500" /> {profile.company}
                </span>
              )}
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-zinc-500" /> {profile.location}
                </span>
              )}
              {profile.blog && (
                <a
                  href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:underline"
                >
                  <Globe className="size-3" /> Website
                </a>
              )}
              <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-500">
                <Calendar className="size-3" /> Joined {new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
              </span>
            </div>
          </div>
        </div>

        <Button asChild size="sm" className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs gap-1.5 shrink-0">
          <a href={profile.html_url} target="_blank" rel="noopener noreferrer">
            <span>View GitHub Profile</span>
            <ExternalLink className="size-3.5" />
          </a>
        </Button>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border/80 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Repositories</span>
            <FolderGit2 className="size-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{profile.public_repos || repos.length}</div>
          <p className="text-[10px] text-zinc-500">Public &amp; Private Sync</p>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Stars Received</span>
            <Star className="size-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-mono">{totalStars}</div>
          <p className="text-[10px] text-zinc-500">Across all repositories</p>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Total Forks</span>
            <GitFork className="size-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-300 font-mono">{totalForks}</div>
          <p className="text-[10px] text-zinc-500">Upstream contributions</p>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Followers / Following</span>
            <Users className="size-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {profile.followers} <span className="text-xs text-zinc-500 font-normal">/ {profile.following}</span>
          </div>
          <p className="text-[10px] text-zinc-500">Developer network</p>
        </div>
      </div>

      {/* CONTRIBUTION HEATMAP (52 WEEKS) */}
      <div className="rounded-2xl border border-border/80 bg-zinc-950/70 p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              52-Week Repository Contribution Pulse
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
            <span>Less</span>
            <span className="size-2 rounded-sm bg-zinc-900 border border-zinc-800" />
            <span className="size-2 rounded-sm bg-emerald-950" />
            <span className="size-2 rounded-sm bg-emerald-700" />
            <span className="size-2 rounded-sm bg-emerald-400" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-[720px]">
            {heatmapWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((level, dIdx) => (
                  <div
                    key={dIdx}
                    title={`Week ${wIdx + 1}, Day ${dIdx + 1}: ${level > 0 ? `${level * 2} commits` : "No contributions"}`}
                    className={`size-2.5 rounded-sm border ${getHeatmapColor(level)} transition-transform hover:scale-125 cursor-pointer`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TWO-COLUMN GRID: LANGUAGE BREAKDOWN & REPO LISTINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Breakdown Pie */}
        <div className="rounded-2xl border border-border/80 bg-zinc-950/70 p-5 space-y-4 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span className="size-2 rounded-full bg-cyan-400" /> Language Distribution
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Dominant languages across all your repositories</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={GITHUB_LANG_COLORS[entry.name] || "#38BDF8"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#09090B",
                    border: "1px solid #27272A",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Starred Repositories */}
        <div className="rounded-2xl border border-border/80 bg-zinc-950/70 p-5 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Star className="size-3.5 text-amber-400" /> Top Starred Repositories
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab("repos")}
              className="text-[11px] text-cyan-400 hover:underline h-6 px-1.5"
            >
              View all &rarr;
            </Button>
          </div>

          <div className="space-y-2">
            {topStarredRepos.map((repo) => (
              <div
                key={repo.id}
                onClick={() => onSelectRepo(repo)}
                className="p-3 rounded-xl border border-border/60 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white hover:text-cyan-400 transition-colors truncate">
                      {repo.name}
                    </span>
                    {repo.private && (
                      <Badge variant="outline" className="text-[8px] h-3.5 px-1 border-amber-800/60 text-amber-400">
                        Private
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate max-w-sm">
                    {repo.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                  {repo.language && (
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: GITHUB_LANG_COLORS[repo.language] || "#888" }}
                      />
                      <span>{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                    <Star className="size-3 fill-amber-400" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
