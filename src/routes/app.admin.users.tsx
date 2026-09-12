import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  Search,
  Filter,
  Plus,
  Ban,
  CheckCircle,
  UserPlus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { type Role } from "@/lib/auth";
import { PageHeader, SectionCard, StatusBadge } from "@/components/brahma/primitives";
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
import { adminUsers } from "@/lib/mock-data";

export const Route = createFileRoute("/app/admin/users")({
  head: () => ({
    meta: [
      { title: "User Management — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Admin user accounts list, permission controls, and invite queues.",
      },
    ],
  }),
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const [users, setUsers] = useState(adminUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [inviteEmail, setInviteEmail] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: nextStatus as "Active" | "Suspended" | "Pending" | "Invited" }
          : u,
      ),
    );
    toast.success(`User status updated`, {
      description: `User is now ${nextStatus.toLowerCase()}.`,
    });
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const newMember = {
      id: `usr_${users.length + 1}`,
      name: inviteEmail.split("@")[0] || "Invited Admin",
      email: inviteEmail,
      role: "Editor" as Role,
      projects: 0,
      joined: "Just now",
      status: "Pending" as "Active" | "Suspended" | "Pending" | "Invited",
    };
    setUsers((prev) => [...prev, newMember]);
    setInviteEmail("");
    setShowInviteModal(false);
    toast.success("User invited", {
      description: `Sent invitation link to ${inviteEmail}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative min-w-0 flex-1 max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search users by name or email..."
            className="pl-9 h-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {/* Role Filter Selector */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 text-xs border border-border bg-background rounded-lg px-3 text-foreground font-semibold outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="Startup">Startup</option>
          </select>

          <Button
            size="sm"
            onClick={() => setShowInviteModal(true)}
            className="bg-primary text-primary-foreground text-xs h-9"
          >
            <UserPlus className="mr-1.5 size-4" /> Invite User
          </Button>
        </div>
      </div>

      <SectionCard title="Registered Accounts" description="Manage platform user access controls.">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Profile</TableHead>
                <TableHead>System Role</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => {
                const isActive = u.status === "Active";
                return (
                  <TableRow key={u.id}>
                    <TableCell className="max-w-[240px]">
                      <div className="flex items-center gap-2.5">
                        <span className="h-8 w-8 rounded-full bg-secondary/80 flex items-center justify-center font-bold text-xs shrink-0 text-primary uppercase">
                          {u.name.slice(0, 2)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-xs text-foreground">{u.name}</p>
                          <p className="truncate text-[10px] text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline" className="text-[9px]">
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.joined}</TableCell>
                    <TableCell>
                      <StatusBadge status={u.status} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 ${isActive ? "text-red-500 hover:text-red-400" : "text-emerald-500 hover:text-emerald-400"}`}
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        aria-label={isActive ? "Suspend user" : "Activate user"}
                      >
                        {isActive ? <Ban className="size-4" /> : <CheckCircle className="size-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs text-muted-foreground mt-4">
          <span>
            Showing {filtered.length} of {users.length} accounts
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled
              aria-label="Previous page"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled
              aria-label="Next page"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleInvite}
            className="w-full max-w-sm bg-zinc-950 border border-border p-6 rounded-2xl space-y-4 relative"
          >
            <h3 className="text-sm font-semibold">Invite Platform User</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Send a secure invite link to register a new user.
            </p>

            <div className="space-y-3">
              <div>
                <Label htmlFor="usr-email">Email Address</Label>
                <Input
                  id="usr-email"
                  type="email"
                  placeholder="user@university.edu"
                  className="mt-1.5 h-8 text-xs"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
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
    </div>
  );
}
