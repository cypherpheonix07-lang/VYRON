// ============================================================================
// FILE 1: src/components/connectors/ConnectorGlassPrimitives.tsx
// Shared 3D Volumetric Glass Surfaces, Provenance Badges & SectionState<T>
// ============================================================================
import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  Lock,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import type {
  ConnectorConnectionStatus,
  LockReason,
  SectionState,
} from '@/types/connectors';

export type GlassFamily = 'slate' | 'obsidian' | 'teal';

interface GlassCard3DProps {
  children: React.ReactNode;
  family?: GlassFamily;
  className?: string;
  elevated?: boolean;
}

export const GlassCard3D: React.FC<GlassCard3DProps> = ({
  children,
  family = 'slate',
  className = '',
  elevated = false,
}) => {
  const familyStyles: Record<GlassFamily, React.CSSProperties> = {
    slate: {
      background: elevated
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.84) 0%, rgba(51, 65, 85, 0.56) 100%)'
        : 'linear-gradient(135deg, rgba(15, 23, 42, 0.64) 0%, rgba(51, 65, 85, 0.42) 100%)',
      borderColor: 'rgba(148, 163, 184, 0.34)',
      boxShadow:
        'inset 0 1.5px 2px rgba(248, 250, 252, 0.58), inset 0 -2px 6px rgba(15, 23, 42, 0.65), 0 18px 38px -14px rgba(15, 23, 42, 0.85)',
    },
    obsidian: {
      background: elevated
        ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.86) 0%, rgba(51, 51, 51, 0.58) 100%)'
        : 'linear-gradient(135deg, rgba(11, 11, 11, 0.72) 0%, rgba(26, 26, 26, 0.56) 100%)',
      borderColor: 'rgba(217, 217, 217, 0.28)',
      boxShadow:
        'inset 0 1.5px 2px rgba(255, 255, 255, 0.62), inset 0 -2px 6px rgba(0, 0, 0, 0.75), 0 18px 38px -14px rgba(0, 0, 0, 0.90)',
    },
    teal: {
      background: elevated
        ? 'linear-gradient(135deg, rgba(5, 22, 26, 0.84) 0%, rgba(12, 112, 117, 0.48) 100%)'
        : 'linear-gradient(135deg, rgba(7, 46, 51, 0.62) 0%, rgba(15, 150, 156, 0.30) 100%)',
      borderColor: 'rgba(109, 165, 192, 0.44)',
      boxShadow:
        'inset 0 1.5px 2px rgba(255, 255, 255, 0.65), inset 0 -2px 6px rgba(5, 22, 26, 0.72), 0 18px 40px -12px rgba(15, 150, 156, 0.38)',
    },
  };

  return (
    <div
      style={familyStyles[family]}
      className={`glass-3d-surface rounded-xl border p-5 text-[#F8FAFC] transition-all duration-200 ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const ProvenanceBadge: React.FC<{
  type: 'live_provider' | 'storage' | 'synthetic' | 'unavailable';
}> = ({ type }) => {
  const map = {
    live_provider: {
      label: 'LIVE PROVIDER',
      cls: 'bg-[#0C7075]/45 text-[#F8FAFC] border-[#6DA5C0]/50',
      icon: <CheckCircle2 className="h-3 w-3 text-[#0F969C]" />,
    },
    storage: {
      label: 'VERIFIED STORAGE',
      cls: 'bg-[#334155]/55 text-[#E2E8F0] border-[#94A3B8]/40',
      icon: <Database className="h-3 w-3 text-[#6DA5C0]" />,
    },
    synthetic: {
      label: 'SYNTHETIC DEMO',
      cls: 'bg-[#294D61]/60 text-[#E2E8F0] border-[#6DA5C0]/60',
      icon: <Sparkles className="h-3 w-3 text-[#6DA5C0]" />,
    },
    unavailable: {
      label: 'UNAVAILABLE',
      cls: 'bg-[#333333]/65 text-[#D9D9D9] border-[#6B6B6B]/45',
      icon: <AlertTriangle className="h-3 w-3 text-[#D9D9D9]" />,
    },
  }[type];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase ${map.cls}`}
    >
      {map.icon}
      {map.label}
    </span>
  );
};

export const ConnectionStatusPill: React.FC<{ status: ConnectorConnectionStatus }> = ({
  status,
}) => {
  const styles: Record<ConnectorConnectionStatus, string> = {
    connected: 'bg-[#0C7075]/50 text-[#F8FAFC] border-[#0F969C]/60',
    syncing: 'bg-[#294D61]/60 text-[#6DA5C0] border-[#6DA5C0]/50 animate-pulse',
    stale: 'bg-[#334155]/60 text-[#E2E8F0] border-[#94A3B8]/50',
    limited_scope: 'bg-[#334155]/70 text-[#F8FAFC] border-[#6DA5C0]/45',
    unconnected: 'bg-[#1A1A1A]/75 text-[#94A3B8] border-[#6B6B6B]/40',
    connecting: 'bg-[#072E33]/70 text-[#6DA5C0] border-[#0F969C]/45',
    permission_denied: 'bg-[#1A1A1A]/85 text-[#FFFFFF] border-[#D9D9D9]/50',
    failed: 'bg-[#1A1A1A]/85 text-[#FFFFFF] border-[#D9D9D9]/60',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.replace('_', ' ')}
    </span>
  );
};

function renderLockMessage(reason: LockReason): string {
  switch (reason.code) {
    case 'phase_gate_blocked':
      return `Blocked by Phase Gate (${reason.requiredPhase}). Complete attestation in /project/blueprint.`;
    case 'missing_permission':
      return `Requires role "${reason.requiredRole}" to modify connector credentials.`;
    case 'provider_disconnected':
      return `Provider "${reason.provider}" is disconnected. Authorize OAuth scope first.`;
    case 'no_project_selected':
      return 'Select or create an active VYRON project in /project/genesis.';
  }
}

export function SectionStateBoundary<T>({
  state,
  onRetry,
  children,
}: {
  state: SectionState<T>;
  onRetry?: () => void;
  children: (data: T, meta: { isStale: boolean; timestamp?: string }) => React.ReactNode;
}) {
  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <GlassCard3D family="obsidian" className="flex min-h-[220px] flex-col items-center justify-center gap-3">
        <RefreshCw className="h-6 w-6 animate-spin text-[#0F969C]" />
        <p className="font-mono text-xs tracking-wider text-[#94A3B8] uppercase">
          {state.status === 'loading' && state.stage
            ? `${state.stage} (${state.progress ?? 0}%)`
            : 'Initializing volumetric connector telemetry...'}
        </p>
      </GlassCard3D>
    );
  }

  if (state.status === 'locked') {
    return (
      <GlassCard3D family="obsidian" className="border-[#6DA5C0]/40">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 text-[#6DA5C0]" />
          <div>
            <h4 className="text-sm font-semibold text-[#F8FAFC]">Section Locked</h4>
            <p className="mt-1 text-xs text-[#94A3B8]">{renderLockMessage(state.reason)}</p>
          </div>
        </div>
      </GlassCard3D>
    );
  }

  if (state.status === 'no_data') {
    return (
      <GlassCard3D family="slate" className="text-center">
        <p className="text-sm font-medium text-[#E2E8F0]">{state.cta}</p>
      </GlassCard3D>
    );
  }

  if (state.status === 'error') {
    return (
      <GlassCard3D family="obsidian" className="border-[#D9D9D9]/45">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 text-[#FFFFFF]" />
            <div>
              <p className="font-mono text-xs text-[#D9D9D9]">ERROR [{state.error.code}]</p>
              <p className="mt-0.5 text-sm text-[#F8FAFC]">{state.error.message}</p>
            </div>
          </div>
          {state.error.retryable && onRetry && (
            <button
              onClick={onRetry}
              className="rounded-lg border border-[#6DA5C0]/50 bg-[#0C7075]/60 px-3 py-1.5 text-xs font-semibold text-[#F8FAFC] hover:bg-[#0F969C]/70"
            >
              Retry
            </button>
          )}
        </div>
      </GlassCard3D>
    );
  }

  if (state.status === 'streaming') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-xs text-[#6DA5C0]">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          Streaming live telemetry via {state.model}...
        </div>
        {children(state.partialData as T, { isStale: false })}
      </div>
    );
  }

  if (state.status === 'stale') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-lg border border-[#94A3B8]/35 bg-[#334155]/45 px-3 py-1.5 font-mono text-xs text-[#E2E8F0]">
          <Clock className="h-3.5 w-3.5 text-[#6DA5C0]" />
          Data stale since {state.staleSince}. Trigger sync to refresh.
        </div>
        {children(state.data, { isStale: true, timestamp: state.staleSince })}
      </div>
    );
  }

  return <>{children(state.data, { isStale: false, timestamp: state.analyzedAt })}</>;
}
