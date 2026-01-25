import * as core from "@actions/core";
import path from "node:path";
import {
  parseBool,
  readMultiline,
} from "./buckets";
import { runSplit } from "./app";
import type { Logger, SplitConfig } from "./types";

async function run() {
  try {
    const repoPathInput = core.getInput("repo_path") || ".";
    const workspace = process.env.GITHUB_WORKSPACE || "";
    const repoPath = repoPathInput
      ? (path.isAbsolute(repoPathInput) ? repoPathInput : path.resolve(workspace || process.cwd(), repoPathInput))
      : undefined;

    const cfg: SplitConfig = {
      repoPath,
      codeownersPath: core.getInput("codeowners_path") || "CODEOWNERS",
      baseRef: core.getInput("base_ref") || "",
      includeUnowned: parseBool(core.getInput("include_unowned")),
      unownedBucketKey: core.getInput("unowned_bucket_key") || "__UNOWNED__",
      maxBuckets: Number(core.getInput("max_buckets") || "30"),
      excludePatterns: readMultiline(core.getInput("exclude_patterns")),
      patchDir: core.getInput("patch_dir") || "bucket-patches",
      bucketPrefix: core.getInput("bucket_prefix") || "bucket",
      dryRun: parseBool(core.getInput("dry_run")),
      cleanupPatches: parseBool(core.getInput("cleanup_patches")),
      createPrs: parseBool(core.getInput("create_prs")),
      githubToken: core.getInput("github_token") || "",
      baseBranch: core.getInput("base_branch") || "",
      branchPrefix: core.getInput("branch_prefix") || "codemods/",
      commitMessage: core.getInput("commit_message") || "chore: automated changes",
      prTitle: core.getInput("pr_title") || "chore: automated changes ({owners})",
      prBody:
        core.getInput("pr_body") ||
        "Automated changes bucketed by CODEOWNERS.\n\nOwners: {owners}\nBucket key: {bucket_key}\n\nFiles:\n{files}\n",
      prBodyMode: (core.getInput("pr_body_mode") || "custom") as SplitConfig["prBodyMode"],
      prTemplatePath: core.getInput("pr_template_path") || ".github/pull_request_template.md",
      draft: parseBool(core.getInput("draft")),
      remoteName: "origin",
    };

    const logger: Logger = { info: core.info, warn: core.warning, error: core.error };
    const res = await runSplit(cfg, logger);

    core.setOutput("matrix_json", JSON.stringify(res.matrix));
    core.setOutput("buckets_json", JSON.stringify(res.buckets));
    core.setOutput("prs_json", JSON.stringify(res.prs ?? []));
  } catch (e: any) {
    core.setFailed(e?.message ?? String(e));
  }
}

run();
