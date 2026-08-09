import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SectionCard } from "@/components/brahma/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { currentUser } from "@/lib/settings-data";

function strength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score;
}

export function ChangePasswordModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const score = strength(next);
  const labels = ["Too weak", "Weak", "Fair", "Strong", "Excellent"];
  const colors = ["var(--critical)", "var(--critical)", "var(--warning)", "var(--success)", "var(--success)"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            You will stay signed in on this device. Other sessions will be revoked.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pw-current">Current password</Label>
            <Input id="pw-current" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw-next">New password</Label>
            <Input id="pw-next" type="password" value={next} onChange={(e) => setNext(e.target.value)} />
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{ width: `${(score / 4) * 100}%`, backgroundColor: colors[score] }}
                />
              </div>
              <span className="w-20 text-right text-xs text-muted-foreground">{labels[score]}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw-confirm">Confirm new password</Label>
            <Input id="pw-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-[var(--critical)]">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={saving}
            onClick={() => {
              if (!current) return setError("Enter your current password.");
              if (score < 2) return setError("Choose a stronger password (8+ chars, mixed case, a number).");
              if (next !== confirm) return setError("Passwords do not match.");
              setError(null);
              setSaving(true);
              setTimeout(() => {
                setSaving(false);
                onOpenChange(false);
                setCurrent("");
                setNext("");
                setConfirm("");
                toast.success("Password updated");
              }, 900);
            }}
          >
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Update password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ProfileForm() {
  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    title: currentUser.title,
    organization: currentUser.organization,
  });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [pwOpen, setPwOpen] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  };

  const save = () => {
    const next: { name?: string; email?: string } = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setDirty(false);
      toast.success("Profile updated");
    }, 900);
  };

  return (
    <div className="space-y-4">
      <SectionCard
        title="Your profile"
        description="Identity used across reports, audit entries and collaboration."
        action={
          dirty ? (
            <Badge variant="outline" className="rounded-full border-[var(--warning)]/40 bg-[var(--warning)]/12 text-[var(--warning)]">
              Unsaved changes
            </Badge>
          ) : null
        }
      >
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
            {currentUser.initials}
          </span>
          <div className="min-w-0">
            <p className="font-medium">{currentUser.name}</p>
            <p className="truncate text-sm text-muted-foreground">{currentUser.email}</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="rounded-full border-primary/40 bg-primary/12 text-primary">
                {currentUser.role}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Role changes require an admin</TooltipContent>
          </Tooltip>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="p-name">Full name</Label>
            <Input id="p-name" value={form.name} onChange={(e) => update("name", e.target.value)} />
            {errors.name ? <p className="text-xs text-[var(--critical)]">{errors.name}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-email">Email</Label>
            <Input id="p-email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            {errors.email ? <p className="text-xs text-[var(--critical)]">{errors.email}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-phone">Phone (optional)</Label>
            <Input id="p-phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-title">Title</Label>
            <Input id="p-title" value={form.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="p-org">Department / organization</Label>
            <Input id="p-org" value={form.organization} onChange={(e) => update("organization", e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={save} disabled={saving || !dirty}>
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Save changes
          </Button>
          <Button variant="outline" onClick={() => setPwOpen(true)}>
            Change password
          </Button>
        </div>
      </SectionCard>
      <ChangePasswordModal open={pwOpen} onOpenChange={setPwOpen} />
    </div>
  );
}
