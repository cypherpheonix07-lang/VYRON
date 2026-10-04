import fs from "fs";

async function run() {
  console.log("==================================================================");
  console.log("   VYRON BLACK-BOX QA: ASSET & SCRIPT COMPILATION AUDIT           ");
  console.log("==================================================================\n");

  const res = await fetch("http://localhost:8080/");
  const html = await res.text();

  const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const scriptSrcs = [];
  let m;
  while ((m = scriptRegex.exec(html)) !== null) {
    scriptSrcs.push(m[1]);
  }

  console.log(`Found ${scriptSrcs.length} script tags on landing page:`);
  for (const src of scriptSrcs) {
    const sUrl = src.startsWith("http") ? src : "http://localhost:8080" + src;
    try {
      const sRes = await fetch(sUrl);
      const text = await sRes.text();
      const hasError = text.includes("Internal Server Error") || text.includes("Transform failed");
      console.log(
        `  [${sRes.status}] ${src.padEnd(40)} | Size: ${text.length} | Error: ${hasError}`,
      );
    } catch (e) {
      console.error(`  [FAILED] ${src} : ${e.message}`);
    }
  }

  // Also test entry point @vite/client and client.tsx
  const coreEndpoints = ["/@vite/client", "/src/client.tsx", "/src/styles.css"];
  console.log("\nTesting Vite core endpoints:");
  for (const ep of coreEndpoints) {
    try {
      const sRes = await fetch("http://localhost:8080" + ep);
      const text = await sRes.text();
      const hasError = text.includes("Internal Server Error") || text.includes("Transform failed");
      console.log(
        `  [${sRes.status}] ${ep.padEnd(30)} | Size: ${text.length} | Error: ${hasError}`,
      );
    } catch (e) {
      console.error(`  [FAILED] ${ep} : ${e.message}`);
    }
  }
}

run().catch(console.error);
