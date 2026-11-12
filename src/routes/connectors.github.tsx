import { createFileRoute } from '@tanstack/react-router';
import { GitHubConnectorHub } from '@/components/connectors/github/GitHubConnectorHub';

export const Route = createFileRoute('/connectors/github')({
  head: () => ({
    meta: [
      { title: 'GitHub Connector Hub (S27) — VYRON' },
      {
        name: 'description',
        content: 'Authorized GitHub repository binding, pull request analysis, and commit scanning.',
      },
    ],
  }),
  component: () => <GitHubConnectorHub projectId="proj_active_01" />,
});

export const GitHubConnectorRoute = Route;
