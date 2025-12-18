import { execSync } from "node:child_process";

function sh(cmd: string): string {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

export function getChangedFiles(baseRef?: string): string[] {
  // Changed vs HEAD (staged + unstaged)
  const diff = sh(`git diff --name-only HEAD`);
  const untracked = sh(`git ls-files --others --exclude-standard`);

  const out = new Set<string>();
  if (diff) diff.split("\n").map(s => s.trim()).filter(Boolean).forEach(p => out.add(p));
  if (untracked) untracked.split("\n").map(s => s.trim()).filter(Boolean).forEach(p => out.add(p));

  // Optional: if baseRef provided, you can extend to include committed changes too
  // (left minimal—most codemod flows are uncommitted workspace changes)

  return [...out].sort((a, b) => a.localeCompare(b));
}

export function writePatchForPaths(patchPath: string, paths: string[]) {
  if (!paths.length) return;
  const quoted = paths.map(p => `"${p.replace(/"/g, '\\"')}"`).join(" ");
  execSync(`git diff --binary -- ${quoted} > "${patchPath.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
}
