import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { githubService } from "@/services/githubService";
import { toast } from "sonner";

export const Route = createFileRoute("/github/callback")({
  head: () => ({
    meta: [{ title: "Verifying GitHub Connection — PROJECT BRAHMA" }],
  }),
  component: GitHubCallbackPage,
});

function GitHubCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function handleAuth() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.provider_token) {
          githubService.setToken(session.provider_token);

          // Store token in github_tokens table
          if (session.user?.id) {
            await supabase.from("github_tokens").upsert({
              user_id: session.user.id,
              access_token: session.provider_token,
              token_type: "bearer",
              scopes: "repo,read:user,user:email,read:org",
              updated_at: new Date().toISOString(),
            });
          }

          if (isMounted) {
            setStatus("success");
            toast.success("GitHub account connected successfully!");
            setTimeout(() => {
              navigate({ to: "/github", replace: true });
            }, 1200);
          }
        } else {
          // If no provider token, redirect back to /github
          if (isMounted) {
            setStatus("success");
            navigate({ to: "/github", replace: true });
          }
        }
      } catch (err: unknown) {
        console.error("GitHub auth callback error:", err);
        if (isMounted) {
          setStatus("error");
          setErrorMessage((err as Error).message || "Failed to process GitHub authentication.");
        }
      }
    }

    handleAuth();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="surface p-8 rounded-2xl border border-border/80 max-w-sm w-full text-center space-y-4 shadow-2xl">
        {status === "loading" && (
          <>
            <Loader2 className="size-8 animate-spin mx-auto text-cyan-400" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Connecting GitHub Account</h3>
              <p className="text-xs text-muted-foreground">
                Exchanging OAuth tokens and hydrating repository catalog...
              </p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="size-8 text-emerald-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">GitHub Connected</h3>
              <p className="text-xs text-muted-foreground">Redirecting to your repository mirror...</p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="size-8 text-rose-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Connection Error</h3>
              <p className="text-xs text-rose-400">{errorMessage}</p>
            </div>
            <button
              onClick={() => navigate({ to: "/github" })}
              className="text-xs text-cyan-400 hover:underline pt-2"
            >
              &larr; Return to GitHub Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
