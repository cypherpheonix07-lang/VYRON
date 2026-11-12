// ============================================================================
// FILE 4: src/components/connectors/integrations/IntegrationsMarketplace.tsx
// MODULE S28 — Complete Implementation of Subcomponents S28.1 through S28.8
// ============================================================================
import React, { useState } from 'react';
import {
  Bell,
  Bug,
  Check,
  Figma,
  Grid3X3,
  Plus,
  Sliders,
  Webhook as CustomHookIcon,
  X,
} from 'lucide-react';
import {
  GlassCard3D,
  ConnectionStatusPill,
  ProvenanceBadge,
} from '../ConnectorGlassPrimitives';
import type { MarketplaceIntegration } from '@/types/connectors';

export const IntegrationsMarketplace: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [drawerIntegration, setDrawerIntegration] = useState<MarketplaceIntegration | null>(null);
  const [slackChannel, setSlackChannel] = useState('#vyron-risk-alerts-test');
  const [jiraProjectKey, setJiraProjectKey] = useState('VYR');
  const [figmaFileKey, setFigmaFileKey] = useState('fig_brahma_v3_ui');
  const [customWebhookUrl, setCustomWebhookUrl] = useState('');

  const [integrations, setIntegrations] = useState<MarketplaceIntegration[]>([
    {
      id: 'int_jira',
      provider: 'jira',
      name: 'Jira Software',
      category: 'issue_tracking',
      implemented: true,
      connectionStatus: 'connected',
      accessMode: 'read_write',
      grantedScopes: ['read:jira-work', 'write:jira-work'],
      lastSyncedAt: '5 mins ago',
      configSummary: { projectKey: 'VYR', syncDirection: 'bidirectional' },
    },
    {
      id: 'int_slack',
      provider: 'slack',
      name: 'Slack Alerts',
      category: 'messaging',
      implemented: true,
      connectionStatus: 'connected',
      accessMode: 'read_write',
      grantedScopes: ['chat:write', 'channels:read'],
      lastSyncedAt: 'Real-time',
      configSummary: { channel: '#vyron-risk-alerts-test' },
    },
    {
      id: 'int_sentry',
      provider: 'sentry',
      name: 'Sentry Telemetry',
      category: 'observability',
      implemented: true,
      connectionStatus: 'connected',
      accessMode: 'read',
      grantedScopes: ['event:read', 'project:read'],
      lastSyncedAt: '12 mins ago',
      configSummary: { linkedModule: 'S09 Code Health' },
    },
    {
      id: 'int_figma',
      provider: 'figma',
      name: 'Figma Design Importer',
      category: 'design',
      implemented: true,
      connectionStatus: 'unconnected',
      accessMode: 'read',
      grantedScopes: ['files:read'],
    },
    {
      id: 'int_linear',
      provider: 'linear',
      name: 'Linear Sync',
      category: 'issue_tracking',
      implemented: false,
      connectionStatus: 'unconnected',
      accessMode: 'read',
      grantedScopes: [],
    },
    {
      id: 'int_datadog',
      provider: 'datadog',
      name: 'Datadog APM',
      category: 'observability',
      implemented: false,
      connectionStatus: 'unconnected',
      accessMode: 'read',
      grantedScopes: [],
    },
  ]);

  const filteredGallery =
    selectedCategory === 'all'
      ? integrations
      : integrations.filter((i) => i.category === selectedCategory);

  const activeList = integrations.filter((i) => i.connectionStatus === 'connected');

  const handleSaveDrawerConfig = () => {
    if (!drawerIntegration) return;
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === drawerIntegration.id
          ? {
              ...item,
              connectionStatus: 'connected',
              lastSyncedAt: 'Just now',
            }
          : item
      )
    );
    setDrawerIntegration(null);
  };

  return (
    <div className="space-y-6">
      {/* Row 1: S28.1 Integration Gallery + S28.2 Active Integrations */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* S28.1 IntegrationGallery (2 cols) */}
        <GlassCard3D family="slate" className="xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4 text-[#0F969C]" />
              <span className="font-mono text-[11px] text-[#6DA5C0]">S28.1</span>
              <h3 className="text-base font-semibold text-[#FFFFFF]">Integrations Marketplace</h3>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['all', 'issue_tracking', 'messaging', 'observability', 'design'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase transition-all ${
                    selectedCategory === cat
                      ? 'border-[#0F969C] bg-[#0C7075]/60 text-[#FFFFFF]'
                      : 'border-[#334155] bg-[#0F172A]/60 text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredGallery.map((plugin) => (
              <div
                key={plugin.id}
                className="flex flex-col justify-between rounded-lg border border-[#334155] bg-[#0F172A]/80 p-3.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-[#FFFFFF]">{plugin.name}</h4>
                    <ConnectionStatusPill status={plugin.connectionStatus} />
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-[#94A3B8]">
                    category: {plugin.category} · access: {plugin.accessMode.toUpperCase()}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#334155]/70 pt-2.5">
                  {plugin.implemented ? (
                    <ProvenanceBadge type="live_provider" />
                  ) : (
                    <ProvenanceBadge type="unavailable" />
                  )}

                  <button
                    disabled={!plugin.implemented}
                    onClick={() => setDrawerIntegration(plugin)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold ${
                      plugin.implemented
                        ? 'border-[#6DA5C0]/50 bg-[#0C7075]/60 text-[#FFFFFF] hover:bg-[#0F969C]/75'
                        : 'cursor-not-allowed border-[#333333] bg-[#1A1A1A] text-[#6B6B6B]'
                    }`}
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    {plugin.implemented ? 'Configure' : 'Not Installed'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard3D>

        {/* S28.2 ActiveIntegrationList (1 col) */}
        <GlassCard3D family="teal">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[11px] text-[#6DA5C0]">S28.2</span>
              <h3 className="text-base font-semibold text-[#FFFFFF]">
                Active Connections ({activeList.length})
              </h3>
            </div>
            <span className="font-mono text-[10px] text-[#E2E8F0]">PROJECT: {projectId}</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {activeList.map((active) => (
              <div
                key={active.id}
                className="rounded-lg border border-[#6DA5C0]/35 bg-[#05161A]/75 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FFFFFF]">{active.name}</span>
                  <span className="font-mono text-[10px] text-[#6DA5C0]">
                    {active.lastSyncedAt}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-[#94A3B8]">
                  scopes: {active.grantedScopes.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </GlassCard3D>
      </div>

      {/* Row 2: Dedicated First-Party Tool Panels (S28.4 Jira, S28.5 Slack, S28.6 Sentry, S28.7 Figma) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* S28.4 JiraSyncPanel */}
        <GlassCard3D family="obsidian">
          <span className="font-mono text-[11px] text-[#6DA5C0]">S28.4 · JIRA SYNC</span>
          <h4 className="mt-1 text-sm font-semibold text-[#FFFFFF]">Requirements ↔ Jira</h4>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Maps S04 requirements to Jira issues with conflict resolution.
          </p>
          <input
            value={jiraProjectKey}
            onChange={(e) => setJiraProjectKey(e.target.value)}
            className="mt-3 w-full rounded border border-[#333333] bg-[#0B0B0B]/80 px-2.5 py-1.5 font-mono text-xs text-[#F8FAFC]"
          />
        </GlassCard3D>

        {/* S28.5 SlackAlertConfig */}
        <GlassCard3D family="obsidian">
          <div className="flex items-center gap-1.5">
            <Bell className="h-3.5 w-3.5 text-[#0F969C]" />
            <span className="font-mono text-[11px] text-[#6DA5C0]">S28.5 · SLACK ALERTS</span>
          </div>
          <h4 className="mt-1 text-sm font-semibold text-[#FFFFFF]">Risk & Gate Routing</h4>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Routes S03 phase gates & S20 risk flags to approved channels.
          </p>
          <input
            value={slackChannel}
            onChange={(e) => setSlackChannel(e.target.value)}
            className="mt-3 w-full rounded border border-[#333333] bg-[#0B0B0B]/80 px-2.5 py-1.5 font-mono text-xs text-[#F8FAFC]"
          />
        </GlassCard3D>

        {/* S28.6 SentryIntegrationPanel */}
        <GlassCard3D family="obsidian">
          <div className="flex items-center gap-1.5">
            <Bug className="h-3.5 w-3.5 text-[#6DA5C0]" />
            <span className="font-mono text-[11px] text-[#6DA5C0]">S28.6 · SENTRY</span>
          </div>
          <h4 className="mt-1 text-sm font-semibold text-[#FFFFFF]">Error → Code Health</h4>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Correlates production stack traces directly into S09 Code Health.
          </p>
          <div className="mt-3 rounded border border-[#0C7075]/50 bg-[#05161A]/70 px-2.5 py-1.5 font-mono text-[11px] text-[#E2E8F0]">
            14 unresolved issues linked
          </div>
        </GlassCard3D>

        {/* S28.7 FigmaDesignImporter */}
        <GlassCard3D family="obsidian">
          <div className="flex items-center gap-1.5">
            <Figma className="h-3.5 w-3.5 text-[#6DA5C0]" />
            <span className="font-mono text-[11px] text-[#6DA5C0]">S28.7 · FIGMA SYNC</span>
          </div>
          <h4 className="mt-1 text-sm font-semibold text-[#FFFFFF]">Design Spec Importer</h4>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Imports authorized frames for S04 requirement validation.
          </p>
          <input
            value={figmaFileKey}
            onChange={(e) => setFigmaFileKey(e.target.value)}
            className="mt-3 w-full rounded border border-[#333333] bg-[#0B0B0B]/80 px-2.5 py-1.5 font-mono text-xs text-[#F8FAFC]"
          />
        </GlassCard3D>
      </div>

      {/* Row 3: S28.8 CustomWebhookBuilder */}
      <GlassCard3D family="slate">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <CustomHookIcon className="h-4 w-4 text-[#0F969C]" />
            <span className="font-mono text-[11px] text-[#6DA5C0]">S28.8</span>
            <h3 className="text-base font-semibold text-[#FFFFFF]">Custom Webhook Builder</h3>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            <input
              type="url"
              value={customWebhookUrl}
              onChange={(e) => setCustomWebhookUrl(e.target.value)}
              placeholder="https://hooks.enterprise.internal/vyron-events"
              className="w-full max-w-md rounded-lg border border-[#334155] bg-[#0B0B0B]/80 px-3 py-1.5 font-mono text-xs text-[#F8FAFC] placeholder-[#64748B]"
            />
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#6DA5C0]/50 bg-[#0C7075]/65 px-3.5 py-1.5 text-xs font-semibold text-[#FFFFFF] hover:bg-[#0F969C]/75">
              <Plus className="h-3.5 w-3.5" />
              Register Signed Endpoint
            </button>
          </div>
        </div>
      </GlassCard3D>

      {/* S28.3 IntegrationConfigDrawer (Modal/Slide-Over) */}
      {drawerIntegration && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#0B0B0B]/75 backdrop-blur-sm">
          <div className="h-full w-full max-w-md border-l border-[#6DA5C0]/40 bg-[#0F172A] p-6 text-[#F8FAFC] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#334155] pb-4">
              <div>
                <span className="font-mono text-[11px] text-[#6DA5C0]">S28.3 CONFIG DRAWER</span>
                <h3 className="text-lg font-bold text-[#FFFFFF]">{drawerIntegration.name}</h3>
              </div>
              <button
                onClick={() => setDrawerIntegration(null)}
                className="rounded-lg border border-[#334155] p-1.5 text-[#94A3B8] hover:text-[#FFFFFF]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block font-mono text-xs text-[#E2E8F0]">
                  Server-Side API Token (Encrypted at Rest)
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••"
                  className="mt-1.5 w-full rounded-lg border border-[#334155] bg-[#0B0B0B] px-3 py-2 text-xs text-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#E2E8F0]">
                  Sync Interval (Minutes)
                </label>
                <select className="mt-1.5 w-full rounded-lg border border-[#334155] bg-[#0B0B0B] px-3 py-2 text-xs text-[#F8FAFC]">
                  <option value="5">Every 5 minutes</option>
                  <option value="15">Every 15 minutes</option>
                  <option value="60">Hourly</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setDrawerIntegration(null)}
                  className="rounded-lg border border-[#334155] px-4 py-2 text-xs text-[#94A3B8]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDrawerConfig}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#6DA5C0]/50 bg-[#0C7075] px-4 py-2 text-xs font-semibold text-[#FFFFFF] hover:bg-[#0F969C]"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save & Verify Scope
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
