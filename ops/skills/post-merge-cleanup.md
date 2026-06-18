# Post-Merge Cleanup Skill

Use this card after a PR has been merged and the user asks for strict cleanup.

## Checklist

1. Confirm the PR is merged.
2. Confirm `origin/main` contains the merge commit.
3. Sync local `main` with `origin/main`.
4. Verify local `main` equals `origin/main`.
5. Verify the worktree is clean.
6. Delete the local task branch.
7. Delete the remote task branch if it still exists and deletion is allowed.
8. Stop.

## Commands

Prefer the helper:

```bash
bash scripts/agent/post-merge-cleanup.sh <PR_NUMBER>
```

If the helper cannot run, perform the same checks manually with `gh pr view`, `git merge-base --is-ancestor`, `git pull --ff-only`, and branch deletion commands.
