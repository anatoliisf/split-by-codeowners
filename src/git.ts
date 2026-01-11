import { execSync } from "node:child_process";
import path from "node:path";

function sh(cmd: string, cwd?: string): string {
  return execSync(cmd, { encoding: "utf8", cwd }).trim();
}

function execAllowExitCodes(cmd: string, allowed: number[], opts?: Parameters<typeof execSync>[1]) {
  try {
    execSync(cmd, opts);
  } catch (e: any) {
    const status: number | null | undefined = e?.status;
    if (typeof status === "number" && allowed.includes(status)) return;
    throw e;
  }
}

export function getChangedFiles(baseRef?: string): string[] {
  // Changed vs HEAD (staged + unstaged)
  // Note: we keep this intentionally workspace-focused (codemods often produce uncommitted changes).
  // If baseRef is provided, we currently still use HEAD vs working tree (baseRef is used for PR base branch elsewhere).
  const diff = sh(`git diff --name-only HEAD`);
  const untracked = sh(`git ls-files --others --exclude-standard`);

  const out = new Set<string>();
  if (diff) diff.split("\n").map(s => s.trim()).filter(Boolean).forEach(p => out.add(p));
  if (untracked) untracked.split("\n").map(s => s.trim()).filter(Boolean).forEach(p => out.add(p));

  // Optional: if baseRef provided, you can extend to include committed changes too
  // (left minimal—most codemod flows are uncommitted workspace changes)

  return [...out].sort((a, b) => a.localeCompare(b));
}

function listUntrackedIn(paths: string[]): string[] {
  if (!paths.length) return [];
  const quoted = paths.map(p => `"${p.replace(/"/g, '\\"')}"`).join(" ");
  const out = sh(`git ls-files --others --exclude-standard -- ${quoted}`);
  return out ? out.split("\n").map(s => s.trim()).filter(Boolean) : [];
}

function listTrackedIn(paths: string[]): string[] {
  const untracked = new Set(listUntrackedIn(paths));
  return paths.filter(p => !untracked.has(p));
}

export function writePatchForPaths(patchPath: string, paths: string[]) {
  if (!paths.length) return;
  const abs = path.resolve(process.cwd(), patchPath);

  const untracked = listUntrackedIn(paths);
  const tracked = listTrackedIn(paths);

  // 1) tracked modifications/deletions/renames
  if (tracked.length) {
    const quoted = tracked.map(p => `"${p.replace(/"/g, '\\"')}"`).join(" ");
    // IMPORTANT: diff against HEAD so patches are stable regardless of whether the user staged changes already.
    // (Plain `git diff` only captures *unstaged* changes.)
    execSync(`git diff --binary HEAD -- ${quoted} > "${abs.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
  } else {
    execSync(`: > "${abs.replace(/"/g, '\\"')}"`);
  }

  // 2) untracked additions (append, without touching index)
  for (const f of untracked) {
    const q = `"${f.replace(/"/g, '\\"')}"`;
    // NOTE: `git diff --no-index` requires exactly two path arguments (no pathspec `--` separator).
    // Also, it exits with code 1 when a diff exists, which is expected; treat 1 as success.
    execAllowExitCodes(
      `git diff --binary --no-index /dev/null ${q} >> "${abs.replace(/"/g, '\\"')}"`,
      [1],
      { stdio: "inherit" }
    );
  }
}

export function getRemoteUrl(remoteName = "origin"): string {
  return sh(`git config --get remote.${remoteName}.url`);
}

export function parseGitHubRemote(remoteUrl: string): { owner: string; repo: string } {
  // Supports:
  // - git@github.com:OWNER/REPO.git
  // - https://github.com/OWNER/REPO.git
  // - https://github.com/OWNER/REPO
  const cleaned = remoteUrl.trim();
  const ssh = cleaned.match(/^git@github\.com:([^/]+)\/(.+?)(?:\.git)?$/);
  if (ssh) return { owner: ssh[1], repo: ssh[2] };
  const https = cleaned.match(/^https?:\/\/github\.com\/([^/]+)\/(.+?)(?:\.git)?$/);
  if (https) return { owner: https[1], repo: https[2] };
  throw new Error(`Unsupported remote URL (expected GitHub): ${remoteUrl}`);
}

export function getHeadSha(cwd?: string): string {
  return sh(`git rev-parse HEAD`, cwd);
}

export function ensureGitIdentity(cwd?: string) {
  // Ensure commits work in CI even if user.name/email aren't configured.
  const name = sh(`git config user.name || true`, cwd);
  const email = sh(`git config user.email || true`, cwd);
  if (!name) execSync(`git config user.name "split-by-codeowners"`, { cwd, stdio: "inherit" });
  if (!email) execSync(`git config user.email "split-by-codeowners@users.noreply.github.com"`, { cwd, stdio: "inherit" });
}

export function worktreeBaseDir(): string {
  return path.resolve(process.cwd(), ".split-by-codeowners-worktrees");
}

export function worktreeAdd(branch: string, baseRef: string, worktreeDir: string) {
  execSync(`git worktree add -B "${branch.replace(/"/g, '\\"')}" "${worktreeDir.replace(/"/g, '\\"')}" "${baseRef.replace(/"/g, '\\"')}"`, {
    stdio: "inherit"
  });
}

export function worktreeRemove(worktreeDir: string) {
  execSync(`git worktree remove --force "${worktreeDir.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
}

export function commitAllStaged(message: string, cwd: string) {
  // No-op if nothing staged
  try {
    execSync(`git diff --cached --quiet`, { cwd, stdio: "inherit" });
    return false;
  } catch {
    // has staged changes
  }

  ensureGitIdentity(cwd);
  execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd, stdio: "inherit" });
  return true;
}

export function pushBranch(remoteName: string, branch: string, cwd: string) {
  execSync(`git push "${remoteName.replace(/"/g, '\\"')}" "${branch.replace(/"/g, '\\"')}" --force`, { cwd, stdio: "inherit" });
}

export function applyPatch(patchPath: string, cwd: string) {
  const abs = path.resolve(process.cwd(), patchPath);
  execSync(`git apply --index "${abs.replace(/"/g, '\\"')}"`, { cwd, stdio: "inherit" });
}

export function tempDirForBucket(bucketKey: string): string {
  const safe = bucketKey.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80) || "bucket";
  return path.join(worktreeBaseDir(), `${safe}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
}
