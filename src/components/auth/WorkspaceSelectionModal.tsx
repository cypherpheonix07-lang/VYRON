import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  ShieldAlert,
  ArrowRight,
  Check,
  Building,
  Loader2,
  FolderKanban,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { WORKSPACE_ROLE_TOKENS } from "@/styles/vyron-auth-tokens";
import { Button } from "@/components/ui/button";
import { useAuth, type Role, resolvePostLoginRoute } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface WorkspaceSelectionModalProps {
  onSelectWorkspace: (role: Role, workspaceId?: string) => void;
  className?: string;
}

export function WorkspaceSelectionModal({
  onSelectWorkspace,
  className,
}: WorkspaceSelectionModalProps) {
  const { user } = useAuth();
  const currentRole = user?.role || "Student";
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === "Admin";

  const workspaceOptions = [
    {
      role: "Student" as Role,
      title: WORKSPACE_ROLE_TOKENS.student.title,
      accent: WORKSPACE_ROLE_TOKENS.student.accent,
      glow: WORKSPACE_ROLE_TOKENS.student.glow,
      meaning: WORKSPACE_ROLE_TOKENS.student.meaning,
      destinations: WORKSPACE_ROLE_TOKENS.student.destinations,
      icon: GraduationCap,
      permitted: true,
    },
    {
      role: "Faculty" as Role,
      title: WORKSPACE_ROLE_TOKENS.faculty.title,
      accent: WORKSPACE_ROLE_TOKENS.faculty.accent,
      glow: WORKSPACE_ROLE_TOKENS.faculty.glow,
      meaning: WORKSPACE_ROLE_TOKENS.faculty.meaning,
      destinations: WORKSPACE_ROLE_TOKENS.faculty.destinations,
      icon: BookOpen,
      permitted: true,
    },
    {
      role: "Working Professional" as Role,
      title: WORKSPACE_ROLE_TOKENS.professional.title,
      accent: WORKSPACE_ROLE_TOKENS.professional.accent,
      glow: WORKSPACE_ROLE_TOKENS.professional.glow,
      meaning: WORKSPACE_ROLE_TOKENS.professional.meaning,
      destinations: WORKSPACE_ROLE_TOKENS.professional.destinations,
      icon: Briefcase,
      permitted: true,
    },
    {
      role: "Admin" as Role,
      title: WORKSPACE_ROLE_TOKENS.admin.title,
      accent: WORKSPACE_ROLE_TOKENS.admin.accent,
      glow: WORKSPACE_ROLE_TOKENS.admin.glow,
      meaning: WORKSPACE_ROLE_TOKENS.admin.meaning,
      destinations: WORKSPACE_ROLE_TOKENS.admin.destinations,
      icon: ShieldAlert,
      permitted: isAdmin,
    },
  ];

  const handleLaunch = () => {
    if (loading) return;
    setLoading(true);

    if (selectedRole === "Admin" && !isAdmin) {
      toast.error("Administrator access requires verified server-side authorization.");
      setLoading(false);
      return;
    }

    toast.success(`Activating ${selectedRole} Workspace...`);
    onSelectWorkspace(selectedRole);
  };

  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto rounded-2xl border border-[#2A3A35] bg-[#101A18]/95 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative",
        className,
      )}
    >
      {/* Top Accent Emerald Activation Bar */}
      <div className="absolute top-0 left-8 right-8 h-1 rounded-b bg-gradient-to-r from-transparent via-[#78E0B8] to-transparent" />

      <div className="mb-6 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border uppercase text-[#78E0B8] border-[#78E0B8]/40 bg-[#78E0B8]/10">
            Workspace Activation
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">Role Context Switcher</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#F3F7F5]">
          Select Operational Context
        </h2>
        <p className="text-xs text-[#BAC8C0]">
          Choose your workspace destination. Tailors available AST forensics and engineering systems.
        </p>
      </div>

      {/* Grid of Workspaces */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {workspaceOptions.map((opt) => {
          const isSelected = selectedRole === opt.role;
          const Icon = opt.icon;

          return (
            <button
              key={opt.role}
              type="button"
              disabled={!opt.permitted}
              onClick={() => setSelectedRole(opt.role)}
              className={cn(
                "p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between group",
                isSelected
                  ? "bg-[#162321] shadow-lg ring-1"
                  : opt.permitted
                    ? "bg-[#070C0B]/60 border-[#2A3A35] hover:border-white/20 hover:bg-[#162321]/60"
                    : "opacity-40 cursor-not-allowed bg-[#070C0B]/30 border-white/5",
              )}
              style={{
                borderColor: isSelected ? opt.accent : undefined,
                boxShadow: isSelected ? `0 4px 16px -2px ${opt.glow}` : undefined,
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="size-8 rounded-lg flex items-center justify-center bg-white/5"
                    style={{ color: opt.accent }}
                  >
                    <Icon className="size-4" />
                  </div>
                  {isSelected ? (
                    <span
                      className="size-4 rounded-full flex items-center justify-center text-[#1A1011]"
                      style={{ backgroundColor: opt.accent }}
                    >
                      <Check className="size-3 stroke-[3]" />
                    </span>
                  ) : !opt.permitted ? (
                    <Lock className="size-3.5 text-muted-foreground" />
                  ) : null}
                </div>

                <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span>{opt.title}</span>
                  {!opt.permitted && (
                    <span className="text-[9px] font-mono text-muted-foreground">(Locked)</span>
                  )}
                </div>

                <p className="text-[10px] text-muted-foreground/80 line-clamp-2 mt-1">
                  {opt.meaning}
                </p>
              </div>

              {/* Destination Pill List */}
              <div className="mt-3 pt-2 border-t border-white/5 flex flex-wrap gap-1">
                {opt.destinations.slice(0, 2).map((d) => (
                  <span
                    key={d}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#2A3A35]">
        <div className="text-[11px] text-muted-foreground">
          Destination:{" "}
          <span className="font-mono text-foreground">{resolvePostLoginRoute(selectedRole)}</span>
        </div>

        <Button
          type="button"
          onClick={handleLaunch}
          disabled={loading}
          className="text-xs font-semibold py-2 px-4 flex items-center gap-2"
          style={{
            backgroundColor: "#78E0B8",
            color: "#070C0B",
            boxShadow: "0 4px 16px -2px rgba(120, 224, 184, 0.25)",
          }}
        >
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <>
              <span>Enter {selectedRole} Workspace</span>
              <ArrowRight className="size-3.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
