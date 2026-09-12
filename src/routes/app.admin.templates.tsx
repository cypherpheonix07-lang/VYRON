import { createFileRoute } from "@tanstack/react-router";
import {
  Layers,
  Star,
  Plus,
  Trash2,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/app/admin/templates")({
  head: () => ({
    meta: [
      { title: "Templates Manager — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Admin template creation and category catalogs configurations.",
      },
    ],
  }),
  component: AdminTemplatesPage,
});

const defaultTemplates = [
  {
    id: "tpl-1",
    name: "AI SaaS Dashboard",
    category: "AI Models",
    difficulty: "Advanced",
    usage: 142,
    featured: true,
    status: "Published",
  },
  {
    id: "tpl-2",
    name: "College Final-Year Project",
    category: "Education",
    difficulty: "Beginner",
    usage: 84,
    featured: true,
    status: "Published",
  },
  {
    id: "tpl-3",
    name: "E-commerce Admin Console",
    category: "E-commerce",
    difficulty: "Intermediate",
    usage: 63,
    featured: false,
    status: "Published",
  },
  {
    id: "tpl-4",
    name: "Healthcare Booking System",
    category: "Healthcare",
    difficulty: "Advanced",
    usage: 12,
    featured: false,
    status: "Draft",
  },
];

function AdminTemplatesPage() {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [showDrawer, setShowDrawer] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Education");
  const [difficulty, setDifficulty] = useState("Intermediate");

  const handleToggleFeatured = (tplId: string) => {
    setTemplates((prev) => prev.map((t) => (t.id === tplId ? { ...t, featured: !t.featured } : t)));
    toast.success("Template featured status modified.");
  };

  const handleToggleStatus = (tplId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Published" ? "Draft" : "Published";
    setTemplates((prev) => prev.map((t) => (t.id === tplId ? { ...t, status: nextStatus } : t)));
    toast.success(`Template is now a ${nextStatus.toLowerCase()}.`);
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a template name.");
      return;
    }
    const newTpl = {
      id: `tpl_${templates.length + 1}`,
      name,
      category,
      difficulty,
      usage: 0,
      featured: false,
      status: "Draft",
    };
    setTemplates((prev) => [...prev, newTpl]);
    setName("");
    setShowDrawer(false);
    toast.success(`Template ${name} created as Draft.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => setShowDrawer(true)}
          className="bg-primary text-primary-foreground text-xs h-9"
        >
          <Plus className="mr-1.5 size-4" /> New Template
        </Button>
      </div>

      <SectionCard
        title="Studio Blueprints Catalogs"
        description="Manage preconfigured setup options for Brahma creators."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Template Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Usage Count</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((t) => {
              const isPublished = t.status === "Published";
              return (
                <TableRow key={t.id}>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(t.id)}
                      className={`h-7 w-7 flex items-center justify-center transition-colors ${
                        t.featured
                          ? "text-amber-500"
                          : "text-muted-foreground/30 hover:text-amber-500/60"
                      }`}
                      aria-label={t.featured ? "Unfeature template" : "Feature template"}
                    >
                      <Star className="size-4 fill-current" />
                    </button>
                  </TableCell>
                  <TableCell className="text-xs font-semibold">{t.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[9px]">
                      {t.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground tabular-nums">
                    {t.usage} builds
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-full text-[9px] ${
                        isPublished
                          ? "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                      variant="outline"
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => handleToggleStatus(t.id, t.status)}
                      aria-label={isPublished ? "Deactivate template" : "Publish template"}
                    >
                      <Layers className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SectionCard>

      {/* Template creation Drawer slider mock */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <form
            onSubmit={handleCreateTemplate}
            className="w-full max-w-md h-full bg-zinc-950 border-l border-border p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Create Studio Template</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Preconfigure scaffolding parameters.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDrawer(false)}
                >
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="tpl-name-input">Template Name</Label>
                  <Input
                    id="tpl-name-input"
                    placeholder="e.g. AI Agent Platform"
                    className="h-9 text-xs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tpl-cat-input">Category</Label>
                  <select
                    id="tpl-cat-input"
                    className="h-9 text-xs border border-border bg-background rounded-lg px-2 text-foreground font-semibold outline-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {["Education", "Healthcare", "Finance", "E-commerce", "AI Models", "IoT"].map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tpl-diff-input">Difficulty Tier</Label>
                  <select
                    id="tpl-diff-input"
                    className="h-9 text-xs border border-border bg-background rounded-lg px-2 text-foreground font-semibold outline-none"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    {["Beginner", "Intermediate", "Advanced"].map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-6 border-t border-border/50 mt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => setShowDrawer(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 text-xs bg-primary text-primary-foreground">
                Create Template
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
