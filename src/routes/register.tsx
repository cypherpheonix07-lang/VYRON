import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AuthLayout, FieldError } from "@/routes/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockAuthRequest, signIn, type Role } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create an account — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Create a PROJECT BRAHMA account to turn project ideas into validated blueprints with risk and business impact analysis.",
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

const roles: Role[] = ["Student", "Faculty", "Startup", "Admin"];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Include at least one number"),
  role: z.enum(["Student", "Faculty", "Startup", "Admin"]),
});

function RegisterPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "", role: "Student" as Role });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
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
    signIn(parsed.data);
    toast.success("Account created", {
      description: `Signed in as ${parsed.data.role}. Your workspace is ready.`,
    });
    navigate({ to: "/app" });
  }

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Start every project with a validated blueprint and a measurable risk profile."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            className="mt-1.5"
            value={values.name}
            placeholder="Priya Nair"
            aria-invalid={!!errors['name']}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
          <FieldError message={errors['name']} />
        </div>
        <div>
          <Label htmlFor="email">Work or campus email</Label>
          <Input
            id="email"
            type="email"
            className="mt-1.5"
            value={values.email}
            placeholder="you@company.com"
            aria-invalid={!!errors['email']}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
          <FieldError message={errors['email']} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            className="mt-1.5"
            value={values.password}
            aria-invalid={!!errors['password']}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          />
          <FieldError message={errors['password']} />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            value={values.role}
            onValueChange={(v) => setValues((prev) => ({ ...prev, role: v as Role }))}
          >
            <SelectTrigger id="role" className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Admin unlocks the admin console with usage, users and audit logs.
          </p>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Creating workspace…
            </>
          ) : (
            <>
              <UserPlus className="size-4" aria-hidden /> Create account
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
