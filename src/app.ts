import path from "node:path";
import fs from "node:fs";
import { applyExcludes, ensureDir, toMatrix } from "./buckets";
import { ownersForFile, parseCodeowners } from "./codeowners";
import {
  applyPatch,
  commitAllStaged,
  getChangedFiles,
  getRemoteUrl,
  parseGitHubRemote,
  writePatchForPaths,
  pushBranch,
  tempDirForBucket,
  worktreeAdd,
  worktreeBaseDir,
  worktreeRemove
} from "./git";
import { getDefaultBranch, getOctokit, upsertPullRequest } from "./github";
import { assertGhAuthenticated, getDefaultBranchViaGh, upsertPullRequestViaGh } from "./ghcli";
import { readPrTemplate } from "./pr-template";
import type { Bucket, Logger, PullRequestInfo, SplitConfig, SplitResult } from "./types";

function formatTemplate(tpl: string, vars: Record<string, string>) {
  let out = tpl;
  for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(v);
  return out;
}

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) ensureDir(dir);
}

export async function runSplit(config: SplitConfig, logger: Logger): Promise<SplitResult> {
  if (config.createPrs && config.dryRun) {
    throw new Error("create_prs=true requires dry_run=false (we need patch files to create bucket branches/PRs).");
  }

  // 1) discover + filter changed files
  const changed = getChangedFiles(config.baseRef);
  const filtered = applyExcludes(changed, config.excludePatterns);
  logger.info(`Changed files: ${changed.length} (after excludes: ${filtered.length})`);

  if (!filtered.length) {
    return { buckets: [], matrix: { include: [] }, prs: [] };
  }

  // 2) parse CODEOWNERS + bucketize by owners-set
  const rules = parseCodeowners(config.codeownersPath);
  const bucketsMap = new Map<string, Bucket>();

  for (const file of filtered) {
    const { owners, rule } = ownersForFile(file, rules);
    const sortedOwners = (owners ?? []).slice().sort();
    const isUnowned = sortedOwners.length === 0;
    if (isUnowned && !config.includeUnowned) continue;

    const key = isUnowned
      ? config.unownedBucketKey
      : sortedOwners.join("|").replaceAll("@", "").replaceAll("/", "-").replaceAll(" ", "");

    const existing = bucketsMap.get(key);
    if (!existing) {
      bucketsMap.set(key, {
        key,
        owners: sortedOwners,
        files: [{ file, owners: sortedOwners, rule }]
      });
    } else {
      existing.files.push({ file, owners: sortedOwners, rule });
    }
  }

  const buckets = [...bucketsMap.values()].sort((a, b) => a.key.localeCompare(b.key));
  if (buckets.length > config.maxBuckets) {
    throw new Error(`Too many buckets: ${buckets.length} > max_buckets=${config.maxBuckets}`);
  }

  // 3) write per-bucket patches
  if (!config.dryRun) {
    ensureDirExists(config.patchDir);
    buckets.forEach((b, idx) => {
      const patchPath = path.posix.join(config.patchDir.replaceAll("\\", "/"), `${config.bucketPrefix}-${idx + 1}.patch`);
      const paths = b.files.map((f) => f.file);
      logger.info(`Writing ${patchPath} (${paths.length} files) for bucket=${b.key}`);
      writePatchForPaths(patchPath, paths);
    });
  } else {
    logger.info("dry_run=true; not generating patches.");
  }

  const matrix = toMatrix(buckets, config.patchDir, config.bucketPrefix);

  // 4) optionally create PRs (worktrees so we don't disturb the current working tree)
  let prs: PullRequestInfo[] | undefined = undefined;
  if (config.createPrs) {
    const token = config.githubToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
    const repo = config.repo ?? parseGitHubRemote(getRemoteUrl(config.remoteName));
    const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
    // Auth mode selection:
    // - In GitHub Actions: ALWAYS use token-based API (gh may not be installed/auth'd).
    // - Locally: ALWAYS use gh CLI for best DevX (no token-based local mode).
    if (isGitHubActions) {
      if (!token) {
        throw new Error("Missing GitHub token (set github_token input or GITHUB_TOKEN / GH_TOKEN env var)");
      }
    } else {
      assertGhAuthenticated(process.cwd());
    }

    const useGhCli = !isGitHubActions;
    const octokit = useGhCli ? null : getOctokit(token);
    const baseBranch = config.baseBranch || (useGhCli ? getDefaultBranchViaGh(process.cwd()) : await getDefaultBranch(octokit!, repo));

    const baseRef = "HEAD";

    ensureDirExists(worktreeBaseDir());
    prs = [];

    for (let i = 0; i < buckets.length; i++) {
      const b = buckets[i];
      const patchPath = path.posix.join(config.patchDir.replaceAll("\\", "/"), `${config.bucketPrefix}-${i + 1}.patch`);
      const branch = `${config.branchPrefix}${b.key}`.replaceAll(" ", "");
      const worktreeDir = tempDirForBucket(b.key);

      logger.info(`Creating PR for bucket=${b.key} on branch=${branch}`);

      worktreeAdd(branch, baseRef, worktreeDir);
      try {
        applyPatch(patchPath, worktreeDir);
        const committed = commitAllStaged(config.commitMessage, worktreeDir);
        if (!committed) {
          logger.warn(`No staged changes for bucket=${b.key}; skipping push/PR.`);
          continue;
        }

        pushBranch(config.remoteName, branch, worktreeDir);

        const ownersStr = b.owners.length ? b.owners.join(", ") : "(unowned)";
        const filesStr = b.files.map(f => `- ${f.file}`).join("\n");
        const bucketInfo = formatTemplate(
          "Automated changes bucketed by CODEOWNERS.\n\nOwners: {owners}\nBucket key: {bucket_key}\n\nFiles:\n{files}\n",
          { owners: ownersStr, bucket_key: b.key, files: filesStr }
        );

        const title = formatTemplate(config.prTitle, { owners: ownersStr, bucket_key: b.key });

        let body: string | undefined;
        if (config.prBodyMode === "none") {
          body = undefined;
        } else if (config.prBodyMode === "custom") {
          body = formatTemplate(config.prBody, { owners: ownersStr, bucket_key: b.key, files: filesStr });
        } else {
          const template = readPrTemplate(worktreeDir, config.prTemplatePath) ?? "";
          body =
            config.prBodyMode === "template_with_bucket"
              ? (template ? template.trimEnd() + "\n\n---\n\n" + bucketInfo : bucketInfo)
              : (template || bucketInfo);
        }

        const pr = useGhCli
          ? (() => {
              return upsertPullRequestViaGh({
                cwd: worktreeDir,
                base: baseBranch,
                head: branch,
                title,
                body: body ?? "",
                draft: config.draft,
                bucketKey: b.key
              });
            })()
          : await upsertPullRequest({
              octokit: octokit!,
              repo,
              base: baseBranch,
              head: branch,
              title,
              body: body ?? "",
              draft: config.draft,
              bucketKey: b.key
            });
        prs.push(pr);
        logger.info(`PR: ${pr.url}`);
      } finally {
        worktreeRemove(worktreeDir);
      }
    }
  }

  if (config.cleanupPatches && !config.dryRun) {
    const cwd = process.cwd();
    const abs = path.resolve(cwd, config.patchDir);
    const safePrefix = cwd.endsWith(path.sep) ? cwd : cwd + path.sep;
    if (!abs.startsWith(safePrefix)) {
      throw new Error(`Refusing to delete patch_dir outside repo: ${abs}`);
    }
    if (abs === cwd) {
      throw new Error("Refusing to delete patch_dir equal to repo root.");
    }
    if (fs.existsSync(abs)) {
      logger.info(`Cleaning up patches dir: ${config.patchDir}`);
      fs.rmSync(abs, { recursive: true, force: true });
    }
  }

  return { buckets, matrix, prs };
}

