import fs from 'fs';

const envContent = fs.readFileSync('./.env', 'utf-8');
const env = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let val = match[2].trim().replace(/^['"]|['"]$/g, '');
    env[match[1]] = val;
  }
});

const endpoints = [
  '/pg/query',
  '/pg/v1/query',
  '/rest/v1/rpc/exec',
  '/rest/v1/rpc/execute',
  '/database/query',
  '/api/v1/query',
  '/api/pg/query'
];

async function testEndpoints() {
  for (const ep of endpoints) {
    try {
      const res = await fetch(env.SUPABASE_URL + ep, {
        method: 'POST',
        headers: {
          apikey: env.SUPABASE_SECRET_KEY,
          Authorization: 'Bearer ' + env.SUPABASE_SECRET_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: 'SELECT 1;' })
      });
      console.log(ep, res.status, res.statusText);
      const txt = await res.text();
      if (res.status !== 404) {
        console.log('Response body:', txt.slice(0, 200));
      }
    } catch (e) {
      console.log(ep, 'Error:', e.message);
    }
  }
}

testEndpoints();
