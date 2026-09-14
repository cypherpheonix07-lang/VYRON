/**
 * PROJECT BRAHMA — GITHUB OAUTH CALLBACK ROUTE (FL-01-A STEP 3)
 * Extracts OAuth code and state, invokes exchangeCode(), and redirects.
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { exchangeCode } from "@/lib/github/oauth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/github-callback")({
  head: () => ({
    meta: [{ title: "Exchanging GitHub Credentials — PROJECT BRAHMA" }],
  }),
  component: GitHubOAuthCallbackPage,
});

function GitHubOAuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function handleExchange() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        if (!code || !state) {
          throw new Error("Missing code or state parameters from GitHub authorization callback.");
        }

        const result = await exchangeCode(code, state);

        if (isMounted) {
          setStatus("success");
          const accountNames = result.accounts.map((a) => `@${a.login}`).join(", ");
          toast.success(`Connected GitHub: ${accountNames || `@${result.login}`}`);

          const savedProjectId = sessionStorage.getItem("brahma_github_oauth_project_id");
          sessionStorage.removeItem("brahma_github_oauth_project_id");

          setTimeout(() => {
            if (savedProjectId) {
              navigate({ to: `/app/projects/${savedProjectId}/integrations` as any });
            } else {
              navigate({ to: "/app/connectors" as any });
            }
          }, 1200);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (isMounted) {
          setStatus("error");
          setErrorMessage(msg);
          toast.error(`GitHub authentication failed: ${msg}`);
          setTimeout(() => {
            navigate({ to: "/app/connectors" as any });
          }, 3000);
        }
      }
    }

    handleExchange();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 text-zinc-100">
      <div className="max-w-md w-full p-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-2xl text-center space-y-4">
        {status === "loading" && (
          <div className="space-y-3">
            <Loader2 className="size-8 text-violet-400 animate-spin mx-auto" />
            <h2 className="text-base font-bold text-zinc-100">Verifying GitHub Credentials</h2>
            <p className="text-xs text-zinc-400">
              Validating CSRF state and exchanging code for secure session access token...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-3">
            <CheckCircle2 className="size-8 text-emerald-400 mx-auto" />
            <h2 className="text-base font-bold text-emerald-400">Authentication Complete</h2>
            <p className="text-xs text-zinc-400">Redirecting to integrations console...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <AlertCircle className="size-8 text-rose-500 mx-auto" />
            <h2 className="text-base font-bold text-rose-400">Authentication Failed</h2>
            <p className="text-xs text-zinc-400">{errorMessage}</p>
            <p className="text-[11px] text-zinc-500">Redirecting back to settings in 3 seconds...</p>
          </div>
        )}
      </div>
    </div>
  );
}
