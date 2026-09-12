import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export interface GitHubAccountItem {
  id?: string;
  login: string;
  type: "user" | "organization";
  avatar_url?: string;
}

export interface GitHubAccountSelectorProps {
  open: boolean;
  accounts: GitHubAccountItem[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onSelect: (account: GitHubAccountItem) => void;
  onClose: () => void;
}

export function GitHubAccountSelector({
  open,
  accounts,
  isLoading = false,
  error = null,
  onRetry,
  onSelect,
  onClose,
}: GitHubAccountSelectorProps) {
  const [selectedLogin, setSelectedLogin] = useState<string>(
    accounts.length > 0 ? accounts[0]?.login || "" : ""
  );

  React.useEffect(() => {
    if (accounts.length > 0 && (!selectedLogin || !accounts.some((a) => a.login === selectedLogin))) {
      setSelectedLogin(accounts[0]?.login || "");
    }
  }, [accounts, selectedLogin]);

  const handleContinue = () => {
    const selected = accounts.find((a) => a.login === selectedLogin);
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        id="github-account-selector-dialog"
        className="max-w-md border-border/80 bg-zinc-950/95 p-6 backdrop-blur-xl shadow-2xl"
      >
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="size-4" />
            </div>
            <DialogTitle className="text-base font-semibold text-foreground tracking-tight">
              Select GitHub Account
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Choose which GitHub identity to inspect and bind repositories from into the active project.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3">
          {isLoading ? (
            <div className="space-y-3 py-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-border/40 bg-zinc-900/40 p-3.5 animate-pulse"
                >
                  <div className="size-8 rounded-full bg-zinc-800" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-28 rounded bg-zinc-800" />
                    <div className="h-2 w-16 rounded bg-zinc-850" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center space-y-3">
              <AlertCircle className="size-6 text-destructive mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-destructive">{error}</p>
                <p className="text-[11px] text-muted-foreground">
                  Failed to load GitHub account identities.
                </p>
              </div>
              {onRetry && (
                <Button
                  id="btn-retry-accounts"
                  size="sm"
                  variant="outline"
                  onClick={onRetry}
                  className="text-xs border-destructive/40 text-destructive hover:bg-destructive/20"
                >
                  <RefreshCw className="mr-1.5 size-3" /> Retry
                </Button>
              )}
            </div>
          ) : accounts.length === 0 ? (
            <div className="rounded-xl border border-border/60 bg-zinc-900/30 p-6 text-center space-y-3">
              <User className="size-8 text-muted-foreground/60 mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">No accounts found</p>
                <p className="text-[11px] text-muted-foreground">
                  Re-authorize with GitHub to discover your personal and organization accounts.
                </p>
              </div>
              {onRetry && (
                <Button
                  id="btn-reauth-accounts"
                  size="sm"
                  onClick={onRetry}
                  className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Re-authorize
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {accounts.map((acc) => {
                const isSelected = selectedLogin === acc.login;
                const isOrg = acc.type === "organization";

                return (
                  <div
                    key={acc.login}
                    id={`account-option-${acc.login}`}
                    onClick={() => setSelectedLogin(acc.login)}
                    className={`group flex items-center justify-between rounded-xl border p-3.5 transition-all cursor-pointer select-none ${
                      isSelected
                        ? "border-primary/80 bg-primary/10 ring-1 ring-primary/30 shadow-md"
                        : "border-border/60 bg-zinc-900/40 hover:border-border hover:bg-zinc-900/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {acc.avatar_url ? (
                        <img
                          src={acc.avatar_url}
                          alt={acc.login}
                          className="size-8 rounded-full border border-border/80 object-cover shrink-0"
                        />
                      ) : (
                        <div className="grid size-8 place-items-center rounded-full bg-zinc-800 text-zinc-300">
                          {isOrg ? <Building2 className="size-4" /> : <User className="size-4" />}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {acc.login}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 uppercase font-mono tracking-wider ${
                              isOrg
                                ? "border-purple-500/30 text-purple-400 bg-purple-500/10"
                                : "border-cyan-500/30 text-cyan-400 bg-cyan-500/10"
                            }`}
                          >
                            {isOrg ? "Organization" : "Personal"}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          github.com/{acc.login}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`grid size-4 place-items-center rounded-full border transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/40 bg-transparent"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="size-3.5 fill-current" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between border-t border-border/40 pt-4 gap-2">
          <Button
            id="btn-account-selector-cancel"
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            id="btn-account-selector-continue"
            type="button"
            size="sm"
            disabled={!selectedLogin || isLoading || accounts.length === 0}
            onClick={handleContinue}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4"
          >
            Continue
            <ArrowRight className="ml-1.5 size-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
