import fs from "node:fs";
import { minimatch } from "minimatch";

type Rule = { pattern: string; owners: string[] };

function splitPatternOwners(line: string): { pattern: string; owners: string[] } | null {
  // CODEOWNERS lines are: <pattern><whitespace><owner>...
  // Patterns may contain spaces if escaped as `\ `.
  // We parse by finding the first whitespace not escaped by a backslash.
  let i = 0;
  let escaped = false;
  for (; i < line.length; i++) {
    const ch = line[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (/\s/.test(ch)) break;
  }

  const rawPattern = line.slice(0, i).trim();
  const rest = line.slice(i).trim();
  if (!rawPattern || !rest) return null;

  const pattern = rawPattern.replaceAll("\\ ", " ");
  const owners = rest.split(/\s+/).filter(Boolean);
  if (!owners.length) return null;
  return { pattern, owners };
}

export function parseCodeowners(path: string): Rule[] {
  const text = fs.readFileSync(path, "utf8");
  const rules: Rule[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    const parsed = splitPatternOwners(line);
    if (!parsed) continue;
    rules.push({ pattern: parsed.pattern, owners: parsed.owners });
  }
  return rules;
}

function hasGlobMagic(p: string): boolean {
  // Good-enough heuristic for gitignore-style globs.
  return /[*?\[]/.test(p);
}

function matches(file: string, pattern: string): boolean {
  // GitHub CODEOWNERS patterns are gitignore-like:
  // - Leading `/` anchors to repo root
  // - Pattern without `/` matches a basename anywhere
  // - A directory pattern matches everything under it (e.g. `/frontend/admin` should match `/frontend/admin/**`)
  const f = file.replace(/\\/g, "/").replace(/^\.?\//, "");
  let pat = pattern.replace(/\\/g, "/").trim();
  if (!pat) return false;

  const anchored = pat.startsWith("/");
  if (anchored) pat = pat.slice(1);

  // Directory patterns: trailing `/` means directory; also treat non-glob literal paths as directory-or-file match.
  const trailingSlash = pat.endsWith("/");
  if (trailingSlash) pat = pat.slice(0, -1);

  const isLiteral = !hasGlobMagic(pat);
  const hasSlash = pat.includes("/");

  // Literal path: match exact file OR directory subtree.
  if (isLiteral && (anchored || hasSlash)) {
    return f === pat || f.startsWith(pat + "/");
  }

  // Literal basename: match basename OR directory subtree anywhere.
  if (isLiteral && !hasSlash) {
    const base = f.split("/").pop() ?? f;
    if (base === pat) return true;
    return f.includes("/" + pat + "/");
  }

  // Glob patterns: use minimatch.
  // - If anchored: match from repo root.
  // - If not anchored and no slash: match basename anywhere.
  // - If not anchored but includes a slash: match relative to repo root (like a root CODEOWNERS / .gitignore).
  const matchBase = !anchored && !hasSlash;
  const mm = minimatch(f, pat, { dot: true, matchBase });

  if (mm) return true;

  // If the pattern explicitly denotes a directory (trailing slash), also match directory subtree.
  if (trailingSlash) {
    // Convert `dir/` to subtree match.
    return minimatch(f, pat + "/**", { dot: true, matchBase: false });
  }

  return false;
}

export function ownersForFile(file: string, rules: Rule[]): { owners: string[]; rule?: string } {
  let hit: Rule | undefined;
  for (const r of rules) if (matches(file, r.pattern)) hit = r; // last wins
  return { owners: hit?.owners ?? [], rule: hit?.pattern };
}
