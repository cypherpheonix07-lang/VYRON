import fs from "fs";

async function run() {
  console.log("==================================================================");
  console.log("   VYRON BLACK-BOX QA: LANDING & NAVIGATION STRUCTURE AUDIT       ");
  console.log("==================================================================\n");

  const res = await fetch("http://localhost:8080/");
  const html = await res.text();

  const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis;
  const links = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    links.push({ href: match[1], text: match[2].replace(/<[^>]+>/g, "").trim() });
  }

  const buttonRegex = /<button[^>]*>(.*?)<\/button>/gis;
  const buttons = [];
  while ((match = buttonRegex.exec(html)) !== null) {
    buttons.push(match[1].replace(/<[^>]+>/g, "").trim());
  }

  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, "").trim() : "None";

  console.log("H1 Heading:", h1);
  console.log(`\nTotal Links Found: ${links.length}`);
  links.slice(0, 20).forEach((l, i) => {
    console.log(`  [${i + 1}] ${l.text || "(icon/image)"} -> ${l.href}`);
  });

  console.log(`\nTotal Buttons Found: ${buttons.length}`);
  buttons.slice(0, 20).forEach((b, i) => {
    if (b) console.log(`  [${i + 1}] ${b}`);
  });

  // Check for common error indicators or missing env banners in landing HTML
  const hasEnvError =
    html.includes("VITE_SUPABASE_URL is not set") || html.includes("Supabase Environment Missing");
  console.log("\nHas Supabase Missing Env Banner:", hasEnvError);
  console.log("HTML Body Size (bytes):", html.length);
}

run().catch(console.error);
