import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Loader2,
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
} from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { useAuthSession } from "@/lib/auth";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrahmaLogo } from "@/components/brahma/logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Authenticate — STARK / PROJECT BRAHMA" },
      {
        name: "description",
        content: "Sign in or create an account for engineering intelligence workspace access.",
      },
    ],
  }),
  component: UnifiedAuthPage,
});

const signInSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
  role: z.enum(["student", "faculty", "startup", "admin", "reviewer"]).default("student"),
});

function SetupErrorCard() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-foreground shadow-2xl backdrop-blur">
      <div className="flex items-center gap-3 border-b border-destructive/20 pb-4">
        <div className="grid size-10 place-items-center rounded-xl bg-destructive/20 text-destructive">
          <AlertCircle className="size-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold">Supabase Environment Missing</h2>
          <p className="text-xs text-muted-foreground">Configuration required to start</p>
        </div>
      </div>
      <div className="space-y-3 pt-4 text-xs text-muted-foreground leading-relaxed">
        <p>
          The application cannot establish a secure connection because Supabase environment variables
          are not defined.
        </p>
        <div className="rounded-lg bg-zinc-950/80 p-3 font-mono text-[11px] text-zinc-300 border border-border/60 space-y-1">
          <p className="text-zinc-500"># 1. Copy sample environment file</p>
          <p className="text-primary">cp .env.example .env.local</p>
          <p className="text-zinc-500 pt-1"># 2. Add your Supabase project keys</p>
          <p>VITE_SUPABASE_URL=https://hbbunfizlwgvripgwzdo.supabase.co</p>
          <p>VITE_SUPABASE_ANON_KEY=sb_publishable_RwMBCD1LJxI4927JDU5fbQ_0tfswec4your-anon-key</p>
        </div>
        <p className="text-[11px] text-zinc-400">
          Once configured, restart the dev server with <code className="text-primary font-mono">npm run dev</code>.
        </p>
      </div>
    </div>
  );
}

function UnifiedAuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, ready } = useAuthSession();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sign in form state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign up form state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpRole, setSignUpRole] = useState<"student" | "faculty" | "startup">("student");

  // Magic link state
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Check if Supabase keys exist
  const hasSupabaseKeys = Boolean(
    import.meta.env["VITE_SUPABASE_URL"] &&
      (import.meta.env["VITE_SUPABASE_ANON_KEY"] || import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"]),
  );

  // Handle OAuth error params in URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");
    const errorCode = params.get("error_code");

    if (error || errorDescription) {
      const errorMessages: Record<string, string> = {
        access_denied: "Authentication was cancelled. Please try again.",
        server_error: "Authentication server error. Please try again.",
        temporarily_unavailable: "Service temporarily unavailable.",
        "403": "Your email is not authorized. Contact support.",
      };

      const message =
        errorMessages[errorCode || error || ""] ||
        errorDescription ||
        "Authentication failed. Please try again.";

      toast.error(message);
      setErrors({ form: message });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // If already authenticated, redirect to workspace
  useEffect(() => {
    if (ready && isAuthenticated) {
      navigate({ to: "/app", replace: true });
    }
  }, [ready, isAuthenticated, navigate]);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signInSchema.safeParse({ email: signInEmail, password: signInPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await authService.signInWithPassword(signInEmail, signInPassword);
      if (!res.ok) {
        toast.error(res.error?.message || "Invalid credentials.");
        setErrors({ form: res.error?.message || "Sign in failed" });
      } else {
        toast.success("Welcome back! Loading your workspace...");
        navigate({ to: "/app", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signUpSchema.safeParse({
      fullName: signUpName,
      email: signUpEmail,
      password: signUpPassword,
      role: signUpRole,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await authService.signUp(signUpEmail, signUpPassword, {
        data: {
          full_name: signUpName,
          role: signUpRole,
        },
      });

      if (!res.ok) {
        toast.error(res.error?.message || "Registration failed.");
        setErrors({ form: res.error?.message || "Registration failed" });
      } else {
        if (res.data?.session) {
          toast.success("Account created! Access granted to engineering workspace.");
          navigate({ to: "/app", replace: true });
        } else {
          toast.success("Registration successful! Check your inbox to confirm your email.");
          setMagicLinkSent(true);
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(true);
    try {
      const res = await authService.signInWithOAuth(provider);
      if (!res.ok) {
        toast.error(res.error?.message || `Failed to initiate ${provider} OAuth.`);
      }
    } catch (err) {
      toast.error("OAuth initiation error");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!signInEmail || !signInEmail.includes("@")) {
      setErrors({ email: "Enter a valid email address to receive a magic link" });
      return;
    }
    setLoading(true);
    try {
      const res = await authService.sendMagicLink(signInEmail);
      if (res.ok) {
        setMagicLinkSent(true);
        toast.success("Secure sign-in link dispatched to your inbox!");
      } else {
        toast.error(res.error?.message || "Failed to send magic link.");
      }
    } catch (err) {
      toast.error("Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Deep Space Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-zinc-950 to-background" />
      <div className="pointer-events-none absolute -top-40 right-1/4 size-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 size-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center gap-2.5 transition-transform hover:scale-105">
            <BrahmaLogo />
          </div>
          <p className="text-xs text-muted-foreground max-w-xs">
            Engineering Intelligence &amp; Verified Architecture Workspace
          </p>
        </div>

        {!hasSupabaseKeys ? (
          <SetupErrorCard />
        ) : magicLinkSent ? (
          <div className="surface rounded-2xl border border-border/80 p-8 shadow-2xl space-y-5 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary">
              <Mail className="size-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-foreground">Check your inbox</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We sent a secure verification link to <span className="font-semibold text-foreground">{signInEmail || signUpEmail}</span>. Click the link to complete authentication.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => setMagicLinkSent(false)}
            >
              Back to Sign in
            </Button>
          </div>
        ) : (
          <div className="surface rounded-2xl border border-border/80 p-6 sm:p-8 shadow-2xl backdrop-blur relative space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={(v) => {
                setActiveTab(v as "signin" | "signup");
                setErrors({});
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50 p-1 rounded-xl">
                <TabsTrigger
                  value="signin"
                  className="rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  Create Account
                </TabsTrigger>
              </TabsList>

              {errors["form"] && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-xs text-destructive border border-destructive/25" role="alert">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errors["form"]}</span>
                </div>
              )}

              {/* SIGN IN TAB */}
              <TabsContent value="signin" className="mt-5 space-y-4 outline-none">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="signin-email" className="text-xs font-medium">
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        autoComplete="email"
                        placeholder="operator@brahma.dev"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="pl-9 text-xs"
                        disabled={loading}
                      />
                    </div>
                    {errors["email"] && (
                      <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="size-3" /> {errors["email"]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password" className="text-xs font-medium">
                        Password
                      </Label>
                      <Link
                        to="/forgot-password"
                        className="text-[11px] text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        className="pl-9 text-xs"
                        disabled={loading}
                      />
                    </div>
                    {errors["password"] && (
                      <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="size-3" /> {errors["password"]}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-xs font-semibold h-9 shadow-md"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-3.5 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Sign In <ArrowRight className="ml-1.5 size-3.5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/60" />
                  </div>
                  <span className="relative bg-card px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-8.5 font-medium"
                    onClick={() => handleOAuth("google")}
                    disabled={loading}
                  >
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-8.5 font-medium"
                    onClick={() => handleOAuth("github")}
                    disabled={loading}
                  >
                    GitHub
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full text-[11px] text-muted-foreground hover:text-foreground h-7"
                  onClick={handleMagicLink}
                  disabled={loading}
                >
                  Sign in with Magic Link / OTP &rarr;
                </Button>
              </TabsContent>

              {/* SIGN UP TAB */}
              <TabsContent value="signup" className="mt-5 space-y-4 outline-none">
                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name" className="text-xs font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        placeholder="Priya Nair"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="pl-9 text-xs"
                        disabled={loading}
                      />
                    </div>
                    {errors["fullName"] && (
                      <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="size-3" /> {errors["fullName"]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-xs font-medium">
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        placeholder="priya.nair@brahma.dev"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="pl-9 text-xs"
                        disabled={loading}
                      />
                    </div>
                    {errors["email"] && (
                      <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="size-3" /> {errors["email"]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password" className="text-xs font-medium">
                      Password (8+ chars, 1 uppercase, 1 number)
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••••••"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="pl-9 text-xs"
                        disabled={loading}
                      />
                    </div>
                    {errors["password"] && (
                      <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="size-3" /> {errors["password"]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Account Role</Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["student", "faculty", "startup"] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setSignUpRole(r)}
                          className={cn(
                            "rounded-lg border px-2 py-1.5 text-xs font-semibold capitalize transition-all",
                            signUpRole === r
                              ? "border-primary bg-primary/15 text-primary"
                              : "border-border/60 bg-secondary/20 text-muted-foreground hover:bg-secondary/40",
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-xs font-semibold h-9 shadow-md mt-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-3.5 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account <ArrowRight className="ml-1.5 size-3.5" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Footer Security Badges */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground/60 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3 text-emerald-400" />
            Supabase RLS Protected
          </span>
          <span>&bull;</span>
          <span>Zero Client Secrets</span>
        </div>
      </div>
    </div>
  );
}
