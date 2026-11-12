// ============================================================================
// FILE 2: src/routes/connectors.tsx & Child TanStack Router Routes
// Implements AuthGuard, ProjectGuard & Unified S27–S29 Navigation Shell
// ============================================================================
import React from 'react';
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router';
import { Database, Github, Grid3X3 } from 'lucide-react';
import { GlassCard3D } from '@/components/connectors/ConnectorGlassPrimitives';
import { GitHubConnectorHub } from '@/components/connectors/github/GitHubConnectorHub';
import { IntegrationsMarketplace } from '@/components/connectors/integrations/IntegrationsMarketplace';
import { DatasetManager } from '@/components/connectors/datasets/DatasetManager';

export const Route = createFileRoute('/connectors')({
  head: () => ({
    meta: [
      { title: 'Connectors & Ingestion Hub — VYRON' },
      {
        name: 'description',
        content: 'Repository, Integration, and Dataset Services across S27–S29.',
      },
    ],
  }),
  beforeLoad: ({ context }) => {
    const auth = (context as { auth?: { isAuthenticated: boolean; activeProjectId?: string } })?.auth;
    if (auth && !auth.isAuthenticated) {
      throw redirect({ to: '/auth' as any });
    }
    if (auth && !auth.activeProjectId) {
      throw redirect({ to: '/app' as any });
    }
  },
  component: ConnectorsShellLayout,
});

export const ConnectorsLayoutRoute = Route;

function ConnectorsShellLayout() {
  const navItems = [
    {
      to: '/connectors/github',
      id: 'S27',
      label: 'GitHub Connector Hub',
      icon: Github,
    },
    {
      to: '/connectors/integrations',
      id: 'S28',
      label: 'Integrations Marketplace',
      icon: Grid3X3,
    },
    {
      to: '/connectors/datasets',
      id: 'S29',
      label: 'Dataset Manager',
      icon: Database,
    },
  ] as const;

  return (
    <div
      style={{ background: 'var(--vyron-ng-ambient)' }}
      className="min-h-screen w-full px-6 py-6 text-[#F8FAFC]"
    >
      <div className="mx-auto max-w-[1440px] space-y-6">
        {/* Domain Header & Sub-Module Switcher */}
        <GlassCard3D family="obsidian" elevated className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.14em] text-[#6DA5C0] uppercase">
                DOMAIN G · REPOSITORY, INTEGRATION & DATASET SERVICES
              </p>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-[#FFFFFF]">
                VYRON Connectors & Data Ingestion Hub
              </h1>
            </div>

            <nav className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeProps={{
                      className:
                        'border-[#0F969C] bg-[#0C7075]/60 text-[#FFFFFF] shadow-[0_0_20px_-4px_rgba(15,150,156,0.65)]',
                    }}
                    inactiveProps={{
                      className:
                        'border-[#64748B]/35 bg-[#0F172A]/55 text-[#94A3B8] hover:border-[#6DA5C0]/50 hover:text-[#F8FAFC]',
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all"
                  >
                    <Icon className="h-4 w-4 text-[#6DA5C0]" />
                    <span className="font-mono text-[10px] opacity-75">{item.id}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </GlassCard3D>

        <Outlet />
      </div>
    </div>
  );
}

// Route: /connectors/github -> S27
export const GitHubConnectorRoute = createFileRoute('/connectors/github')({
  component: () => <GitHubConnectorHub projectId="proj_active_01" />,
});

// Route: /connectors/integrations -> S28
export const IntegrationsMarketplaceRoute = createFileRoute('/connectors/integrations')({
  component: () => <IntegrationsMarketplace projectId="proj_active_01" />,
});

// Route: /connectors/datasets -> S29
export const DatasetManagerRoute = createFileRoute('/connectors/datasets')({
  component: () => <DatasetManager projectId="proj_active_01" />,
});
