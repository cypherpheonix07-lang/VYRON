import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/auth";
import type { GitHubAccountItem } from "@/components/github/GitHubAccountSelector";

export function useGitHubAccounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<GitHubAccountItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    if (!user?.id) {
      setAccounts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchErr } = await supabase
        .from("github_accounts")
        .select("id, github_login, account_type, avatar_url")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (fetchErr) throw fetchErr;

      const formatted: GitHubAccountItem[] = (data || []).map((acc) => ({
        id: acc.id,
        login: acc.github_login,
        type: acc.account_type as "user" | "organization",
        avatar_url: acc.avatar_url || undefined,
      }));

      setAccounts(formatted);
    } catch (err: any) {
      console.error("Failed to load GitHub accounts:", err);
      setError(err.message || "Failed to load connected GitHub accounts");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    isLoading,
    error,
    refetch: fetchAccounts,
  };
}
