# split-by-codeowners

Two entrypoints sharing the same core logic:

- **Local dev (CLI via `npx`)**: bucketize your current git working tree changes by CODEOWNERS, optionally push branches + create/update one PR per bucket.
- **CI (GitHub Action)**: same behavior inside GitHub Actions (**no third-party PR-creation actions**).

### CLI usage (local dev)

Bucketize + write patches:

```bash
npx split-by-codeowners --exclude - < excludes.txt
```

Create one PR per bucket:

```bash
export GH_TOKEN=... # needs contents:write + pull-requests:write
npx split-by-codeowners --create-prs --base-branch main
```

### GitHub Action usage (CI)

After `actions/checkout` and after you run your codemods (that modify the working tree), run:

```yaml
- name: Split into CODEOWNERS PRs
  uses: anatoliisf/split-by-codeowners@v1
  with:
    create_prs: "true"
    github_token: ${{ github.token }}
```

### Reusable workflow (optional)

This repo also ships `.github/workflows/split-prs.yml`, which runs your codemod command and then calls the Action to create PRs.
