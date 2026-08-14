import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Chrome,
  Github,
} from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { useAuth } from "../lib/auth";
import { authService } from "../services/authService";
import { AuthLayout, FieldError } from "./login";
import {
  PasswordInput,
  StrengthMeter,
  ChecklistChips,
  OtpInput,
  RoleCardGrid,
  GoalChipSelector,
  TeamSizeSelector,
  WorkspaceSlugField,
  InviteTeammatesField,
  InviteCodeField,
  WizardProgressRail,
  ResendCountdown,
} from "../components/auth/auth-components";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { type Role } from "../lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create an account — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Create a PROJECT BRAHMA account to turn project ideas into validated blueprints.",
      },
      { property: "og:title", content: "Create an account — PROJECT BRAHMA" },
      {
        property: "og:description",
        content: "Start with a validated blueprint instead of an unvalidated backlog.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { user, ready, refresh } = useAuth();

  // Wizard Step
  const [step, setStep] = useState(1);

  // Step 1: Account
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Step 2: Role & Context
  const [selectedRole, setSelectedRole] = useState<Role>("Student");
  const [organization, setOrganization] = useState("");
  const [teamSize, setTeamSize] = useState("Solo operator (1)");

  // Step 3: Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [technicalLevel, setTechnicalLevel] = useState("Beginner");
  const [targetDeadline, setTargetDeadline] = useState("");

  // Step 4: Workspace
  const [workspaceName, setWorkspaceName] = useState("");
  const [teammateEmails, setTeammateEmails] = useState<string[]>([]);
  const [themePreference, setThemePreference] = useState("dark");
  const [inviteCode, setInviteCode] = useState("");

  // Step 5: Verify Email
  const [otpCode, setOtpCode] = useState("");
  const [verificationError, setVerificationError] = useState("");

  // Errors & States
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const handleOAuthRegister = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    toast.loading(`Redirecting to ${provider === "google" ? "Google" : "GitHub"}...`, {
      id: "oauth-register-redirect",
    });
    try {
      const { error } = await authService.signInWithOAuth(provider);
      if (error) {
        toast.dismiss("oauth-register-redirect");
        toast.error(error.message);
      }
    } catch (err) {
      toast.dismiss("oauth-register-redirect");
      toast.error((err as Error).message || "OAuth redirect failed.");
    } finally {
      setOauthLoading(null);
    }
  };

  // Redirect if already authenticated and onboarded
  useEffect(() => {
    if (ready && user) {
      if (user.onboarded) {
        navigate({ to: "/app", replace: true });
      } else {
        navigate({ to: "/onboarding", replace: true });
      }
    }
  }, [ready, user, navigate]);

  // Live password strength calculation
  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setPasswordStrength(score);
  }, [password]);

  // Handle next step validation
  const validateStep = () => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!fullName.trim()) errs["fullName"] = "Full name is required.";
      if (!email.trim() || !email.includes("@")) errs["email"] = "Enter a valid email address.";
      if (password.length < 8) errs["password"] = "Password must be at least 8 characters.";
    } else if (step === 2) {
      if (!organization.trim())
        errs["organization"] = "Organization or department name is required.";
    } else if (step === 4) {
      if (!workspaceName.trim()) errs["workspaceName"] = "Workspace name is required.";
    }

    setStepErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Step 4 Complete: Trigger registration
  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      const { data, error } = await authService.signUp(email, password, {
        data: {
          full_name: fullName,
          role: selectedRole.toLowerCase(),
          organization,
          team_size: teamSize,
          technical_level: technicalLevel,
          goals: selectedGoals,
          target_deadline: targetDeadline,
          workspace_name: workspaceName,
          invite_code: inviteCode,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! A confirmation code has been sent.");
        setStep(5); // Go to verification
        setCountdown(30);
      }
    } catch (err) {
      toast.error((err as Error).message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  // Step 5 Complete: Verify Email OTP code
  const handleVerificationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setVerificationError("");

    if (otpCode.length !== 6) {
      setVerificationError("Verification code must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authService.verifyOtp(email, otpCode, "signup");
      if (error) {
        setVerificationError(error.message);
        toast.error(error.message);
      } else {
        toast.success("Account confirmed successfully!");
        await refresh();
        navigate({ to: "/onboarding" });
      }
    } catch (err) {
      setVerificationError("Failed to verify code.");
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    "Create Account",
    "Select Your Role",
    "Define Your Goals",
    "Setup Workspace",
    "Verify Email",
  ];

  const stepSubtitles = [
    "Enter your details to register and scaffold your architecture.",
    "Help us tailor the experience by choosing your workspace role.",
    "Tell us about your technical stack goals and project milestones.",
    "Create your repository workspace context and invite teammates.",
    "Verify your account via the 6-digit confirmation code sent to you.",
  ];

  return (
    <AuthLayout title={stepTitles[step - 1] || "Register"} subtitle={stepSubtitles[step - 1] || ""}>
      <div className="space-y-6">
        <WizardProgressRail currentStep={step} />

        {/* STEP 1: Account */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-slate-300 font-medium text-xs">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="e.g. Priya Nair"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={stepErrors["fullName"] ? "border-red-500" : ""}
              />
              <FieldError message={stepErrors["fullName"]} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300 font-medium text-xs">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. developer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={stepErrors["email"] ? "border-red-500" : ""}
              />
              <FieldError message={stepErrors["email"]} />
            </div>

            <div className="space-y-2">
              <PasswordInput
                id="password"
                label="Choose Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={stepErrors["password"]}
                placeholder="••••••••••••"
              />
              {password && (
                <div className="space-y-2">
                  <StrengthMeter score={passwordStrength} />
                  <ChecklistChips value={password} />
                </div>
              )}
            </div>

            <Button
              type="button"
              onClick={handleNext}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg py-2 mt-2"
            >
              Continue <ArrowRight className="size-4 ml-1.5 shrink-0" />
            </Button>

            {/* OAuth separator and grid */}
            {(authService.isOAuthProviderEnabled("google") ||
              authService.isOAuthProviderEnabled("github")) && (
              <>
                <div className="relative flex items-center justify-center my-3 select-none">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-900" />
                  </div>
                  <span className="relative px-3 bg-[#0c1322] text-[10px] uppercase font-mono font-bold tracking-widest text-slate-500">
                    Or sign up with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {authService.isOAuthProviderEnabled("google") && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOAuthRegister("google")}
                      disabled={oauthLoading !== null}
                      className="border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2"
                      aria-label="Sign up with Google"
                    >
                      {oauthLoading === "google" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <>
                          <Chrome className="size-4 text-red-400" />
                          <span>Google</span>
                        </>
                      )}
                    </Button>
                  )}
                  {authService.isOAuthProviderEnabled("github") && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOAuthRegister("github")}
                      disabled={oauthLoading !== null}
                      className="border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2"
                      aria-label="Sign up with GitHub"
                    >
                      {oauthLoading === "github" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <>
                          <Github className="size-4 text-slate-300" />
                          <span>GitHub</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 2: Role & Context */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <RoleCardGrid selected={selectedRole} onChange={setSelectedRole} />

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="organization" className="text-slate-300 font-medium text-xs">
                School, Cohort, or Organization
              </Label>
              <Input
                id="organization"
                type="text"
                placeholder="e.g. MIT, Startup Sandbox, Brahma Corp"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className={stepErrors["organization"] ? "border-red-500" : ""}
              />
              <FieldError message={stepErrors["organization"]} />
            </div>

            <TeamSizeSelector value={teamSize} onChange={setTeamSize} />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1 border-slate-800 hover:bg-slate-900 text-xs"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
              >
                Continue <ArrowRight className="size-4 ml-1.5 shrink-0" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Goals */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <GoalChipSelector selected={selectedGoals} onChange={setSelectedGoals} />

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="technicalLevel" className="text-slate-300 font-medium text-xs">
                Technical Proficiency Level
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {["Beginner", "Intermediate", "Advanced"].map((level) => {
                  const isSel = technicalLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setTechnicalLevel(level)}
                      className={`py-2 border text-xs font-semibold rounded-lg text-center transition-all ${
                        isSel
                          ? "bg-slate-900 border-cyan-500 text-cyan-400"
                          : "bg-slate-950/20 border-slate-850 text-slate-500 hover:border-slate-800"
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="deadline" className="text-slate-300 font-medium text-xs">
                Target Blueprint Milestone Deadline (Optional)
              </Label>
              <Input
                id="deadline"
                type="date"
                value={targetDeadline}
                onChange={(e) => setTargetDeadline(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white focus-visible:ring-cyan-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1 border-slate-800 hover:bg-slate-900 text-xs"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
              >
                Continue <ArrowRight className="size-4 ml-1.5 shrink-0" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Workspace */}
        {step === 4 && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fadeIn">
            <WorkspaceSlugField
              value={workspaceName}
              onChange={setWorkspaceName}
              error={stepErrors["workspaceName"]}
            />

            <InviteTeammatesField emails={teammateEmails} onChange={setTeammateEmails} />

            <div className="space-y-1.5 pt-1">
              <Label className="text-slate-300 font-medium text-xs">
                Interface Theme Preference
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {["dark", "light"].map((theme) => {
                  const isSel = themePreference === theme;
                  return (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => setThemePreference(theme)}
                      className={`py-2 border text-xs font-semibold rounded-lg text-center transition-all ${
                        isSel
                          ? "bg-slate-900 border-cyan-500 text-cyan-400"
                          : "bg-slate-950/20 border-slate-850 text-slate-500 hover:border-slate-800"
                      }`}
                    >
                      {theme === "dark" ? "Deep Navy (Dark)" : "Clean Slate (Light)"}
                    </button>
                  );
                })}
              </div>
            </div>

            <InviteCodeField value={inviteCode} onChange={setInviteCode} />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1 border-slate-800 hover:bg-slate-900 text-xs"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.15)]"
              >
                {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : "Complete Setup"}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 5: Verify Email */}
        {step === 5 && (
          <form onSubmit={handleVerificationSubmit} className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="mx-auto size-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 animate-pulse">
                <Sparkles className="size-6" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                We sent a 6-digit confirmation code to{" "}
                <strong className="text-slate-200">{email}</strong>. Enter it below to verify and
                activate your workspace.
              </p>
            </div>

            <OtpInput
              value={otpCode}
              onChange={(val) => setOtpCode(val)}
              error={verificationError}
            />

            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg py-2"
              >
                {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : "Confirm and Launch"}
              </Button>

              <div className="text-center">
                <ResendCountdown
                  initialSeconds={countdown}
                  onTrigger={async () => {
                    await authService.resendOtp(email, "signup");
                    setCountdown(30);
                    toast.success("Confirmation code resent!");
                  }}
                />
              </div>
            </div>
          </form>
        )}

        {/* Back to Login link */}
        {step < 5 && (
          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-900">
            <span>Already have a workspace account? </span>
            <Link
              to="/login"
              className="text-cyan-400/80 hover:text-cyan-400 underline font-semibold select-none"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
