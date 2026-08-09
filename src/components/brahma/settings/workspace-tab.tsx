import { Loader2, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState, SectionCard, StatusBadge } from "@/components/brahma/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { teamMembers, workspace, type MemberRole, type TeamMember } from "@/lib/settings-data";

const roleOptions: MemberRole[] = ["Viewer", "Editor", "Reviewer", "Admin"];

export function InviteMemberModal({
  open,
  onOpenChange,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onInvite: (email: string, role: MemberRole) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("Editor");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>They receive an email invite valid for 7 days.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inv-email">Email</Label>
            <Input id="inv-email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {error ? <p className="text-xs text-[var(--critical)]">{error}</p> : null}
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as MemberRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-msg">Message (optional)</Label>
            <Textarea
              id="inv-msg"
              rows={3}
              placeholder="Context for the invite, e.g. which project they should review."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={sending}
            onClick={() => {
              if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                setError("Enter a valid email address.");
                return;
              }
              setError(null);
              setSending(true);
              setTimeout(() => {
                setSending(false);
                onInvite(email, role);
                setEmail("");
                setMessage("");
                onOpenChange(false);
                toast.success(`Invitation sent to ${email}`);
              }, 900);
            }}
          >
            {sending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function WorkspaceTab() {
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleChange, setRoleChange] = useState<{ member: TeamMember; role: MemberRole } | null>(null);
  const [removing, setRemoving] = useState<TeamMember | null>(null);
  const [ws, setWs] = useState(workspace);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-4">
      <SectionCard
        title="Workspace"
        description="Defaults applied to every new project created in this workspace."
        action={
          dirty ? (
            <Badge variant="outline" className="rounded-full border-[var(--warning)]/40 bg-[var(--warning)]/12 text-[var(--warning)]">
              Unsaved changes
            </Badge>
          ) : null
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ws-name">Workspace name</Label>
            <Input
              id="ws-name"
              value={ws.name}
              onChange={(e) => {
                setWs({ ...ws, name: e.target.value });
                setDirty(true);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Default project domain</Label>
            <Select
              value={ws.domain}
              onValueChange={(v) => {
                setWs({ ...ws, domain: v });
                setDirty(true);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Education", "Healthcare", "Finance", "E-commerce", "Logistics", "Governance", "Developer Tools", "IoT"].map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Default analysis profile</Label>
            <Select
              value={ws.analysisProfile}
              onValueChange={(v) => {
                setWs({ ...ws, analysisProfile: v });
                setDirty(true);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard (balanced depth and speed)">Standard (balanced depth and speed)</SelectItem>
                <SelectItem value="Academic (requirements + report focus)">Academic (requirements + report focus)</SelectItem>
                <SelectItem value="Enterprise (strict security + business impact)">
                  Enterprise (strict security + business impact)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6">
          <Button
            disabled={!dirty || saving}
            onClick={() => {
              setSaving(true);
              setTimeout(() => {
                setSaving(false);
                setDirty(false);
                toast.success("Workspace settings saved");
              }, 800);
            }}
          >
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Save workspace
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Team members"
        description="Roles control who can run analyses, approve reviews and publish."
        action={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-4" aria-hidden /> Invite member
          </Button>
        }
      >
        {members.length <= 1 ? (
          <EmptyState
            icon={Users}
            title="No members yet"
            description="You are the only person in this workspace. Invite reviewers and editors to collaborate."
            action={<Button onClick={() => setInviteOpen(true)}>Invite member</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Projects</TableHead>
                  <TableHead className="text-right">Credits used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
                          {m.initials}
                        </span>
                        <span className="font-medium">{m.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.email}</TableCell>
                    <TableCell>
                      <Select
                        value={m.role}
                        onValueChange={(v) => setRoleChange({ member: m, role: v as MemberRole })}
                      >
                        <SelectTrigger className="h-8 w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{m.projects}</TableCell>
                    <TableCell className="text-right tabular-nums">{m.creditsUsed}</TableCell>
                    <TableCell>
                      <StatusBadge status={m.status === "Invitation pending" ? "Invited" : m.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[var(--critical)] hover:text-[var(--critical)]"
                        disabled={m.role === "Admin" && m.id === "m1"}
                        onClick={() => setRemoving(m)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <InviteMemberModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={(email, role) =>
          setMembers((prev) => [
            ...prev,
            {
              id: `m${prev.length + 1}`,
              name: email.split("@")[0] ?? email,
              initials: (email.slice(0, 2) || "NA").toUpperCase(),
              email,
              role,
              projects: 0,
              creditsUsed: 0,
              status: "Invitation pending",
              lastActive: "Never",
            },
          ])
        }
      />

      <AlertDialog open={!!roleChange} onOpenChange={(o) => !o && setRoleChange(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change role?</AlertDialogTitle>
            <AlertDialogDescription>
              {roleChange
                ? `${roleChange.member.name} will become ${roleChange.role}. This is recorded in the audit log.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!roleChange) return;
                setMembers((prev) =>
                  prev.map((m) => (m.id === roleChange.member.id ? { ...m, role: roleChange.role } : m)),
                );
                toast.success(`${roleChange.member.name} is now ${roleChange.role}`);
                setRoleChange(null);
              }}
            >
              Change role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!removing} onOpenChange={(o) => !o && setRemoving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--critical)]">Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              {removing
                ? `${removing.name} loses access to all workspace projects immediately. This cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[var(--critical)] text-white hover:bg-[var(--critical)]/90"
              onClick={() => {
                if (!removing) return;
                setMembers((prev) => prev.filter((m) => m.id !== removing.id));
                toast.success(`${removing.name} removed from workspace`);
                setRemoving(null);
              }}
            >
              Remove member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
