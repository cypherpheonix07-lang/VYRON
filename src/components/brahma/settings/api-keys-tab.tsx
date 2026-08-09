import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState, SectionCard } from "@/components/brahma/primitives";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiKeyScopes, apiKeys as seedKeys, type ApiKeyRow } from "@/lib/settings-data";
import { cn } from "@/lib/utils";

export function ApiKeysTab() {
  const [keys, setKeys] = useState<ApiKeyRow[]>(seedKeys);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState<string[]>(["read"]);
  const [expiry, setExpiry] = useState("12 months");
  const [creating, setCreating] = useState(false);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<ApiKeyRow | null>(null);

  return (
    <div className="space-y-4">
      <SectionCard
        title="API keys"
        description="Programmatic access to analysis, reports and publish endpoints."
        action={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <KeyRound className="size-4" aria-hidden /> Create API key
          </Button>
        }
      >
        {keys.length === 0 ? (
          <EmptyState
            icon={KeyRound}
            title="No API keys yet"
            description="Create a key to run BRAHMA analyses from CI or your own tooling."
            action={<Button onClick={() => setCreateOpen(true)}>Create API key</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Scopes</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{k.mask}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {k.scopes.map((s) => (
                          <Badge key={s} variant="outline" className="rounded-full text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{k.created}</TableCell>
                    <TableCell className="text-muted-foreground">{k.lastUsed}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full",
                          k.status === "Active"
                            ? "border-[var(--success)]/40 bg-[var(--success)]/12 text-[var(--success)]"
                            : "border-border bg-muted text-muted-foreground",
                        )}
                      >
                        {k.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[var(--critical)] hover:text-[var(--critical)]"
                        disabled={k.status === "Revoked"}
                        onClick={() => setRevoking(k)}
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <p className="mt-4 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          API usage counts against your 200 monthly analysis credits.
        </p>
      </SectionCard>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create API key</DialogTitle>
            <DialogDescription>Scope keys to the minimum access the caller needs.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="k-name">Key name</Label>
              <Input id="k-name" placeholder="CI analysis runner" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Scopes</Label>
              <div className="grid grid-cols-2 gap-2">
                {apiKeyScopes.map((s) => (
                  <label key={s} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                    <Checkbox
                      checked={scopes.includes(s)}
                      onCheckedChange={(v) =>
                        setScopes((prev) => (v ? [...prev, s] : prev.filter((x) => x !== s)))
                      }
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Expiration</Label>
              <Select value={expiry} onValueChange={setExpiry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["30 days", "90 days", "12 months", "No expiry"].map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={creating}
              onClick={() => {
                if (!name.trim()) {
                  toast.error("Give the key a name");
                  return;
                }
                if (scopes.length === 0) {
                  toast.error("Select at least one scope");
                  return;
                }
                setCreating(true);
                setTimeout(() => {
                  setCreating(false);
                  setCreateOpen(false);
                  setKeys((prev) => [
                    {
                      id: `k${prev.length + 1}`,
                      name,
                      mask: "brh_live_••••••••e4b0",
                      scopes,
                      created: "2026-08-09",
                      lastUsed: "Never",
                      status: "Active",
                    },
                    ...prev,
                  ]);
                  setRevealed("brh_live_7f13c9a2e08b4d5590c1a6f3e4b0");
                  setName("");
                  setScopes(["read"]);
                  toast.success("API key created");
                }, 900);
              }}
            >
              {creating ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              Create key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!revealed} onOpenChange={(o) => !o && setRevealed(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Copy your API key</DialogTitle>
            <DialogDescription className="text-[var(--warning)]">
              You will not see this key again. Store it in your secret manager now.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input readOnly value={revealed ?? ""} className="font-mono text-xs" />
            <Button
              variant="outline"
              onClick={() => {
                if (revealed) void navigator.clipboard?.writeText(revealed);
                toast.success("Key copied to clipboard");
              }}
            >
              Copy
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setRevealed(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!revoking} onOpenChange={(o) => !o && setRevoking(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--critical)]">Revoke this key?</AlertDialogTitle>
            <AlertDialogDescription>
              {revoking ? `Requests using ${revoking.name} start failing immediately.` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[var(--critical)] text-white hover:bg-[var(--critical)]/90"
              onClick={() => {
                if (!revoking) return;
                setKeys((prev) => prev.map((k) => (k.id === revoking.id ? { ...k, status: "Revoked" } : k)));
                toast.success(`${revoking.name} revoked`);
                setRevoking(null);
              }}
            >
              Revoke key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
