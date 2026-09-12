/**
 * PROJECT BRAHMA — GITHUB PLUGIN (PHASE B.5)
 * MCP Tool "fetch_commits": Live GitHub Proxy vs Seeded Fixtures.
 */

import { PluginTool, PluginContext, ToolResult } from "./types";
import { fixtureStore } from "@/services/fixtureStore";

export const githubPluginTool: PluginTool = {
  name: "fetch_commits",
  description: "Fetches recent Git commits, author attribution, and changelogs for drift and architectural risk tracking.",
  inputSchema: {
    type: "object",
    properties: {
      repoFullName: { type: "string", description: "Full GitHub repository name (e.g. 'owner/repo')" },
      since: { type: "string", description: "ISO 8601 timestamp cutoff for commits" },
    },
    required: ["repoFullName"],
  },
  handler: async (args: unknown, ctx: PluginContext): Promise<ToolResult> => {
    const { repoFullName, since } =
      (args as { repoFullName: string; since?: string }) || {};

    if (ctx.isDemo) {
      const fix = fixtureStore.get("fintech");
      const commits = fix.commits.map((c) => ({
        hash: c.hash,
        author: c.author,
        message: c.message,
        timestamp: c.timestamp,
      }));

      return {
        isError: false,
        content: [
          {
            type: "text",
            value: `Retrieved ${commits.length} commits for demo repository '${repoFullName || fix.project.repoUrl}'.`,
            metadata: { commitCount: commits.length, simulated: true },
          },
          {
            type: "artifact",
            value: JSON.stringify(commits, null, 2),
            metadata: {
              artifactType: "json",
              title: `Git History: ${repoFullName || "FinLedger"}`,
            },
          },
        ],
      };
    }

    // Live mode: call GitHub proxy or sessionStorage token directly
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("brahma_github_token") : null;
      let headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = `https://api.github.com/repos/${repoFullName}/commits${since ? `?since=${encodeURIComponent(since)}` : ""}`;
      const res = await fetch(url, { headers });

      if (!res.ok) {
        // Try via proxy edge function if rate limited or direct call fails
        const { data, error } = await ctx.supabase.functions.invoke("github-proxy", {
          body: {
            endpoint: `/repos/${repoFullName}/commits`,
            params: since ? { since } : {},
          },
        });

        if (error || !data) {
          return {
            isError: true,
            content: [{ type: "text", value: `GitHub API error: ${res.statusText || error?.message}` }],
          };
        }

        return {
          isError: false,
          content: [
            { type: "text", value: `Fetched commits via GitHub Proxy.` },
            {
              type: "artifact",
              value: typeof data === "string" ? data : JSON.stringify(data, null, 2),
              metadata: { artifactType: "json", title: `Commits: ${repoFullName}` },
            },
          ],
        };
      }

      const commits = await res.json();
      const formatted = Array.isArray(commits)
        ? commits.slice(0, 20).map((c) => ({
            hash: c.sha?.substring(0, 8),
            author: c.commit?.author?.name || c.author?.login,
            message: c.commit?.message,
            timestamp: c.commit?.author?.date,
          }))
        : [];

      return {
        isError: false,
        content: [
          {
            type: "text",
            value: `Retrieved ${formatted.length} commits directly from GitHub API for '${repoFullName}'.`,
          },
          {
            type: "artifact",
            value: JSON.stringify(formatted, null, 2),
            metadata: { artifactType: "json", title: `Commits: ${repoFullName}` },
          },
        ],
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: "text", value: `GitHub fetch error: ${msg}` }],
      };
    }
  },
};
