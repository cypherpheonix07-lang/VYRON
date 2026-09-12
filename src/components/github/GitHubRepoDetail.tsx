import { useState, useEffect } from "react";
import {
  GitHubRepoItem,
  GitHubTreeItem,
  GitHubCommitItem,
  GitHubBranchItem,
  githubService,
  GITHUB_LANG_COLORS,
} from "@/services/githubService";
import {
  ArrowLeft,
  FolderGit2,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  File,
  GitBranch,
  GitCommit,
  Copy,
  Check,
  Download,
  ExternalLink,
  RefreshCw,
  Lock,
  Star,
  GitFork,
  Code2,
  Terminal,
  Calendar,
  User,
} from "lucide-react";
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

interface GitHubRepoDetailProps {
  repo: GitHubRepoItem;
  onBack: () => void;
}

export function GitHubRepoDetail({ repo, onBack }: GitHubRepoDetailProps) {
  const [activeTab, setActiveTab] = useState<"tree" | "commits" | "clone">("tree");
  const [selectedBranch, setSelectedBranch] = useState(repo.default_branch || "main");

  // File tree & content states
  const [treeItems, setTreeItems] = useState<GitHubTreeItem[]>([]);
  const [loadingTree, setLoadingTree] = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);

  // Commits states
  const [commits, setCommits] = useState<GitHubCommitItem[]>([]);
  const [loadingCommits, setLoadingCommits] = useState(false);

  // Branches
  const [branches, setBranches] = useState<GitHubBranchItem[]>([]);

  // Clone command copy state
  const [copiedClone, setCopiedClone] = useState<"https" | "ssh" | null>(null);

  const cloneCommands = githubService.getCloneCommands(repo);

  // Load Tree & Branches on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoadingTree(true);
      try {
        const [owner, name] = repo.full_name.split("/");
        if (!owner || !name) return;

        const treeData = await githubService.fetchFileTree(owner, name, selectedBranch);
        if (isMounted) {
          setTreeItems(treeData.tree || []);
        }

        const branchData = await githubService.fetchBranches(owner, name);
        if (isMounted) {
          setBranches(branchData || []);
        }
      } catch (err) {
        console.warn("Tree load error:", err);
      } finally {
        if (isMounted) setLoadingTree(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [repo, selectedBranch]);

  // Load Commits when switching to commits tab
  useEffect(() => {
    let isMounted = true;
    if (activeTab === "commits" && commits.length === 0) {
      setLoadingCommits(true);
      const [owner, name] = repo.full_name.split("/");
      if (owner && name) {
        githubService
          .fetchCommits(owner, name, 30)
          .then((res) => {
            if (isMounted) setCommits(res || []);
          })
          .catch((err) => console.warn("Commits error:", err))
          .finally(() => {
            if (isMounted) setLoadingCommits(false);
          });
      }
    }
    return () => {
      isMounted = false;
    };
  }, [activeTab, repo, commits.length]);

  // Load File Content when clicking a file in the tree
  const handleSelectFile = async (path: string) => {
    setSelectedFilePath(path);
    setLoadingFile(true);
    setFileContent(null);
    try {
      const [owner, name] = repo.full_name.split("/");
      if (!owner || !name) return;
      const res = await githubService.fetchFileContent(owner, name, path, selectedBranch);
      if (res.encoding === "base64" && res.content) {
        const decoded = atob(res.content.replace(/\n/g, ""));
        setFileContent(decoded);
      } else {
        setFileContent(res.content || "");
      }
    } catch (e) {
      setFileContent(`// Failed to load file: ${(e as Error).message}`);
    } finally {
      setLoadingFile(false);
    }
  };

  const handleCopyCommand = (cmd: string, type: "https" | "ssh") => {
    navigator.clipboard.writeText(cmd);
    setCopiedClone(type);
    toast.success("Clone command copied to clipboard!");
    setTimeout(() => setCopiedClone(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* REPO HEADER & CONTROLS */}
      <div className="rounded-2xl border border-border/80 bg-zinc-950/70 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              className="h-8 w-8 rounded-lg border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white shrink-0"
              title="Back to Repositories"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <FolderGit2 className="size-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white tracking-tight">{repo.name}</h2>
                {repo.private ? (
                  <Badge
                    variant="outline"
                    className="text-[9px] border-amber-800 text-amber-400 bg-amber-950/30"
                  >
                    <Lock className="size-2.5 mr-1" /> Private
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[9px] border-zinc-700 text-zinc-400">
                    Public
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{repo.full_name}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Branch Switcher */}
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-800 w-36 font-mono">
                <GitBranch className="size-3 text-cyan-400 mr-1.5" />
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800 text-xs font-mono">
                {branches.length > 0 ? (
                  branches.map((b) => (
                    <SelectItem key={b.name} value={b.name}>
                      {b.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value={repo.default_branch || "main"}>
                    {repo.default_branch || "main"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {/* Direct Open */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white gap-1"
            >
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                <span>GitHub</span>
                <ExternalLink className="size-3" />
              </a>
            </Button>
          </div>
        </div>

        {/* REPO SUB-NAV TABS */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab("tree")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "tree"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Folder className="size-3.5" /> File Tree &amp; Viewer
          </button>

          <button
            onClick={() => setActiveTab("commits")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "commits"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitCommit className="size-3.5" /> Commit History ({commits.length || 20}+)
          </button>

          <button
            onClick={() => setActiveTab("clone")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "clone"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="size-3.5" /> 1-Click Clone &amp; IDE Export
          </button>
        </div>
      </div>

      {/* TAB 1: FILE TREE & VIEWER */}
      {activeTab === "tree" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
          {/* File Explorer Tree (Left 4 cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-border/80 bg-zinc-950/70 p-4 space-y-2 max-h-[600px] overflow-y-auto font-mono text-xs shadow-lg">
            <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2 text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1">
                <GitBranch className="size-3 text-cyan-400" /> {selectedBranch}
              </span>
              <span>{treeItems.length} files</span>
            </div>

            {loadingTree ? (
              <div className="p-8 text-center text-xs text-muted-foreground font-sans space-y-2">
                <RefreshCw className="size-5 animate-spin mx-auto text-cyan-400" />
                <p>Traversing recursive git tree...</p>
              </div>
            ) : treeItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground font-sans">
                Empty repository tree.
              </div>
            ) : (
              <div className="space-y-0.5">
                {treeItems.map((item) => {
                  const isFile = item.type === "blob";
                  const isSelected = selectedFilePath === item.path;
                  return (
                    <div
                      key={item.path}
                      onClick={() => isFile && handleSelectFile(item.path)}
                      className={`px-2 py-1 rounded-md transition-colors flex items-center justify-between gap-1.5 cursor-pointer text-[11px] ${
                        isSelected
                          ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30"
                          : isFile
                            ? "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                            : "text-amber-400/90 font-bold hover:bg-zinc-900"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        {isFile ? (
                          item.path.endsWith(".ts") ||
                          item.path.endsWith(".tsx") ||
                          item.path.endsWith(".js") ? (
                            <FileCode className="size-3 text-cyan-400 shrink-0" />
                          ) : (
                            <FileText className="size-3 text-zinc-400 shrink-0" />
                          )
                        ) : (
                          <Folder className="size-3 text-amber-400 shrink-0" />
                        )}
                        <span className="truncate">{item.path}</span>
                      </div>
                      {item.size && (
                        <span className="text-[9px] text-zinc-600 shrink-0">
                          {Math.round(item.size / 1024)}kb
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* File Content Viewer (Right 8 cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-border/80 bg-zinc-950/80 overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="border-b border-border/60 bg-zinc-900/60 px-4 py-2.5 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 font-semibold truncate">
                {selectedFilePath || "Select a file from the explorer on the left"}
              </span>
              {fileContent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(fileContent);
                    toast.success("File content copied to clipboard!");
                  }}
                  className="h-6 px-2 text-[10px] border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  <Copy className="size-2.5 mr-1" /> Copy File
                </Button>
              )}
            </div>

            <div className="p-4 flex-1 overflow-x-auto text-xs font-mono leading-relaxed bg-black/80 max-h-[550px] overflow-y-auto">
              {loadingFile ? (
                <div className="p-12 text-center text-xs text-muted-foreground font-sans space-y-2">
                  <RefreshCw className="size-5 animate-spin mx-auto text-cyan-400" />
                  <p>Fetching blob from GitHub API...</p>
                </div>
              ) : fileContent ? (
                <pre className="text-zinc-300">
                  <code>
                    {fileContent.split("\n").map((line, lIdx) => (
                      <div key={lIdx} className="table-row">
                        <span className="table-cell pr-4 text-zinc-600 select-none text-right font-mono text-[10px] w-6">
                          {lIdx + 1}
                        </span>
                        <span className="table-cell">{line}</span>
                      </div>
                    ))}
                  </code>
                </pre>
              ) : (
                <div className="p-12 text-center text-zinc-600 font-sans space-y-2">
                  <Code2 className="size-8 mx-auto text-zinc-700" />
                  <p>Click any file on the left to inspect syntax and structure.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMMITS HISTORY */}
      {activeTab === "commits" && (
        <div className="rounded-2xl border border-border/80 bg-zinc-950/70 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <GitCommit className="size-4 text-cyan-400" /> Recent Commits ({selectedBranch})
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              Top {commits.length} commits
            </span>
          </div>

          {loadingCommits ? (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
              <RefreshCw className="size-5 animate-spin mx-auto text-cyan-400" />
              <p>Loading commit ledger...</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {commits.map((c) => (
                <div key={c.sha} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    {c.author?.avatar_url ? (
                      <img
                        src={c.author.avatar_url}
                        alt=""
                        className="size-7 rounded-full border border-zinc-700 shrink-0"
                      />
                    ) : (
                      <div className="size-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                        <User className="size-3.5" />
                      </div>
                    )}
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-bold text-white truncate leading-snug">
                        {c.commit.message}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                        <span className="text-cyan-400 font-semibold">
                          {c.author?.login || c.commit.author.name}
                        </span>
                        <span>committed {new Date(c.commit.author.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {c.sha.slice(0, 7)}
                    </span>
                    <a
                      href={c.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-zinc-500 hover:text-white"
                      title="View Commit Diff on GitHub"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: 1-CLICK CLONE & IDE EXPORT */}
      {activeTab === "clone" && (
        <div className="rounded-2xl border border-border/80 bg-zinc-950/70 p-6 space-y-6 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Clone &amp; Workspace Import Engine
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Clone this repository directly to your workstation or launch in your preferred IDE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* HTTPS Clone */}
            <div className="p-4 rounded-xl border border-border bg-zinc-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">HTTPS</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCommand(cloneCommands.https, "https")}
                  className="h-6 px-2 text-[10px] border-zinc-700 bg-zinc-800 text-zinc-200 hover:text-white"
                >
                  {copiedClone === "https" ? (
                    <Check className="size-2.5 text-emerald-400 mr-1" />
                  ) : (
                    <Copy className="size-2.5 mr-1" />
                  )}
                  Copy
                </Button>
              </div>
              <div className="p-2.5 rounded-lg bg-black font-mono text-xs text-cyan-400 select-all truncate border border-zinc-800">
                {cloneCommands.https}
              </div>
            </div>

            {/* SSH Clone */}
            <div className="p-4 rounded-xl border border-border bg-zinc-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">SSH</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCommand(cloneCommands.ssh, "ssh")}
                  className="h-6 px-2 text-[10px] border-zinc-700 bg-zinc-800 text-zinc-200 hover:text-white"
                >
                  {copiedClone === "ssh" ? (
                    <Check className="size-2.5 text-emerald-400 mr-1" />
                  ) : (
                    <Copy className="size-2.5 mr-1" />
                  )}
                  Copy
                </Button>
              </div>
              <div className="p-2.5 rounded-lg bg-black font-mono text-xs text-cyan-400 select-all truncate border border-zinc-800">
                {cloneCommands.ssh}
              </div>
            </div>
          </div>

          {/* 1-Click IDE Launch Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl py-3 h-auto"
            >
              <a href={cloneCommands.vsCodeUrl}>
                <span>Open in VS Code</span>
                <ExternalLink className="size-3.5 ml-1.5" />
              </a>
            </Button>

            <Button
              asChild
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl py-3 h-auto"
            >
              <a href={cloneCommands.githubDesktopUrl}>
                <span>Open in GitHub Desktop</span>
                <ExternalLink className="size-3.5 ml-1.5" />
              </a>
            </Button>

            <Button
              onClick={() => githubService.downloadRepoZip(repo)}
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl py-3 h-auto"
            >
              <Download className="size-3.5 mr-1.5" />
              <span>Download ZIP Blob</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
