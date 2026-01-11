import fs from "node:fs";
import path from "node:path";
import { minimatch } from "minimatch";
import { Bucket, BucketFile, Owner } from "./types";

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
