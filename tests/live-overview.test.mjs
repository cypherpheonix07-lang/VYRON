import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchLiveOverview } from '../src/services/project/liveOverview.ts';

function fixture(overrides = {}, authenticated = true) {
  const calls = [];
  const responses = {
    projects: { data: { id: 'project-a', name: 'Real project', health_score: 0 }, error: null },
    project_repos: { data: [], error: null },
    requirements: { data: null, count: 0, error: null },
    ...overrides,
  };
  const client = {
    auth: { getUser: async () => ({ data: { user: authenticated ? { id: 'user-a' } : null }, error: null }) },
    from(table) {
      const call = { table, columns: null, filters: [] }; calls.push(call);
      const builder = {
        select(columns) { call.columns = columns; return builder; },
        eq(key, value) { call.filters.push([key, value]); return builder; },
        order() { return builder; },
        maybeSingle() { return Promise.resolve(responses[table]); },
        then(resolve, reject) { return Promise.resolve(responses[table]).then(resolve, reject); },
      };
      return builder;
    },
  };
  return { client, calls };
}

test('returns persisted zero values and no fabricated metrics', async () => {
  const { client, calls } = fixture();
  const result = await fetchLiveOverview(client, 'project-a');
  assert.equal(result.project.health_score, 0);
  assert.equal(result.requirementCount, 0);
  assert.deepEqual(result.repositories, []);
  assert.equal(result.securityScore, undefined);
  assert.deepEqual(calls.map(c => c.filters), [[['id', 'project-a']], [['project_id', 'project-a']], [['project_id', 'project-a']]]);
  assert.equal(calls[1].columns.includes('secret'), false);
  assert.equal(calls[1].columns.includes('*'), false);
});
test('requires authentication before any database query', async () => {
  const { client, calls } = fixture({}, false);
  await assert.rejects(fetchLiveOverview(client, 'project-a'), /Sign in/);
  assert.equal(calls.length, 0);
});
test('missing or inaccessible project never falls back to another project', async () => {
  const { client, calls } = fixture({ projects: { data: null, error: null } });
  assert.equal(await fetchLiveOverview(client, 'missing'), null);
  assert.equal(calls.length, 1);
});
test('project database failure is not converted into sample data', async () => {
  const { client } = fixture({ projects: { data: null, error: { code: '42501' } } });
  await assert.rejects(fetchLiveOverview(client, 'project-a'), /42501/);
});
test('unavailable child queries are unknown, not false zero or disconnected', async () => {
  const { client } = fixture({
    project_repos: { data: null, error: { code: '42P01' } },
    requirements: { count: null, error: { code: '42501' } },
  });
  const result = await fetchLiveOverview(client, 'project-a');
  assert.equal(result.repositories, null);
  assert.equal(result.requirementCount, null);
  assert.equal(result.warnings.length, 2);
});
test('repository binding and synchronization status come from records', async () => {
  const binding = { id: 'binding-a', repo_full_name: 'owner/repo', sync_status: 'failed', last_synced_at: null };
  const { client } = fixture({ project_repos: { data: [binding], error: null } });
  const result = await fetchLiveOverview(client, 'project-a');
  assert.deepEqual(result.repositories, [binding]);
  assert.equal(result.repositories[0].sync_status, 'failed');
});
