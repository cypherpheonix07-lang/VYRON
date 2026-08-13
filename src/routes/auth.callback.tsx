import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [{ title: "Verifying Authentication — PROJECT BRAHMA" }],
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await authService.getSession();

        if (error) {
          setErrorMsg(error.message);
          return;
        }

        if (session) {
          if (authService.isDemoMode()) {
            if (!session.user.onboarded) {
              navigate({ to: "/onboarding", replace: true });
            } else {
              navigate({ to: "/app", replace: true });
            }
          } else {
            // Fetch user profile to see if onboarded
            const { data: profile, error: profileErr } = await supabase
              .from("profiles")
              .select("onboarded")
              .eq("id", session.user.id)
              .single();

            if (profileErr) {
              console.error("Error retrieving profile during callback:", profileErr);
            }

            if (profile && !profile.onboarded) {
              navigate({ to: "/onboarding", replace: true });
            } else {
              navigate({ to: "/app", replace: true });
            }
          }
        } else {
          // If no session is returned, check if there is an error in URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const errorDescription = hashParams.get("error_description");
          const errorCode = hashParams.get("error");

          if (errorCode || errorDescription) {
            setErrorMsg(errorDescription || errorCode || "Authentication callback error.");
          } else {
            // Otherwise redirect to login
            navigate({ to: "/login", replace: true });
          }
        }
      } catch (err) {
        console.error("Auth callback exception:", err);
        setErrorMsg((err as Error).message || "An unexpected error occurred during verification.");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0B1220] px-4">
      {/* Background blueprint decorations */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-15" aria-hidden />

      <div className="relative w-full max-w-md bg-slate-950/40 border border-slate-800/80 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        {errorMsg ? (
          <>
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-red-500/10 text-red-400">
              <AlertCircle className="size-6" />
            </div>
            <div className="space-y-2">
              <h1 className="text-lg font-semibold tracking-tight text-white">
                Sign-in verification failed
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
            </div>
            <div className="pt-2">
              <Button
                onClick={() => navigate({ to: "/login" })}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
              >
                Return to sign in
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-cyan-500/10 text-cyan-400">
              <Loader2 className="size-6 animate-spin" />
            </div>
            <div className="space-y-2">
              <h1 className="text-lg font-semibold tracking-tight text-white">
                Completing sign-in…
              </h1>
              <p className="text-xs text-slate-400">
                Verifying secure session token and retrieving user profile.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
