import * as core from "@actions/core";
import { getChangedFiles, writePatchForPaths } from "./git";
import { applyExcludes, buildBuckets, ensureDir, parseBool, readCodeownersJson, readMultiline, toMatrix } from "./buckets";

async function run() {
  try {
    const codeownersJsonPath = core.getInput("codeowners_json") || "codeowner-information.json";
    const includeUnowned = parseBool(core.getInput("include_unowned"));
    const unownedKey = core.getInput("unowned_bucket_key") || "__UNOWNED__";
    const maxBuckets = Number(core.getInput("max_buckets") || "30");
    const excludePatterns = readMultiline(core.getInput("exclude_patterns"));
    const patchDir = core.getInput("patch_dir") || "bucket-patches";
    const bucketPrefix = core.getInput("bucket_prefix") || "bucket";
    const dryRun = parseBool(core.getInput("dry_run"));

    const changed = getChangedFiles(core.getInput("base_ref"));
    const filtered = applyExcludes(changed, excludePatterns);

    core.info(`Changed files: ${changed.length} (after excludes: ${filtered.length})`);
    if (!filtered.length) {
      core.setOutput("matrix_json", JSON.stringify({ include: [] }));
      core.setOutput("buckets_json", JSON.stringify([]));
      return;
    }

    const codeowners = readCodeownersJson(codeownersJsonPath);
    const buckets = buildBuckets(filtered, codeowners, includeUnowned, unownedKey);

    if (buckets.length > maxBuckets) {
      throw new Error(`Too many buckets: ${buckets.length} > max_buckets=${maxBuckets}`);
    }

    if (!dryRun) {
      ensureDir(patchDir);
      buckets.forEach((b, idx) => {
        const patchPath = `${patchDir}/${bucketPrefix}-${idx + 1}.patch`;
        const paths = b.files.map(f => f.file);
        core.info(`Writing ${patchPath} (${paths.length} files) for bucket=${b.key}`);
        writePatchForPaths(patchPath, paths);
      });
    } else {
      core.info("dry_run=true; not generating patches.");
    }

    const matrix = toMatrix(buckets, patchDir, bucketPrefix);
    core.setOutput("matrix_json", JSON.stringify(matrix));
    core.setOutput("buckets_json", JSON.stringify(buckets));
  } catch (e: any) {
    core.setFailed(e?.message ?? String(e));
  }
}

run();
