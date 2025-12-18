# Split PRs by CODEOWNERS (codemods → one PR per owner group)

This repo provides:
1) A Marketplace Action: `anatoliisf/split-by-codeowners@v1` (bucketize + patches + matrix JSON)
2) A Reusable Workflow: `split-prs.yml` (recommended UX) that runs codemods and creates PRs using:
   - SvanBoxel/codeowners-action
   - peter-evans/create-pull-request

## Recommended usage (one-liner UX)

```yaml
jobs:
  split_prs:
    uses: anatoliisf/split-by-codeowners/.github/workflows/split-prs.yml@v1
    permissions:
      contents: write
      pull-requests: write
    with:
      codemod_command: ./run-codemods.sh
      max_prs: "20"
      exclude_patterns: |
        **/yarn.lock
        **/pnpm-lock.yaml
        **/package-lock.json
