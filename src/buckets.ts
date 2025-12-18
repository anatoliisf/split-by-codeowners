import fs from "node:fs";
import path from "node:path";
import { minimatch } from "minimatch";
import { Bucket, BucketFile, CodeownersJson, Owner } from "./types";

export function parseBool(v: string) {
  return String(v).toLowerCase() === "true";
}

export function readMultiline(input: string): string[] {
  return (input || "")
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);
}

export function applyExcludes(files: string[], excludePatterns: string[]): string[] {
  if (!excludePatterns.length) return files;
  return files.filter(f => !excludePatterns.some(p => minimatch(f, p, { dot: true })));
}

function ownersKey(owners: Owner[]) {
  return owners.slice().sort().join("|");
}

function stableBucketKey(owners: Owner[], unownedKey: string) {
  if (!owners.length) return unownedKey;
  return ownersKey(owners)
    .replaceAll("@", "")
    .replaceAll("/", "-")
    .replaceAll(" ", "");
}

export function readCodeownersJson(codeownersJsonPath: string): CodeownersJson {
  const raw = fs.readFileSync(path.resolve(process.cwd(), codeownersJsonPath), "utf8");
  return JSON.parse(raw) as CodeownersJson;
}

export function buildBuckets(
  changedFiles: string[],
  codeowners: CodeownersJson,
  includeUnowned: boolean,
  unownedKey: string
): Bucket[] {
  const fileMatches = codeowners.fileMatches ?? {};
  const buckets = new Map<string, Bucket>();

  for (const file of changedFiles) {
    const match = fileMatches[file];
    const owners = (match?.owners ?? []).slice().sort();
    const isUnowned = owners.length === 0;
    if (isUnowned && !includeUnowned) continue;

    const key = stableBucketKey(owners, unownedKey);
    const bf: BucketFile = {
      file,
      owners,
      rule: match?.matched_rule ?? match?.rule_match
    };

    const existing = buckets.get(key);
    if (!existing) {
      buckets.set(key, { key, owners, files: [bf] });
    } else {
      existing.files.push(bf);
    }
  }

  return [...buckets.values()].sort((a, b) => a.key.localeCompare(b.key));
}

export function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

export function toMatrix(buckets: Bucket[], patchDir: string, bucketPrefix: string) {
  return {
    include: buckets.map((b, i) => ({
      bucket_key: b.key,
      owners: b.owners,
      files: b.files.map(f => f.file),
      patch_path: path.posix.join(patchDir.replaceAll("\\", "/"), `${bucketPrefix}-${i + 1}.patch`)
    }))
  };
}
