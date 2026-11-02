import React, { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Lock,
  Mail,
  User,
  GraduationCap,
  BookOpen,
  Briefcase,
  ShieldAlert,
  Sparkles,
  AlertCircle,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { SIGN_UP_TOKENS, WORKSPACE_ROLE_TOKENS } from "@/styles/vyron-auth-tokens";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/auth";

interface IndigoAuroraSignUpProps {
  onSuccess: (destination?: string) => void;
  onSwitchToSignIn: () => void;
  onSwitchToWorkspace?: () => void;
}

export function IndigoAuroraSignUp({
  onSuccess,
  onSwitchToSignIn,
  onSwitchToWorkspace,
}: IndigoAuroraSignUpProps) {
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);

  // Stage 1: Identity
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Stage 2: Role & Workspace
  const [selectedRole, setSelectedRole] = useState<Role>("Student");
  const [organization, setOrganization] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");

  // Stage 3: Personalization
  const [primaryFocus, setPrimaryFocus] = useState<string>("12-Stage Forensics & AST");
  const [themePref, setThemePref] = useState<"dark" | "midnight">("midnight");

  // State
  const [loading, setLoading] = useState(false);
  const [stageError, setStageError] = useState<string | null>(null);

  // Calculate password strength
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const passwordScore = getPasswordStrength(password);

  // Stage 1 Submit
  const handleStage1Next = (e: FormEvent) => {
    e.preventDefault();
    setStageError(null);
    if (!fullName.trim() || fullName.trim().length < 2) {
      setStageError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setStageError("Please enter a valid work or academic email.");
      return;
    }
    if (password.length < 8) {
      setStageError("Password must be at least 8 characters long.");
      return;
    }
    setCurrentStage(2);
  };

  // Stage 2 Submit
  const handleStage2Next = (e: FormEvent) => {
    e.preventDefault();
    setStageError(null);
    if (!organization.trim()) {
      setStageError("Please enter your university, research lab, or organization.");
      return;
    }
    const finalWorkspace = workspaceName.trim() || `${fullName.split(" ")[0]}'s Workspace`;
    setWorkspaceName(finalWorkspace);
    setCurrentStage(3);
  };

  // Stage 3 Final Launch
  const handleFinalLaunch = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setStageError(null);

    try {
      // Execute registration via authService
      const res = await authService.signUp(email.trim(), password, {
        data: {
          full_name: fullName.trim(),
          role: selectedRole.toLowerCase(),
          organization: organization.trim(),
          workspace_name: workspaceName.trim(),
          primary_focus: primaryFocus,
          theme_preference: themePref,
        },
      });

      if (!res.ok) {
        setStageError(res.error?.message || "Failed to complete account registration.");
        setLoading(false);
        return;
      }

      toast.success("Account created and workspace initialized!");
      onSuccess();
    } catch (err) {
      setStageError(err instanceof Error ? err.message : "An unexpected registration error occurred.");
      setLoading(false);
    }
  };

  const roles = [
    {
      role: "Student" as Role,
      title: "Student",
      desc: "Coursework, research, project blueprints and prototyping",
      icon: GraduationCap,
      accent: WORKSPACE_ROLE_TOKENS.student.accent,
    },
    {
      role: "Faculty" as Role,
      title: "Faculty",
      desc: "Academic oversight, student review ledgers, rubric grading",
      icon: BookOpen,
      accent: WORKSPACE_ROLE_TOKENS.faculty.accent,
    },
    {
      role: "Working Professional" as Role,
      title: "Professional",
      desc: "Production engineering, architecture drift, release verification",
      icon: Briefcase,
      accent: WORKSPACE_ROLE_TOKENS.professional.accent,
    },
    {
      role: "Admin" as Role,
      title: "Organization Admin",
      desc: "Governance & SLOs (Requires backend authorization)",
      icon: ShieldAlert,
      accent: WORKSPACE_ROLE_TOKENS.admin.accent,
      restricted: true,
    },
  ];

  return (
    <div
      className="w-full max-w-lg mx-auto rounded-2xl border p-6 sm:p-8 backdrop-blur-xl transition-all shadow-2xl relative"
      style={{
        backgroundColor: SIGN_UP_TOKENS.surface,
        borderColor: SIGN_UP_TOKENS.border,
      }}
    >
      {/* Top Accent Aurora Bar */}
      <div
        className="absolute top-0 left-8 right-8 h-1 rounded-b"
        style={{
          background: `linear-gradient(90deg, transparent, ${SIGN_UP_TOKENS.accent}, ${SIGN_UP_TOKENS.supportingAccent}, transparent)`,
        }}
      />

      {/* 3-Stage Progress Rail */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-[11px] font-mono mb-2">
          <span
            className={cn(
              "font-bold",
              currentStage === 1
                ? "text-[#A8A4FF]"
                : currentStage > 1
                  ? "text-emerald-400"
                  : "text-muted-foreground",
            )}
          >
            STAGE 01 — IDENTITY
          </span>
          <span
            className={cn(
              "font-bold",
              currentStage === 2
                ? "text-[#A8A4FF]"
                : currentStage > 2
                  ? "text-emerald-400"
                  : "text-muted-foreground",
            )}
          >
            STAGE 02 — ROLE & WORKSPACE
          </span>
          <span
            className={cn(
              "font-bold",
              currentStage === 3 ? "text-[#A8A4FF]" : "text-muted-foreground",
            )}
          >
            STAGE 03 — LAUNCH
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-1 bg-[#10132B] rounded-full overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-[#79D9F7] via-[#A8A4FF] to-[#78E0B8] transition-all duration-300"
            style={{ width: currentStage === 1 ? "33%" : currentStage === 2 ? "66%" : "100%" }}
          />
        </div>
      </div>

      {/* Error Announcement */}
      {stageError && (
        <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{stageError}</div>
        </div>
      )}

      {/* ── STAGE 01: IDENTITY ──────────────────────────────────────────────── */}
      {currentStage === 1 && (
        <form onSubmit={handleStage1Next} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#F3F7F5]">Establish Your Identity</h2>
            <p className="text-xs text-[#BAC8C0]">
              Create your account credentials to begin engineering verification.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-name" className="text-xs font-medium text-[#BAC8C0]">
              Full Legal Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
              <Input
                id="signup-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Samantha Vance"
                className="pl-9 bg-[#0D1020] border-[#2A3555] text-xs text-[#F3F7F5] focus-visible:ring-1 focus-visible:ring-[#A8A4FF]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-email" className="text-xs font-medium text-[#BAC8C0]">
              Academic / Work Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vance@engineering.mit.edu"
                className="pl-9 bg-[#0D1020] border-[#2A3555] text-xs text-[#F3F7F5] focus-visible:ring-1 focus-visible:ring-[#A8A4FF]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-password" className="text-xs font-medium text-[#BAC8C0]">
              Security Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="pl-9 bg-[#0D1020] border-[#2A3555] text-xs text-[#F3F7F5] focus-visible:ring-1 focus-visible:ring-[#A8A4FF]"
                required
              />
            </div>

            {/* Strength indicator */}
            {password && (
              <div className="flex items-center gap-1.5 pt-1">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3, 4].map((idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        idx <= passwordScore
                          ? passwordScore <= 2
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                          : "bg-white/10",
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {passwordScore <= 1 ? "Weak" : passwordScore <= 3 ? "Good" : "Strong"}
                </span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full text-xs font-semibold py-2.5 mt-2 flex items-center justify-center gap-2"
            style={{
              backgroundColor: SIGN_UP_TOKENS.accent,
              color: SIGN_UP_TOKENS.btnForeground,
              boxShadow: `0 4px 16px -2px ${SIGN_UP_TOKENS.accentGlow}`,
            }}
          >
            <span>Continue to Role & Workspace</span>
            <ArrowRight className="size-3.5" />
          </Button>

          <div className="pt-2 text-center text-xs text-[#BAC8C0]">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-[#A8A4FF] hover:underline font-semibold"
            >
              Sign in directly
            </button>
          </div>
        </form>
      )}

      {/* ── STAGE 02: ROLE AND WORKSPACE ────────────────────────────────────── */}
      {currentStage === 2 && (
        <form onSubmit={handleStage2Next} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#F3F7F5]">Select Role & Workspace</h2>
            <p className="text-xs text-[#BAC8C0]">
              Tailors available engineering systems and dashboard navigation.
            </p>
          </div>

          {/* Role Choice Cards */}
          <div className="grid grid-cols-2 gap-2">
            {roles.map((r) => {
              const isSelected = selectedRole === r.role;
              const Icon = r.icon;

              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setSelectedRole(r.role)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between",
                    isSelected
                      ? "bg-[#1F2342] border-[#A8A4FF] shadow-md ring-1 ring-[#A8A4FF]"
                      : "bg-[#0D1020]/60 border-[#2A3555] hover:border-white/20",
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div
                        className="size-7 rounded-lg flex items-center justify-center bg-white/5"
                        style={{ color: r.accent }}
                      >
                        <Icon className="size-4" />
                      </div>
                      {isSelected && <Check className="size-3.5 text-[#A8A4FF]" />}
                    </div>
                    <div className="text-xs font-bold text-foreground">{r.title}</div>
                    <p className="text-[10px] text-muted-foreground/80 line-clamp-2 mt-0.5">
                      {r.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 pt-1">
            <Label htmlFor="signup-org" className="text-xs font-medium text-[#BAC8C0]">
              Organization / Institution
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
              <Input
                id="signup-org"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Massachusetts Institute of Technology"
                className="pl-9 bg-[#0D1020] border-[#2A3555] text-xs text-[#F3F7F5]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-workspace" className="text-xs font-medium text-[#BAC8C0]">
              Workspace Identifier (Optional)
            </Label>
            <Input
              id="signup-workspace"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="vance-engineering-lab"
              className="bg-[#0D1020] border-[#2A3555] text-xs text-[#F3F7F5]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentStage(1)}
              className="border-[#2A3555] bg-[#0D1020] text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5 mr-1" />
              Back
            </Button>
            <Button
              type="submit"
              size="sm"
              className="flex-1 text-xs font-semibold py-2.5"
              style={{
                backgroundColor: SIGN_UP_TOKENS.accent,
                color: SIGN_UP_TOKENS.btnForeground,
              }}
            >
              <span>Continue to Launch Setup</span>
              <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </div>
        </form>
      )}

      {/* ── STAGE 03: PERSONALIZATION AND LAUNCH ────────────────────────────── */}
      {currentStage === 3 && (
        <form onSubmit={handleFinalLaunch} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#F3F7F5]">Personalization & Launch</h2>
            <p className="text-xs text-[#BAC8C0]">
              Review your configuration and initialize your engineering intelligence workspace.
            </p>
          </div>

          {/* Primary Focus Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[#BAC8C0]">Primary Platform Interest</Label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                "12-Stage Forensics & AST",
                "Architecture Digital Twin",
                "Automated Release CI/CD",
                "Multi-Agent Command Hub",
              ].map((focus) => (
                <button
                  key={focus}
                  type="button"
                  onClick={() => setPrimaryFocus(focus)}
                  className={cn(
                    "p-2.5 rounded-lg border text-left transition-colors",
                    primaryFocus === focus
                      ? "border-[#A8A4FF] bg-[#1F2342] text-foreground font-semibold"
                      : "border-[#2A3555] bg-[#0D1020]/60 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="text-[11px] leading-tight block">{focus}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Summary Confirmation Card */}
          <div className="rounded-xl border border-[#2A3555] bg-[#0D1020] p-3 text-xs space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Account Identity</span>
              <span className="text-foreground font-mono font-medium">{fullName}</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Selected Role</span>
              <span className="text-[#A8A4FF] font-medium">{selectedRole}</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Organization</span>
              <span className="text-foreground font-medium">{organization}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => setCurrentStage(2)}
              className="border-[#2A3555] bg-[#0D1020] text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5 mr-1" />
              Back
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="flex-1 text-xs font-semibold py-2.5 flex items-center justify-center gap-2"
              style={{
                backgroundColor: SIGN_UP_TOKENS.accent,
                color: SIGN_UP_TOKENS.btnForeground,
                boxShadow: `0 4px 16px -2px ${SIGN_UP_TOKENS.accentGlow}`,
              }}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  <span>Launch Initialized Workspace</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
