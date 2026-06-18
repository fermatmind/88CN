#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: bash scripts/agent/post-merge-cleanup.sh <PR_NUMBER>" >&2
  exit 1
fi

pr_number="$1"

pr_json="$(gh pr view "${pr_number}" --json number,state,headRefName,baseRefName,mergeCommit,url)"
state="$(node -e "const p=JSON.parse(process.argv[1]); console.log(p.state)" "${pr_json}")"
head_ref="$(node -e "const p=JSON.parse(process.argv[1]); console.log(p.headRefName)" "${pr_json}")"
base_ref="$(node -e "const p=JSON.parse(process.argv[1]); console.log(p.baseRefName)" "${pr_json}")"
merge_sha="$(node -e "const p=JSON.parse(process.argv[1]); console.log(p.mergeCommit?.oid || '')" "${pr_json}")"

if [[ "${state}" != "MERGED" ]]; then
  echo "PR ${pr_number} is not merged" >&2
  exit 1
fi

if [[ "${base_ref}" != "main" ]]; then
  echo "PR ${pr_number} base is ${base_ref}, expected main" >&2
  exit 1
fi

if [[ -z "${merge_sha}" ]]; then
  echo "merge commit missing" >&2
  exit 1
fi

git fetch origin --prune
git merge-base --is-ancestor "${merge_sha}" origin/main

git switch main
git pull --ff-only origin main

local_sha="$(git rev-parse main)"
remote_sha="$(git rev-parse origin/main)"
if [[ "${local_sha}" != "${remote_sha}" ]]; then
  echo "local main does not equal origin/main" >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "worktree is not clean" >&2
  git status --short
  exit 1
fi

if git show-ref --verify --quiet "refs/heads/${head_ref}"; then
  git branch -D "${head_ref}"
fi

if git ls-remote --exit-code --heads origin "${head_ref}" >/dev/null 2>&1; then
  git push origin --delete "${head_ref}"
fi

echo "post-merge cleanup complete for PR ${pr_number}"
