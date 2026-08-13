import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AuthLayout } from "../components/auth/auth-components";
import { authService } from "../services/authService";
import { useAuth } from "../lib/auth";
import { OtpInput, ResendCountdown } from "../components/auth/auth-components";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const searchSchema = z.object({
  email: z.string().optional().catch(""),
});

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Verify Email — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Verify your email address to activate your PROJECT BRAHMA account.",
      },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { refresh } = useAuth();

  const [email, setEmail] = useState(search.email || "");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    return;
  }, [countdown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (otpCode.length !== 6) {
      setError("Verification code must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await authService.verifyOtp(email.trim(), otpCode, "signup");
      if (err) {
        setError(err.message);
        toast.error(err.message);
      } else {
        toast.success("Verification successful!");
        await refresh();
        navigate({ to: "/onboarding" });
      }
    } catch (err) {
      setError("An unexpected error occurred during verification.");
      toast.error("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter your email to resend the code.");
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await authService.resendOtp(email.trim(), "signup");
      if (err) {
        toast.error(err.message);
      } else {
        setCountdown(30);
        toast.success("Verification code resent successfully.");
      }
    } catch (err) {
      toast.error("Failed to resend verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit verification code to activate your account."
      footer={
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-cyan-400 hover:underline text-xs"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {!search.email && (
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-slate-300 font-medium text-xs">
              Verify Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus-visible:ring-cyan-500 rounded-lg text-sm"
              required
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-slate-300 font-medium text-xs">6-Digit Verification Code</Label>
          <OtpInput value={otpCode} onChange={(val) => setOtpCode(val)} error={error} />
        </div>

        <div className="space-y-3 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg py-2"
          >
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : "Verify and Launch"}
          </Button>

          <div className="text-center">
            <ResendCountdown initialSeconds={countdown} onTrigger={handleResend} />
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
