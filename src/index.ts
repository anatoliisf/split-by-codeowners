import * as core from "@actions/core";
import { getChangedFiles, writePatchForPaths } from "./git";
import {
  applyExcludes,
  ensureDir,
  parseBool,
  readMultiline,
  toMatrix,
} from "./buckets";
import { parseCodeowners, ownersForFile } from "./codeowners";
import type { Bucket } from "./types";

async function run() {
  try {
    const codeownersPath = core.getInput("codeowners_path") || "CODEOWNERS";

    const includeUnowned = parseBool(core.getInput("include_unowned"));
    const unownedKey = core.getInput("unowned_bucket_key") || "__UNOWNED__";
    const maxBuckets = Number(core.getInput("max_buckets") || "30");
    const excludePatterns = readMultiline(core.getInput("exclude_patterns"));

    const patchDir = core.getInput("patch_dir") || "bucket-patches";
    const bucketPrefix = core.getInput("bucket_prefix") || "bucket";
    const dryRun = parseBool(core.getInput("dry_run"));

    // 1) discover changed files (workspace)
    const changed = getChangedFiles(core.getInput("base_ref"));
    const filtered = applyExcludes(changed, excludePatterns);

    core.info(`Changed files: ${changed.length} (after excludes: ${filtered.length})`);

    if (!filtered.length) {
      core.setOutput("matrix_json", JSON.stringify({ include: [] }));
      core.setOutput("buckets_json", JSON.stringify([]));
      return;
    }

    // 2) parse CODEOWNERS and resolve owners per file
    const rules = parseCodeowners(codeownersPath);

    const bucketsMap = new Map<string, Bucket>();

    for (const file of filtered) {
      const { owners, rule } = ownersForFile(file, rules);
      const sortedOwners = (owners ?? []).slice().sort();
      const isUnowned = sortedOwners.length === 0;

      if (isUnowned && !includeUnowned) continue;

      const key = isUnowned
        ? unownedKey
        : sortedOwners
            .join("|")
            .replaceAll("@", "")
            .replaceAll("/", "-")
            .replaceAll(" ", "");

      const existing = bucketsMap.get(key);
      if (!existing) {
        bucketsMap.set(key, {
          key,
          owners: sortedOwners,
          files: [{ file, owners: sortedOwners, rule }],
        });
      } else {
        existing.files.push({ file, owners: sortedOwners, rule });
      }
    }

    const buckets = [...bucketsMap.values()].sort((a, b) => a.key.localeCompare(b.key));

    if (buckets.length > maxBuckets) {
      throw new Error(`Too many buckets: ${buckets.length} > max_buckets=${maxBuckets}`);
    }

    // 3) write per-bucket patches
    if (!dryRun) {
      ensureDir(patchDir);
      buckets.forEach((b, idx) => {
        const patchPath = `${patchDir}/${bucketPrefix}-${idx + 1}.patch`;
        const paths = b.files.map((f) => f.file);

        core.info(`Writing ${patchPath} (${paths.length} files) for bucket=${b.key}`);
        writePatchForPaths(patchPath, paths);
      });
    } else {
      core.info("dry_run=true; not generating patches.");
    }

    // 4) output matrix + buckets json
    const matrix = toMatrix(buckets, patchDir, bucketPrefix);
    core.setOutput("matrix_json", JSON.stringify(matrix));
    core.setOutput("buckets_json", JSON.stringify(buckets));
  } catch (e: any) {
    core.setFailed(e?.message ?? String(e));
  }
}

run();
