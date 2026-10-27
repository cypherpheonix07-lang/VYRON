/**
 * VYRON / BRAHMA — WORKSPACE FOLDER TREE
 * Visualizes imported GitHub repositories organized into internal application folders
 * based on AI README analysis and classification.
 *
 * ZERO REMOTE MUTATION GUARANTEE:
 *  - Virtual organization lives strictly within the local workspace store.
 *  - Remote GitHub repositories are never modified, branched, or written to.
 */

import React, { useState, useEffect } from "react";
import {
  Folder,
  FolderOpen,
  Github,
  Sparkles,
  ExternalLink,
  Trash2,
  MoveRight,
  Brain,
  Globe,
  Smartphone,
  ShieldAlert,
  BarChart3,
  Cloud,
  Coins,
  DollarSign,
  GraduationCap,
  FlaskConical,
  ChevronRight,
  ChevronDown,
  Star,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  workspaceRepoStore,
  type WorkspaceFolder,
  type ImportedRepoRecord,
} from "@/state/workspace/workspaceRepoStore";
import { CLASSIFICATION_CATEGORIES } from "@/services/ai/aiRepoClassifier";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "ai-ml": Brain,
  "web-dev": Globe,
  "mobile-apps": Smartphone,
  cybersecurity: ShieldAlert,
  "data-science": BarChart3,
  "cloud-devops": Cloud,
  "blockchain-web3": Coins,
  fintech: DollarSign,
  education: GraduationCap,
  research: FlaskConical,
  uncategorized: Folder,
};

export function WorkspaceFolderTree() {
  const [folders, setFolders] = useState<WorkspaceFolder[]>(() =>
    workspaceRepoStore.getFolders(),
  );
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const f of workspaceRepoStore.getFolders()) {
      if (f.repositories.length > 0) {
        init[f.slug] = true;
      }
    }
    return init;
  });

  useEffect(() => {
    const unsubscribe = workspaceRepoStore.subscribe(() => {
      setFolders(workspaceRepoStore.getFolders());
    });
    return unsubscribe;
  }, []);

  const totalRepos = workspaceRepoStore.getTotalRepoCount();

  const toggleFolder = (slug: string) => {
    setExpandedFolders((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const handleMoveRepo = (repoId: number, targetCategorySlug: string) => {
    const success = workspaceRepoStore.moveRepository(repoId, targetCategorySlug);
    if (success) {
      toast.success("Repository moved to new domain folder.");
      setExpandedFolders((prev) => ({ ...prev, [targetCategorySlug]: true }));
    }
  };

  const handleRemoveRepo = (repoId: number, repoName: string) => {
    workspaceRepoStore.removeRepository(repoId);
    toast.info(`Removed @${repoName} from internal workspace.`);
  };

  return (
    <div className="space-y-4">
      {/* HEADER & ZERO MUTATION GUARANTEE NOTICE */}
      <div className="p-4 rounded-xl border border-border/80 bg-zinc-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">
            <FolderOpen className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">
                Internal Workspace Repository Folders
              </h2>
              <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                {totalRepos} Repositories Organized
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Info className="size-3 text-cyan-400 shrink-0" />
              <span>
                Categorized by internal AI based on GitHub README content. Remote repositories remain untouched.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* FOLDER ACCORDION LIST */}
      <div className="space-y-2">
        {folders.map((folder) => {
          const isExpanded = expandedFolders[folder.slug] ?? false;
          const Icon = CATEGORY_ICONS[folder.slug] || Folder;
          const repoCount = folder.repositories.length;

          return (
            <div
              key={folder.slug}
              className={`rounded-xl border transition-all ${
                repoCount > 0
                  ? "border-zinc-800 bg-zinc-950/80"
                  : "border-zinc-800/40 bg-zinc-950/40 opacity-75"
              }`}
            >
              {/* FOLDER HEADER */}
              <button
                type="button"
                onClick={() => toggleFolder(folder.slug)}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-zinc-900/40 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                      repoCount > 0
                        ? "bg-primary/20 text-primary"
                        : "bg-zinc-900 text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground truncate">
                        {folder.name}
                      </span>
                      <Badge
                        variant={repoCount > 0 ? "secondary" : "outline"}
                        className={`text-[9px] px-1.5 py-0 font-mono ${
                          repoCount > 0
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "border-zinc-800 text-zinc-500"
                        }`}
                      >
                        {repoCount} {repoCount === 1 ? "repo" : "repos"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {folder.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* REPOSITORIES INSIDE FOLDER */}
              {isExpanded && (
                <div className="p-3 pt-0 space-y-2 border-t border-zinc-900">
                  {repoCount === 0 ? (
                    <div className="py-4 text-center text-[11px] text-muted-foreground font-mono">
                      No repositories currently assigned to this domain folder.
                    </div>
                  ) : (
                    folder.repositories.map((repo) => (
                      <div
                        key={repo.id}
                        className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/70 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-foreground truncate">
                              @{repo.fullName}
                            </span>
                            {repo.language && (
                              <Badge
                                variant="outline"
                                className="text-[9px] px-1.5 py-0 font-mono text-cyan-400 border-cyan-800/60"
                              >
                                {repo.language}
                              </Badge>
                            )}
                            {repo.stars > 0 && (
                              <span className="text-[10px] font-mono text-amber-400 flex items-center gap-0.5">
                                <Star className="size-2.5 fill-current" />
                                {repo.stars}
                              </span>
                            )}
                            <Badge
                              variant="outline"
                              className="text-[9px] px-1.5 py-0 font-mono text-emerald-400 border-emerald-800/60"
                            >
                              AI Confidence: {Math.round(repo.confidence * 100)}%
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {repo.summary}
                          </p>
                          {repo.tags && repo.tags.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                              {repo.tags.map((t) => (
                                <span
                                  key={t}
                                  className="text-[9px] font-mono bg-zinc-950 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-800"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* REPO ACTIONS */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
                          >
                            <a href={repo.htmlUrl} target="_blank" rel="noreferrer">
                              <ExternalLink className="size-3" />
                              GitHub
                            </a>
                          </Button>

                          {/* RECLASSIFY / MOVE DROPDOWN */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs border-zinc-800 gap-1 px-2"
                              >
                                <MoveRight className="size-3" />
                                Move
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 bg-zinc-950 border-zinc-800 text-foreground"
                            >
                              <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Move to Category Folder
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-zinc-800" />
                              {CLASSIFICATION_CATEGORIES.map((c) => (
                                <DropdownMenuItem
                                  key={c.slug}
                                  onClick={() => handleMoveRepo(repo.id, c.slug)}
                                  disabled={c.slug === folder.slug}
                                  className="text-xs flex items-center justify-between cursor-pointer"
                                >
                                  <span>{c.name}</span>
                                  {c.slug === folder.slug && (
                                    <span className="text-[10px] text-primary font-mono">
                                      current
                                    </span>
                                  )}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRepo(repo.id, repo.name)}
                            title="Remove from internal workspace"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-400"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
