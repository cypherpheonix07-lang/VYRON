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
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleOAuth = async (provider: "google" | "github" | "gitlab") => {
    setOauthLoading(provider);
    try {
      let res;
      if (provider === "google") res = await authService.signInWithGoogle();
      else if (provider === "github") res = await authService.signInWithGithub();
      else res = await authService.signInWithGitlab();

      if (!res.ok) {
        setStageError(res.error?.message || `OAuth sign-up with ${provider} failed.`);
      }
    } catch (err) {
      setStageError(err instanceof Error ? err.message : `Failed to connect with ${provider}.`);
    } finally {
      setOauthLoading(null);
    }
  };

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

          {/* OAuth Providers Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A3555]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#0D1020] px-2 text-muted-foreground font-mono">
                Or register with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={Boolean(oauthLoading)}
              onClick={() => handleOAuth("google")}
              aria-label="Sign up with Google"
              className="text-xs border-[#2A3555] bg-[#070A18]/60 hover:bg-[#161D3A] text-[#F3F7F5] flex items-center justify-center gap-1.5 px-2"
            >
              {oauthLoading === "google" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                  <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.6-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
                </svg>
              )}
              <span>Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={Boolean(oauthLoading)}
              onClick={() => handleOAuth("github")}
              aria-label="Sign up with GitHub"
              className="text-xs border-[#2A3555] bg-[#070A18]/60 hover:bg-[#161D3A] text-[#F3F7F5] flex items-center justify-center gap-1.5 px-2"
            >
              {oauthLoading === "github" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <svg className="size-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              )}
              <span>GitHub</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={Boolean(oauthLoading)}
              onClick={() => handleOAuth("gitlab")}
              aria-label="Sign up with GitLab"
              className="text-xs border-[#2A3555] bg-[#070A18]/60 hover:bg-[#161D3A] text-[#F3F7F5] flex items-center justify-center gap-1.5 px-2"
            >
              {oauthLoading === "gitlab" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#E24329" d="m23.6 9.6-1.5-4.5c-.2-.5-.8-.8-1.3-.5l-2.4 1.8L12 .3l-6.4 6.1-2.4-1.8c-.5-.3-1.1-.1-1.3.5L.4 9.6c-.2.6 0 1.2.5 1.6l11.1 8.2 11.1-8.2c.5-.4.7-1 .5-1.6z" />
                  <path fill="#FC6D26" d="M12 19.4 5.6 6.4h12.8L12 19.4z" />
                  <path fill="#FCA326" d="M12 19.4 5.6 6.4.4 9.6c-.2.6 0 1.2.5 1.6l11.1 8.2z" />
                  <path fill="#FCA326" d="M12 19.4 18.4 6.4 23.6 9.6c.2.6 0 1.2-.5 1.6l-11.1 8.2z" />
                </svg>
              )}
              <span>GitLab</span>
            </Button>
          </div>

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
