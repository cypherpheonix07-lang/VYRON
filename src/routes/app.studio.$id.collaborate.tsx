import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  MessageSquare,
  Activity,
  Plus,
  Trash2,
  CheckCircle,
  HelpCircle,
  Radio,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard, StatusBadge } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/studio/$id/collaborate")({
  head: () => ({
    meta: [
      { title: "Team Collaboration — BRAHMA AI Studio" },
      {
        name: "description",
        content: "Manage project access permissions, approval workflows, and comment logs.",
      },
    ],
  }),
  component: CollaborationPage,
});

const mockComments = [
  {
    id: 1,
    author: "Priya Nair",
    role: "Admin",
    text: "We need to fix CWE-89 before the security quality gate allows publishing.",
    anchor: "CWE-89 SQL Injection",
    time: "2 hours ago",
  },
  {
    id: 2,
    author: "Puli Phanindhra",
    role: "Editor",
    text: "Fixed the SQL concatenation in api.py. Triggering new pipeline checks.",
    anchor: "server/routes/api.py",
    time: "1 hour ago",
  },
  {
    id: 3,
    author: "Brahma AI",
    role: "System",
    text: "Security scan cleared. SQL Injection vulnerability resolved.",
    anchor: "SEC-1 SQLi Fix",
    time: "45 mins ago",
  },
];

const mockMembers = [
  { name: "Priya Nair", email: "priya.nair@brahma.dev", role: "Admin", active: true },
  { name: "Puli Phanindhra", email: "puli.ph@brahma.dev", role: "Editor", active: true },
  { name: "Vishal Madhavan", email: "vishal.m@brahma.dev", role: "Reviewer", active: false },
  { name: "Vishal S", email: "vishal.s@brahma.dev", role: "Editor", active: false },
];

function CollaborationPage() {
  const { id } = Route.useParams();

  const [members, setMembers] = useState(mockMembers);
  const [comments, setComments] = useState(mockComments);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Editor");
  const [commentText, setCommentText] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Workflow states: Draft, Faculty Review, Approved, Ready to Publish
  const [workflowState, setWorkflowState] = useState<"Draft" | "Review" | "Approved" | "Ready">(
    "Review",
  );

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const newMember = {
      name: inviteEmail.split("@")[0] || "Invited User",
      email: inviteEmail,
      role: inviteRole,
      active: false,
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail("");
    setShowInviteModal(false);
    toast.success("Invitation pending", {
      description: `Sent collaboration invite link to ${inviteEmail}.`,
    });
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: comments.length + 1,
      author: "Priya Nair",
      role: "Admin",
      text: commentText,
      anchor: "General Workspace",
      time: "Just now",
    };
    setComments((prev) => [...prev, newComment]);
    setCommentText("");
    toast.success("Comment posted.");
  };

  return (
    <div className="space-y-6">
      {/* Approval Workflow Stepper */}
      <SectionCard
        title="Approval Workflow Status"
        description="Workspace verification checkpoints."
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 py-2">
          <div className="flex flex-1 gap-2 items-center justify-between max-w-2xl relative before:absolute before:left-3 before:right-3 before:top-4 before:h-0.5 before:bg-border/60">
            {(
              [
                ["Draft", "Draft version ready"],
                ["Review", "Under Faculty/Admin review"],
                ["Approved", "Blueprint approved"],
                ["Ready", "All quality gates verified"],
              ] as const
            ).map(([stateKey, desc]) => {
              const isActive = workflowState === stateKey;
              const isChecked =
                (workflowState === "Review" && stateKey === "Draft") ||
                (workflowState === "Approved" && (stateKey === "Draft" || stateKey === "Review")) ||
                (workflowState === "Ready" && stateKey !== "Ready") ||
                workflowState === stateKey;

              return (
                <div
                  key={stateKey}
                  className="flex flex-col items-center text-center relative z-10"
                >
                  <button
                    type="button"
                    onClick={() => setWorkflowState(stateKey)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive ? "bg-primary border-primary text-primary-foreground font-bold" : ""
                    } ${
                      isChecked && !isActive
                        ? "bg-[var(--success)]/10 border-[var(--success)] text-[var(--success)]"
                        : ""
                    } ${
                      !isChecked && !isActive
                        ? "bg-background border-border text-muted-foreground"
                        : ""
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle className="size-4 shrink-0" />
                    ) : (
                      <Radio className="size-4 shrink-0" />
                    )}
                  </button>
                  <span className="text-[10px] font-semibold mt-1">{stateKey}</span>
                </div>
              );
            })}
          </div>

          <Button
            size="sm"
            className="bg-primary text-primary-foreground"
            onClick={() => {
              setWorkflowState("Approved");
              toast.success("Blueprint approved!", {
                description: "You've marked this workspace revision as verified.",
              });
            }}
          >
            <UserCheck className="mr-1.5 size-4" /> Approve Workspace
          </Button>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Active Members */}
        <div className="space-y-4">
          <SectionCard
            title="Team Members"
            description="Manage roles and user permissions."
            action={
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[10px]"
                onClick={() => setShowInviteModal(true)}
              >
                <Plus className="mr-1 size-3" /> Invite
              </Button>
            }
          >
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.email}
                  className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-secondary/80 flex items-center justify-center font-bold text-xs shrink-0 text-primary uppercase">
                      {member.name.slice(0, 2)}
                    </span>
                    <div>
                      <p className="text-xs font-semibold flex items-center gap-1.5">
                        {member.name}
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${member.active ? "bg-[var(--success)]" : "bg-zinc-600"}`}
                        />
                      </p>
                      <p className="text-[10px] text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px]">
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right: Comments */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard
            title="Discussion Board"
            description="Review comments anchored to requirements and components."
          >
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="flex gap-2 max-w-[90%] bg-secondary/20 p-3 rounded-xl border border-border/40"
                >
                  <span className="grid size-6 place-items-center rounded bg-primary/10 text-primary shrink-0 font-bold text-[10px] uppercase">
                    {c.author.slice(0, 2)}
                  </span>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-semibold text-foreground">{c.author}</span>
                      <span className="text-[9px] text-muted-foreground">{c.time}</span>
                    </div>
                    <Badge variant="outline" className="text-[8px] px-1 py-0">
                      {c.anchor}
                    </Badge>
                    <p className="text-muted-foreground leading-relaxed mt-1">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Post Comments form */}
            <form
              onSubmit={handlePostComment}
              className="flex gap-2 pt-4 border-t border-border/60 mt-4"
            >
              <Input
                placeholder="Anchor a comment..."
                className="h-8 text-xs bg-background/50 border-border/60"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button
                type="submit"
                size="sm"
                className="h-8 bg-primary text-primary-foreground text-xs shrink-0"
              >
                <MessageSquare className="mr-1.5 size-3.5" /> Comment
              </Button>
            </form>
          </SectionCard>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleInvite}
            className="w-full max-w-sm bg-zinc-950 border border-border p-6 rounded-2xl space-y-4 relative"
          >
            <h3 className="text-sm font-semibold">Invite Team Collaborator</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Send a secure invite link to add user to this project.
            </p>

            <div className="space-y-3">
              <div>
                <Label htmlFor="inv-email">Work or Campus Email</Label>
                <Input
                  id="inv-email"
                  type="email"
                  placeholder="name@university.edu"
                  className="mt-1.5 h-8 text-xs"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="inv-role">Select Workspace Role</Label>
                <select
                  id="inv-role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="mt-1.5 h-8 w-full text-xs border border-border bg-background rounded-lg px-2 text-foreground font-semibold outline-none"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Editor">Editor</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Admin">Admin</option>
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
    </div>
  );
}
