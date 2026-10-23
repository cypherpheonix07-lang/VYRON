/**
 * VYRON / BRAHMA — MULTI-REPOSITORY SELECTOR & AI IMPORT MODAL
 * Allows developers to select 1 to N repositories from their connected GitHub account,
 * inspects each repository's README, runs AI classification, and places each
 * repository into the appropriate internal workspace domain folder.
 *
 * ZERO REMOTE MUTATION: No commits or changes to remote GitHub repositories.
 */

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Github,
  Sparkles,
  Loader2,
  CheckCircle2,
  FolderPlus,
  Filter,
  Lock,
  Globe,
  Star,
  GitBranch,
} from "lucide-react";
import { toast } from "sonner";
import { githubService, type GitHubRepoItem } from "@/services/githubService";
import { AIRepoClassifier } from "@/services/ai/aiRepoClassifier";
import { workspaceRepoStore } from "@/state/workspace/workspaceRepoStore";

export interface MultiRepoSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repositories: GitHubRepoItem[];
  onImportComplete?: () => void;
}

export function MultiRepoSelectModal({
  open,
  onOpenChange,
  repositories,
  onImportComplete,
}: MultiRepoSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedRepoIds, setSelectedRepoIds] = useState<Set<number>>(new Set());

  // Import State
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{
    current: number;
    total: number;
    currentRepoName: string;
    step: "readme" | "ai" | "store";
  } | null>(null);

  // Available Languages for filtering
  const languages = useMemo(() => {
    const set = new Set<string>();
    for (const r of repositories) {
      if (r.language) set.add(r.language);
    }
    return Array.from(set).sort();
  }, [repositories]);

  // Filtered repositories
  const filteredRepos = useMemo(() => {
    return repositories.filter((repo) => {
      const matchQuery =
        !searchQuery.trim() ||
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchLang = selectedLanguage === "all" || repo.language === selectedLanguage;

      return matchQuery && matchLang;
    });
  }, [repositories, searchQuery, selectedLanguage]);

  const handleToggleRepo = (id: number) => {
    setSelectedRepoIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const next = new Set<number>();
    for (const r of filteredRepos) {
      next.add(r.id);
    }
    setSelectedRepoIds(next);
  };

  const handleClearSelection = () => {
    setSelectedRepoIds(new Set());
  };

  const handleStartImport = async () => {
    if (selectedRepoIds.size === 0) {
      toast.error("Please select at least one repository to connect.");
      return;
    }

    const reposToImport = repositories.filter((r) => selectedRepoIds.has(r.id));
    setIsImporting(true);

    let successCount = 0;
    const categoryCounts: Record<string, number> = {};

    for (let i = 0; i < reposToImport.length; i++) {
      const repo = reposToImport[i];
      if (!repo) continue;
      const [owner, repoName] = repo.full_name.split("/");

      setImportProgress({
        current: i + 1,
        total: reposToImport.length,
        currentRepoName: repo.name,
        step: "readme",
      });

      // 1. Fetch README
      const readme = await githubService.fetchRepoReadme(
        owner || repo.owner?.login || "unknown",
        repoName || repo.name,
        repo.default_branch,
      );

      // 2. Classify with AI
      setImportProgress({
        current: i + 1,
        total: reposToImport.length,
        currentRepoName: repo.name,
        step: "ai",
      });

      const classification = await AIRepoClassifier.classify({
        name: repo.name,
        description: repo.description,
        topics: repo.topics,
        language: repo.language,
        readmeText: readme?.text || null,
      });

      // 3. Save to internal workspace virtual folder
      setImportProgress({
        current: i + 1,
        total: reposToImport.length,
        currentRepoName: repo.name,
        step: "store",
      });

      workspaceRepoStore.importRepository(
        {
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          owner: owner || repo.owner?.login || "unknown",
          description: repo.description,
          language: repo.language,
          htmlUrl: repo.html_url,
          stars: repo.stargazers_count,
          defaultBranch: repo.default_branch,
        },
        classification,
        readme ? { size: readme.size, path: readme.path } : undefined,
      );

      categoryCounts[classification.category] = (categoryCounts[classification.category] || 0) + 1;
      successCount++;
    }

    setIsImporting(false);
    setImportProgress(null);
    onOpenChange(false);

    toast.success(`Connected & Segregated ${successCount} Repositories!`, {
      description: Object.entries(categoryCounts)
        .map(([cat, cnt]) => `${cat}: ${cnt}`)
        .join(" · "),
    });

    if (onImportComplete) {
      onImportComplete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={isImporting ? () => {} : onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col bg-zinc-950 border-zinc-800 text-foreground p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
              <Github className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Select & Connect GitHub Repositories
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Choose any number of repositories to import. The internal AI will inspect each project's README and segregate them into organized workspace folders.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* CONTROLS: SEARCH & LANGUAGE FILTER */}
        <div className="px-6 py-3 border-b border-zinc-800/60 bg-zinc-900/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative flex-1">
              <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter repositories by name or description..."
                className="pl-8 h-8 text-xs bg-zinc-900/80 border-zinc-800"
                disabled={isImporting}
              />
            </div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="h-8 px-2.5 text-xs rounded-md bg-zinc-900/80 border border-zinc-800 text-muted-foreground hover:text-foreground"
              disabled={isImporting}
            >
              <option value="all">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              disabled={isImporting || filteredRepos.length === 0}
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
            >
              Select All ({filteredRepos.length})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSelection}
              disabled={isImporting || selectedRepoIds.size === 0}
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* IN-FLIGHT PROGRESS OVERLAY */}
        {isImporting && importProgress && (
          <div className="p-4 bg-primary/10 border-b border-primary/20 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-primary flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Processing {importProgress.current} of {importProgress.total}: @{importProgress.currentRepoName}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {importProgress.step === "readme" && "Reading GitHub README..."}
                {importProgress.step === "ai" && "Classifying with Internal AI..."}
                {importProgress.step === "store" && "Organizing into Workspace Folders..."}
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${(importProgress.current / importProgress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* REPOSITORIES SCROLL LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2 min-h-[250px]">
          {filteredRepos.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No matching repositories found.
            </div>
          ) : (
            filteredRepos.map((repo) => {
              const isSelected = selectedRepoIds.has(repo.id);
              return (
                <div
                  key={repo.id}
                  onClick={() => !isImporting && handleToggleRepo(repo.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary/50 bg-primary/10 shadow-sm"
                      : "border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggleRepo(repo.id)}
                    disabled={isImporting}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-foreground truncate">{repo.name}</span>
                      {repo.private ? (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-800/60 text-amber-400 gap-1">
                          <Lock className="size-2.5" /> Private
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-zinc-700 text-zinc-400 gap-1">
                          <Globe className="size-2.5" /> Public
                        </Badge>
                      )}
                      {repo.language && (
                        <span className="text-[10px] font-mono text-cyan-400">
                          {repo.language}
                        </span>
                      )}
                      {repo.stargazers_count > 0 && (
                        <span className="text-[10px] font-mono text-amber-400 flex items-center gap-0.5">
                          <Star className="size-2.5 fill-current" />
                          {repo.stargazers_count}
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{repo.description}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* MODAL FOOTER */}
        <DialogFooter className="p-4 px-6 border-t border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between sm:justify-between">
          <div className="text-xs text-muted-foreground">
            <strong className="text-foreground">{selectedRepoIds.size}</strong> of{" "}
            {repositories.length} repositories selected
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isImporting}
              className="text-xs h-8 border-zinc-800"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleStartImport}
              disabled={isImporting || selectedRepoIds.size === 0}
              className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-semibold"
            >
              {isImporting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Organizing Repositories...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  Connect & AI Segregate ({selectedRepoIds.size})
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
