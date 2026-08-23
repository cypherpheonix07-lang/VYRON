import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('./.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SECRET_KEY;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

const serviceClient = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const anonClient = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function runAutopsy() {
  console.log('--- TABLES CHECK ---');
  const tables = ['profiles', 'auth_events', 'user_integrations', 'integration_events', 'projects', 'notifications'];
  for (const t of tables) {
    const { data, error } = await serviceClient.from(t).select('*').limit(1);
    console.log(`Table '${t}':`, error ? `ERROR: ${error.message}` : `EXISTS (${data.length} sample rows returned)`);
  }

  console.log('\n--- PROFILES DATA & COLUMNS SAMPLE ---');
  const { data: profs, error: pErr } = await serviceClient.from('profiles').select('*').limit(10);
  if (pErr) {
    console.log('Error selecting profiles:', pErr);
  } else {
    console.log(`Profiles count: ${profs.length}`);
    if (profs.length > 0) {
      console.log('Sample profile columns:', Object.keys(profs[0]));
      console.log('Sample profile rows:', JSON.stringify(profs.map(p => ({ id: p.id, email: p.email, role: p.role, full_name: p.full_name })), null, 2));
    }
  }

  console.log('\n--- PROFILES RLS CHECK (ANON SELECT) ---');
  const { data: anonProfs, error: aErr } = await anonClient.from('profiles').select('*');
  console.log('Anon select on profiles:', aErr ? `Blocked (${aErr.message})` : `LEAK / OPEN: Returned ${anonProfs.length} rows`);
}

runAutopsy();
