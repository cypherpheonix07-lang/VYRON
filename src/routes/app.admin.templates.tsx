import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SectionCard } from "@/components/brahma/primitives";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  adminTemplates,
  templateCategories,
  templateModules,
  type AdminTemplate,
} from "@/lib/settings-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admin/templates")({
  component: AdminTemplates,
});

const blank: AdminTemplate = {
  id: "new",
  name: "",
  category: "Education",
  difficulty: "Beginner",
  usage: 0,
  featured: false,
  status: "Draft",
  description: "",
  tags: [],
  modules: [],
};

function AdminTemplates() {
  const [items, setItems] = useState<AdminTemplate[]>(adminTemplates);
  const [draft, setDraft] = useState<AdminTemplate | null>(null);
  const [creating, setCreating] = useState(false);
  const [archiving, setArchiving] = useState<AdminTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...items].sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <SectionCard
      title="Templates"
      description="Starting points offered in the template gallery."
      action={
        <Button
          size="sm"
          onClick={() => {
            setCreating(true);
            setDraft({ ...blank });
          }}
        >
          New template
        </Button>
      }
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-right">Usage</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {t.featured ? <Star className="size-4 text-[var(--warning)]" aria-hidden /> : null}
                    <div className="min-w-0">
                      <p className="font-medium">{t.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{t.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{t.category}</TableCell>
                <TableCell>{t.difficulty}</TableCell>
                <TableCell className="text-right tabular-nums">{t.usage}</TableCell>
                <TableCell>
                  <Switch
                    checked={t.featured}
                    onCheckedChange={(v) => {
                      setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, featured: v } : x)));
                      toast.success(`${t.name} ${v ? "featured" : "unfeatured"}`);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full",
                      t.status === "Published"
                        ? "border-[var(--success)]/40 bg-[var(--success)]/12 text-[var(--success)]"
                        : "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-1 text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => { setCreating(false); setDraft(t); }}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setItems((prev) => [...prev, { ...t, id: `${t.id}-copy`, name: `${t.name} (copy)`, status: "Draft", featured: false, usage: 0 }]);
                      toast.success(`${t.name} duplicated`);
                    }}
                  >
                    Duplicate
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const next = t.status === "Published" ? "Draft" : "Published";
                      setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: next } : x)));
                      toast.success(`${t.name} ${next === "Published" ? "published" : "unpublished"}`);
                    }}
                  >
                    {t.status === "Published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[var(--critical)] hover:text-[var(--critical)]"
                    onClick={() => setArchiving(t)}
                  >
                    Archive
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{creating ? "New template" : `Edit ${draft?.name ?? ""}`}</SheetTitle>
            <SheetDescription>Templates appear in the studio gallery once published.</SheetDescription>
          </SheetHeader>
          {draft ? (
            <div className="space-y-4 px-4 pb-6">
              <div className="space-y-2">
                <Label htmlFor="t-name">Name</Label>
                <Input id="t-name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                {error ? <p className="text-xs text-[var(--critical)]">{error}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-desc">Description</Label>
                <Textarea id="t-desc" rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {templateCategories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={draft.difficulty}
                    onValueChange={(v) => setDraft({ ...draft, difficulty: v as AdminTemplate["difficulty"] })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Beginner", "Intermediate", "Advanced"].map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-tags">Tech stack tags (comma separated)</Label>
                <Input
                  id="t-tags"
                  value={draft.tags.join(", ")}
                  onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Included modules</Label>
                <div className="grid grid-cols-2 gap-2">
                  {templateModules.map((m) => (
                    <label key={m} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                      <Checkbox
                        checked={draft.modules.includes(m)}
                        onCheckedChange={(v) =>
                          setDraft({
                            ...draft,
                            modules: v ? [...draft.modules, m] : draft.modules.filter((x) => x !== m),
                          })
                        }
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (!draft.name.trim()) {
                      setError("Template name is required.");
                      return;
                    }
                    setError(null);
                    setItems((prev) =>
                      creating
                        ? [...prev, { ...draft, id: `t${prev.length + 1}` }]
                        : prev.map((x) => (x.id === draft.id ? draft : x)),
                    );
                    toast.success(creating ? "Template created" : "Template updated");
                    setDraft(null);
                  }}
                >
                  {creating ? "Create template" : "Save changes"}
                </Button>
                <Button variant="outline" onClick={() => setDraft(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!archiving} onOpenChange={(o) => !o && setArchiving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--critical)]">Archive template?</AlertDialogTitle>
            <AlertDialogDescription>
              {archiving ? `${archiving.name} is removed from the gallery. Existing projects are unaffected.` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[var(--critical)] text-white hover:bg-[var(--critical)]/90"
              onClick={() => {
                if (!archiving) return;
                setItems((prev) => prev.filter((x) => x.id !== archiving.id));
                toast.success(`${archiving.name} archived`);
                setArchiving(null);
              }}
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SectionCard>
  );
}
