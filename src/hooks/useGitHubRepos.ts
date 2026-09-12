import { useState, useEffect, useCallback, useRef } from "react";
import { authService } from "@/services/authService";
import type { GitHubRepoItem } from "@/components/github/GitHubRepoCard";

export interface UseGitHubReposOptions {
  account: string | null;
  searchQuery?: string;
  perPage?: number;
}

export function useGitHubRepos({ account, searchQuery = "", perPage = 100 }: UseGitHubReposOptions) {
  const [repos, setRepos] = useState<GitHubRepoItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchReposPage = useCallback(
    async (pageToFetch: number, query: string, isAppend = false) => {
      if (!account) {
        setRepos([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] || "";
        const edgeUrl = new URL(`${supabaseUrl}/functions/v1/github-proxy`);
        edgeUrl.searchParams.set("account", account);
        edgeUrl.searchParams.set("page", String(pageToFetch));
        edgeUrl.searchParams.set("per_page", String(perPage));
        if (query.trim()) {
          edgeUrl.searchParams.set("q", query.trim());
        }

        const session = (await authService.getSession()).data;

        const res = await fetch(edgeUrl.toString(), {
          headers: {
            ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
          },
        });

        if (!res.ok) {
          if (res.status === 429) {
            const retryAfter = res.headers.get("Retry-After") || "60";
            throw new Error(`GitHub API rate limit exceeded. Please retry in ${retryAfter}s.`);
          }
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || `Failed to fetch repositories (${res.status})`);
        }

        const data = await res.json();
        const incomingRepos: GitHubRepoItem[] = data.repos || [];

        setRepos((prev) => (isAppend ? [...prev, ...incomingRepos] : incomingRepos));
        setHasMore(Boolean(data.has_more));
        setTotalCount(data.total_count || incomingRepos.length);
        setPage(pageToFetch);
      } catch (err: any) {
        console.error("useGitHubRepos fetch error:", err);
        setError(err.message || "Failed to load repositories");
      } finally {
        setIsLoading(false);
      }
    },
    [account, perPage]
  );

  // Debounced fetch on search or account change
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchReposPage(1, searchQuery, false);
    }, 300);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [account, searchQuery, fetchReposPage]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    await fetchReposPage(page + 1, searchQuery, true);
  }, [isLoading, hasMore, page, searchQuery, fetchReposPage]);

  const refetch = useCallback(async () => {
    await fetchReposPage(1, searchQuery, false);
  }, [fetchReposPage, searchQuery]);

  return {
    repos,
    isLoading,
    hasMore,
    totalCount,
    error,
    page,
    loadMore,
    refetch,
  };
}
