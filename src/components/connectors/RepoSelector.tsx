/**
 * PROJECT BRAHMA — REPO SELECTOR COMPONENT (FL-01-B)
 * Searchable repository list with organization filtering, language tags, and star counts.
 */

import React, { useState, useEffect, useMemo } from "react";
import { Search, GitBranch, Star, Lock, Globe, FolderGit2, Check } from "lucide-react";
import { getStoredGitHubToken } from "@/lib/github/oauth";
import { listUserRepos, listOrgRepos, getUserOrganizations, GitHubRepo, GitHubOrg } from "@/lib/github/api";
import { Badge } from "@/components/ui/badge";

export interface RepoSelectorProps {
  onSelectRepo: (repo: GitHubRepo) => void;
  selectedRepoId?: number;
  className?: string;
}

export function RepoSelector({
  onSelectRepo,
  selectedRepoId,
  className = "",
}: RepoSelectorProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [orgs, setOrgs] = useState<GitHubOrg[]>([]);
  const [selectedScope, setSelectedScope] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getStoredGitHubToken() || "gho_mock_default";
    setLoading(true);

    Promise.all([listUserRepos(token), getUserOrganizations(token)])
      .then(([reposData, orgsData]) => {
        setRepos(reposData);
        setOrgs(orgsData);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredRepos = useMemo(() => {
    return repos.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;
      if (selectedScope === "all") return true;
      if (selectedScope === "personal") return !r.fullName.includes("/");
      return r.fullName.startsWith(`${selectedScope}/`);
    });
  }, [repos, searchQuery, selectedScope]);

  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-3.5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <FolderGit2 className="size-4 text-violet-400" />
          <h4 className="text-xs font-semibold text-zinc-100 uppercase tracking-wider">
            Select Repository ({filteredRepos.length})
          </h4>
        </div>

        {/* Scope selector */}
        {orgs.length > 0 && (
          <select
            value={selectedScope}
            onChange={(e) => setSelectedScope(e.target.value)}
            className="px-2.5 py-1 bg-zinc-900 border border-zinc-700/80 rounded-md text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-400"
          >
            <option value="all">All Repositories</option>
            {orgs.map((o) => (
              <option key={o.id} value={o.login}>
                Org: {o.login}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-3.5 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter repositories by name or description..."
          className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-400"
        />
      </div>

      {/* Repositories List */}
      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
        {loading ? (
          <div className="p-6 text-center text-xs text-zinc-500 font-mono">Loading repositories...</div>
        ) : filteredRepos.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500 font-mono">
            No repositories found matching "{searchQuery}".
          </div>
        ) : (
          filteredRepos.map((repo) => {
            const isSelected = selectedRepoId === repo.id;
            return (
              <div
                key={repo.id}
                onClick={() => onSelectRepo(repo)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-violet-950/20 border-violet-500/80 ring-1 ring-violet-500/50"
                    : "bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <div className="space-y-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-zinc-100 truncate">{repo.fullName}</span>
                    {repo.isPrivate ? (
                      <span title="Private" className="shrink-0 flex items-center">
                        <Lock className="size-3 text-amber-400" />
                      </span>
                    ) : (
                      <span title="Public" className="shrink-0 flex items-center">
                        <Globe className="size-3 text-zinc-500" />
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-[11px] text-zinc-400 truncate">{repo.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono">
                    {repo.language && <span className="text-zinc-300">● {repo.language}</span>}
                    <span className="flex items-center gap-0.5">
                      <Star className="size-3 text-amber-400" /> {repo.stars}
                    </span>
                    <span>Branch: {repo.defaultBranch}</span>
                  </div>
                </div>

                {isSelected && <Check className="size-4 text-violet-400 shrink-0" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
