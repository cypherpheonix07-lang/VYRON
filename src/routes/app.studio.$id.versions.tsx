import { createFileRoute } from "@tanstack/react-router";
import {
  History,
  GitBranch,
  ArrowLeftRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Calendar,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/app/studio/$id/versions")({
  head: () => ({
    meta: [
      { title: "Versioning & History — BRAHMA AI Studio" },
      {
        name: "description",
        content: "Review workspace git commits, diff code histories, and restore points.",
      },
    ],
  }),
  component: VersionsHistoryPage,
});

const mockCommits = [
  {
    hash: "brh_f7a8b9",
    author: "Priya Nair",
    date: "2026-08-09T10:14:00Z",
    msg: "Wired secure auth routing guards and email integration tokens",
    aiDesc:
      "Generated JWT middleware verification checks and pre-filled patient reservation models inside database seeders.",
    approved: true,
    diff: `diff --git a/src/routes/login.tsx b/src/routes/login.tsx\nindex a1c2e3..f4b5d6 100\n--- a/src/routes/login.tsx\n+++ b/src/routes/login.tsx\n@@ -112,6 +112,12 @@\n+    if (activeMethod === "sso") {\n+      toast.success("Redirecting to Single Sign-On...");\n+      return;\n+    }`,
  },
  {
    hash: "brh_d3c2a1",
    author: "Brahma AI",
    date: "2026-08-09T09:42:00Z",
    msg: "Auto-patched SQL injection vulnerabilities in API route",
    aiDesc:
      "Replaced raw database query concatenation in server/routes/api.py with binding parameters to protect against CWE-89 SQLi.",
    approved: true,
    diff: `diff --git a/server/routes/api.py b/server/routes/api.py\n--- a/server/routes/api.py\n+++ b/server/routes/api.py\n@@ -14,1 +14,1 @@\n- query = f"SELECT * FROM users WHERE email = '{email}'"\n+ query = select(User).where(User.email == email)`,
  },
  {
    hash: "brh_b2a1c0",
    author: "Brahma AI",
    date: "2026-08-09T08:30:00Z",
    msg: "Initial repository compilation from user prompt",
    aiDesc:
      "Created 12 React component skeletons, compiled 6 SQLite tables, and generated testing suite setups.",
    approved: false,
    diff: `diff --git a/package.json b/package.json\nnew file mode 100644\n--- /dev/null\n+++ b/package.json\n@@ -0,0 +1,8 @@\n+{\n+  "name": "brahma-app"\n+}`,
  },
];

function VersionsHistoryPage() {
  const { id } = Route.useParams();

  const [activeBranch, setActiveBranch] = useState("main");
  const [selectedCommitIdx, setSelectedCommitIdx] = useState(0);
  const activeCommit = mockCommits[selectedCommitIdx] || mockCommits[0]!;

  const handleRestore = () => {
    toast.success("Branch restored successfully!", {
      description: `Reverted workspace source code files to checkpoint ${activeCommit.hash}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <History className="size-5 text-primary" /> Version Control History
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compare source code diffs and rollback workspace files instantly.
          </p>
        </div>

        {/* Branch control */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-secondary/40 px-3 py-1.5 rounded-xl border border-border/40 shrink-0">
            <GitBranch className="size-4 text-emerald-400" />
            <select
              value={activeBranch}
              onChange={(e) => setActiveBranch(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-foreground cursor-pointer"
            >
              <option value="main">main</option>
              <option value="dev">dev</option>
              <option value="release-v1">release-v1</option>
            </select>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
            onClick={() => toast.info("Opening branch compare workbench...")}
          >
            <ArrowLeftRight className="size-3.5" /> Compare Branches
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Timeline Cards */}
        <div className="space-y-4">
          <SectionCard title="Commit Timeline" description="Historical workspace checkpoints.">
            <div className="space-y-3 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-border/60">
              {mockCommits.map((item, idx) => {
                const isActive = idx === selectedCommitIdx;
                return (
                  <button
                    key={item.hash}
                    type="button"
                    onClick={() => setSelectedCommitIdx(idx)}
                    className={`w-full text-left relative pl-8 py-3 rounded-xl border transition-colors ${
                      isActive
                        ? "border-primary bg-primary/8 text-primary shadow-[0_0_0_1px_var(--primary)]"
                        : "border-border/60 hover:bg-secondary/40 hover:text-foreground text-muted-foreground"
                    }`}
                  >
                    {/* Circle timeline dot indicator */}
                    <span
                      className={`absolute left-2.5 top-[18px] h-3 w-3 rounded-full border-2 ${
                        isActive ? "bg-primary border-primary" : "bg-background border-border"
                      }`}
                    />
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono">{item.hash}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" /> {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold truncate text-foreground">{item.msg}</h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
                        <User className="size-3" /> {item.author}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* Right Side: Diff & AI Summary Panel */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard
            title="Checkpoint Inspector"
            description="AI-generated change logic and code patches."
            action={
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-[10px] gap-1 text-[var(--success)] hover:text-[var(--success)]"
                  onClick={handleRestore}
                >
                  <RotateCcw className="size-3 shrink-0" /> Restore this version
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              {/* AI Details */}
              <div className="border border-border/60 p-4 rounded-xl surface space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="size-4 shrink-0 animate-pulse" />
                  <span>AI Commit Explanation</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeCommit.aiDesc}
                </p>
                {activeCommit.approved && (
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--success)] pt-1">
                    <CheckCircle2 className="size-3.5 shrink-0" /> Quality checks passed. Version
                    signed by Brahma Gatekeeper.
                  </div>
                )}
              </div>

              {/* Code Diff Panel */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Patch Diff Preview
                </span>
                <div className="border border-border/60 bg-zinc-950 p-4 rounded-xl font-mono text-[10px] text-zinc-300 leading-relaxed whitespace-pre overflow-x-auto max-h-72">
                  {activeCommit.diff.split("\n").map((line, i) => {
                    let colorClass = "text-zinc-400";
                    if (line.startsWith("+")) colorClass = "text-emerald-400 bg-emerald-950/20";
                    if (line.startsWith("-")) colorClass = "text-rose-400 bg-rose-950/20";
                    return (
                      <div key={i} className={colorClass}>
                        {line}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
