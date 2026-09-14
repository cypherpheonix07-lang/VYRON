import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Loader2, Chrome, Github } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { useAuth } from "../lib/auth";
import { authService } from "../services/authService";
import { cn } from "../lib/utils";
import {
  AuthLayout,
  AuthMethodTabs,
  PasswordInput,
  TwoFactorStep,
  SsoForm,
  PasskeyButton,
  MagicLinkSent,
  RateLimitBanner,
  DemoAccessButton,
  FieldError,
} from "../components/auth/auth-components";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Sign in to PROJECT BRAHMA to review blueprints, code health, security and delivery risk.",
      },
      { property: "og:title", content: "Sign in — PROJECT BRAHMA" },
      { property: "og:description", content: "Access your engineering intelligence workspace." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, ready, refresh } = useAuth();

  // Form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicEmail, setMagicEmail] = useState("");
  const [activeMethod, setActiveMethod] = useState("password");

  // States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 2FA Flow states
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Handle OAuth error params in URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");
    const errorCode = params.get("error_code");

    if (error || errorDescription) {
      const errorMessages: Record<string, string> = {
        access_denied: "Sign in was cancelled. Please try again.",
        server_error: "Authentication server error. Please try again.",
        temporarily_unavailable: "Service temporarily unavailable.",
        "403": "Your email is not authorized. Contact support.",
      };

      const message =
        errorMessages[errorCode || error || ""] ||
        errorDescription ||
        "Sign in failed. Please try again.";

      setFormError(message);
      toast.error(message);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (ready && user) {
      const rawTarget =
        sessionStorage.getItem("brahma_auth_redirect") ||
        sessionStorage.getItem("auth_redirect");
      let safeRedirect: string | null = null;
      if (rawTarget && rawTarget.startsWith("/") && !rawTarget.startsWith("//")) {
        safeRedirect = rawTarget;
        sessionStorage.removeItem("brahma_auth_redirect");
        sessionStorage.removeItem("auth_redirect");
      }

      if (!user.onboarded) {
        navigate({ to: "/onboarding", replace: true });
      } else {
        navigate({ to: (safeRedirect || "/app") as "/app", replace: true });
      }
    }
  }, [ready, user, navigate]);

  // Sync countdown for magic link email
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    return;
  }, [countdown]);

  // Password Sign In
  const handlePasswordSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setErrors({});

    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        next[String(issue.path[0])] = issue.message;
      }
      setErrors(next);
      return;
    }

    if (loginAttempts >= 5) {
      setRateLimitError(
        "Rate limit exceeded. Your account has been temporarily rate-limited due to multiple invalid password attempts. Please wait 60 seconds before trying again.",
      );
      return;
    }

    setLoading(true);
    try {
      const result = await authService.signInWithPassword(email, password);

      if (!result.ok) {
        setLoginAttempts((prev) => prev + 1);
        const code = result.error?.code;
        if (code === "email_not_confirmed") {
          setFormError("email-not-confirmed");
        } else {
          setFormError(result.error?.message ?? "Sign-in failed.");
        }
        return;
      }

      toast.success("Welcome back!");
      await refresh();
    } catch (err) {
      setFormError((err as Error).message || "An unexpected error occurred during sign-in.");
    } finally {
      setLoading(false);
    }
  };

  // Magic Link Sign In
  const handleMagicLinkSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!magicEmail.trim() || !magicEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const result = await authService.signInWithOtp(magicEmail);
      if (!result.ok) {
        toast.error(result.error?.message ?? "Failed to send magic link.");
      } else {
        setMagicLinkSent(true);
        setCountdown(30);
        toast.success("Magic link sent!");
      }
    } catch (err) {
      toast.error((err as Error).message || "Failed to send magic link.");
    } finally {
      setLoading(false);
    }
  };

  // SSO Sign In
  const handleSSOSignIn = async (domain: string) => {
    setLoading(true);
    try {
      const result = await authService.signInWithSSO(domain);
      if (!result.ok) {
        toast.error(result.error?.message ?? "SSO initialization failed.");
      }
    } catch (err) {
      toast.error("SSO initialization failed.");
    } finally {
      setLoading(false);
    }
  };

  // Passkey Sign In
  const handlePasskeySignIn = async () => {
    setLoading(true);
    try {
      const result = await authService.signInWithPasskey();
      if (!result.ok) {
        toast.error(result.error?.message ?? "Passkey authentication failed.");
      } else {
        toast.success("Passkey authentication successful!");
        await refresh();
      }
    } catch (err) {
      toast.error("Passkey authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  // OAuth Sign In
  const handleOAuthLogin = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    setFormError(null);
    toast.loading(`Redirecting to ${provider === "google" ? "Google" : "GitHub"}...`, {
      id: "oauth-redirect",
    });
    try {
      const result = await authService.signInWithOAuth(provider);
      if (!result.ok) {
        toast.dismiss("oauth-redirect");
        const msg = result.error?.message ?? "OAuth redirect failed.";
        setFormError(msg);
        toast.error(msg);
      }
    } catch (err) {
      toast.dismiss("oauth-redirect");
      const msg = (err as Error).message || "OAuth redirect failed.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setOauthLoading(null);
    }
  };

  // Seed local demo user
  const handleDemoSelect = async (role: "Admin" | "Faculty" | "Student") => {
    setLoading(true);
    try {
      const demoEmail = `${role.toLowerCase()}.demo@brahma.dev`;
      const localDemoSession = {
        access_token: "demo-token-" + Date.now(),
        refresh_token: "demo-refresh-token",
        expires_at: Math.floor(Date.now() / 1000) + 86400,
        user: {
          id: `demo-${role.toLowerCase()}-uuid`,
          email: demoEmail,
          name:
            role === "Admin"
              ? "Priya Nair"
              : role === "Faculty"
                ? "Dr. Arjun Mehta"
                : "Student User",
          role: (role === "Admin" ? "admin" : role === "Faculty" ? "faculty" : "student") as any,
          onboarded: true,
          isDemo: true,
        },
      };
      localStorage.setItem("brahma_demo_session", JSON.stringify(localDemoSession));
      localStorage.setItem("brahma_demo_mode", "true");
      toast.success(`Welcome to DEMO Workspace (${role})`);
      await refresh();
      window.location.href = "/app/admin/models";
    } catch (err) {
      toast.error("Failed to seed demo session.");
    } finally {
      setLoading(false);
    }
  };

  if (showTwoFactor) {
    return (
      <AuthLayout
        title="Verify Identity"
        subtitle="Enter your two-factor security details to access Project Brahma."
      >
        <TwoFactorStep
          onVerify={async (code) => {
            setLoading(true);
            try {
              // Mock/Supabase verification
              const result = await authService.verifyOtp(email, code, "magiclink");
              if (!result.ok) {
                toast.error(result.error?.message ?? "Verification failed.");
              } else {
                toast.success("Security verification passed!");
                await refresh();
              }
            } catch (err) {
              toast.error("Verification failed.");
            } finally {
              setLoading(false);
            }
          }}
          onCancel={() => setShowTwoFactor(false)}
          loading={loading}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Sign In" subtitle="Sign in to your Project Brahma workspace.">
      <div className="space-y-6">
        {/* Method tabs switcher */}
        <AuthMethodTabs activeTab={activeMethod} onChange={setActiveMethod} />

        {rateLimitError && <RateLimitBanner errorMsg={rateLimitError} />}

        {formError && (
          <div className="p-3 border border-red-500/20 bg-red-500/5 text-red-400 text-xs rounded-lg flex items-start gap-2">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div>
              {formError === "email-not-confirmed" ? (
                <div className="space-y-1.5">
                  <p className="font-semibold">Email address not confirmed</p>
                  <p className="text-slate-400">Please confirm your email address to log in.</p>
                  <div className="flex gap-2 pt-1">
                    <Button
                      onClick={async () => {
                        if (!email) return;
                        await authService.resendOtp(email, "signup").catch(() => undefined);
                        toast.success("Confirmation code resent!");
                      }}
                      variant="outline"
                      size="sm"
                      className="border-slate-800 text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      Resend Code
                    </Button>
                    <Button
                      onClick={() => {
                        navigate({
                          to: "/verify-email",
                          search: { email: email.trim() } as never,
                        });
                      }}
                      size="sm"
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs"
                    >
                      Enter Code
                    </Button>
                  </div>
                </div>
              ) : (
                <p>{formError}</p>
              )}
            </div>
          </div>
        )}

        {/* Password sign-in form */}
        {activeMethod === "password" && (
          <form onSubmit={handlePasswordSignIn} className="space-y-4" id="panel-password">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300 font-medium text-xs">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="developer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus-visible:ring-cyan-500 rounded-lg text-sm",
                  errors["email"] && "border-red-500 focus-visible:ring-red-500",
                )}
                aria-invalid={!!errors["email"]}
              />
              <FieldError message={errors["email"]} />
            </div>

            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors["password"]}
              placeholder="••••••••••••"
            />

            <div className="flex justify-between items-center text-xs">
              <Link
                to="/forgot-password"
                className="text-cyan-400/80 hover:text-cyan-400 underline font-semibold select-none"
              >
                Forgot password?
              </Link>
              {authService.isDemoMode() && (
                <button
                  type="button"
                  onClick={() => setShowTwoFactor(true)}
                  className="text-slate-500 hover:text-slate-300 underline font-mono text-[10px]"
                >
                  Test 2FA Step
                </button>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg py-2 transition-all duration-200 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                "Sign In to Project Brahma"
              )}
            </Button>
          </form>
        )}

        {/* Magic Link sign-in form */}
        {activeMethod === "magic" && (
          <div id="panel-magic">
            {magicLinkSent ? (
              <MagicLinkSent
                email={magicEmail}
                countdown={countdown}
                onResend={async () => {
                  await authService.signInWithOtp(magicEmail);
                  setCountdown(30);
                  toast.success("Magic link resent!");
                }}
              />
            ) : (
              <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="magicEmail" className="text-slate-300 font-medium text-xs">
                    Email Address
                  </Label>
                  <Input
                    id="magicEmail"
                    type="email"
                    placeholder="developer@company.com"
                    value={magicEmail}
                    onChange={(e) => setMagicEmail(e.target.value)}
                    className="bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus-visible:ring-cyan-500 rounded-lg text-sm"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg py-2"
                >
                  {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : "Send Magic Link"}
                </Button>
              </form>
            )}
          </div>
        )}

        {/* SSO Sign In */}
        {activeMethod === "sso" && (
          <div id="panel-sso">
            <SsoForm onSubmit={handleSSOSignIn} loading={loading} />
          </div>
        )}

        {/* Passkey Sign In */}
        {activeMethod === "passkey" && (
          <div id="panel-passkey">
            <PasskeyButton onClick={handlePasskeySignIn} loading={loading} />
          </div>
        )}

        {/* Separator */}
        <div className="relative flex items-center justify-center my-4 select-none">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-900" />
          </div>
          <span className="relative px-3 bg-[var(--surface-base)] text-[10px] uppercase font-mono font-bold tracking-widest text-slate-500">
            Or continue with
          </span>
        </div>

        {/* OAuth grid */}
        {(authService.isOAuthProviderEnabled("google") ||
          authService.isOAuthProviderEnabled("github")) && (
          <div className="grid grid-cols-2 gap-3">
            {authService.isOAuthProviderEnabled("google") && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthLogin("google")}
                disabled={oauthLoading !== null}
                className="border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2"
                aria-label="Sign in with Google"
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
                onClick={() => handleOAuthLogin("github")}
                disabled={oauthLoading !== null}
                className="border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2"
                aria-label="Sign in with GitHub"
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
        )}

        {/* Register redirection */}
        <div className="text-center text-xs text-slate-400">
          <span>Don&apos;t have an account? </span>
          <Link
            to="/register"
            className="text-cyan-400/80 hover:text-cyan-400 underline font-semibold select-none"
          >
            Create one now
          </Link>
        </div>

        {/* Demo trigger */}
        {authService.isDemoMode() && <DemoAccessButton onSelect={handleDemoSelect} />}
      </div>
    </AuthLayout>
  );
}
