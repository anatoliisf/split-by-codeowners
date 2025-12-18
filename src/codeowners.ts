import fs from "node:fs";
import { minimatch } from "minimatch";

type Rule = { pattern: string; owners: string[] };

export function parseCodeowners(path: string): Rule[] {
  const text = fs.readFileSync(path, "utf8");
  const rules: Rule[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const parts = line.split(/\s+/).filter(Boolean);
    if (parts.length < 2) continue;
    rules.push({ pattern: parts[0], owners: parts.slice(1) });
  }
  return rules;
}

function matches(file: string, pattern: string): boolean {
  const f = file.replace(/\\/g, "/");
  // crude but works for most repos:
  const pat = pattern.startsWith("/") ? pattern.slice(1) : pattern;
  return minimatch(f, pat, { dot: true, matchBase: !pattern.startsWith("/") });
}

export function ownersForFile(file: string, rules: Rule[]): { owners: string[]; rule?: string } {
  let hit: Rule | undefined;
  for (const r of rules) if (matches(file, r.pattern)) hit = r; // last wins
  return { owners: hit?.owners ?? [], rule: hit?.pattern };
}
