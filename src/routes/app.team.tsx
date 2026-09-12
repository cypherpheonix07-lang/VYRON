import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  Search,
  Plus,
  Ban,
  UserMinus,
  CheckCircle,
  MoreVertical,
  X,
  Mail,
  Shield,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard, StatusBadge } from "@/components/brahma/primitives";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Role } from "@/lib/auth";

export const Route = createFileRoute("/app/team")({
  head: () => ({
    meta: [
      { title: "Team Space — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Manage roles, permissions, and active presence of collaborators.",
      },
    ],
  }),
  component: WorkspaceTeamPage,
});

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Suspended" | "Pending";
  presence: "online" | "idle" | "offline";
  lastActive: string;
}

const initialMembers: Member[] = [
  {
    id: "m1",
    name: "Priya Nair",
    email: "priya.nair@brahma.dev",
    role: "Admin",
    status: "Active",
    presence: "online",
    lastActive: "Just now",
  },
  {
    id: "m2",
    name: "Puli Phanindhra",
    email: "puli@brahma.dev",
    role: "Reviewer",
    status: "Active",
    presence: "online",
    lastActive: "Just now",
  },
  {
    id: "m3",
    name: "Vishal Madhavan",
    email: "vishal@brahma.dev",
    role: "Reviewer",
    status: "Active",
    presence: "idle",
    lastActive: "35m ago",
  },
  {
    id: "m4",
    name: "Vishal S",
    email: "vishals@brahma.dev",
    role: "Reviewer",
    status: "Active",
    presence: "offline",
    lastActive: "1d ago",
  },
  {
    id: "m5",
    name: "Ananya K",
    email: "ananya.k@brahma.dev",
    role: "Student",
    status: "Pending",
    presence: "offline",
    lastActive: "Never",
  },
];

function WorkspaceTeamPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState("");

  // Modals state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Student");
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Confirmation state
  const [confirmDeleteMember, setConfirmDeleteMember] = useState<Member | null>(null);
  const [confirmRoleChange, setConfirmRoleChange] = useState<{
    member: Member;
    nextRole: Role;
  } | null>(null);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const newMember: Member = {
      id: `m_${members.length + 1}`,
      name: inviteEmail.split("@")[0] || "Invited User",
      email: inviteEmail,
      role: inviteRole,
      status: "Pending",
      presence: "offline",
      lastActive: "Never",
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail("");
    setShowInviteModal(false);
    toast.success(`Invite sent successfully to ${inviteEmail}.`);
  };

  const handleRoleChangeConfirm = () => {
    if (!confirmRoleChange) return;
    const { member, nextRole } = confirmRoleChange;
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, role: nextRole } : m)));
    toast.success(`Role for ${member.name} updated to ${nextRole}`);
    setConfirmRoleChange(null);
  };

  const handleRemoveMemberConfirm = () => {
    if (!confirmDeleteMember) return;
    setMembers((prev) => prev.filter((m) => m.id !== confirmDeleteMember.id));
    toast.success(`${confirmDeleteMember.name} removed from workspace.`);
    setConfirmDeleteMember(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspace Team Space"
        description="Collaborate in real-time. Invite teammates, manage roles, and review session active states."
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative min-w-0 flex-1 max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search teammates by name or email..."
            className="pl-9 h-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button
          size="sm"
          className="bg-primary text-primary-foreground text-xs h-9"
          onClick={() => setShowInviteModal(true)}
        >
          <Plus className="mr-1.5 size-4" /> Invite Teammate
        </Button>
      </div>

      <SectionCard title="Active Collaborators" description="Manage user permission parameters.">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Collaborator</TableHead>
              <TableHead>Workspace Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Presence</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <select
                    value={item.role}
                    onChange={(e) =>
                      setConfirmRoleChange({ member: item, nextRole: e.target.value as Role })
                    }
                    disabled={item.id === "m1"} // Priya Nair cannot demote herself
                    className="bg-transparent border border-border/60 hover:border-primary/20 text-xs px-2 py-1 rounded text-foreground outline-none cursor-pointer"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Reviewer">Reviewer</option>
                    <option value="Student">Student</option>
                  </select>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] px-2 rounded-full",
                      item.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    )}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        item.presence === "online" && "bg-emerald-500",
                        item.presence === "idle" && "bg-amber-500",
                        item.presence === "offline" && "bg-zinc-600",
                      )}
                    />
                    <span className="text-xs text-muted-foreground capitalize">
                      {item.presence}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">
                  {item.lastActive}
                </TableCell>
                <TableCell>
                  {item.id !== "m1" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-[var(--critical)] hover:bg-[var(--critical)]/10"
                      onClick={() => setConfirmDeleteMember(item)}
                      aria-label="Remove collaborator"
                    >
                      <UserMinus className="size-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {/* INVITE TEAMMATE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleInviteSubmit}
            className="w-full max-w-sm bg-zinc-950 border border-border p-6 rounded-2xl space-y-4 relative"
          >
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <h3 className="text-sm font-semibold">Invite Collaborator</h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="inv-email">Email Address</Label>
                <Input
                  id="inv-email"
                  placeholder="name@university.edu"
                  type="email"
                  className="mt-1.5 h-8 text-xs"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="inv-role">Workspace Permission</Label>
                <select
                  id="inv-role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Role)}
                  className="w-full mt-1.5 bg-zinc-950 border border-border text-xs px-2.5 py-1.5 rounded text-foreground outline-none"
                >
                  <option value="Student">Student (Read/Verify)</option>
                  <option value="Reviewer">Reviewer (Write/Design)</option>
                  <option value="Admin">Admin (Full access)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                Send Invitation
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* CONFIRM ROLE CHANGE DIALOG */}
      {confirmRoleChange && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-zinc-950 border border-border p-6 rounded-2xl space-y-4 relative">
            <h3 className="text-sm font-semibold text-foreground">Confirm Role Change</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to adjust the role of **{confirmRoleChange.member.name}** from
              **{confirmRoleChange.member.role}** to **{confirmRoleChange.nextRole}**?
            </p>
            <div className="flex gap-2 justify-end pt-4 border-t border-border/60">
              <Button size="sm" variant="outline" onClick={() => setConfirmRoleChange(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                onClick={handleRoleChangeConfirm}
              >
                Confirm Change
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MEMBER DIALOG */}
      {confirmDeleteMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-zinc-950 border border-border p-6 rounded-2xl space-y-4 relative">
            <h3 className="text-sm font-semibold text-[var(--critical)]">Remove Collaborator</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to revoke workspace access for **{confirmDeleteMember.name}**?
              This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end pt-4 border-t border-border/60">
              <Button size="sm" variant="outline" onClick={() => setConfirmDeleteMember(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleRemoveMemberConfirm}
              >
                Revoke Access
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
