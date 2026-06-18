# PR Train Runner Skill

Use this card when a user starts a bounded PR train by `BATCH_ID`.

## Bounded Batch Rule

1. Read `ops/trains/batches.json`.
2. Select exactly one batch by `id`.
3. Confirm the selected batch has explicit boolean values for merge, live deploy, payment, MCP, server, plugin, and dependency permissions.
4. Confirm the selected task count does not exceed `batch_limit`.
5. For train entries with `sub_batches`, execute only one sub-batch at a time.
6. Read each matching task object in `ops/tasks/roadmap.json` before editing.
7. If a task object is missing, stop and record the missing task as a blocker.

## Human Checkpoint Rule

Stop before any action covered by `human_checkpoints`.

Human checkpoints are required for:

- payment or Stripe/commercial enablement
- email automation or external notification
- public API external release
- scaled public content or indexability expansion
- Laravel, API key, metering, or data feed release
- real MCP endpoint configuration
- external framework PR creation
- live deployment unless both the batch and roadmap task allow it

## Sidecar Issue Rule

Use `docs/SIDECAR_ISSUES.md` only for issues outside the active task scope.

If `continue_on_sidecar` is true, record the issue and continue with the bounded batch.

If `continue_on_sidecar` is false, record the issue and stop.

Never use a sidecar issue to bypass a forbidden path, failed security gate, missing human checkpoint, or public language violation.

## Merge Policy

Merges are human-approved by default.

The runner must not execute an unattended or train-driven auto-merge unless all conditions are true:

- the selected batch sets `auto_merge_allowed` to true
- the active roadmap task allows merge
- `ops/tools/tool-registry.json` allows the required merge command
- the human team explicitly approves the merge

If the user explicitly approves a specific PR merge, Codex may run `gh pr merge` when `ops/tools/tool-registry.json` allows it, the PR is mergeable, required checks pass, and no human checkpoint is being bypassed.

If the merge is not explicitly approved, open or update the PR and stop before merge.

## Live Smoke vs Live Config Change

Live-smoke-only tasks may run approved smoke checks against the live site when the roadmap task allows QA.

Live-smoke-only tasks must not:

- change server configuration
- change production process managers
- change DNS or TLS
- write secrets or environment values
- deploy a new target SHA

Live configuration changes require a separate roadmap task, exact target SHA, and explicit human approval.

## Post-Merge Validation

After a PR is merged and cleanup is requested, use `ops/skills/post-merge-cleanup.md`.

Confirm:

1. the PR is merged
2. `origin/main` contains the merge commit
3. local `main` is synced to `origin/main`
4. local `main` equals `origin/main`
5. the worktree is clean
6. the task branch is removed only after the above checks pass

## No Same-Worktree Parallelism Rule

Do not run parallel write sessions in the same git worktree.

Before starting a train, inspect:

```bash
git status --short --branch
git worktree list
```

If another train is active in the same working tree, stop or create a separate worktree.

## Parallel OPS Worktree Rule

Parallel OPS tasks must use separate worktrees created from current `origin/main`.

Recommended pattern:

```bash
git fetch origin --prune
git worktree add /path/to/88CN-<task> origin/main -b codex/<task-branch>
```

Work only inside the new worktree. Do not write to another active train's worktree.
