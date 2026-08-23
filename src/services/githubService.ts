import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export interface GitHubUserProfile {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  archived: boolean;
  open_issues_count: number;
  default_branch: string;
  topics: string[];
  clone_url: string;
  ssh_url: string;
}

export interface GitHubCommitItem {
  sha: string;
  commit: {
    author: { name: string; email: string; date: string };
    message: string;
  };
  html_url: string;
  author: { login: string; avatar_url: string } | null;
  stats?: { total: number; additions: number; deletions: number };
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

export interface GitHubBranchItem {
  name: string;
  commit: { sha: string; url: string };
  protected: boolean;
}

export interface GitHubOrgItem {
  login: string;
  id: number;
  url: string;
  avatar_url: string;
  description: string | null;
}

export interface GitHubEventItem {
  id: string;
  type: string;
  actor: { login: string; avatar_url: string };
  repo: { name: string; url: string };
  created_at: string;
  payload: Record<string, unknown>;
}

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  resetTime: Date;
  percentRemaining: number;
}

// Language color mappings matching GitHub linguist
export const GITHUB_LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  Rust: "#DEA584",
  Go: "#00ADD8",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Java: "#B07219",
  "C++": "#F34B7D",
  C: "#555555",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Shell: "#89E051",
  Vue: "#41B883",
  Svelte: "#FF3E00",
  Solidity: "#AA6746",
};

class GitHubService {
  private token: string | null = null;
  private rateLimit: RateLimitStatus = {
    limit: 5000,
    remaining: 5000,
    resetTime: new Date(Date.now() + 3600000),
    percentRemaining: 100,
  };

  constructor() {
    // Check if token stored in memory/session
    this.hydrateToken();
  }

  private async hydrateToken(): Promise<string | null> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.provider_token) {
        this.token = session.provider_token;
        return this.token;
      }
      // Check database tokens table
      if (session?.user?.id) {
        const { data } = await supabase
          .from("github_tokens")
          .select("access_token")
          .eq("user_id", session.user.id)
          .maybeSingle();
        if (data?.access_token) {
          this.token = data.access_token;
          return this.token;
        }
      }
    } catch (e) {
      console.warn("[GitHubService] Token hydration warning:", e);
    }
    return this.token;
  }

  public setToken(token: string) {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  public getRateLimitStatus(): RateLimitStatus {
    return this.rateLimit;
  }

  // Update rate limits from response headers
  private updateRateLimitFromHeaders(headers: Headers) {
    const limit = headers.get("x-ratelimit-limit");
    const remaining = headers.get("x-ratelimit-remaining");
    const reset = headers.get("x-ratelimit-reset");

    if (limit && remaining && reset) {
      const numLimit = parseInt(limit, 10);
      const numRemaining = parseInt(remaining, 10);
      const resetDate = new Date(parseInt(reset, 10) * 1000);
      this.rateLimit = {
        limit: numLimit,
        remaining: numRemaining,
        resetTime: resetDate,
        percentRemaining: Math.round((numRemaining / numLimit) * 100),
      };

      if (numRemaining < 100) {
        toast.warning(
          `GitHub API rate limit critical: ${numRemaining}/${numLimit} remaining. Auto-refresh paused.`,
        );
      }
    }
  }

  // Resilient fetch wrapper with 10s timeout and 3x retry exponential backoff
  private async resilientFetch<T>(
    endpoint: string,
    cacheTtlSeconds: number = 300,
    forceRefresh: boolean = false,
  ): Promise<T> {
    // 1. Check Supabase / memory cache if not force refresh
    const cacheKey = `gh_${endpoint}`;
    if (!forceRefresh) {
      const cached = this.getMemCache<T>(cacheKey);
      if (cached) return cached;
    }

    const token = this.token || (await this.hydrateToken());
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = endpoint.startsWith("https://") ? endpoint : `https://api.github.com${endpoint}`;

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const res = await fetch(url, {
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        this.updateRateLimitFromHeaders(res.headers);

        if (res.status === 401) {
          throw new Error("GitHub credentials expired or revoked. Please reconnect your account.");
        }

        if (res.status === 403) {
          const rateMsg = res.headers.get("x-ratelimit-remaining") === "0";
          if (rateMsg) {
            throw new Error("GitHub API rate limit exceeded. Showing cached data where available.");
          }
          throw new Error("GitHub permission denied. Check your OAuth scopes.");
        }

        if (!res.ok) {
          throw new Error(`GitHub API error ${res.status}: ${res.statusText}`);
        }

        const data = (await res.json()) as T;
        this.setMemCache(cacheKey, data, cacheTtlSeconds);
        return data;
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        if (attempts >= maxAttempts) {
          // Attempt to return stale cache on final failure
          const stale = this.getMemCache<T>(cacheKey, true);
          if (stale) {
            toast.info("Using cached GitHub data due to network connection failure.");
            return stale;
          }
          throw err;
        }
        // Exponential backoff wait: 300ms, 600ms, 1200ms
        await new Promise((resolve) => setTimeout(resolve, 300 * Math.pow(2, attempts - 1)));
      }
    }

    throw new Error("Failed to communicate with GitHub API after 3 attempts.");
  }

  // In-Memory Cache with TTL
  private memCache: Map<string, { data: unknown; expiresAt: number }> = new Map();

  private getMemCache<T>(key: string, allowStale: boolean = false): T | null {
    const entry = this.memCache.get(key);
    if (!entry) return null;
    if (!allowStale && Date.now() > entry.expiresAt) {
      this.memCache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  private setMemCache(key: string, data: unknown, ttlSeconds: number) {
    this.memCache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  public clearCache() {
    this.memCache.clear();
  }

  // ─── 7 DATA LAYERS ────────────────────────────────────────────────────────

  // LAYER 1: USER PROFILE (TTL: 1 hour)
  public async fetchUserProfile(forceRefresh = false): Promise<GitHubUserProfile> {
    return this.resilientFetch<GitHubUserProfile>("/user", 3600, forceRefresh);
  }

  // LAYER 2: REPOSITORIES CATALOG (TTL: 5 mins)
  public async fetchRepositories(
    page: number = 1,
    perPage: number = 100,
    sort: "updated" | "stars" | "pushed" = "updated",
    forceRefresh = false,
  ): Promise<GitHubRepoItem[]> {
    return this.resilientFetch<GitHubRepoItem[]>(
      `/user/repos?per_page=${perPage}&page=${page}&sort=${sort}`,
      300,
      forceRefresh,
    );
  }

  // LAYER 3: REPOSITORY FILE TREE (TTL: 30 mins)
  public async fetchFileTree(
    owner: string,
    repo: string,
    branch: string = "main",
    forceRefresh = false,
  ): Promise<{ tree: GitHubTreeItem[]; truncated: boolean }> {
    return this.resilientFetch<{ tree: GitHubTreeItem[]; truncated: boolean }>(
      `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      1800,
      forceRefresh,
    );
  }

  // Fetch individual file content (TTL: 30 mins)
  public async fetchFileContent(
    owner: string,
    repo: string,
    path: string,
    ref: string = "main",
    forceRefresh = false,
  ): Promise<{ content: string; encoding: string; size: number }> {
    return this.resilientFetch<{ content: string; encoding: string; size: number }>(
      `/repos/${owner}/${repo}/contents/${path}?ref=${ref}`,
      1800,
      forceRefresh,
    );
  }

  // LAYER 4: COMMITS HISTORY (TTL: 10 mins)
  public async fetchCommits(
    owner: string,
    repo: string,
    perPage: number = 25,
    forceRefresh = false,
  ): Promise<GitHubCommitItem[]> {
    return this.resilientFetch<GitHubCommitItem[]>(
      `/repos/${owner}/${repo}/commits?per_page=${perPage}`,
      600,
      forceRefresh,
    );
  }

  // LAYER 5: BRANCHES (TTL: 10 mins)
  public async fetchBranches(
    owner: string,
    repo: string,
    forceRefresh = false,
  ): Promise<GitHubBranchItem[]> {
    return this.resilientFetch<GitHubBranchItem[]>(
      `/repos/${owner}/${repo}/branches`,
      600,
      forceRefresh,
    );
  }

  // LAYER 6: ORGANIZATIONS (TTL: 1 hour)
  public async fetchOrganizations(forceRefresh = false): Promise<GitHubOrgItem[]> {
    return this.resilientFetch<GitHubOrgItem[]>("/user/orgs", 3600, forceRefresh);
  }

  // LAYER 7: ACTIVITY FEED (TTL: 2 mins)
  public async fetchActivityEvents(
    username: string,
    perPage: number = 30,
    forceRefresh = false,
  ): Promise<GitHubEventItem[]> {
    return this.resilientFetch<GitHubEventItem[]>(
      `/users/${username}/events?per_page=${perPage}`,
      120,
      forceRefresh,
    );
  }

  // ─── CLONE & REPOSITORY ACTIONS ──────────────────────────────────────────

  public getCloneCommands(repo: GitHubRepoItem) {
    return {
      https: `git clone ${repo.clone_url}`,
      ssh: `git clone ${repo.ssh_url}`,
      vsCodeUrl: `vscode://vscode.git/clone?url=${encodeURIComponent(repo.clone_url)}`,
      githubDesktopUrl: `x-github-client://openRepo/${encodeURIComponent(repo.html_url)}`,
      zipDownloadUrl: `https://api.github.com/repos/${repo.full_name}/zipball/${repo.default_branch}`,
    };
  }

  // Trigger direct browser download of repository ZIP
  public downloadRepoZip(repo: GitHubRepoItem) {
    const url = `https://github.com/${repo.full_name}/archive/refs/heads/${repo.default_branch}.zip`;
    window.open(url, "_blank");
    toast.success(`Starting download for ${repo.name}.zip`);
  }
}

export const githubService = new GitHubService();
