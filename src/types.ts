export type Owner = string;

export type BucketFile = {
  file: string;
  owners: Owner[];
  rule?: string;
};

export type Bucket = {
  key: string;
  owners: Owner[];
  files: BucketFile[];
};

export type RepoRef = { owner: string; repo: string };

export type PullRequestInfo = {
  bucket_key: string;
  branch: string;
  number: number;
  url: string;
};

export type SplitConfig = {
  // bucketing
  repoPath?: string;
  codeownersPath: string;
  baseRef?: string;
  includeUnowned: boolean;
  unownedBucketKey: string;
  maxBuckets: number;
  excludePatterns: string[];

  // patch output
  patchDir: string;
  bucketPrefix: string;
  dryRun: boolean;
  cleanupPatches: boolean;

  // PR creation (optional)
  createPrs: boolean;
  githubToken?: string;
  repo?: RepoRef;
  baseBranch?: string;
  branchPrefix: string;
  commitMessage: string;
  prTitle: string;
  prBody: string;
  prBodyMode: "custom" | "template" | "template_with_bucket" | "none";
  prTemplatePath: string;
  draft: boolean;
  remoteName: string;
};

export type Logger = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
};

export type SplitResult = {
  buckets: Bucket[];
  matrix: { include: Array<{ bucket_key: string; owners: Owner[]; files: string[]; patch_path: string }> };
  prs?: PullRequestInfo[];
};
