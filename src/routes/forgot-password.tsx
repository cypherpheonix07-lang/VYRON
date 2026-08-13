import { Link, createFileRoute } from "@tanstack/react-router";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { toast } from "sonner";

import { AuthLayout } from "../components/auth/auth-components";
import { authService } from "../services/authService";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — PROJECT BRAHMA" },
      { name: "description", content: "Recover your PROJECT BRAHMA workspace account password." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
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
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await authService.resetPasswordForEmail(email.trim());

      if (error) {
        toast.error(error.message);
      } else {
        setSent(true);
        setCountdown(60);
        toast.success("Recovery link sent!", {
          description: `Check your inbox at ${email} for a link to reset your password.`,
        });
      }
    } catch (err) {
      toast.error((err as Error).message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        sent
          ? "Check your inbox for instructions to set a new password."
          : "Enter your work email and we'll send you a password recovery link."
      }
      footer={
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-cyan-400 hover:underline text-xs"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="space-y-4 text-center py-4">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-green-500/10 text-green-400">
            <Mail className="size-6" aria-hidden />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            If an account exists for <span className="font-semibold text-slate-200">{email}</span>,
            you will receive a link to reset your password within a few minutes.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="outline"
              disabled={countdown > 0 || loading}
              onClick={handleSubmit}
              className="w-full text-xs border-slate-800 bg-slate-900 hover:bg-slate-850"
            >
              {countdown > 0 ? `Resend link (${countdown}s)` : "Resend recovery link"}
            </Button>
            <button
              onClick={() => setSent(false)}
              className="text-xs text-cyan-400 hover:underline mt-2 focus:outline-none"
            >
              Change email address
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="rec-email" className="text-slate-300 font-medium text-xs">
              Work Email Address
            </Label>
            <Input
              id="rec-email"
              type="email"
              placeholder="you@company.com"
              className="bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus-visible:ring-cyan-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" aria-hidden /> Sending link…
              </>
            ) : (
              <>
                <Mail className="size-4 mr-2" aria-hidden /> Send reset link
              </>
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
