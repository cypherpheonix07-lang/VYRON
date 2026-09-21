import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";

console.log("======================================================================");
console.log("PHASE 0 — FORENSIC INTAKE: RAW TERMINAL & DB SWEEPS");
console.log("======================================================================\n");

// ----------------------------------------------------------------------
// SWEEP 1: SKELETON
// ----------------------------------------------------------------------
console.log("──────────────────────────────────────────────────────────────────────");
console.log("FORENSIC SWEEP 1 — PROJECT SKELETON");
console.log("──────────────────────────────────────────────────────────────────────");

function getFiles(
  dir,
  excludes = [
    "node_modules",
    ".git",
    ".next",
    "dist",
    ".venv",
    ".output",
    ".tanstack",
    "istio-1.20.0",
  ],
) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!excludes.includes(file)) {
        results = results.concat(getFiles(fullPath, excludes));
      }
    } else {
      results.push(fullPath.replace(/\\/g, "/"));
    }
  }
  return results;
}

const allFiles = getFiles(".").sort();
console.log(`[FILE TREE - Total files: ${allFiles.length}]`);
allFiles.forEach((f) => console.log(f));

// ----------------------------------------------------------------------
// SWEEP 2: SUPABASE CLIENT
// ----------------------------------------------------------------------
console.log("\n──────────────────────────────────────────────────────────────────────");
console.log("FORENSIC SWEEP 2 — THE SUPABASE CLIENT");
console.log("──────────────────────────────────────────────────────────────────────");

const scPath = "./src/lib/supabaseClient.ts";
if (fs.existsSync(scPath)) {
  const stat = fs.statSync(scPath);
  console.log(`ls -la ${scPath}: size=${stat.size} bytes, mtime=${stat.mtime.toISOString()}`);
  console.log("\ncat src/lib/supabaseClient.ts:\n");
  console.log(fs.readFileSync(scPath, "utf8"));
} else {
  console.log(`${scPath} DOES NOT EXIST!`);
}

function grepFiles(dir, regex, fileExts = [".ts", ".tsx"]) {
  const matches = [];
  function search(current) {
    const list = fs.readdirSync(current);
    for (const f of list) {
      const p = path.join(current, f);
      const s = fs.statSync(p);
      if (s.isDirectory()) {
        if (f !== "node_modules" && f !== ".git" && f !== "dist" && f !== ".output") {
          search(p);
        }
      } else if (fileExts.some((ext) => f.endsWith(ext))) {
        const lines = fs.readFileSync(p, "utf8").split("\n");
        lines.forEach((line, idx) => {
          if (regex.test(line)) {
            matches.push({ file: p.replace(/\\/g, "/"), line: idx + 1, text: line.trim() });
          }
        });
      }
    }
  }
  search(dir);
  return matches;
}

console.log('\ngrep -rn "createClient" src/ --include="*.ts" --include="*.tsx"');
const createClientMatches = grepFiles("./src", /createClient/);
console.log(`Total occurrences: ${createClientMatches.length}`);
createClientMatches.forEach((m) => console.log(`${m.file}:${m.line}: ${m.text}`));

console.log('\ngrep -rn "supabase.co" src/ --include="*.ts" --include="*.tsx"');
const urlMatches = grepFiles("./src", /supabase\.co/);
console.log(`Total occurrences: ${urlMatches.length}`);
urlMatches.forEach((m) => console.log(`${m.file}:${m.line}: ${m.text}`));

console.log('\ngrep -rn "eyJ" src/ --include="*.ts" --include="*.tsx"');
const jwtMatches = grepFiles("./src", /eyJ[a-zA-Z0-9_-]{10,}/);
console.log(`Total occurrences: ${jwtMatches.length}`);
jwtMatches.forEach((m) => console.log(`${m.file}:${m.line}: ${m.text}`));

// ----------------------------------------------------------------------
// SWEEP 3: AUTH SERVICE AUTOPSY
// ----------------------------------------------------------------------
console.log("\n──────────────────────────────────────────────────────────────────────");
console.log("FORENSIC SWEEP 3 — AUTH SERVICE AUTOPSY");
console.log("──────────────────────────────────────────────────────────────────────");

const asPath = "./src/services/authService.ts";
if (fs.existsSync(asPath)) {
  const stat = fs.statSync(asPath);
  console.log(`ls -la ${asPath}: size=${stat.size} bytes, mtime=${stat.mtime.toISOString()}`);
  console.log("\ncat src/services/authService.ts:\n");
  console.log(fs.readFileSync(asPath, "utf8"));
} else {
  console.log(`${asPath} DOES NOT EXIST!`);
}

const mockPatterns = [
  { name: "setTimeout", regex: /setTimeout/ },
  { name: "mockUser", regex: /mockUser/ },
  { name: "fakeUser", regex: /fakeUser/ },
  { name: "DEMO_MODE", regex: /DEMO_MODE/ },
  { name: "// TODO", regex: /\/\/\s*TODO/i },
  { name: "// FIXME", regex: /\/\/\s*FIXME/i },
  { name: "placeholder", regex: /placeholder/i },
  { name: "coming soon", regex: /coming\s+soon/i },
  { name: "not implemented", regex: /not\s+implemented/i },
];

mockPatterns.forEach((pat) => {
  console.log(`\ngrep -rn "${pat.name}" src/ --include="*.ts" --include="*.tsx"`);
  const m = grepFiles("./src", pat.regex);
  console.log(`Matches: ${m.length}`);
  m.slice(0, 10).forEach((match) => console.log(`  ${match.file}:${match.line}: ${match.text}`));
  if (m.length > 10) console.log(`  ... and ${m.length - 10} more`);
});

// ----------------------------------------------------------------------
// SWEEP 4: AUTH PAGE CONTAMINATION CHECK
// ----------------------------------------------------------------------
console.log("\n──────────────────────────────────────────────────────────────────────");
console.log("FORENSIC SWEEP 4 — AUTH PAGE CONTAMINATION CHECK");
console.log("──────────────────────────────────────────────────────────────────────");

const authRouteFiles = grepFiles("./src/routes", /./, [".tsx", ".ts"]).filter(
  (f) =>
    f.file.includes("auth") ||
    f.file.includes("login") ||
    f.file.includes("register") ||
    f.file.includes("reset"),
);
const uniqueAuthFiles = [...new Set(authRouteFiles.map((f) => f.file))];
console.log("Auth route files found:", uniqueAuthFiles);

uniqueAuthFiles.forEach((f) => {
  console.log(`\n--- ${f} ---`);
  console.log(fs.readFileSync(f, "utf8"));
});

console.log('\ngrep -rn "signIn|signUp|signOut|getSession|supabase.auth" src/pages/ src/routes/');
const inlineAuth = grepFiles("./src/routes", /(signIn|signUp|signOut|getSession|supabase\.auth)/);
console.log(`Total inline auth occurrences in routes: ${inlineAuth.length}`);
inlineAuth.forEach((m) => console.log(`${m.file}:${m.line}: ${m.text}`));

// ----------------------------------------------------------------------
// SWEEP 5: DESIGN SYSTEM VERIFICATION
// ----------------------------------------------------------------------
console.log("\n──────────────────────────────────────────────────────────────────────");
console.log("FORENSIC SWEEP 5 — DESIGN SYSTEM VERIFICATION");
console.log("──────────────────────────────────────────────────────────────────────");

console.log("\n--- CSS & TAILWIND CONFIG ---");
[
  "./src/styles.css",
  "./src/styles/globals.css",
  "./src/index.css",
  "./tailwind.config.ts",
  "./tailwind.config.js",
  "./index.html",
].forEach((f) => {
  if (fs.existsSync(f)) {
    console.log(`\nFile: ${f}`);
    console.log(fs.readFileSync(f, "utf8").slice(0, 500) + "...\n");
  } else {
    console.log(`File: ${f} (Not found)`);
  }
});

console.log('\ngrep -r "hugeicons|hugeiconspro" package.json');
const pkg = fs.readFileSync("./package.json", "utf8");
const hugeInPkg = pkg.split("\n").filter((l) => /hugeicons/i.test(l));
console.log(hugeInPkg.length ? hugeInPkg.join("\n") : "NONE");

console.log('\ngrep -rn "lucide-react|heroicons|react-icons|fa-" src/');
const iconMatches = grepFiles(
  "./src",
  /from\s+['"](lucide-react|@heroicons|react-icons|font-awesome)/,
);
console.log(`Total wrong icon library imports: ${iconMatches.length}`);
iconMatches.forEach((m) => console.log(`${m.file}:${m.line}: ${m.text}`));

// ----------------------------------------------------------------------
// SWEEP 6: TYPESCRIPT HEALTH CHECK
// ----------------------------------------------------------------------
console.log("\n──────────────────────────────────────────────────────────────────────");
console.log("FORENSIC SWEEP 6 — TYPESCRIPT HEALTH CHECK");
console.log("──────────────────────────────────────────────────────────────────────");

try {
  console.log("npx tsc --noEmit 2>&1");
  const tscOut = execSync("npx tsc --noEmit", { encoding: "utf8" });
  console.log(tscOut || "TypeScript check PASSED: 0 errors");
} catch (e) {
  console.log("TypeScript ERRORS found:");
  console.log(e.stdout || e.message);
}

try {
  console.log("\nnpx eslint src/ (summary)");
  const eslintOut = execSync("npx eslint src/ --format compact", { encoding: "utf8" });
  console.log(eslintOut || "ESLint PASSED: 0 errors");
} catch (e) {
  console.log("ESLint output:");
  console.log((e.stdout || e.message).split("\n").slice(0, 30).join("\n"));
}
