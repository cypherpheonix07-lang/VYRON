import React, { useState, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { SIGN_IN_TOKENS } from "@/styles/vyron-auth-tokens";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DemoAccessButton } from "@/components/auth/auth-components";
import { cn } from "@/lib/utils";

interface MidnightCoralSignInProps {
  onSuccess: (destination?: string) => void;
  onSwitchToSignUp: () => void;
  onSwitchToWorkspace?: () => void;
}

export function MidnightCoralSignIn({
  onSuccess,
  onSwitchToSignUp,
  onSwitchToWorkspace,
}: MidnightCoralSignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setFormError(null);
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setFormError("Please enter your email address.");
      return;
    }
    if (!password) {
      setFormError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.signInWithPassword(cleanEmail, password);
      if (!res.ok) {
        setFormError(res.error?.message || "Sign in failed. Please verify credentials.");
        return;
      }
      toast.success("Welcome back to VYRON Workspace!");
      onSuccess();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github" | "gitlab") => {
    if (oauthLoading || loading) return;
    setOauthLoading(provider);
    setFormError(null);
    try {
      let res;
      if (provider === "google") res = await authService.signInWithGoogle();
      else if (provider === "github") res = await authService.signInWithGithub();
      else res = await authService.signInWithGitlab();

      if (!res.ok) {
        setFormError(res.error?.message || `OAuth sign-in with ${provider} failed.`);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : `Failed to connect with ${provider}.`);
    } finally {
      setOauthLoading(null);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await authService.resetPasswordForEmail(forgotEmail.trim());
      if (res.ok) {
        setForgotSuccess(true);
        toast.success("Password reset instructions sent to your inbox.");
      } else {
        toast.error(res.error?.message || "Failed to send reset email.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md mx-auto rounded-2xl border p-6 sm:p-8 backdrop-blur-xl transition-all shadow-2xl relative"
      style={{
        backgroundColor: SIGN_IN_TOKENS.surface,
        borderColor: SIGN_IN_TOKENS.border,
      }}
    >
      {/* Top Accent Coral Bar */}
      <div
        className="absolute top-0 left-8 right-8 h-1 rounded-b"
        style={{
          background: `linear-gradient(90deg, transparent, ${SIGN_IN_TOKENS.accent}, transparent)`,
        }}
      />

      {/* Header */}
      <div className="mb-6 space-y-1.5">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border uppercase"
            style={{
              color: SIGN_IN_TOKENS.accent,
              borderColor: `${SIGN_IN_TOKENS.accent}40`,
              backgroundColor: `${SIGN_IN_TOKENS.accent}12`,
            }}
          >
            {SIGN_IN_TOKENS.themeName}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">Secured AST Access</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#F3F7F5]">
          Welcome Back to VYRON
        </h2>
        <p className="text-xs text-[#BAC8C0]">
          Enter your credentials to access engineering intelligence and digital twin telemetry.
        </p>
      </div>

      {/* Error Alert */}
      {formError && (
        <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{formError}</div>
        </div>
      )}

      {showForgotPassword ? (
        /* Forgot Password View */
        <div className="space-y-4">
          {forgotSuccess ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-2">
              <ShieldCheck className="size-8 text-emerald-400 mx-auto" />
              <p className="text-xs text-emerald-300 font-medium">
                Reset link sent! Please check your email inbox to continue.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotSuccess(false);
                }}
                className="mt-2 text-xs"
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="forgot-email" className="text-xs font-medium text-[#BAC8C0]">
                  Enter Account Email
                </Label>
                <Input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="architect@domain.com"
                  className="bg-[#070C0B] border-[#2A3A35] text-xs text-[#F3F7F5]"
                  required
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading}
                  className="flex-1 text-xs font-semibold"
                  style={{
                    backgroundColor: SIGN_IN_TOKENS.accent,
                    color: SIGN_IN_TOKENS.btnForeground,
                  }}
                >
                  {loading ? <Loader2 className="size-3.5 animate-spin" /> : "Send Reset Link"}
                </Button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Standard Sign-In Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <Label htmlFor="signin-email" className="text-xs font-medium text-[#BAC8C0]">
              Work / Academic Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
              <Input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@institution.edu"
                disabled={loading}
                className="pl-9 bg-[#070C0B] border-[#2A3A35] text-xs text-[#F3F7F5] focus-visible:ring-1 focus-visible:ring-[#FF9A8B]"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="signin-password" className="text-xs font-medium text-[#BAC8C0]">
                Password
              </Label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[11px] font-medium text-[#FF9A8B] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
              <Input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={loading}
                className="pl-9 pr-9 bg-[#070C0B] border-[#2A3A35] text-xs text-[#F3F7F5] focus-visible:ring-1 focus-visible:ring-[#FF9A8B]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-xs font-semibold py-2.5 transition-all shadow-md mt-2 flex items-center justify-center gap-2"
            style={{
              backgroundColor: SIGN_IN_TOKENS.accent,
              color: SIGN_IN_TOKENS.btnForeground,
              boxShadow: `0 4px 16px -2px ${SIGN_IN_TOKENS.accentGlow}`,
            }}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <span>Sign In to VYRON Workspace</span>
                <ArrowRight className="size-3.5" />
              </>
            )}
          </Button>

          {/* OAuth Providers Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A3A35]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#101A18] px-2 text-muted-foreground font-mono">
                Or authenticate with
              </span>
            </div>
          </div>

          {/* OAuth Provider Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading || Boolean(oauthLoading)}
              onClick={() => handleOAuth("google")}
              aria-label="Sign in with Google"
              className="text-xs border-[#2A3A35] bg-[#070C0B]/60 hover:bg-[#162321] text-[#F3F7F5] flex items-center justify-center gap-1.5 px-2"
            >
              {oauthLoading === "google" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.7c-.2-.7-.4-1.6-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
                  />
                </svg>
              )}
              <span>Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading || Boolean(oauthLoading)}
              onClick={() => handleOAuth("github")}
              aria-label="Sign in with GitHub"
              className="text-xs border-[#2A3A35] bg-[#070C0B]/60 hover:bg-[#162321] text-[#F3F7F5] flex items-center justify-center gap-1.5 px-2"
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
              disabled={loading || Boolean(oauthLoading)}
              onClick={() => handleOAuth("gitlab")}
              aria-label="Sign in with GitLab"
              className="text-xs border-[#2A3A35] bg-[#070C0B]/60 hover:bg-[#162321] text-[#F3F7F5] flex items-center justify-center gap-1.5 px-2"
            >
              {oauthLoading === "gitlab" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#E24329"
                    d="m23.6 9.6-1.5-4.5c-.2-.5-.8-.8-1.3-.5l-2.4 1.8L12 .3l-6.4 6.1-2.4-1.8c-.5-.3-1.1-.1-1.3.5L.4 9.6c-.2.6 0 1.2.5 1.6l11.1 8.2 11.1-8.2c.5-.4.7-1 .5-1.6z"
                  />
                  <path fill="#FC6D26" d="M12 19.4 5.6 6.4h12.8L12 19.4z" />
                  <path fill="#FCA326" d="M12 19.4 5.6 6.4.4 9.6c-.2.6 0 1.2.5 1.6l11.1 8.2z" />
                  <path fill="#FCA326" d="M12 19.4 18.4 6.4 23.6 9.6c.2.6 0 1.2-.5 1.6l-11.1 8.2z" />
                </svg>
              )}
              <span>GitLab</span>
            </Button>
          </div>

          {/* Switch to Registration */}
          <div className="pt-2 text-center text-xs text-[#BAC8C0]">
            <span>Don&apos;t have an account? </span>
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-[#FF9A8B] hover:underline font-semibold"
            >
              Create one now (3-Stage)
            </button>
          </div>

          {/* Offline / Demo God-Mode Access */}
          <div className="pt-2 border-t border-[#2A3A35]/60">
            <DemoAccessButton
              onSelect={(demoSession) => {
                toast.success(`Access granted as ${demoSession.user.name} (${demoSession.user.role})`);
                onSuccess();
              }}
            />
          </div>
        </form>
      )}
    </div>
  );
}
