import { useState } from "react";
import { authService } from "@/services/authService";

interface OAuthButtonsProps {
  mode: "signin" | "signup";
}

export function OAuthButtons({ mode }: OAuthButtonsProps) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    if (googleLoading || githubLoading) return; // Prevent double-click
    setGoogleLoading(true);
    setError(null);

    const result = await authService.signInWithGoogle();

    if (!result.ok && result.error) {
      setError(`Google sign-${mode === "signin" ? "in" : "up"} failed: ${result.error.message}`);
      setGoogleLoading(false);
    }
  };

  const handleGitHub = async () => {
    if (googleLoading || githubLoading) return;
    setGithubLoading(true);
    setError(null);

    const result = await authService.signInWithGitHub();

    if (!result.ok && result.error) {
      setError(`GitHub sign-${mode === "signin" ? "in" : "up"} failed: ${result.error.message}`);
      setGithubLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
          {error}
        </div>
      )}

      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading || githubLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-850 text-slate-200 font-medium text-xs transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-sm"
        aria-label={`${mode === "signin" ? "Sign in" : "Sign up"} with Google`}
      >
        {googleLoading ? (
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <GoogleIcon className="w-4 h-4" />
        )}
        <span>
          {googleLoading
            ? "Connecting to Google..."
            : `${mode === "signin" ? "Continue" : "Sign up"} with Google`}
        </span>
      </button>

      {/* GitHub Button */}
      <button
        type="button"
        onClick={handleGitHub}
        disabled={googleLoading || githubLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-850 text-slate-200 font-medium text-xs transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-sm"
        aria-label={`${mode === "signin" ? "Sign in" : "Sign up"} with GitHub`}
      >
        {githubLoading ? (
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <GitHubIcon className="w-4 h-4" />
        )}
        <span>
          {githubLoading
            ? "Connecting to GitHub..."
            : `${mode === "signin" ? "Continue" : "Sign up"} with GitHub`}
        </span>
      </button>
    </div>
  );
}

// Inline SVG icons
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
