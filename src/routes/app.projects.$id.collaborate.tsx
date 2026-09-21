import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  Search,
  Plus,
  UserPlus,
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

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
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

export const Route = createFileRoute("/app/projects/$id/collaborate")({
  head: () => ({
    meta: [
      { title: "Collaborators — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Assign collaborators and configure branch workspace access.",
      },
    ],
  }),
  component: ProjectCollaboratorsPage,
});

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: Role;
  assigned: boolean;
  presence: "online" | "idle" | "offline";
}

const initialCollaborators: Collaborator[] = [
  {
    id: "m1",
    name: "Priya Nair",
    email: "priya.nair@brahma.dev",
    role: "Admin",
    assigned: true,
    presence: "online",
  },
  {
    id: "m2",
    name: "Puli Phanindhra",
    email: "puli@brahma.dev",
    role: "Reviewer",
    assigned: true,
    presence: "online",
  },
  {
    id: "m3",
    name: "Vishal Madhavan",
    email: "vishal@brahma.dev",
    role: "Reviewer",
    assigned: false,
    presence: "idle",
  },
  {
    id: "m4",
    name: "Vishal S",
    email: "vishals@brahma.dev",
    role: "Reviewer",
    assigned: false,
    presence: "offline",
  },
];

function ProjectCollaboratorsPage() {
  const { id } = Route.useParams();

  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialCollaborators);
  const [search, setSearch] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const filtered = collaborators.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleAssignment = (id: string, current: boolean) => {
    setCollaborators((prev) => prev.map((c) => (c.id === id ? { ...c, assigned: !current } : c)));
    toast.success(
      current
        ? "Revoked project access for team member."
        : "Teammate successfully assigned to this project.",
    );
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const newCollab: Collaborator = {
      id: `c_${collaborators.length + 1}`,
      name: inviteEmail.split("@")[0] || "Invited Teammate",
      email: inviteEmail,
      role: "Reviewer",
      assigned: true,
      presence: "offline",
    };
    setCollaborators((prev) => [...prev, newCollab]);
    setInviteEmail("");
    setShowInviteModal(false);
    toast.success(`Invite sent successfully. Teammate added to project.`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Project Collaborators</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage teammate access assignments and check active workspace session status.
          </p>
        </div>
        <Button
          size="sm"
          className="bg-primary text-primary-foreground text-xs h-9"
          onClick={() => setShowInviteModal(true)}
        >
          <Plus className="mr-1.5 size-4" /> Add Collaborator
        </Button>
      </header>

      <div className="relative min-w-0 max-w-sm flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          placeholder="Filter team roster..."
          className="pl-9 h-9 text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <SectionCard
        title="Workspace Assignments Ledger"
        description="Grant or restrict blueprint read-write keys."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Collaborator</TableHead>
              <TableHead>Workspace Role</TableHead>
              <TableHead>Access Status</TableHead>
              <TableHead>Presence</TableHead>
              <TableHead className="w-24"></TableHead>
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
                  <Badge variant="outline" className="text-[9px] font-mono">
                    {item.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.assigned ? (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] h-4">
                      Active Access
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[8px] h-4">
                      No Access
                    </Badge>
                  )}
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
                <TableCell>
                  {item.id !== "m1" ? (
                    <Button
                      variant={item.assigned ? "outline" : "default"}
                      size="sm"
                      className="h-7 text-[10px] min-w-[70px]"
                      onClick={() => toggleAssignment(item.id, item.assigned)}
                    >
                      {item.assigned ? "Revoke" : "Assign"}
                    </Button>
                  ) : (
                    <span className="text-[10px] text-muted-foreground italic">Owner</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {/* ADD COLLABORATOR MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleInviteSubmit}
            className="w-full max-w-sm bg-zinc-950 border border-border p-6 rounded-2xl space-y-4 relative"
          >
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <h3 className="text-sm font-semibold">Assign Project Collaborator</h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div>
              <Label htmlFor="collab-email">Collaborator Email</Label>
              <Input
                id="collab-email"
                placeholder="name@company.com"
                type="email"
                className="mt-1.5 h-8 text-xs"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
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
                Assign Member
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
