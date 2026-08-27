import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught component error:", error, errorInfo);
  }

  public reset = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-destructive/30 bg-destructive/5 my-4">
          <div className="size-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-3">
            <AlertTriangle className="size-5" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            {this.props.fallbackTitle || "Component render exception"}
          </h4>
          <p className="text-xs text-muted-foreground max-w-md mt-1 mb-4">
            {this.props.fallbackMessage ||
              this.state.error?.message ||
              "An unexpected error occurred while rendering this module."}
          </p>
          <button
            onClick={this.reset}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-sm"
          >
            <RefreshCw className="size-3.5" /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
