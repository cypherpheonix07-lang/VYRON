import fs from "fs";

const envContent = fs.readFileSync("./.env", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim().replace(/^['"]|['"]$/g, "");
    env[match[1]] = value;
  }
});

async function testSqlApi() {
  const ref = "hbbunfizlwgvripgwzdo";
  const secretKey = env.SUPABASE_SECRET_KEY;

  // Test 1: Management API with secretKey as bearer
  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({ query: "SELECT 1 as test;" }),
    });
    console.log("Test 1 (api.supabase.com):", res.status, await res.text());
  } catch (e) {
    console.log("Test 1 failed:", e.message);
  }

  // Test 2: Project-specific endpoint /pg or /sql
  try {
    const res2 = await fetch(`https://${ref}.supabase.co/pg/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({ query: "SELECT 1 as test;" }),
    });
    console.log("Test 2 (project.supabase.co/pg):", res2.status, await res2.text());
  } catch (e) {
    console.log("Test 2 failed:", e.message);
  }
}

testSqlApi();
