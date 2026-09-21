import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { toast } from "sonner";

import { AuthLayout, FieldError } from "@/components/auth/auth-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";

export const Route = createFileRoute("/invite")({
  head: () => ({
    meta: [
      { title: "Accept Invitation — PROJECT BRAHMA" },
      { name: "description", content: "Join your workspace on PROJECT BRAHMA." },
    ],
  }),
  component: InvitePage,
});

function InvitePage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [workspaceName, setWorkspaceName] = useState("your team");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  // Check access token on mount
  useEffect(() => {
    const checkInviteToken = async () => {
      // Invite links from Supabase direct back with tokens in the URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken =
        hashParams.get("access_token") || new URLSearchParams(window.location.search).get("token");

      if (accessToken) {
        setHasToken(true);
        // If token in search parameters, set session via setSession
        const refreshToken = new URLSearchParams(window.location.search).get("refresh_token") || "";
        if (refreshToken) {
          await authService.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }
      } else {
        // If there's already an active session, let them set password
        const result = await authService.getSession();
        if (result.ok && result.data) {
          setHasToken(true);
        } else {
          setFormError(
            "No invitation token detected. Please check your invitation link or contact your workspace admin.",
          );
        }
      }
    };
    checkInviteToken();
  }, []);

  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (password.length < 8) {
      nextErrors["password"] = "Password must be at least 8 characters";
    }
    if (password !== confirmPassword) {
      nextErrors["confirmPassword"] = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Complete user signup/password setup
      const result = await authService.updatePassword(password);

      if (!result.ok) {
        setFormError(result.error?.message ?? "Failed to accept invitation.");
      } else {
        toast.success("Account activated!", {
          description: "You have joined the workspace. Let's personalize your setup.",
        });
        navigate({ to: "/onboarding" });
      }
    } catch (err) {
      setFormError((err as Error).message || "Failed to accept invitation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Accept Invitation"
      subtitle={`Set a password to activate your account and join ${workspaceName}.`}
      footer={
        <Link
          to="/login"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
        >
          Return to sign in
        </Link>
      }
    >
      {formError && !hasToken ? (
        <div className="space-y-4 text-center py-4">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--critical)]/10 text-[var(--critical)]">
            <AlertCircle className="size-6" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{formError}</p>
          <Button asChild className="w-full">
            <Link to="/login">Sign in with password instead</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {formError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-[var(--critical)]/40 bg-[var(--critical)]/10 px-3 py-2.5 text-xs text-[var(--critical)]"
            >
              <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>{formError}</span>
            </div>
          )}

          <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/10 p-3.5 flex items-start gap-3">
            <ShieldCheck className="size-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-normal">
              <span className="text-white font-semibold">Verification check complete.</span> You
              have been invited to collaborate on Project Brahma. Enter a password to sign in.
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="mt-1.5"
              value={password}
              aria-invalid={!!errors["password"]}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FieldError message={errors["password"]} />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              className="mt-1.5"
              value={confirmPassword}
              aria-invalid={!!errors["confirmPassword"]}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FieldError message={errors["confirmPassword"]} />
          </div>

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" /> Joining workspace…
              </>
            ) : (
              <>
                <Lock className="size-4 mr-2" /> Join workspace
              </>
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
