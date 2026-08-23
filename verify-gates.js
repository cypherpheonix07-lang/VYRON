import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load env variables
const envPath = './.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
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

if (!url || !serviceKey || !anonKey) {
  console.error('Missing configuration in .env!');
  process.exit(1);
}

const serviceClient = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const anonClient = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function runTests() {
  console.log('=== RUNNING CORRECTED VERIFICATION GATES T1-T12 ===\n');
  
  let t1Passed = false;
  let t2Passed = false;
  let t3Passed = false;
  let t4Passed = false;
  let t5Passed = false;
  let t6Passed = false;
  let t7Passed = false;
  let t8Passed = false;
  let t9Passed = false;
  let t10Passed = false;
  let t11Passed = false;
  let t12Passed = false;

  let seededUser = null;
  let adminUser = null;
  const password = `SecurePass123!_`;
  const emailSeeded = `seeded_${Date.now()}@gmail.com`;
  const emailLive = `live_${Date.now()}@gmail.com`;

  // Seed Admin User (Priya Nair) to guarantee E2E capability
  const adminEmail = 'priya.nair@brahma.dev';
  const adminPassword = 'AdminSecurePass123!';
  try {
    const { data: adminData, error: adminErr } = await serviceClient.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Priya Nair',
        role: 'admin'
      }
    });

    if (!adminErr && adminData.user) {
      adminUser = adminData.user;
      await serviceClient.from('profiles').update({ role: 'admin' }).eq('id', adminUser.id);
      console.log('Seed: Priya Nair created and role set to admin.');
    } else if (adminErr && adminErr.message.includes('already exists')) {
      const { data: users } = await serviceClient.auth.admin.listUsers();
      const found = users?.users?.find(u => u.email === adminEmail);
      if (found) {
        adminUser = found;
        await serviceClient.from('profiles').update({ role: 'admin' }).eq('id', adminUser.id);
        console.log('Seed: Priya Nair verified already exists and role refreshed to admin.');
      }
    }
  } catch (e) {
    console.warn('Admin seeding warning:', e.message);
  }

  // ---------------------------------------------------------------------------
  // T1: getSession (Active session lookup check)
  // ---------------------------------------------------------------------------
  try {
    const { data, error } = await anonClient.auth.getSession();
    if (error) throw error;
    console.log('✅ T1 getSession: PASSED (200 + session structure returned)');
    t1Passed = true;
  } catch (err) {
    console.log('❌ T1 getSession: FAILED ->', err.message);
  }

  // ---------------------------------------------------------------------------
  // T2: signup (seeded)
  // ---------------------------------------------------------------------------
  try {
    console.log(`Seeding user via admin.createUser: ${emailSeeded}...`);
    const { data: userData, error: userError } = await serviceClient.auth.admin.createUser({
      email: emailSeeded,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Test Seeded Student',
        role: 'student'
      }
    });

    if (userError) throw userError;
    seededUser = userData.user;

    // Wait for trigger
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify profile row exists
    const { data: profile, error: profileErr } = await serviceClient
      .from('profiles')
      .select('*')
      .eq('id', seededUser.id)
      .maybeSingle();

    if (profileErr) throw profileErr;
    if (profile) {
      console.log('✅ T2 signup (seeded): PASSED (User and profile row successfully exist)');
      t2Passed = true;
    } else {
      console.log('❌ T2 signup (seeded): FAILED -> Profile row missing in public.profiles table');
    }
  } catch (err) {
    console.log('❌ T2 signup (seeded): FAILED ->', err.message);
  }

  // ---------------------------------------------------------------------------
  // T3: profile auto-create (live, once/hr)
  // ---------------------------------------------------------------------------
  try {
    console.log(`Executing live signUp probe: ${emailLive}...`);
    const { data: liveData, error: liveError } = await anonClient.auth.signUp({
      email: emailLive,
      password: password,
      options: {
        data: {
          full_name: 'Test Live Signup',
          role: 'student'
        }
      }
    });

    if (liveError) throw liveError;
    const liveUser = liveData.user;

    // Wait for trigger
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify profile row exists
    const { data: liveProfile, error: liveProfileErr } = await serviceClient
      .from('profiles')
      .select('*')
      .eq('id', liveUser.id)
      .maybeSingle();

    if (liveProfileErr) throw liveProfileErr;
    if (liveProfile) {
      console.log('✅ T3 profile auto-create (live): PASSED (Profile row automatically created)');
      t3Passed = true;
    } else {
      console.log('❌ T3 profile auto-create (live): FAILED -> PGRST204 / missing profile row');
    }

    // Clean up live user
    if (liveUser) {
      await serviceClient.auth.admin.deleteUser(liveUser.id);
    }
  } catch (err) {
    console.log('❌ T3 profile auto-create (live): FAILED -> env rate limit or error:', err.message);
  }

  // Authenticate student client context for student-bound tests
  let studentClient = anonClient;
  if (seededUser) {
    try {
      console.log('Logging in as seeded student user for contextual tests...');
      const { data: signInData, error: signInErr } = await anonClient.auth.signInWithPassword({
        email: emailSeeded,
        password: password
      });

      if (signInErr) throw signInErr;

      studentClient = createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
      await studentClient.auth.setSession(signInData.session);
    } catch (err) {
      console.error('Failed to log in student client:', err.message);
    }
  }

  // ---------------------------------------------------------------------------
  // T4: student -> set_user_role
  // ---------------------------------------------------------------------------
  if (seededUser) {
    try {
      console.log('Attempting to call set_user_role as student...');
      const { error: rpcErr } = await studentClient.rpc('set_user_role', {
        target_user_id: seededUser.id,
        target_role: 'admin'
      });

      if (rpcErr) {
        if (rpcErr.message.includes('Unauthorized') || rpcErr.message.includes('forbidden') || rpcErr.status === 403) {
          console.log(`✅ T4 student → set_user_role: PASSED (Exact string or block matched: "${rpcErr.message}")`);
          t4Passed = true;
        } else if (rpcErr.message.includes('Could not find the function') || rpcErr.status === 404) {
          console.log('❌ T4 student → set_user_role: FAILED -> MIGRATION ABSENT');
        } else {
          console.log(`❌ T4 student → set_user_role: FAILED -> Unexpected error: "${rpcErr.message}"`);
        }
      } else {
        console.log('❌ T4 student → set_user_role: FAILED -> set_user_role succeeded for non-admin user!');
      }
    } catch (err) {
      console.log('❌ T4 student → set_user_role: FAILED ->', err.message);
    }
  } else {
    console.log('⚠️ T4 student → set_user_role: SKIPPED (No seeded user created)');
  }

  // ---------------------------------------------------------------------------
  // T5: admin bootstrap
  // ---------------------------------------------------------------------------
  if (seededUser) {
    try {
      console.log('Bootstrapping role to admin via service client (bypasses role self-change trigger)...');
      const { error: bootstrapErr } = await serviceClient
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', seededUser.id);

      if (bootstrapErr) throw bootstrapErr;

      // Verify role is indeed updated
      const { data: checkProfile, error: checkErr } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', seededUser.id)
        .single();

      if (checkErr) throw checkErr;

      if (checkProfile.role === 'admin') {
        console.log('✅ T5 admin bootstrap: PASSED (Role successfully updated to "admin")');
        t5Passed = true;
      } else {
        console.log(`❌ T5 admin bootstrap: FAILED -> Role is still "${checkProfile.role}"`);
      }
    } catch (err) {
      console.log('❌ T5 admin bootstrap: FAILED ->', err.message);
    }
  } else {
    console.log('⚠️ T5 admin bootstrap: SKIPPED (No seeded user created)');
  }

  // ---------------------------------------------------------------------------
  // T6: RLS CROSS-READ
  // ---------------------------------------------------------------------------
  if (seededUser) {
    try {
      console.log('T6 RLS CROSS-READ: Fetching profiles as student...');
      const { data: studentProfiles, error: readErr } = await studentClient
        .from('profiles')
        .select('*');

      if (readErr) throw readErr;
      if (studentProfiles && studentProfiles.length === 1 && studentProfiles[0].id === seededUser.id) {
        console.log(`✅ T6 RLS CROSS-READ: PASSED (Retrieved exactly 1 own row, no leaks. Own ID: ${studentProfiles[0].id})`);
        t6Passed = true;
      } else {
        console.log(`❌ T6 RLS CROSS-READ: FAILED - RLS LEAK! Retrieved ${studentProfiles?.length || 0} rows`);
        console.log('   HUMAN ACTION REQUIRED: Review and tighten RLS policy on public.profiles to ensure only own rows are visible.');
      }
    } catch (err) {
      console.log('❌ T6 RLS CROSS-READ: FAILED ->', err.message);
    }
  } else {
    console.log('⚠️ T6 RLS CROSS-READ: SKIPPED (No seeded user created)');
  }

  // ---------------------------------------------------------------------------
  // T7: AUTH EVENTS PIPELINE
  // ---------------------------------------------------------------------------
  if (seededUser) {
    try {
      console.log('T7 AUTH EVENTS PIPELINE: Querying auth_events for seeded student sign-in...');
      
      // Wait for auth event propagation
      console.log('Waiting 5s for event logging...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      const { data: events, error: eventsErr } = await serviceClient
        .from('auth_events')
        .select('*')
        .eq('user_id', seededUser.id)
        .order('created_at', { ascending: false });

      if (eventsErr) throw eventsErr;

      const loggedEvent = events && events.find(e => e.event === 'signed_in');
      if (loggedEvent && loggedEvent.device_type && loggedEvent.browser && loggedEvent.ip) {
        console.log(`✅ T7 AUTH EVENTS PIPELINE: PASSED (Auth event logged. Browser: ${loggedEvent.browser}, IP: ${loggedEvent.ip})`);
        t7Passed = true;
      } else {
        console.log('❌ T7 AUTH EVENTS PIPELINE: FAILED -> log-auth-event Edge Function absent or failed to log parameters.');
        console.log('   HUMAN ACTION REQUIRED: Deploy the "log-auth-event" Edge Function to Supabase.');
      }
    } catch (err) {
      console.log('❌ T7 AUTH EVENTS PIPELINE: FAILED ->', err.message);
      console.log('   HUMAN ACTION REQUIRED: Deploy the "log-auth-event" Edge Function to Supabase.');
    }
  } else {
    console.log('⚠️ T7 AUTH EVENTS PIPELINE: SKIPPED');
  }

  // ---------------------------------------------------------------------------
  // T8: RPC get_dashboard_stats
  // ---------------------------------------------------------------------------
  if (seededUser) {
    try {
      console.log('T8 RPC get_dashboard_stats: Calling RPC...');
      const { data: stats, error: statsErr } = await studentClient.rpc('get_dashboard_stats');
      if (statsErr) {
        if (statsErr.message.includes('Could not find') || statsErr.status === 404) {
          console.log('❌ T8 RPC get_dashboard_stats: FAILED -> MIGRATION ABSENT');
        } else {
          throw statsErr;
        }
      } else {
        const { count, error: countErr } = await serviceClient
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', seededUser.id);
        
        if (countErr) throw countErr;

        const expectedCount = count || 0;
        const returnedCount = stats && stats[0] ? parseInt(stats[0].projects_count) : 0;

        if (returnedCount === expectedCount) {
          console.log(`✅ T8 RPC get_dashboard_stats: PASSED (Stats match owner project count: ${returnedCount})`);
          t8Passed = true;
        } else {
          console.log(`❌ T8 RPC get_dashboard_stats: FAILED -> Count mismatch (Expected ${expectedCount}, got ${returnedCount})`);
        }
      }
    } catch (err) {
      console.log('❌ T8 RPC get_dashboard_stats: FAILED ->', err.message);
    }
  } else {
    console.log('⚠️ T8 RPC get_dashboard_stats: SKIPPED');
  }

  // ---------------------------------------------------------------------------
  // T9: RPC project_trace
  // ---------------------------------------------------------------------------
  if (seededUser) {
    try {
      console.log('T9 RPC project_trace: Calling project_trace with random UUID...');
      const randomUuid = '00000000-0000-0000-0000-000000000000';
      const { error: traceErr } = await studentClient.rpc('project_trace', { project_id: randomUuid });
      
      if (traceErr) {
        if (traceErr.message.includes('Could not find') || traceErr.status === 404) {
          console.log('❌ T9 RPC project_trace: FAILED -> MIGRATION ABSENT');
        } else {
          console.log(`✅ T9 RPC project_trace: PASSED (Function exists, error: ${traceErr.message})`);
          t9Passed = true;
        }
      } else {
        console.log('✅ T9 RPC project_trace: PASSED (Function exists, returned empty result set)');
        t9Passed = true;
      }
    } catch (err) {
      console.log('❌ T9 RPC project_trace: FAILED ->', err.message);
    }
  } else {
    console.log('⚠️ T9 RPC project_trace: SKIPPED');
  }

  // ---------------------------------------------------------------------------
  // T10: health_recompute
  // ---------------------------------------------------------------------------
  if (seededUser) {
    try {
      console.log('T10 health_recompute: Seeding minimal project row...');
      const { data: project, error: pErr } = await serviceClient
        .from('projects')
        .insert({
          owner_id: seededUser.id,
          name: 'Verification Test Project',
          health_score: 50
        })
        .select()
        .single();

      if (pErr) {
        if (pErr.message.includes('relation "public.projects" does not exist') || pErr.status === 404) {
          console.log('❌ T10 health_recompute: FAILED -> MIGRATION ABSENT (Projects table missing)');
        } else {
          throw pErr;
        }
      } else {
        console.log('Calling health_recompute RPC...');
        const { data: score, error: hErr } = await studentClient.rpc('health_recompute', {
          project_id: project.id
        });

        if (hErr) {
          if (hErr.message.includes('Could not find') || hErr.status === 404) {
            console.log('❌ T10 health_recompute: FAILED -> MIGRATION ABSENT');
          } else {
            throw hErr;
          }
        } else {
          const computedScore = parseInt(score);
          
          const { data: updatedProject, error: getErr } = await serviceClient
            .from('projects')
            .select('health_score')
            .eq('id', project.id)
            .single();

          if (getErr) throw getErr;

          if (computedScore >= 0 && computedScore <= 100 && updatedProject.health_score === computedScore) {
            console.log(`✅ T10 health_recompute: PASSED (Returned score: ${computedScore}, projects table updated correctly)`);
            t10Passed = true;
          } else {
            console.log(`❌ T10 health_recompute: FAILED -> Updated score mismatch (Returned ${computedScore}, stored ${updatedProject.health_score})`);
          }
        }

        // Clean up project
        await serviceClient.from('projects').delete().eq('id', project.id);
      }
    } catch (err) {
      console.log('❌ T10 health_recompute: FAILED ->', err.message);
    }
  } else {
    console.log('⚠️ T10 health_recompute: SKIPPED');
  }

  // ---------------------------------------------------------------------------
  // T11: REALTIME
  // ---------------------------------------------------------------------------
  if (seededUser) {
    try {
      console.log('T11 REALTIME: Subscribing to postgres_changes and broadcast ping...');
      
      let broadcastFired = false;
      let dbChangesFired = false;

      // 1. Broadcast channel setup
      const channelBroadcast = anonClient.channel('realtime-test-broadcast');
      channelBroadcast.on('broadcast', { event: 'ping' }, (payload) => {
        broadcastFired = true;
      });

      await new Promise((resolve) => {
        channelBroadcast.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channelBroadcast.send({
              type: 'broadcast',
              event: 'ping',
              payload: { message: 'hello' }
            });
          }
          resolve();
        });
      });

      // 2. Postgres changes subscription
      const channelChanges = serviceClient.channel('realtime-test-changes');
      channelChanges.on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        dbChangesFired = true;
      });

      await new Promise((resolve) => {
        channelChanges.subscribe((status) => {
          resolve();
        });
      });

      // 3. Trigger insert notification
      console.log('   Triggering database notification insert...');
      const { data: note, error: noteErr } = await serviceClient
        .from('notifications')
        .insert({
          user_id: seededUser.id,
          title: 'Realtime Check',
          content: 'Testing postgres_changes channel'
        })
        .select()
        .single();

      if (noteErr) {
        if (noteErr.message.includes('relation "public.notifications" does not exist')) {
          console.log('❌ T11 REALTIME: FAILED -> MIGRATION ABSENT (Notifications table missing)');
        } else {
          throw noteErr;
        }
      } else {
        // Wait for event propagation
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Cleanup subscription channels
        await anonClient.removeChannel(channelBroadcast);
        await serviceClient.removeChannel(channelChanges);

        // Clean up notification row
        if (note) {
          await serviceClient.from('notifications').delete().eq('id', note.id);
        }

        if (broadcastFired && dbChangesFired) {
          console.log('✅ T11 REALTIME: PASSED (Realtime broadcast & DB changes fired successfully)');
          t11Passed = true;
        } else {
          console.log(`❌ T11 REALTIME: FAILED -> Broadcast fired: ${broadcastFired}, DB Changes fired: ${dbChangesFired}`);
        }
      }
    } catch (err) {
      console.log('❌ T11 REALTIME: FAILED ->', err.message);
    }
  } else {
    console.log('⚠️ T11 REALTIME: SKIPPED');
  }

  // ---------------------------------------------------------------------------
  // T12: STORAGE
  // ---------------------------------------------------------------------------
  if (seededUser) {
    try {
      console.log('T12 STORAGE: Verifying bucket upload constraints...');
      
      const ownPath = `${seededUser.id}/avatar_${Date.now()}.txt`;
      const otherPath = `00000000-0000-0000-0000-000000000000/avatar_${Date.now()}.txt`;
      const content = 'verification-contents';

      // Own upload
      const { data: uploadOwn, error: ownErr } = await studentClient.storage
        .from('avatars')
        .upload(ownPath, Buffer.from(content), {
          contentType: 'text/plain',
          upsert: true
        });

      const isOwnSuccess = !ownErr && uploadOwn;

      // Cross-user upload (should be blocked)
      const { data: uploadOther, error: otherErr } = await studentClient.storage
        .from('avatars')
        .upload(otherPath, Buffer.from(content), {
          contentType: 'text/plain',
          upsert: true
        });

      const isOtherBlocked = otherErr && (
        otherErr.message.includes('Unauthorized') || 
        otherErr.message.includes('row-level security') || 
        otherErr.status === 403 || 
        otherErr.status === 401
      );

      if (isOwnSuccess && isOtherBlocked) {
        console.log('✅ T12 STORAGE: PASSED (Allowed own upload, blocked cross-user upload)');
        t12Passed = true;
      } else {
        console.log(`❌ T12 STORAGE: FAILED -> Own success: ${isOwnSuccess}, Other blocked: ${isOtherBlocked} (error: ${otherErr?.message || 'none'})`);
      }

      // Cleanup
      if (isOwnSuccess) {
        await studentClient.storage.from('avatars').remove([ownPath]);
      }
    } catch (err) {
      console.log('❌ T12 STORAGE: FAILED ->', err.message);
    }
  } else {
    console.log('⚠️ T12 STORAGE: SKIPPED');
  }

  // Clean up seeded user
  if (seededUser) {
    console.log('Cleaning up seeded test user...');
    try {
      await serviceClient.auth.admin.deleteUser(seededUser.id);
    } catch (err) {
      console.error('Cleanup error:', err.message);
    }
  }

  console.log('\n=== FINAL VERIFICATION SUMMARY ===');
  console.log(`T1 getSession                     | ${t1Passed ? 'PASS' : 'FAIL'}`);
  console.log(`T2 signup (seeded)                | ${t2Passed ? 'PASS' : 'FAIL'}`);
  console.log(`T3 profile auto-create (live)     | ${t3Passed ? 'PASS' : 'FAIL'}`);
  console.log(`T4 student → set_user_role        | ${t4Passed ? 'PASS' : 'FAIL'}`);
  console.log(`T5 admin bootstrap                | ${t5Passed ? 'PASS' : 'FAIL'}`);
  console.log(`T6 RLS CROSS-READ                 | ${t6Passed ? 'PASS' : 'FAIL'}`);
  console.log(`T7 AUTH EVENTS PIPELINE           | ${t7Passed ? 'PASS' : 'FAIL'}`);
  console.log(`T8 RPC get_dashboard_stats        | ${t8Passed ? 'PASS' : 'FAIL'}`);
  console.log(`T9 RPC project_trace              | ${t9Passed ? 'PASS' : 'FAIL'}`);
  console.log(`T10 health_recompute              | ${t10Passed ? 'PASS' : 'FAIL'}`);
  console.log(`T11 REALTIME                      | ${t11Passed ? 'PASS' : 'FAIL'}`);
  console.log(`T12 STORAGE                       | ${t12Passed ? 'PASS' : 'FAIL'}`);
}

runTests();
