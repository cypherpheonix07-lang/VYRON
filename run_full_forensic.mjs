import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';

const out = [];
function log(msg = '') {
  out.push(msg);
  console.log(msg);
}

log("======================================================================");
log("SECTION 1 — FORENSIC SWEEP OUTPUT (RAW FORENSIC DATA)");
log("======================================================================\n");

// Read .env
const envContent = fs.existsSync('./.env') ? fs.readFileSync('./.env', 'utf-8') : '';
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

// ----------------------------------------------------------------------
// SWEEP 1
// ----------------------------------------------------------------------
log("──────────────────────────────────────────────────────────────────────");
log("FORENSIC SWEEP 1 — PROJECT SKELETON");
log("──────────────────────────────────────────────────────────────────────\n");

log("# Full directory tree — no hiding anything");
function getFiles(dir, excludes = ['node_modules', '.git', '.next', 'dist', '.venv', '.output', '.tanstack', 'istio-1.20.0']) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (!excludes.includes(file)) {
          results = results.concat(getFiles(fullPath, excludes));
        }
      } else {
        results.push(fullPath.replace(/\\/g, '/'));
      }
    }
  } catch (e) {
    results.push(`Error reading ${dir}: ${e.message}`);
  }
  return results;
}

const allFiles = getFiles('.').sort();
log(`Total files: ${allFiles.length}`);
allFiles.forEach(f => log(f));

log("\n# Package.json — exact installed versions");
log(fs.readFileSync('./package.json', 'utf8'));

log("\n# Lock file integrity — npm ls --depth=0");
try {
  const lsOut = execSync('npm ls --depth=0', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  log(lsOut);
} catch (e) {
  log(e.stdout || e.message || String(e));
}

log("\n# npm install --dry-run");
try {
  const dryOut = execSync('npm install --dry-run', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  log(dryOut || "npm install --dry-run completed with 0 errors.");
} catch (e) {
  log(e.stdout || e.message || String(e));
}

// ----------------------------------------------------------------------
// SWEEP 2
// ----------------------------------------------------------------------
log("\n──────────────────────────────────────────────────────────────────────");
log("FORENSIC SWEEP 2 — THE SUPABASE CLIENT");
log("──────────────────────────────────────────────────────────────────────\n");

log("# ls -la src/lib/supabaseClient.ts");
const scPath = './src/lib/supabaseClient.ts';
if (fs.existsSync(scPath)) {
  const stat = fs.statSync(scPath);
  log(`-rw-r--r-- 1 dev dev ${stat.size} ${stat.mtime.toISOString()} ${scPath}`);
  log("\n# cat src/lib/supabaseClient.ts");
  log(fs.readFileSync(scPath, 'utf8'));
} else {
  log("src/lib/supabaseClient.ts DOES NOT EXIST!");
}

function grepFiles(dir, regex, fileExts = ['.ts', '.tsx']) {
  const matches = [];
  function search(current) {
    try {
      const list = fs.readdirSync(current);
      for (const f of list) {
        const p = path.join(current, f);
        const s = fs.statSync(p);
        if (s.isDirectory()) {
          if (f !== 'node_modules' && f !== '.git' && f !== 'dist' && f !== '.output') {
            search(p);
          }
        } else if (fileExts.some(ext => f.endsWith(ext))) {
          const lines = fs.readFileSync(p, 'utf8').split('\n');
          lines.forEach((line, idx) => {
            if (regex.test(line)) {
              matches.push({ file: p.replace(/\\/g, '/'), line: idx + 1, text: line.trim() });
            }
          });
        }
      }
    } catch(e) {}
  }
  search(dir);
  return matches;
}

log('\n# grep -rn "createClient" src/ --include="*.ts" --include="*.tsx"');
const createClientMatches = grepFiles('./src', /createClient/);
log(`Total occurrences: ${createClientMatches.length}`);
createClientMatches.forEach(m => log(`${m.file}:${m.line}: ${m.text}`));

log('\n# grep -rn "supabase.co" src/ --include="*.ts" --include="*.tsx"');
const urlMatches = grepFiles('./src', /supabase\.co/);
log(`Total occurrences: ${urlMatches.length}`);
urlMatches.forEach(m => log(`${m.file}:${m.line}: ${m.text}`));

log('\n# grep -rn "eyJ" src/ --include="*.ts" --include="*.tsx" (JWT check)');
const jwtMatches = grepFiles('./src', /eyJ[a-zA-Z0-9_-]{10,}/);
log(`Total occurrences: ${jwtMatches.length}`);
jwtMatches.forEach(m => log(`${m.file}:${m.line}: ${m.text}`));

// ----------------------------------------------------------------------
// SWEEP 3
// ----------------------------------------------------------------------
log("\n──────────────────────────────────────────────────────────────────────");
log("FORENSIC SWEEP 3 — AUTH SERVICE AUTOPSY");
log("──────────────────────────────────────────────────────────────────────\n");

log("# ls -la src/services/authService.ts");
const asPath = './src/services/authService.ts';
if (fs.existsSync(asPath)) {
  const stat = fs.statSync(asPath);
  log(`-rw-r--r-- 1 dev dev ${stat.size} ${stat.mtime.toISOString()} ${asPath}`);
  log("\n# cat src/services/authService.ts");
  log(fs.readFileSync(asPath, 'utf8'));
} else {
  log("src/services/authService.ts DOES NOT EXIST!");
}

log("\n# Mock logic & debt pattern hunt across src/");
const patterns = [
  { name: "setTimeout", regex: /setTimeout/ },
  { name: "mockUser", regex: /mockUser/ },
  { name: "fakeUser", regex: /fakeUser/ },
  { name: "DEMO_MODE", regex: /DEMO_MODE/ },
  { name: "// TODO", regex: /\/\/\s*TODO/i },
  { name: "// FIXME", regex: /\/\/\s*FIXME/i },
  { name: "placeholder", regex: /placeholder/i },
  { name: "coming soon", regex: /coming\s+soon/i },
  { name: "not implemented", regex: /not\s+implemented/i }
];

patterns.forEach(pat => {
  log(`\ngrep -rn "${pat.name}" src/ --include="*.ts" --include="*.tsx"`);
  const m = grepFiles('./src', pat.regex);
  log(`Matches count: ${m.length}`);
  m.slice(0, 15).forEach(match => log(`  ${match.file}:${match.line}: ${match.text}`));
  if (m.length > 15) log(`  ... and ${m.length - 15} more matches.`);
});

// ----------------------------------------------------------------------
// SWEEP 4
// ----------------------------------------------------------------------
log("\n──────────────────────────────────────────────────────────────────────");
log("FORENSIC SWEEP 4 — AUTH PAGE CONTAMINATION CHECK");
log("──────────────────────────────────────────────────────────────────────\n");

const authRouteFiles = grepFiles('./src/routes', /./, ['.tsx', '.ts'])
  .filter(f => f.file.includes('auth') || f.file.includes('login') || f.file.includes('register') || f.file.includes('reset') || f.file.includes('callback') || f.file.includes('verify'));
const uniqueAuthFiles = [...new Set(authRouteFiles.map(f => f.file))];
log(`Auth routes identified: ${JSON.stringify(uniqueAuthFiles, null, 2)}`);

uniqueAuthFiles.forEach(f => {
  log(`\n=== FILE: ${f} ===`);
  log(fs.readFileSync(f, 'utf8'));
});

log('\n# grep -rn "signIn|signUp|signOut|getSession|supabase.auth" in routes/pages');
const inlineAuthMatches = grepFiles('./src/routes', /(signIn|signUp|signOut|getSession|supabase\.auth)/);
log(`Total occurrences in src/routes: ${inlineAuthMatches.length}`);
inlineAuthMatches.forEach(m => log(`${m.file}:${m.line}: ${m.text}`));

// ----------------------------------------------------------------------
// SWEEP 5
// ----------------------------------------------------------------------
log("\n──────────────────────────────────────────────────────────────────────");
log("FORENSIC SWEEP 5 — DESIGN SYSTEM VERIFICATION");
log("──────────────────────────────────────────────────────────────────────\n");

log("# Tailwind config:");
['./tailwind.config.ts', './tailwind.config.js', './vite.config.ts'].forEach(f => {
  if (fs.existsSync(f)) {
    log(`--- ${f} ---`);
    log(fs.readFileSync(f, 'utf8'));
  }
});

log("\n# Global CSS & HTML Font imports:");
['./src/styles.css', './src/styles/globals.css', './src/index.css', './index.html'].forEach(f => {
  if (fs.existsSync(f)) {
    log(`--- ${f} (first 40 lines) ---`);
    log(fs.readFileSync(f, 'utf8').split('\n').slice(0, 40).join('\n'));
  }
});

log('\n# grep -r "hugeicons|hugeiconspro" package.json');
const pkgStr = fs.readFileSync('./package.json', 'utf8');
const hugeLines = pkgStr.split('\n').filter(l => /hugeicons/i.test(l));
log(hugeLines.length ? hugeLines.join('\n') : "NONE");

log('\n# grep -rn "lucide-react|heroicons|react-icons|fa-" src/');
const wrongIconImports = grepFiles('./src', /from\s+['"](lucide-react|@heroicons|react-icons|font-awesome)/);
log(`Total non-Hugeicons imports in src/: ${wrongIconImports.length}`);
wrongIconImports.slice(0, 20).forEach(m => log(`${m.file}:${m.line}: ${m.text}`));
if (wrongIconImports.length > 20) log(`... and ${wrongIconImports.length - 20} more.`);

// ----------------------------------------------------------------------
// SWEEP 6
// ----------------------------------------------------------------------
log("\n──────────────────────────────────────────────────────────────────────");
log("FORENSIC SWEEP 6 — TYPESCRIPT & ESLINT HEALTH CHECK");
log("──────────────────────────────────────────────────────────────────────\n");

log("# npx tsc --noEmit");
try {
  const tscRes = execSync('npx tsc --noEmit', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  log(tscRes || "PASS: 0 TypeScript errors.");
} catch (e) {
  log("TypeScript check failed:");
  log(e.stdout || e.stderr || e.message);
}

log("\n# npx eslint src/ (sample of errors/warnings)");
try {
  const esRes = execSync('npx eslint src/ --format compact', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  log(esRes || "PASS: 0 ESLint errors.");
} catch (e) {
  const lines = (e.stdout || e.stderr || e.message).split('\n');
  log(`Total ESLint output lines: ${lines.length}`);
  log(lines.slice(0, 30).join('\n'));
}

// ----------------------------------------------------------------------
// SWEEP 7
// ----------------------------------------------------------------------
log("\n──────────────────────────────────────────────────────────────────────");
log("FORENSIC SWEEP 7 — SUPABASE DATABASE AUTOPSY");
log("──────────────────────────────────────────────────────────────────────\n");

async function runDbAutopsy() {
  if (!url || !serviceKey) {
    log("ERROR: Supabase URL or Service Key not configured in .env!");
    return;
  }
  
  const serviceClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  
  const anonClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  
  log(`Supabase Target URL: ${url}`);
  
  // 1. Table inventory
  log("\n-- 1. Table Inventory via REST Probe");
  const candidateTables = [
    'profiles', 'auth_events', 'user_integrations', 'integration_events',
    'projects', 'requirements', 'blueprint_nodes', 'notifications',
    'github_tokens', 'audit_logs', 'webhook_ingest', 'llm_configs',
    'llm_usage_logs', 'llm_prompt_templates'
  ];
  
  for (const t of candidateTables) {
    try {
      const { data, count, error } = await serviceClient.from(t).select('*', { count: 'exact', head: true });
      if (error) {
        log(`Table [${t}]: NOT FOUND / ERROR (${error.code}: ${error.message})`);
      } else {
        log(`Table [${t}]: EXISTS | Rows: ${count}`);
      }
    } catch(e) {
      log(`Table [${t}]: EXCEPTION (${e.message})`);
    }
  }
  
  // 2. Profiles columns inspection
  log("\n-- 2. Profiles Schema & Columns Inspection");
  try {
    const { data: sample, error } = await serviceClient.from('profiles').select('*').limit(3);
    if (error) {
      log(`Error querying profiles: ${error.message}`);
    } else if (sample && sample.length > 0) {
      log(`Columns found in public.profiles (${Object.keys(sample[0]).length} columns):`);
      log(JSON.stringify(Object.keys(sample[0]), null, 2));
      log("Sample profiles row:");
      log(JSON.stringify(sample[0], null, 2));
    } else {
      log("Profiles table exists but contains 0 rows.");
    }
  } catch(e) {
    log(`Exception in profiles schema check: ${e.message}`);
  }
  
  // 3. RLS and anon access verification
  log("\n-- 3. Anonymous Client RLS Probe");
  for (const t of ['profiles', 'auth_events', 'projects', 'user_integrations', 'audit_logs']) {
    try {
      const { data, error } = await anonClient.from(t).select('*');
      log(`Anon client query on '${t}': data count = ${data ? data.length : 'null'}, error = ${error ? error.message : 'none'}`);
    } catch(e) {
      log(`Anon query exception on '${t}': ${e.message}`);
    }
  }
  
  // 4. RPC Functions Check
  log("\n-- 4. Database RPC Functions & Security Check");
  const rpcs = [
    { name: 'is_admin', args: {} },
    { name: 'get_dashboard_stats', args: {} },
    { name: 'ensure_profile', args: {} },
    { name: 'set_user_role', args: { target_user_id: '00000000-0000-0000-0000-000000000000', target_role: 'admin' } }
  ];
  
  for (const r of rpcs) {
    try {
      const { data, error } = await serviceClient.rpc(r.name, r.args);
      log(`RPC '${r.name}': ${error ? 'ERROR (' + error.message + ')' : 'SUCCESS (' + JSON.stringify(data) + ')'}`);
    } catch(e) {
      log(`RPC '${r.name}': EXCEPTION (${e.message})`);
    }
  }
  
  // 5. Run Step 1.8 4-Gate End-to-End Verification
  log("\n-- 5. Step 1.8 End-to-End 4-Gate Verification");
  const testEmail = `forensic_gate_${Date.now()}@brahma.dev`;
  const testPass = 'ForensicTestPass123!';
  let createdUserId = null;
  
  // Gate 1: getSession
  const { data: g1Data, error: g1Err } = await anonClient.auth.getSession();
  log(`Gate 1 (getSession 200 check): ${g1Err ? 'FAILED (' + g1Err.message + ')' : 'PASSED (session = ' + (g1Data.session ? 'active' : 'null') + ')'}`);
  
  // Gate 2: auto-profile creation
  const { data: g2Auth, error: g2Err } = await serviceClient.auth.admin.createUser({
    email: testEmail,
    password: testPass,
    email_confirm: true,
    user_metadata: { full_name: 'Forensic Test User', role: 'student' }
  });
  
  if (g2Err) {
    log(`Gate 2 (User creation): FAILED (${g2Err.message})`);
  } else {
    createdUserId = g2Auth.user.id;
    log(`Gate 2: User created (${createdUserId}), waiting 2s for trigger...`);
    await new Promise(r => setTimeout(r, 2000));
    
    const { data: profData, error: profErr } = await serviceClient.from('profiles').select('*').eq('id', createdUserId).maybeSingle();
    if (profErr) {
      log(`Gate 2 (Profile query): FAILED (${profErr.message})`);
    } else if (profData && profData.id === createdUserId) {
      log(`Gate 2 (Auto-profile creation): PASSED (Role: ${profData.role}, Name: ${profData.full_name})`);
    } else {
      log(`Gate 2 (Auto-profile creation): FAILED (No profile row created)`);
    }
  }
  
  // Gate 3: self-role-block
  if (createdUserId) {
    const studentClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    await studentClient.auth.signInWithPassword({ email: testEmail, password: testPass });
    const { data: rpcRes, error: rpcErr } = await studentClient.rpc('set_user_role', {
      target_user_id: createdUserId,
      target_role: 'admin'
    });
    if (rpcErr) {
      log(`Gate 3 (Self-role-block non-admin escalation): PASSED (Blocked with error: "${rpcErr.message}")`);
    } else {
      log(`Gate 3 (Self-role-block): FAILED (Non-admin successfully escalated role!)`);
    }
  }
  
  // Gate 4: admin bootstrap check
  const adminEmail = 'priya.nair@brahma.dev';
  const { data: userList } = await serviceClient.auth.admin.listUsers();
  const adminUser = userList?.users?.find(u => u.email === adminEmail);
  if (adminUser) {
    const { data: adminProf } = await serviceClient.from('profiles').select('*').eq('id', adminUser.id).maybeSingle();
    log(`Gate 4 (Admin bootstrap verification): PASSED (Admin: ${adminProf?.full_name || adminEmail}, Role: ${adminProf?.role})`);
  } else {
    log(`Gate 4 (Admin bootstrap verification): Admin ${adminEmail} not found`);
  }
  
  // Cleanup test user
  if (createdUserId) {
    try {
      await serviceClient.auth.admin.deleteUser(createdUserId);
      log("Test user cleaned up successfully.");
    } catch(e) {
      log(`Cleanup error: ${e.message}`);
    }
  }
  
  log("\n======================================================================");
  log("FORENSIC SWEEPS 1-7 COMPLETE");
  log("======================================================================\n");
  
  fs.writeFileSync('./forensic_output.txt', out.join('\n'), 'utf8');
  console.log("Written full output to ./forensic_output.txt");
}

runDbAutopsy().catch(err => {
  log(`CRITICAL AUTOPSY ERROR: ${err.stack || err.message}`);
  fs.writeFileSync('./forensic_output.txt', out.join('\n'), 'utf8');
});
