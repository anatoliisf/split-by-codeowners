export type Owner = string;

export type FileMatch = {
  owners?: Owner[];
  // SvanBoxel includes extra info when file_match_info=true; we keep it flexible.
  matched_rule?: string;
  rule_match?: string;
};

export type CodeownersJson = {
  fileMatches?: Record<string, FileMatch>;
};

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
