# split-by-codeowners

Split a set of local changes into **CODEOWNERS buckets** and (optionally) create **one PR per bucket**.

Works in two modes sharing the same core logic:

- **GitHub Action**: run in CI after your codemod step; generates patches + can create/update PRs (no third-party PR actions).
- **CLI (`npx`)**: run locally to bucketize current working tree changes; can create/update PRs using `gh` for best dev UX.

## Why

If a codemod touches files owned by different teams, you often want:

- smaller PRs
- clearer ownership/review routing
- independent merge/rollback per owner group

This tool groups changed files by their **effective CODEOWNERS owner set** (last-match-wins semantics).

## Quickstart (GitHub Action)

```yaml
permissions:
  contents: write
  pull-requests: write

steps:
  - uses: actions/checkout@v4
  - name: Run codemods
    run: ./run-codemods.sh

  - name: Split into CODEOWNERS PRs
    uses: anatoliisf/split-by-codeowners@v1
    with:
      create_prs: "true"
      github_token: ${{ github.token }}
```

## Quickstart (CLI)

Bucketize + write patches:

```bash
npx split-by-codeowners
```

Create/update PRs locally (recommended: `gh` auth):

```bash
gh auth login -h github.com
npx split-by-codeowners --create-prs --base-branch main
```

## GitHub Action

### Inputs

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `codeowners_path` | no | `CODEOWNERS` | Path to CODEOWNERS file |
| `base_ref` | no | `""` | Base ref for changed-files discovery (currently workspace-focused; see notes) |
| `include_unowned` | no | `"true"` | Include files with no owners in a special bucket |
| `unowned_bucket_key` | no | `__UNOWNED__` | Bucket key for unowned files |
| `max_buckets` | no | `"30"` | Fail if buckets exceed this number |
| `exclude_patterns` | no | `""` | Newline-separated glob patterns to exclude (minimatch) |
| `patch_dir` | no | `bucket-patches` | Directory to write per-bucket patch files |
| `bucket_prefix` | no | `bucket` | Patch file prefix |
| `dry_run` | no | `"false"` | Compute buckets but don’t write patches |
| `cleanup_patches` | no | `"false"` | Delete `patch_dir` after a successful run |
| `create_prs` | no | `"false"` | Create/update one PR per bucket |
| `github_token` | no | `""` | Token used for pushing branches + GitHub API (defaults to env `GITHUB_TOKEN`) |
| `base_branch` | no | `""` | Base branch for PRs (defaults to repo default branch) |
| `branch_prefix` | no | `codemods/` | Prefix for created branches |
| `commit_message` | no | `chore: automated changes` | Commit message for bucket PRs |
| `pr_title` | no | `chore: automated changes ({owners})` | PR title template (`{owners}`, `{bucket_key}`) |
| `pr_body` | no | *(see `action.yml`)* | PR body template (`{owners}`, `{bucket_key}`, `{files}`) |
| `draft` | no | `"false"` | Create PRs as drafts |

### Outputs

| Name | Description |
| --- | --- |
| `matrix_json` | JSON for `strategy.matrix` (`{ include: [...] }`) |
| `buckets_json` | Full buckets JSON (owners + files + matched rule) |
| `prs_json` | If `create_prs=true`, list of created/updated PRs |

### Example: bucketize only (matrix + patches)

```yaml
- name: Bucketize (patches + matrix)
  id: split
  uses: anatoliisf/split-by-codeowners@v1
  with:
    create_prs: "false"

- name: Use matrix
  run: echo '${{ steps.split.outputs.matrix_json }}'
```

### Required permissions (when `create_prs=true`)

At minimum:

```yaml
permissions:
  contents: write
  pull-requests: write
```

## CLI

The CLI operates on your **current working tree** (modified + untracked files) and groups them by CODEOWNERS.

### Usage

```bash
npx split-by-codeowners --help
```

### Common examples

Exclude some paths:

```bash
npx split-by-codeowners --exclude - < excludes.txt
```

Create/update PRs:

```bash
npx split-by-codeowners --create-prs --base-branch main
```

Force token auth locally (instead of `gh`):

```bash
export GH_TOKEN=...
npx split-by-codeowners --create-prs --token "$GH_TOKEN" --base-branch main
```

### Notes on local PR creation

- Locally (no `GITHUB_ACTIONS`), the tool **prefers `gh`** for PR creation.
- In GitHub Actions (`GITHUB_ACTIONS=true`), the tool **requires a token** and uses API auth.

## How it buckets files

- Uses CODEOWNERS **last matching rule wins** for each file.
- Bucket key is the sorted owners list (normalized) or `unowned_bucket_key`.

## Troubleshooting

### “Permission denied to github-actions[bot]”

Ensure workflow permissions include:

- `contents: write`
- `pull-requests: write`

### “Too many buckets”

Raise `max_buckets` or add `exclude_patterns` to avoid noisy files (lockfiles, snapshots, etc.).

## Development

Build bundles (committed `dist/` is required for Marketplace Actions):

```bash
npm ci
npm run build
```
