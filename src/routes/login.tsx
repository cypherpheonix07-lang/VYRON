import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { BrahmaLogo } from "@/components/brahma/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockAuthRequest, signIn } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Sign in to PROJECT BRAHMA to review blueprints, code health, security and delivery risk.",
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

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-25" aria-hidden />
      <div className="relative w-full max-w-md">
        <div className="flex justify-center">
          <BrahmaLogo />
        </div>
        <div className="surface mt-8 rounded-2xl p-6 sm:p-8">
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      </div>
    </div>
  );
}

export function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--critical)]">
      <AlertCircle className="size-3.5" aria-hidden />
      {message}
    </p>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "priya.nair@brahma.dev", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    await mockAuthRequest(null);
    setLoading(false);

    if (parsed.data.password === "wrongpassword") {
      setFormError("Those credentials don't match an account in this workspace.");
      return;
    }
    signIn({
      name: parsed.data.email.startsWith("priya") ? "Priya Nair" : "Workspace User",
      email: parsed.data.email,
      role: "Admin",
    });
    toast.success("Signed in", { description: "Welcome back to PROJECT BRAHMA." });
    navigate({ to: "/app" });
  }

  return (
    <AuthLayout
      title="Sign in to your workspace"
      subtitle="Review blueprints, health scores and delivery risk across your projects."
      footer={
        <>
          Need an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {formError ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-[var(--critical)]/40 bg-[var(--critical)]/10 px-3 py-2.5 text-xs text-[var(--critical)]"
          >
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {formError}
          </div>
        ) : null}
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-1.5"
            value={values.email}
            aria-invalid={!!errors.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
          <FieldError message={errors.email} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <span className="text-xs text-muted-foreground">Min. 8 characters</span>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            className="mt-1.5"
            value={values.password}
            aria-invalid={!!errors.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          />
          <FieldError message={errors.password} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Signing in…
            </>
          ) : (
            <>
              <LogIn className="size-4" aria-hidden /> Sign in
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Demo build — any password of 8+ characters signs you in. Use “wrongpassword” to preview the
          error state.
        </p>
      </form>
    </AuthLayout>
  );
}
