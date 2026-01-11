import { Octokit } from "octokit";
import type { PullRequestInfo, RepoRef } from "./types";

export function getOctokit(token: string) {
  if (!token) throw new Error("Missing GitHub token (set github_token input or GITHUB_TOKEN / GH_TOKEN env var)");
  return new Octokit({ auth: token });
}

export async function getDefaultBranch(octokit: Octokit, repo: RepoRef): Promise<string> {
  const res = await octokit.rest.repos.get({ owner: repo.owner, repo: repo.repo });
  return res.data.default_branch;
}

export async function upsertPullRequest(params: {
  octokit: Octokit;
  repo: RepoRef;
  base: string;
  head: string; // branch name (no owner:)
  title: string;
  body: string;
  draft: boolean;
  bucketKey: string;
}): Promise<PullRequestInfo> {
  const { octokit, repo, base, head, title, body, draft, bucketKey } = params;

  const headWithOwner = `${repo.owner}:${head}`;
  const existing = await octokit.rest.pulls.list({
    owner: repo.owner,
    repo: repo.repo,
    state: "open",
    head: headWithOwner,
    base
  });

  if (existing.data.length) {
    const pr = existing.data[0];
    const updated = await octokit.rest.pulls.update({
      owner: repo.owner,
      repo: repo.repo,
      pull_number: pr.number,
      title,
      body
    });
    return { bucket_key: bucketKey, branch: head, number: updated.data.number, url: updated.data.html_url };
  }

  const created = await octokit.rest.pulls.create({
    owner: repo.owner,
    repo: repo.repo,
    head,
    base,
    title,
    body,
    draft
  });

  return { bucket_key: bucketKey, branch: head, number: created.data.number, url: created.data.html_url };
}

