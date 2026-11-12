import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/connectors/')({
  component: () => <Navigate to="/connectors/github" replace />,
});
