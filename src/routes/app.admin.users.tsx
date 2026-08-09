import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState, SectionCard, StatusBadge } from "@/components/brahma/primitives";
import { InviteMemberModal } from "@/components/brahma/settings/workspace-tab";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminUserDirectory, type AdminUser } from "@/lib/settings-data";

export const Route = createFileRoute("/app/admin/users")({
  component: AdminUsers,
});

const PAGE_SIZE = 8;

function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(adminUserDirectory);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [plan, setPlan] = useState("all");
  const [page, setPage] = useState(1);
  const [invite, setInvite] = useState(false);
  const [roleTarget, setRoleTarget] = useState<AdminUser | null>(null);
  const [nextRole, setNextRole] = useState("Editor");
  const [suspendTarget, setSuspendTarget] = useState<AdminUser | null>(null);
  const [drawer, setDrawer] = useState<AdminUser | null>(null);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          (q === "" || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q.toLowerCase())) &&
          (role === "all" || u.role === role) &&
          (status === "all" || u.status === status) &&
          (plan === "all" || u.plan === plan),
      ),
    [users, q, role, status, plan],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const clear = () => {
    setQ("");
    setRole("all");
    setStatus("all");
    setPlan("all");
    setPage(1);
  };

  return (
    <SectionCard
      title="Users"
      description={`${filtered.length} of ${users.length} users match the current filters.`}
      action={
        <Button size="sm" onClick={() => setInvite(true)}>
          Invite user
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search name or email"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-64"
        />
        {[
          { value: role, set: setRole, label: "Role", options: ["Admin", "Editor", "Reviewer", "Viewer", "Student", "Faculty", "Startup"] },
          { value: status, set: setStatus, label: "Status", options: ["Active", "Suspended", "Pending"] },
          { value: plan, set: setPlan, label: "Plan", options: ["Student Free", "Team Pro", "Startup", "Enterprise"] },
        ].map((f) => (
          <Select
            key={f.label}
            value={f.value}
            onValueChange={(v) => {
              f.set(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={f.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {f.label.toLowerCase()}s</SelectItem>
              {f.options.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No users match your filters"
            description="Try a different role, status or plan combination."
            action={<Button variant="outline" onClick={clear}>Clear filters</Button>}
          />
        </div>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Projects</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
                          {u.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{u.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell className="text-muted-foreground">{u.plan}</TableCell>
                    <TableCell className="text-right tabular-nums">{u.projects}</TableCell>
                    <TableCell className="text-right tabular-nums">{u.creditsUsed}</TableCell>
                    <TableCell>
                      <StatusBadge status={u.status === "Pending" ? "Invited" : u.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.lastActive}</TableCell>
                    <TableCell className="space-x-1 text-right whitespace-nowrap">
                      <Button size="sm" variant="ghost" onClick={() => setDrawer(u)}>
                        View
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setRoleTarget(u)}>
                        Role
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[var(--critical)] hover:text-[var(--critical)]"
                        onClick={() => setSuspendTarget(u)}
                      >
                        {u.status === "Suspended" ? "Activate" : "Suspend"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>
              Page {current} of {pages}
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={current === 1} onClick={() => setPage(current - 1)}>
                Previous
              </Button>
              <Button size="sm" variant="outline" disabled={current === pages} onClick={() => setPage(current + 1)}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <InviteMemberModal
        open={invite}
        onOpenChange={setInvite}
        onInvite={(email) =>
          setUsers((prev) => [
            {
              id: `au${prev.length + 1}`,
              name: email.split("@")[0] ?? email,
              initials: email.slice(0, 2).toUpperCase(),
              email,
              role: "Editor",
              plan: "Team Pro",
              projects: 0,
              creditsUsed: 0,
              status: "Pending",
              lastActive: "Never",
            },
            ...prev,
          ])
        }
      />

      <AlertDialog open={!!roleTarget} onOpenChange={(o) => !o && setRoleTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change role</AlertDialogTitle>
            <AlertDialogDescription>
              {roleTarget ? `Select the new platform role for ${roleTarget.name}. Logged to the audit trail.` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Select value={nextRole} onValueChange={setNextRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Admin", "Editor", "Reviewer", "Viewer"].map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!roleTarget) return;
                setUsers((prev) =>
                  prev.map((u) => (u.id === roleTarget.id ? { ...u, role: nextRole as AdminUser["role"] } : u)),
                );
                toast.success(`${roleTarget.name} is now ${nextRole}`);
                setRoleTarget(null);
              }}
            >
              Save role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!suspendTarget} onOpenChange={(o) => !o && setSuspendTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--critical)]">
              {suspendTarget?.status === "Suspended" ? "Reactivate account?" : "Suspend account?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {suspendTarget
                ? suspendTarget.status === "Suspended"
                  ? `${suspendTarget.name} regains access to all assigned projects.`
                  : `${suspendTarget.name} loses access immediately and running analyses are cancelled.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!suspendTarget) return;
                const activate = suspendTarget.status === "Suspended";
                setUsers((prev) =>
                  prev.map((u) => (u.id === suspendTarget.id ? { ...u, status: activate ? "Active" : "Suspended" } : u)),
                );
                toast.success(`${suspendTarget.name} ${activate ? "reactivated" : "suspended"}`);
                setSuspendTarget(null);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={!!drawer} onOpenChange={(o) => !o && setDrawer(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{drawer?.name ?? "User"}</SheetTitle>
            <SheetDescription>{drawer?.email ?? ""}</SheetDescription>
          </SheetHeader>
          {drawer ? (
            <div className="space-y-4 px-4 pb-6 text-sm">
              <dl className="space-y-2">
                {[
                  ["Role", drawer.role],
                  ["Plan", drawer.plan],
                  ["Projects", String(drawer.projects)],
                  ["Credits used", `${drawer.creditsUsed} of 200`],
                  ["Status", drawer.status],
                  ["Last active", drawer.lastActive],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs text-muted-foreground">
                Recent projects: Smart Campus Portal, VaultLedger, MediSync Booking.
              </p>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </SectionCard>
  );
}
