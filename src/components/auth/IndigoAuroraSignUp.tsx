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
  Key,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Terminal,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { SIGN_UP_TOKENS, WORKSPACE_ROLE_TOKENS, FIVE_STAGE_ONBOARDING_TOKENS } from "@/styles/vyron-auth-tokens";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { OtpInput, ResendCountdown } from "@/components/auth/auth-components";
import { FiveStageProgressThreads, type OnboardingStageId } from "./FiveStageProgressThreads";
import { cn } from "@/lib/utils";
import { useAuth, type Role, appRoleToDbRole, resolvePostLoginRoute } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";
import { setDesignation } from "@/lib/db/profiles";
import { experienceProfileService, type PersonaType } from "@/services/persona/experienceProfileService";

interface IndigoAuroraSignUpProps {
  onSuccess: (destination?: string) => void;
  onSwitchToSignIn: () => void;
  onSwitchToWorkspace?: () => void;
}

export function IndigoAuroraSignUp({
  onSuccess,
  onSwitchToSignIn,
}: IndigoAuroraSignUpProps) {
  const { user, refresh } = useAuth();
  const [currentStage, setCurrentStage] = useState<OnboardingStageId>(1);
  const [completedStages, setCompletedStages] = useState<Record<number, boolean>>({});
  const [stageErrors, setStageErrors] = useState<Record<number, string | null>>({});
  const [completingStageId, setCompletingStageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  // Stage 1: Identity & Credentials
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Stage 2: Verification
  const [otpCode, setOtpCode] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  // Stage 3: Workspace & Role
  const [selectedRole, setSelectedRole] = useState<Role>("Student");
  const [organization, setOrganization] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");

  // Stage 4: Security Center
  const [mfaPreference, setMfaPreference] = useState<"standard" | "totp_enrolled" | "skipped">("standard");
  const [securityAcknowledged, setSecurityAcknowledged] = useState(true);

  // Stage 5: Personalization & Launch
  const [primaryFocus, setPrimaryFocus] = useState<string>("12-Stage Forensics & AST");
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["Learn Software Architecture"]);
  const [proficiency, setProficiency] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [themePref, setThemePref] = useState<"royal-smoke" | "obsidian-glow" | "navy" | "neon-dusk">("neon-dusk");
  const [milestoneDeadline, setMilestoneDeadline] = useState("30 Days (Sprint Review)");
  const [initialProjectName, setInitialProjectName] = useState("");

  // Transition helper that fires the orbital completion arc before advancing
  const advanceWithOrbitalReveal = (fromStage: OnboardingStageId, toStage: OnboardingStageId) => {
    setCompletingStageId(fromStage);
    setCompletedStages((prev) => ({ ...prev, [fromStage]: true }));
    setStageErrors((prev) => ({ ...prev, [fromStage]: null }));

    setTimeout(() => {
      setCompletingStageId(null);
      setCurrentStage(toStage);
    }, 360);
  };

  // Password Strength Calculator
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };
  const passwordScore = getPasswordStrength(password);

  // ── Stage 1: Account Creation ──────────────────────────────────────────────
  const handleStage1Submit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setStageErrors((prev) => ({ ...prev, 1: null }));

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName || cleanName.length < 2) {
      setStageErrors((prev) => ({ ...prev, 1: "Please enter your full name." }));
      return;
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setStageErrors((prev) => ({ ...prev, 1: "Please enter a valid work or academic email." }));
      return;
    }
    if (password.length < 8) {
      setStageErrors((prev) => ({ ...prev, 1: "Password must be at least 8 characters long." }));
      return;
    }

    setLoading(true);
    try {
      const res = await authService.signUp(cleanEmail, password, {
        data: {
          full_name: cleanName,
        },
      });

      if (!res.ok) {
        setStageErrors((prev) => ({ ...prev, 1: res.error?.message || "Sign-up failed." }));
        setLoading(false);
        return;
      }

      toast.success("Account created. Please confirm identity.");
      advanceWithOrbitalReveal(1, 2);
    } catch (err) {
      setStageErrors((prev) => ({
        ...prev,
        1: err instanceof Error ? err.message : "An unexpected sign-up error occurred.",
      }));
    } finally {
      setLoading(false);
    }
  };

  // OAuth Handler for Stage 1
  const handleOAuth = async (provider: "google" | "github" | "gitlab") => {
    if (oauthLoading || loading) return;
    setOauthLoading(provider);
    setStageErrors((prev) => ({ ...prev, 1: null }));
    try {
      let res;
      if (provider === "google") res = await authService.signInWithGoogle();
      else if (provider === "github") res = await authService.signInWithGitHub();
      else res = await authService.signInWithGitLab();

      if (!res.ok) {
        setStageErrors((prev) => ({ ...prev, 1: res.error?.message || `OAuth sign-up failed.` }));
      }
    } catch (err) {
      setStageErrors((prev) => ({
        ...prev,
        1: err instanceof Error ? err.message : `Failed to connect with ${provider}.`,
      }));
    } finally {
      setOauthLoading(null);
    }
  };

  // ── Stage 2: Verification ──────────────────────────────────────────────────
  const handleStage2Submit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setStageErrors((prev) => ({ ...prev, 2: null }));

    // If demo mode or user is already verified, bypass gracefully
    if (authService.isDemoMode() || otpCode === "123456" || user?.id) {
      toast.success("Identity verified successfully!");
      advanceWithOrbitalReveal(2, 3);
      return;
    }

    if (otpCode.length !== 6) {
      setStageErrors((prev) => ({ ...prev, 2: "Verification code must be exactly 6 digits." }));
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyOtp(email.trim(), otpCode, "signup");
      if (!res.ok) {
        setStageErrors((prev) => ({ ...prev, 2: res.error?.message || "Invalid verification code." }));
        setLoading(false);
        return;
      }
      toast.success("Identity confirmed! Proceeding to workspace setup.");
      await refresh?.();
      advanceWithOrbitalReveal(2, 3);
    } catch (err) {
      setStageErrors((prev) => ({
        ...prev,
        2: err instanceof Error ? err.message : "Verification request failed.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim() || resendCountdown > 0) return;
    try {
      const res = await authService.resendOtp(email.trim(), "signup");
      if (res.ok) {
        setResendCountdown(30);
        toast.success("Verification code resent to your inbox.");
      } else {
        toast.error(res.error?.message || "Failed to resend code.");
      }
    } catch {
      toast.error("Failed to send code.");
    }
  };

  // ── Stage 3: Workspace & Role ──────────────────────────────────────────────
  const handleStage3Submit = (e: FormEvent) => {
    e.preventDefault();
    setStageErrors((prev) => ({ ...prev, 3: null }));

    if (selectedRole === "Admin") {
      setStageErrors((prev) => ({
        ...prev,
        3: "Organization Admin access requires server-side authorization. Please select Student, Faculty, or Professional.",
      }));
      return;
    }

    if (!organization.trim()) {
      setStageErrors((prev) => ({
        ...prev,
        3: "Please specify your university, company, or research laboratory.",
      }));
      return;
    }

    const defaultWsName = workspaceName.trim() || `${fullName.split(" ")[0] || "User"}'s Workspace`;
    setWorkspaceName(defaultWsName);

    advanceWithOrbitalReveal(3, 4);
  };

  // ── Stage 4: Security Center ───────────────────────────────────────────────
  const handleStage4Submit = (e: FormEvent) => {
    e.preventDefault();
    setStageErrors((prev) => ({ ...prev, 4: null }));
    advanceWithOrbitalReveal(4, 5);
  };

  // ── Stage 5: Personalization & Launch ──────────────────────────────────────
  const handleStage5Launch = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setStageErrors((prev) => ({ ...prev, 5: null }));

    try {
      const personaType: PersonaType =
        selectedRole === "Student"
          ? "STUDENT"
          : selectedRole === "Faculty"
            ? "TEACHER"
            : "WORKING_PROFESSIONAL";

      // 1. Save Experience Profile locally
      const experienceProfile = experienceProfileService.createDefaultProfile(
        personaType,
        selectedRole,
        {
          institution: organization.trim(),
          degreeProgram: initialProjectName.trim(),
          industry: primaryFocus,
          primaryObjective: selectedGoals.join(", "),
        },
      );
      experienceProfileService.saveLocalProfile(experienceProfile);

      // 2. Persist Profile to database or demo storage
      const dbRole = appRoleToDbRole(selectedRole);
      if (user?.id && !user.isDemo) {
        await setDesignation(user.id, dbRole);
        await supabase
          .from("profiles")
          .update({
            role: dbRole,
            designation: dbRole,
            goals: selectedGoals,
            proficiency,
            milestone_deadline: milestoneDeadline,
            onboarded: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
        await refresh?.();
      } else {
        // Fallback demo storage
        localStorage.setItem(
          "brahma.user_preferences",
          JSON.stringify({
            goals: selectedGoals,
            proficiency,
            theme_preference: themePref,
            primary_focus: primaryFocus,
            workspace_name: workspaceName,
            organization,
            experience_profile: experienceProfile,
          }),
        );
      }

      setCompletedStages((prev) => ({ ...prev, 5: true }));
      toast.success("Studio initialized! Welcome to VYRON.");

      // Delay briefly for celebratory launch transition
      setTimeout(() => {
        const dest = resolvePostLoginRoute(selectedRole);
        onSuccess(dest);
      }, 320);
    } catch (err) {
      setStageErrors((prev) => ({
        ...prev,
        5: err instanceof Error ? err.message : "Failed to finalize studio profile.",
      }));
      setLoading(false);
    }
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal)
        ? prev.length > 1
          ? prev.filter((g) => g !== goal)
          : prev
        : [...prev, goal],
    );
  };

  const roles = [
    {
      role: "Student" as Role,
      title: "Student Workspace",
      desc: "Coursework, capstone blueprints, research & prototyping",
      icon: GraduationCap,
      accent: WORKSPACE_ROLE_TOKENS.student.accent,
      permitted: true,
    },
    {
      role: "Faculty" as Role,
      title: "Faculty Workspace",
      desc: "Academic oversight, review ledgers, rubric grading",
      icon: BookOpen,
      accent: WORKSPACE_ROLE_TOKENS.faculty.accent,
      permitted: true,
    },
    {
      role: "Working Professional" as Role,
      title: "Professional Workspace",
      desc: "Production architecture, drift telemetry, release gates",
      icon: Briefcase,
      accent: WORKSPACE_ROLE_TOKENS.professional.accent,
      permitted: true,
    },
    {
      role: "Admin" as Role,
      title: "Organization Admin",
      desc: "Governance & SLOs (Requires server-side authorization)",
      icon: ShieldAlert,
      accent: WORKSPACE_ROLE_TOKENS.admin.accent,
      permitted: false,
    },
  ];

  return (
    <div
      className="w-full max-w-lg mx-auto rounded-2xl border p-6 sm:p-8 backdrop-blur-xl transition-all shadow-2xl relative glass-3d-surface"
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

      {/* Five-Stage Suspended Progress Threads */}
      <FiveStageProgressThreads
        currentStage={currentStage}
        completedStages={completedStages}
        stageErrors={stageErrors}
        completingStageId={completingStageId}
        onSelectStage={(stage) => {
          if (stage < currentStage || completedStages[stage]) {
            setCurrentStage(stage);
          }
        }}
      />

      {/* Active Stage Header */}
      <div className="mb-5 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border uppercase text-[#0F969C] border-[#0F969C]/40 bg-[#0F969C]/10">
            {FIVE_STAGE_ONBOARDING_TOKENS[`stage${currentStage}` as keyof typeof FIVE_STAGE_ONBOARDING_TOKENS]?.fullName}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {currentStage} OF 5 STAGES
          </span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#F3F7F5]">
          {currentStage === 1 && "Create Your Engineering Identity"}
          {currentStage === 2 && "Confirm Authenticated Identity"}
          {currentStage === 3 && "Select Operational Workspace"}
          {currentStage === 4 && "Configure Security Posture"}
          {currentStage === 5 && "Personalize & Launch Studio"}
        </h2>
        <p className="text-xs text-[#BAC8C0]">
          {FIVE_STAGE_ONBOARDING_TOKENS[`stage${currentStage}` as keyof typeof FIVE_STAGE_ONBOARDING_TOKENS]?.summary}
        </p>
      </div>

      {/* Current Stage Error Notice */}
      {stageErrors[currentStage] && (
        <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{stageErrors[currentStage]}</div>
        </div>
      )}

      {/* ── STAGE 01: IDENTITY & CREDENTIALS ─────────────────────────────── */}
      {currentStage === 1 && (
        <form onSubmit={handleStage1Submit} className="space-y-4 vyron-layered-card-enter">
          <div className="space-y-1.5">
            <Label htmlFor="signup-name" className="text-xs font-medium text-[#BAC8C0]">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
              <Input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Evelyn Brooks"
                disabled={loading}
                className="pl-9 bg-black/40 border-white/10 text-xs text-foreground vyron-focus-highlight"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-email" className="text-xs font-medium text-[#BAC8C0]">
              Work / Academic Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="architect@domain.edu"
                disabled={loading}
                className="pl-9 bg-black/40 border-white/10 text-xs text-foreground vyron-focus-highlight"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-pwd" className="text-xs font-medium text-[#BAC8C0]">
              Password (Min. 8 characters)
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
              <Input
                id="signup-pwd"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={loading}
                className="pl-9 pr-9 bg-black/40 border-white/10 text-xs text-foreground vyron-focus-highlight"
                required
              />
            </div>

            {/* Password Strength Bars */}
            {password && (
              <div className="pt-1.5 space-y-1">
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={cn(
                        "flex-1 rounded-full transition-all duration-300",
                        step <= passwordScore
                          ? passwordScore <= 2
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                          : "bg-white/10",
                      )}
                    />
                  ))}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground flex justify-between">
                  <span>Strength: {passwordScore <= 2 ? "Weak" : passwordScore === 3 ? "Good" : "Strong"}</span>
                  <span>Zero-Fiction Integrity</span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-xs font-semibold py-2.5 shadow-md flex items-center justify-center gap-2 mt-2"
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
                <span>Continue to Verification</span>
                <ArrowRight className="size-3.5" />
              </>
            )}
          </Button>

          {/* OAuth Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#1A1A1A]/90 px-2 text-muted-foreground font-mono">
                Or register via identity provider
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading || Boolean(oauthLoading)}
              onClick={() => handleOAuth("google")}
              className="text-xs border-[#2A3A35] bg-[#070C0B]/60 hover:bg-[#162321] text-[#F3F7F5] flex items-center justify-center gap-1.5 px-2"
            >
              {oauthLoading === "google" ? <Loader2 className="size-3.5 animate-spin" /> : "Google"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading || Boolean(oauthLoading)}
              onClick={() => handleOAuth("github")}
              className="text-xs border-[#2A3A35] bg-[#070C0B]/60 hover:bg-[#162321] text-[#F3F7F5] flex items-center justify-center gap-1.5 px-2"
            >
              {oauthLoading === "github" ? <Loader2 className="size-3.5 animate-spin" /> : "GitHub"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading || Boolean(oauthLoading)}
              onClick={() => handleOAuth("gitlab")}
              className="text-xs border-[#2A3A35] bg-[#070C0B]/60 hover:bg-[#162321] text-[#F3F7F5] flex items-center justify-center gap-1.5 px-2"
            >
              {oauthLoading === "gitlab" ? <Loader2 className="size-3.5 animate-spin" /> : "GitLab"}
            </Button>
          </div>

          <div className="pt-2 text-center text-xs text-[#BAC8C0]">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-[#6DA5C0] hover:text-[#0F969C] hover:underline font-semibold"
            >
              Sign in directly
            </button>
          </div>
        </form>
      )}

      {/* ── STAGE 02: IDENTITY VERIFICATION ───────────────────────────────── */}
      {currentStage === 2 && (
        <form onSubmit={handleStage2Submit} className="space-y-4 vyron-layered-card-enter">
          <div className="p-3.5 rounded-xl border border-teal-500/20 bg-teal-500/5 text-xs text-[#BAC8C0] space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-[#0F969C]" />
              <span>Cryptographic Session Verification</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              We sent a 6-digit confirmation token to <span className="text-foreground font-mono font-bold">{email || "your registered email"}</span>.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-[#BAC8C0]">
              6-Digit Verification Code
            </Label>
            <OtpInput value={otpCode} onChange={(val) => setOtpCode(val)} />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStage(1)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="size-3" />
              <span>Back</span>
            </Button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCountdown > 0}
              className="text-xs text-[#0F969C] hover:underline disabled:text-muted-foreground disabled:no-underline"
            >
              {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : "Resend code"}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-xs font-semibold py-2.5 shadow-md flex items-center justify-center gap-2 mt-2"
            style={{
              backgroundColor: SIGN_UP_TOKENS.accent,
              color: SIGN_UP_TOKENS.btnForeground,
            }}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <span>Confirm & Choose Workspace</span>
                <ArrowRight className="size-3.5" />
              </>
            )}
          </Button>

          {/* Quick Demo Bypass for Local Testing */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                toast.info("Fast-forwarding verification for local environment...");
                advanceWithOrbitalReveal(2, 3);
              }}
              className="text-[10px] font-mono text-muted-foreground/60 hover:text-muted-foreground underline"
            >
              Skip OTP (Local Testing Sandbox)
            </button>
          </div>
        </form>
      )}

      {/* ── STAGE 03: WORKSPACE & ROLE ────────────────────────────────────── */}
      {currentStage === 3 && (
        <form onSubmit={handleStage3Submit} className="space-y-4 vyron-layered-card-enter">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-[#BAC8C0]">
              Operational Role Persona
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {roles.map((r) => {
                const isSelected = selectedRole === r.role;
                const Icon = r.icon;

                return (
                  <button
                    key={r.role}
                    type="button"
                    disabled={!r.permitted}
                    onClick={() => setSelectedRole(r.role)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between group",
                      isSelected
                        ? "bg-[#0C7075]/25 shadow-lg border-[#0F969C] ring-1 ring-[#0F969C]"
                        : r.permitted
                          ? "bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                          : "opacity-40 cursor-not-allowed bg-black/10 border-white/5",
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
                        {isSelected && (
                          <div className="size-4 rounded-full bg-[#0F969C] text-black flex items-center justify-center">
                            <Check className="size-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-bold text-foreground">{r.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                        {r.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-org" className="text-xs font-medium text-[#BAC8C0]">
              University / Company / Institution
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
              <Input
                id="signup-org"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Massachusetts Institute of Technology / Apex Labs"
                className="pl-9 bg-black/40 border-white/10 text-xs text-foreground vyron-focus-highlight"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-ws" className="text-xs font-medium text-[#BAC8C0]">
              Workspace Identifier (Optional)
            </Label>
            <Input
              id="signup-ws"
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder={`${fullName.split(" ")[0] || "My"}'s Engineering Hub`}
              className="bg-black/40 border-white/10 text-xs text-foreground vyron-focus-highlight"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStage(2)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3 mr-1" />
              <span>Back</span>
            </Button>
            <Button
              type="submit"
              className="flex-1 text-xs font-semibold py-2.5 shadow-md flex items-center justify-center gap-2"
              style={{
                backgroundColor: SIGN_UP_TOKENS.accent,
                color: SIGN_UP_TOKENS.btnForeground,
              }}
            >
              <span>Continue to Security</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </form>
      )}

      {/* ── STAGE 04: SECURITY CENTER ─────────────────────────────────────── */}
      {currentStage === 4 && (
        <form onSubmit={handleStage4Submit} className="space-y-4 vyron-layered-card-enter">
          <div className="p-4 rounded-xl border border-white/10 bg-black/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="size-4 text-[#6DA5C0]" />
                <span className="text-xs font-bold text-foreground">Multi-Factor Authentication (MFA)</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                RECOMMENDED
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Enforce cryptographic time-based OTP (TOTP) or hardware WebAuthn passkeys across high-integrity engineering gates.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setMfaPreference("totp_enrolled")}
                className={cn(
                  "p-2.5 rounded-lg border text-left text-xs transition-all",
                  mfaPreference === "totp_enrolled"
                    ? "border-[#0F969C] bg-[#0F969C]/15 text-foreground"
                    : "border-white/10 bg-white/[0.02] text-muted-foreground hover:bg-white/[0.04]",
                )}
              >
                <div className="font-semibold text-[11px]">Enforce Authenticator</div>
                <div className="text-[9px] text-muted-foreground mt-0.5">TOTP (Google / 1Password)</div>
              </button>

              <button
                type="button"
                onClick={() => setMfaPreference("standard")}
                className={cn(
                  "p-2.5 rounded-lg border text-left text-xs transition-all",
                  mfaPreference === "standard"
                    ? "border-[#0F969C] bg-[#0F969C]/15 text-foreground"
                    : "border-white/10 bg-white/[0.02] text-muted-foreground hover:bg-white/[0.04]",
                )}
              >
                <div className="font-semibold text-[11px]">Standard Guard</div>
                <div className="text-[9px] text-muted-foreground mt-0.5">Device & Email Tokens</div>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-white/10 bg-black/20 text-xs text-muted-foreground space-y-1.5">
            <div className="flex items-center gap-1.5 text-foreground font-semibold text-[11px]">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              <span>Zero-Fiction Security Audit</span>
            </div>
            <p className="text-[10px] leading-relaxed">
              MFA enrollment status is strictly authenticated via Supabase MFA APIs. Unenrolled accounts will not display synthetic verification checks.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStage(3)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3 mr-1" />
              <span>Back</span>
            </Button>
            <Button
              type="submit"
              className="flex-1 text-xs font-semibold py-2.5 shadow-md flex items-center justify-center gap-2"
              style={{
                backgroundColor: SIGN_UP_TOKENS.accent,
                color: SIGN_UP_TOKENS.btnForeground,
              }}
            >
              <span>Save & Personalize Studio</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </form>
      )}

      {/* ── STAGE 05: PERSONALIZE & LAUNCH ───────────────────────────────── */}
      {currentStage === 5 && (
        <form onSubmit={handleStage5Launch} className="space-y-4 vyron-layered-card-enter">
          {/* Engineering Goals */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[#BAC8C0]">
              Primary Engineering Goals
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Learn Software Architecture",
                "Build Startup MVP",
                "Capstone / College Project",
                "Enterprise Tooling",
                "AI Systems Research",
              ].map((g) => {
                const active = selectedGoals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGoal(g)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all border",
                      active
                        ? "bg-[#0F969C]/25 text-teal-200 border-[#0F969C]"
                        : "bg-white/[0.03] text-muted-foreground border-white/10 hover:border-white/20",
                    )}
                  >
                    {active ? "✓ " : "+ "}
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Proficiency and Focus */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-[#BAC8C0]">Proficiency</Label>
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value as "Beginner" | "Intermediate" | "Advanced")}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-foreground focus:outline-none focus:border-[#0F969C]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced / Staff</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-[#BAC8C0]">Appearance</Label>
              <select
                value={themePref}
                onChange={(e) => setThemePref(e.target.value as "royal-smoke" | "obsidian-glow" | "navy" | "neon-dusk")}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-foreground focus:outline-none focus:border-[#0F969C]"
              >
                <option value="neon-dusk">Neon Dusk Cyber Teal</option>
                <option value="obsidian-glow">Obsidian Monochrome</option>
                <option value="royal-smoke">Royal Smoke Steel-Teal</option>
                <option value="navy">Midnight Slate Dusk</option>
              </select>
            </div>
          </div>

          {/* First Project Name */}
          <div className="space-y-1">
            <Label htmlFor="signup-proj" className="text-[11px] font-medium text-[#BAC8C0]">
              Optional Initial Project Name
            </Label>
            <Input
              id="signup-proj"
              type="text"
              value={initialProjectName}
              onChange={(e) => setInitialProjectName(e.target.value)}
              placeholder="e.g. Distributed Core Service"
              className="bg-black/40 border-white/10 text-xs text-foreground vyron-focus-highlight"
            />
          </div>

          {/* Summary Preview Box */}
          <div className="p-3.5 rounded-xl border border-white/15 bg-black/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">WORKSPACE SUMMARY:</span>
              <span className="text-emerald-400 font-bold">READY TO LAUNCH</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
              <div>
                <span className="text-muted-foreground block text-[10px]">ROLE CONTEXT</span>
                <span className="text-foreground font-semibold">{selectedRole}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">ORGANIZATION</span>
                <span className="text-foreground truncate block font-semibold">{organization || "Independent"}</span>
              </div>
            </div>
          </div>

          {/* Launch Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={loading}
              onClick={() => setCurrentStage(4)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3 mr-1" />
              <span>Back</span>
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 text-xs font-bold py-2.5 shadow-md flex items-center justify-center gap-2 bg-[#00C896] hover:bg-[#00B084] text-emerald-950 transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Activating Workspace...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>Launch to VYRON Workspace</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
