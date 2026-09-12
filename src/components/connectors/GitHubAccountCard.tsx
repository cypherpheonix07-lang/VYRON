/**
 * PROJECT BRAHMA — GITHUB ACCOUNT CARD (FL-01-B)
 * Displays connected GitHub account, organization switcher, and repository stats.
 */

import React, { useState, useEffect } from "react";
import { Github, LogOut, ExternalLink, ShieldCheck, RefreshCw, Building } from "lucide-react";
import {
  initiateGitHubOAuth,
  revokeGitHubToken,
  getStoredGitHubToken,
  getStoredGitHubUser,
  GitHubTokenResult,
} from "@/lib/github/oauth";
import { getAuthenticatedUser, getUserOrganizations, GitHubUser, GitHubOrg } from "@/lib/github/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function GitHubAccountCard({ className = "" }: { className?: string }) {
  const [token, setToken] = useState<string | null>(() => getStoredGitHubToken());
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [orgs, setOrgs] = useState<GitHubOrg[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    setLoading(true);

    Promise.all([getAuthenticatedUser(token), getUserOrganizations(token)])
      .then(([userData, orgsData]) => {
        if (!isMounted) return;
        setUser(userData);
        setOrgs(orgsData);
      })
      .catch((err) => {
        console.warn("Failed to load GitHub user:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleConnect = () => {
    initiateGitHubOAuth();
  };

  const handleDisconnect = async () => {
    await revokeGitHubToken();
    setToken(null);
    setUser(null);
    setOrgs([]);
    toast.info("GitHub account disconnected");
  };

  const isConnected = Boolean(token);

  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100">
            <Github className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">GitHub Integration</h3>
              <span
                className={`inline-block size-2 rounded-full ${
                  isConnected ? "bg-emerald-400" : "bg-zinc-600"
                }`}
              />
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  isConnected
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Clone repositories for AST parsing, security audits, and automated gate verification.
            </p>
          </div>
        </div>

        <div>
          {isConnected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="size-3.5" />
              <span>Disconnect</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shadow-md cursor-pointer"
            >
              <Github className="size-3.5" />
              <span>Connect GitHub</span>
            </button>
          )}
        </div>
      </div>

      {isConnected && user && (
        <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl}
              alt={user.login}
              className="size-8 rounded-full ring-1 ring-zinc-700"
            />
            <div>
              <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <span>{user.name || user.login}</span>
                <span className="text-zinc-500 font-mono text-[11px]">(@{user.login})</span>
              </div>
              <div className="text-[11px] text-zinc-400 flex items-center gap-3 mt-0.5 font-mono">
                <span>{user.publicRepos} Public Repos</span>
                {user.totalPrivateRepos !== undefined && (
                  <span>{user.totalPrivateRepos} Private Repos</span>
                )}
              </div>
            </div>
          </div>

          {orgs.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 text-[11px] flex items-center gap-1">
                <Building className="size-3" /> Orgs:
              </span>
              <div className="flex -space-x-1.5">
                {orgs.slice(0, 3).map((org) => (
                  <img
                    key={org.id}
                    src={org.avatarUrl}
                    alt={org.login}
                    title={org.login}
                    className="size-5 rounded-full ring-1 ring-zinc-800"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
