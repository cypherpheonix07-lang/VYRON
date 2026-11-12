import { createFileRoute } from '@tanstack/react-router';
import { IntegrationsMarketplace } from '@/components/connectors/integrations/IntegrationsMarketplace';

export const Route = createFileRoute('/connectors/integrations')({
  head: () => ({
    meta: [
      { title: 'Integrations Marketplace (S28) — VYRON' },
      {
        name: 'description',
        content: 'Enterprise integrations for Jira, Slack, Sentry, Figma, and signed custom webhooks.',
      },
    ],
  }),
  component: () => <IntegrationsMarketplace projectId="proj_active_01" />,
});

export const IntegrationsMarketplaceRoute = Route;
