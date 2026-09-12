import { createFileRoute } from "@tanstack/react-router";
import {
  GitCommit,
  GitBranch,
  History,
  RotateCcw,
  Sparkles,
  User,
  BadgeAlert,
  Loader2,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard, StatusBadge, ScoreBar } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/app/projects/$id/versions")({
  head: () => ({
    meta: [
      { title: "Version Ledger — PROJECT BRAHMA" },
      { name: "description", content: "Review publish release histories and trigger rollbacks." },
    ],
  }),
  component: ProjectVersionsPage,
});

interface Version {
  version: string;
  commit: string;
  author: string;
  date: string;
  changesCount: number;
  healthAtPublish: number;
  status: "Active" | "Archived" | "Rolled Back";
}

const initialVersions: Version[] = [
  {
    version: "v1.2.4 (Latest)",
    commit: "c7d24a1",
    author: "Priya Nair",
    date: "10 mins ago",
    changesCount: 14,
    healthAtPublish: 73,
    status: "Active",
  },
  {
    version: "v1.2.3",
    commit: "a4f89d2",
    author: "Puli Phanindhra",
    date: "2 days ago",
    changesCount: 8,
    healthAtPublish: 76,
    status: "Archived",
  },
  {
    version: "v1.2.2",
    commit: "f1a92e4",
    author: "Vishal Madhavan",
    date: "1 week ago",
    changesCount: 22,
    healthAtPublish: 71,
    status: "Archived",
  },
  {
    version: "v1.2.1",
    commit: "d3e811c",
    author: "System Auto-Fix",
    date: "2 weeks ago",
    changesCount: 4,
    healthAtPublish: 62,
    status: "Rolled Back",
  },
];

function ProjectVersionsPage() {
  const { id } = Route.useParams();

  const [versions, setVersions] = useState<Version[]>(initialVersions);
  const [rollbackTarget, setRollbackTarget] = useState<Version | null>(null);
  const [rollingBack, setRollingBack] = useState(false);

  const handleRollbackConfirm = () => {
    if (!rollbackTarget) return;
    setRollingBack(true);
    toast.info(`Initiating rollback sequence to ${rollbackTarget.version}...`);

    setTimeout(() => {
      setVersions((prev) =>
        prev.map((v) => {
          if (v.version === rollbackTarget.version) {
            return { ...v, status: "Active" };
          }
          return v.status === "Active" ? { ...v, status: "Archived" } : v;
        }),
      );
      setRollingBack(false);
      setRollbackTarget(null);
      toast.success(`System successfully rolled back to ${rollbackTarget.version}.`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Release Control Ledger</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit history of active deployments, branch synchronization, and publish rollbacks.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="h-7 text-[10px] gap-1 px-2">
            <GitBranch className="size-3 text-cyan-400" /> main branch (synced)
          </Badge>
        </div>
      </header>

      <SectionCard title="Active Versions Catalog" description="Deployments history metrics.">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Release Version</TableHead>
              <TableHead>Revision Hash</TableHead>
              <TableHead>Publisher</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Delta Nodes</TableHead>
              <TableHead>Health Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((item) => (
              <TableRow key={item.commit}>
                <TableCell className="text-xs font-semibold">{item.version}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">
                  {item.commit}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.author}</TableCell>
                <TableCell className="text-xs text-muted-foreground flex items-center gap-1 mt-2.5">
                  <Calendar className="size-3.5" /> {item.date}
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground tabular-nums">
                  {item.changesCount} modifications
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">
                      {item.healthAtPublish}%
                    </span>
                    <ScoreBar value={item.healthAtPublish} />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[9px] rounded-full ${
                      item.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : item.status === "Rolled Back"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.status !== "Active" && item.status !== "Rolled Back" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[10px] text-primary"
                      onClick={() => setRollbackTarget(item)}
                    >
                      <RotateCcw className="size-3.5 mr-1" /> Rollback
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {/* CONFIRM ROLLBACK DIALOG */}
      {rollbackTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-zinc-950 border border-border p-6 rounded-2xl space-y-4 relative">
            <h3 className="text-sm font-semibold text-[var(--warning)]">
              Initiate Release Rollback
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to rollback active service metrics to **{rollbackTarget.version}
              ** ({rollbackTarget.commit})? This will replace the active build index.
            </p>
            <div className="flex gap-2 justify-end pt-4 border-t border-border/60">
              <Button
                size="sm"
                variant="outline"
                disabled={rollingBack}
                onClick={() => setRollbackTarget(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                disabled={rollingBack}
                onClick={handleRollbackConfirm}
              >
                {rollingBack ? <Loader2 className="size-3 animate-spin mr-1" /> : null}
                Confirm Rollback
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
