import { execSync } from "node:child_process";
import type { PullRequestInfo } from "./types";

function sh(cmd: string, cwd: string): string {
  return execSync(cmd, { encoding: "utf8", cwd }).trim();
}

export function assertGhAuthenticated(cwd: string) {
  try {
    execSync(`gh auth status`, { cwd, stdio: "ignore" });
  } catch {
    throw new Error(
      "Missing GitHub auth for local PR creation. Run `gh auth login` (or pass --token / set GH_TOKEN / GITHUB_TOKEN)."
    );
  }
}

export function getDefaultBranchViaGh(cwd: string): string {
  // gh has built-in jq filtering (no system jq required)
  return sh(`gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`, cwd);
}

function tryParseJson<T>(s: string): T | null {
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

export function upsertPullRequestViaGh(params: {
  cwd: string;
  base: string;
  head: string;
  title: string;
  body: string;
  draft: boolean;
  bucketKey: string;
}): PullRequestInfo {
  const { cwd, base, head, title, body, draft, bucketKey } = params;

  const listRaw = sh(`gh pr list --state open --head "${head.replace(/"/g, '\\"')}" --json number,url --limit 1`, cwd);
  const list = tryParseJson<Array<{ number: number; url: string }>>(listRaw) ?? [];

  if (list.length) {
    const pr = list[0];
    // Update title/body; leave draft state as-is.
    execSync(
      `gh pr edit ${pr.number} --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}"`,
      { cwd, stdio: "inherit" }
    );
    return { bucket_key: bucketKey, branch: head, number: pr.number, url: pr.url };
  }

  // Create new PR; gh prints URL on success.
  const draftFlag = draft ? "--draft" : "";
  const url = sh(
    `gh pr create --head "${head.replace(/"/g, '\\"')}" --base "${base.replace(/"/g, '\\"')}" --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}" ${draftFlag}`,
    cwd
  );

  // We don't know the PR number without another API call; leave as 0 for now.
  return { bucket_key: bucketKey, branch: head, number: 0, url };
}

