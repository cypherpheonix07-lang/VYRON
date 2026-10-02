import fs from "fs";

const envContent = fs.readFileSync("./.env", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let val = match[2].trim().replace(/^['"]|['"]$/g, "");
    env[match[1]] = val;
  }
});

async function main() {
  const res = await fetch(env.SUPABASE_URL + "/rest/v1/", {
    headers: {
      apikey: env.SUPABASE_SECRET_KEY,
      Authorization: "Bearer " + env.SUPABASE_SECRET_KEY,
    },
  });
  const spec = await res.json();
  console.log("github_accounts definition:");
  console.log(JSON.stringify(spec.definitions?.github_accounts?.properties, null, 2));

  console.log("project_repos definition:");
  console.log(JSON.stringify(spec.definitions?.project_repos?.properties, null, 2));
}

main();
