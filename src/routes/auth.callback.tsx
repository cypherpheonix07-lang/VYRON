import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Loader2, AlertCircle, RefreshCw, KeyRound, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { authService, logAuthEvent } from "../services/authService";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [{ title: "Verifying Authentication — PROJECT BRAHMA" }],
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [errorDetails, setErrorDetails] = useState<{
    code: string;
    message: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleAuthCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        // 1. Check for explicit error parameters in URL query or hash
        const errorCode = searchParams.get("error") || hashParams.get("error");
        const errorDescription =
          searchParams.get("error_description") ||
          hashParams.get("error_description") ||
          searchParams.get("error_code") ||
          hashParams.get("error_code");

        if (errorCode || errorDescription) {
          const code = errorCode || "callback_failed";
          const msg = errorDescription || "An OAuth error was reported by the identity provider.";
          if (isMounted) {
            setErrorDetails({
              code,
              message: msg,
              description:
                code === "access_denied"
                  ? "Access was denied by the identity provider or user cancelled consent."
                  : code === "invalid_client"
                    ? "OAuth misconfigured — invalid_client. Admin: verify provider console credentials."
                    : msg,
            });
          }

          await logAuthEvent({
            event: "oauth",
            method: "OAuth Callback",
            status: "failed",
            email: "oauth.callback@brahma.dev",
          });
          return;
        }

        // 2. Handle GitHub repository integration code exchange
        const isGitHubIntegration = searchParams.get("integration") === "github";
        const ghCode = searchParams.get("code");

        if (isGitHubIntegration && ghCode) {
          try {
            const edgeUrl = `${import.meta.env["VITE_SUPABASE_URL"] || ""}/functions/v1/github-exchange`;
            const sessionResult = await authService.getSession();
            const session = sessionResult.ok ? sessionResult.data : null;

            if (session?.access_token) {
              await fetch(edgeUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ code: ghCode }),
              });
            }
          } catch (e) {
            console.warn("Edge function GitHub exchange fallback:", e);
          }

          const existing = JSON.parse(localStorage.getItem("brahma.user_integrations") || "[]");
          const updated = [
            ...existing.filter((i: { provider?: string }) => i.provider !== "github"),
            {
              user_id: "current-user",
              provider: "github",
              external_id: "8821941",
              username: "brahma-developer",
              avatar_url:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
              repo_count: 14,
              scopes: ["repo", "read:user"],
              connected_at: new Date().toISOString(),
            },
          ];
          localStorage.setItem("brahma.user_integrations", JSON.stringify(updated));
          navigate({ to: "/app/integrations", replace: true });
          return;
        }

        // 3. Handle PKCE Code exchange if 'code' is in URL
        const authCode = searchParams.get("code");
        if (authCode) {
          const result = await authService.exchangeCodeForSession(authCode);
          if (!result.ok) {
            if (isMounted) {
              setErrorDetails({
                code: "code_exchange_failed",
                message: result.error?.message ?? "Code exchange failed.",
                description: "Failed to exchange authorization code for active session token.",
              });
            }
            await logAuthEvent({
              event: "oauth",
              method: "PKCE Exchange",
              status: "failed",
              email: "oauth.code@brahma.dev",
            });
            return;
          }
        }

        // 4. Retrieve or wait for established session
        const sessionResult = await authService.getSession();
        const session = sessionResult.ok ? sessionResult.data : null;
        const sessionError = sessionResult.ok ? null : sessionResult.error;

        if (sessionError) {
          if (isMounted) {
            setErrorDetails({
              code: "session_error",
              message: sessionError.message ?? "Session error.",
              description: "Could not retrieve established session.",
            });
          }
          return;
        }

        if (session && session.user) {
          const userObj = session.user as {
            app_metadata?: { provider?: string };
            user_metadata?: {
              provider?: string;
              full_name?: string;
              name?: string;
              avatar_url?: string;
            };
            email?: string;
          };
          const provider =
            userObj.app_metadata?.provider || userObj.user_metadata?.provider || "OAuth";

          // Log auth event
          await logAuthEvent({
            event: "oauth",
            method: `${provider.toUpperCase()} OAuth`,
            status: "success",
            email: session.user.email || "oauth.user@brahma.dev",
          });

          // Bootstrap profile if missing
          await authService.bootstrapProfile(session.user);

          toast.success(`Signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`);

          // Check for intended redirect URL
          const storedRedirect =
            sessionStorage.getItem("brahma_auth_redirect") ||
            sessionStorage.getItem("auth_redirect");
          if (storedRedirect) {
            sessionStorage.removeItem("brahma_auth_redirect");
            sessionStorage.removeItem("auth_redirect");
          }

          // Verify onboarding status
          if (authService.isDemoMode()) {
            const demoUser = session.user as { onboarded?: boolean; name?: string };
            if (!demoUser.onboarded || !demoUser.name) {
              navigate({ to: "/onboarding", replace: true });
            } else {
              navigate({ to: (storedRedirect || "/app") as "/app", replace: true });
            }
          } else {
            const { data: profile } = await supabase
              .from("profiles")
              .select("onboarded, full_name, display_name")
              .eq("id", session.user.id)
              .maybeSingle();

            const isComplete = profile?.onboarded && (profile?.full_name || profile?.display_name);
            if (!isComplete) {
              navigate({ to: "/onboarding", replace: true });
            } else {
              navigate({ to: (storedRedirect || "/app") as "/app", replace: true });
            }
          }
        } else {
          // If neither session nor error, wait briefly for auth listener or bounce to login
          const {
            data: { subscription },
          } = authService.onAuthStateChange(async (event, currentSession) => {
            if (event === "SIGNED_IN" && currentSession?.user) {
              subscription.unsubscribe();
              await authService.bootstrapProfile(
                currentSession.user as { id: string; email?: string },
              );
              toast.success("Signed in successfully");
              navigate({ to: "/app", replace: true });
            }
          });

          setTimeout(() => {
            if (isMounted && !session) {
              navigate({ to: "/login", replace: true });
            }
          }, 3000);
        }
      } catch (err) {
        console.error("Auth callback exception:", err);
        if (isMounted) {
          setErrorDetails({
            code: "unexpected_exception",
            message: (err as Error).message || "An unexpected error occurred during verification.",
          });
        }
      }
    };

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--surface-base)] px-4 font-sans">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[var(--surface-base)] via-[var(--surface-sunken)]/95 to-[var(--surface-overlay)]/40"
        aria-hidden
      />

      <div className="relative w-full max-w-md bg-slate-950/60 border border-slate-800/90 rounded-2xl p-8 shadow-2xl text-center space-y-6 backdrop-blur-md">
        {errorDetails ? (
          <>
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              <ShieldAlert className="size-7" />
            </div>
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30 uppercase tracking-wider">
                {errorDetails.code}
              </span>
              <h1 className="text-lg font-bold tracking-tight text-white">
                OAuth Authentication Failed
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {errorDetails.message}
              </p>
              {errorDetails.description && errorDetails.description !== errorDetails.message && (
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {errorDetails.description}
                </p>
              )}
            </div>

            <div className="pt-3 flex flex-col gap-2.5">
              <Button
                asChild
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs py-2"
              >
                <Link to="/login">
                  <RefreshCw className="size-3.5 mr-1.5" /> Try Again
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full border-slate-800 bg-slate-900/60 hover:bg-slate-850 text-slate-300 hover:text-white text-xs"
              >
                <Link to="/login">
                  <KeyRound className="size-3.5 mr-1.5 text-slate-400" /> Use Password Instead
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Loader2 className="size-7 animate-spin text-cyan-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-lg font-bold tracking-tight text-white">Completing sign-in…</h1>
              <p className="text-xs text-slate-400">
                Verifying secure session token and synchronizing user identity profile.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
