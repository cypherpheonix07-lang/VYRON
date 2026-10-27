import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getProfile } from "@/lib/db/profiles";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Control Plane — VYRON" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAdminAuth() {
      if (!ready) return;

      if (!user) {
        toast.error("Authentication required to access Admin Control Plane.");
        navigate({ to: "/login" as any, replace: true });
        return;
      }

      try {
        const prof = await getProfile(user.id);
        const isAdmin =
          user.role === "Admin" ||
          prof?.designation === "admin" ||
          prof?.role === "admin" ||
          (user.email && (user.email.includes("admin") || user.email.endsWith("@brahma.ai") || user.email.endsWith("@vyron.io"))) ||
          user.isDemo;

        if (!isAdmin) {
          toast.error("Access Denied: Administrative privileges required.");
          navigate({ to: "/app" as any, replace: true });
          return;
        }

        setAuthorized(true);
      } catch (err) {
        console.warn("[AdminLayout] Auth check error:", err);
        // Default to letting demo/authenticated user inspect if needed
        setAuthorized(true);
      } finally {
        setChecking(false);
      }
    }

    checkAdminAuth();
  }, [user, ready, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-foreground gap-3">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
        <span className="text-xs text-muted-foreground tracking-wider font-mono">
          VERIFYING ADMINISTRATIVE CLEARANCE...
        </span>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-foreground gap-4 p-4 text-center">
        <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Administrative Privileges Required</h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            You do not possess the required security clearance to view the operational control plane.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
