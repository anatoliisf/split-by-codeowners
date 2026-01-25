#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runSplit } from "./app";
import { readMultiline } from "./buckets";
import { parseBool } from "./buckets";
import type { Logger, SplitConfig } from "./types";

function printHelp() {
  // Minimal help; keep dependencies at zero.
  process.stdout.write(
    [
      "split-by-codeowners",
      "",
      "Usage:",
      "  npx split-by-codeowners [options]",
      "",
      "Common options:",
      "  --repo-path <path>            Repo path (relative to cwd) to operate on",
      "  --codeowners <path>           Path to CODEOWNERS (default: CODEOWNERS)",
      "  --exclude <file|->            File with newline-separated globs, or '-' to read stdin",
      "  --include-unowned <true|false> (default: true)",
      "  --max-buckets <n>             (default: 30)",
      "  --patch-dir <dir>             (default: bucket-patches)",
      "  --bucket-prefix <prefix>      (default: bucket)",
      "  --dry-run                     Compute buckets, don't write patches",
      "",
      "PR creation:",
      "  --create-prs                  Push branches + create/update PRs (uses `gh` auth locally; token in CI)",
      "  --base-branch <branch>        Base branch for PRs (default: repo default)",
      "  --branch-prefix <prefix>      (default: codemods/)",
      "  --commit-message <msg>        (default: chore: automated changes)",
      "  --pr-title <tpl>              Supports {owners} and {bucket_key}",
      "  --pr-body <tpl>               Supports {owners}, {bucket_key}, {files}",
      "  --pr-body-mode <mode>         custom|template|template_with_bucket|none (default: custom)",
      "  --pr-template-path <path>     (default: .github/pull_request_template.md)",
      "  --draft <true|false>          (default: false)",
      "",
      "Examples:",
      "  npx split-by-codeowners --exclude - < excludes.txt",
      "  npx split-by-codeowners --create-prs --base-branch main",
      ""
    ].join("\n")
  );
}

function takeArg(argv: string[], i: number, name: string): string {
  const v = argv[i + 1];
  if (!v) throw new Error(`Missing value for ${name}`);
  return v;
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const c of process.stdin) chunks.push(Buffer.from(c));
  return Buffer.concat(chunks).toString("utf8");
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) {
    printHelp();
    return;
  }

  const logger: Logger = {
    info: (m) => process.stdout.write(m + "\n"),
    warn: (m) => process.stderr.write(m + "\n"),
    error: (m) => process.stderr.write(m + "\n")
  };

  // defaults
  let repoPath: string | undefined = undefined;
  let codeownersPath = "CODEOWNERS";
  let includeUnowned = true;
  let unownedBucketKey = "__UNOWNED__";
  let maxBuckets = 30;
  let excludePatterns: string[] = [];
  let patchDir = "bucket-patches";
  let bucketPrefix = "bucket";
  let dryRun = false;
  let cleanupPatches = true;

  let createPrs = false;
  let baseBranch = "";
  let branchPrefix = "codemods/";
  let commitMessage = "chore: automated changes";
  let prTitle = "chore: automated changes ({owners})";
  let prBody =
    "Automated changes bucketed by CODEOWNERS.\n\nOwners: {owners}\nBucket key: {bucket_key}\n\nFiles:\n{files}\n";
  let prBodyMode: SplitConfig["prBodyMode"] = "template";
  let prTemplatePath = ".github/pull_request_template.md";
  let draft = false;

  // parse args
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--repo-path") repoPath = takeArg(argv, i++, a);
    else if (a === "--codeowners") codeownersPath = takeArg(argv, i++, a);
    else if (a === "--include-unowned") includeUnowned = parseBool(takeArg(argv, i++, a));
    else if (a === "--unowned-bucket-key") unownedBucketKey = takeArg(argv, i++, a);
    else if (a === "--max-buckets") maxBuckets = Number(takeArg(argv, i++, a));
    else if (a === "--exclude") {
      const v = takeArg(argv, i++, a);
      const raw = v === "-" ? await readStdin() : readFileSync(v, "utf8");
      excludePatterns = readMultiline(raw);
    } else if (a === "--patch-dir") patchDir = takeArg(argv, i++, a);
    else if (a === "--bucket-prefix") bucketPrefix = takeArg(argv, i++, a);
    else if (a === "--dry-run") dryRun = true;
    else if (a === "--cleanup-patches") cleanupPatches = true;
    else if (a === "--create-prs") createPrs = true;
    else if (a === "--base-branch") baseBranch = takeArg(argv, i++, a);
    else if (a === "--branch-prefix") branchPrefix = takeArg(argv, i++, a);
    else if (a === "--commit-message") commitMessage = takeArg(argv, i++, a);
    else if (a === "--pr-title") prTitle = takeArg(argv, i++, a);
    else if (a === "--pr-body") prBody = takeArg(argv, i++, a);
    else if (a === "--pr-body-mode") prBodyMode = takeArg(argv, i++, a) as SplitConfig["prBodyMode"];
    else if (a === "--pr-template-path") prTemplatePath = takeArg(argv, i++, a);
    else if (a === "--draft") draft = parseBool(takeArg(argv, i++, a));
    else if (a.startsWith("-")) throw new Error(`Unknown arg: ${a}`);
  }

  const cfg: SplitConfig = {
    repoPath,
    codeownersPath,
    includeUnowned,
    unownedBucketKey,
    maxBuckets,
    excludePatterns,
    patchDir,
    bucketPrefix,
    dryRun,
    cleanupPatches,
    baseRef: "",
    createPrs,
    githubToken: "",
    baseBranch,
    branchPrefix,
    commitMessage,
    prTitle,
    prBody,
    prBodyMode,
    prTemplatePath,
    draft,
    remoteName: "origin"
  };

  const res = await runSplit(cfg, logger);
  logger.info(JSON.stringify({ buckets: res.buckets, prs: res.prs ?? [] }, null, 2));
}

main().catch((e) => {
  process.stderr.write((e?.message ?? String(e)) + "\n");
  process.exitCode = 1;
});

