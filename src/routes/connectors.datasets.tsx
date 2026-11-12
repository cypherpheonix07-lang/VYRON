import { createFileRoute } from '@tanstack/react-router';
import { DatasetManager } from '@/components/connectors/datasets/DatasetManager';

export const Route = createFileRoute('/connectors/datasets')({
  head: () => ({
    meta: [
      { title: 'Dataset Manager (S29) — VYRON' },
      {
        name: 'description',
        content: 'Kaggle dataset ingestion, custom data uploads, and synthetic data generation.',
      },
    ],
  }),
  component: () => <DatasetManager projectId="proj_active_01" />,
});

export const DatasetManagerRoute = Route;
