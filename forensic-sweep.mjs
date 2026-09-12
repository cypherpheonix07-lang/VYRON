import fs from "fs";
import path from "path";

function searchFiles(
  dir,
  matchPatterns,
  excludeDir = ["node_modules", ".git", ".next", "dist", ".output"],
) {
  const results = {};
  matchPatterns.forEach((p) => (results[p.name] = []));

  function walk(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const f of files) {
      const fullPath = path.join(currentDir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (!excludeDir.includes(f)) walk(fullPath);
      } else if (/\.(ts|tsx|js|jsx|css|html|json)$/.test(f)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const lines = content.split("\n");
        lines.forEach((line, idx) => {
          matchPatterns.forEach((p) => {
            if (p.regex.test(line)) {
              results[p.name].push({
                file: fullPath.replace(/\\/g, "/"),
                line: idx + 1,
                text: line.trim(),
              });
            }
          });
        });
      }
    }
  }
  walk(dir);
  return results;
}

const patterns = [
  { name: "createClient", regex: /createClient/ },
  { name: "hardcoded_supabase_url", regex: /https:\/\/[a-z0-9]+\.supabase\.co/ },
  { name: "jwt_prefix_eyJ", regex: /eyJ[a-zA-Z0-9_-]{10,}/ },
  { name: "setTimeout", regex: /setTimeout/ },
  { name: "mockUser", regex: /mockUser/ },
  { name: "fakeUser", regex: /fakeUser/ },
  { name: "DEMO_MODE", regex: /DEMO_MODE/ },
  { name: "TODO", regex: /\/\/\s*TODO/i },
  { name: "FIXME", regex: /\/\/\s*FIXME/i },
  { name: "placeholder_code", regex: /placeholder/i },
  { name: "coming_soon", regex: /coming\s+soon/i },
  { name: "not_implemented", regex: /not\s+implemented/i },
  { name: "lucide_react", regex: /from\s+['"]lucide-react['"]/ },
  { name: "heroicons", regex: /from\s+['"]@heroicons/ },
  { name: "react_icons", regex: /from\s+['"]react-icons/ },
  { name: "hugeicons", regex: /hugeicons/i },
  {
    name: "inline_auth_calls",
    regex: /(signInWithPassword|signUp|signInWithOAuth|supabase\.auth)/,
  },
];

console.log("=== FORENSIC CODEBASE PATTERN AUDIT ===\n");
const res = searchFiles("./src", patterns);
for (const [k, v] of Object.entries(res)) {
  console.log(`--- Pattern: ${k} (Total Matches: ${v.length}) ---`);
  v.slice(0, 15).forEach((m) => console.log(`  ${m.file}:${m.line}: ${m.text}`));
  if (v.length > 15) console.log(`  ... and ${v.length - 15} more`);
  console.log("");
}
