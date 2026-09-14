import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Loader2, Lock } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { toast } from "sonner";

import {
  AuthLayout,
  FieldError,
  PasswordInput,
  StrengthMeter,
  ChecklistChips,
} from "../components/auth/auth-components";
import { authService } from "../services/authService";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Set a new password for your PROJECT BRAHMA workspace account.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [strengthScore, setStrengthScore] = useState(0);

  // Live password strength calculation
  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrengthScore(score);
  }, [password]);

  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (password.length < 8) {
      nextErrors["password"] = "Password must be at least 8 characters.";
    }
    if (password !== confirmPassword) {
      nextErrors["confirmPassword"] = "Passwords do not match.";
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
      const result = await authService.updatePassword(password);

      if (!result.ok) {
        setFormError(result.error?.message ?? "Failed to update password.");
      } else {
        toast.success("Password updated", {
          description:
            "Your password has been successfully reset. Please sign in with your new credentials.",
        });
        navigate({ to: "/login" });
      }
    } catch (err) {
      setFormError((err as Error).message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Enter a secure password for your workspace account."
      footer={
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-cyan-400 hover:underline text-xs"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs text-red-400"
          >
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <span>{formError}</span>
          </div>
        )}

        <div className="space-y-2">
          <PasswordInput
            id="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors["password"]}
            placeholder="••••••••••••"
            autoComplete="new-password"
          />
          {password && (
            <div className="space-y-2">
              <StrengthMeter score={strengthScore} />
              <ChecklistChips value={password} />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-slate-300 font-medium text-xs">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="bg-slate-900 border-slate-800 text-white focus-visible:ring-cyan-500 rounded-lg text-sm"
            value={confirmPassword}
            aria-invalid={!!errors["confirmPassword"]}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••"
          />
          <FieldError message={errors["confirmPassword"]} />
        </div>

        <Button
          type="submit"
          className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" /> Saving password…
            </>
          ) : (
            <>
              <Lock className="size-4 mr-2" /> Save password
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
