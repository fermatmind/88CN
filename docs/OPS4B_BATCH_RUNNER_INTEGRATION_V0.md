# OPS4B Batch Runner Integration v0

## Purpose

OPS-4B turns the OPS-4A PR Train Batch Registry into an executable planning layer. It adds local validation scripts, train plan dry-run output, package scripts, and agent gate integration so future batch execution can be checked before any product work starts.

This PR does not execute PR42 or any future product train.

## What OPS-4A Provided

OPS-4A created the spec-only registry and runner documentation:

- `ops/trains/batches.json`
- `ops/trains/current.json`
- `ops/templates/pr-train-goal.md`
- `ops/skills/pr-train-runner.md`
- `docs/OPS4_PR_TRAIN_BATCH_REGISTRY_V0.md`
- `docs/SIDECAR_ISSUES.md`

OPS-4A intentionally did not modify package scripts or agent scripts.

## What OPS-4B Adds

OPS-4B adds:

- `scripts/agent/batch-check.mjs`
- `scripts/agent/train-plan-check.mjs`
- `npm run agent:batch:check`
- `npm run agent:train-plan:check`
- batch and train-plan checks inside `npm run agent:gate`
- roadmap task objects for `OPS4B` and `OPS4BQ`
- updated runner template and skill-card references to the new checks

## Batch Validation Rules

`npm run agent:batch:check` validates:

- registry and current-train JSON files exist and parse
- each batch has required fields
- batch IDs are unique
- task IDs inside each batch are unique
- task count does not exceed `batch_limit`
- each task ID exists in `ops/tasks/roadmap.json` or is covered by a roadmap skeleton
- required stop conditions are present:
  - `secret_exposure`
  - `scope_validation_failure`
  - `policy_scan_failure`
  - `required_github_check_failure`
  - `credential_prompt`
- payment, MCP, server, plugin, and dependency permission flags require human checkpoints when true
- auto-merge batches include required check and scope stop conditions
- registry policy requires stable auto-merge eligibility, branch deletion after merge, and explicit auto-merge blockers
- live deploy batches keep `server_change_allowed=false`
- live deploy batches distinguish live-smoke-only from live-config-change
- `ops/trains/current.json` has the required pointer fields

The script is read-only. It does not perform network calls, read secrets, or mutate files.

## Train Plan Dry-Run Behavior

`npm run agent:train-plan:check` reads `ops/trains/current.json.next_recommended_train` by default.

To check a specific train:

```bash
node scripts/agent/train-plan-check.mjs --batch TRAIN-PR42-PR46
node scripts/agent/train-plan-check.mjs --batch TRAIN-PR50-PR51
```

The dry-run prints:

- index
- task ID
- title or reserved skeleton purpose
- role
- deployment type
- human checkpoint yes/no
- can auto merge yes/no
- notes

Roadmap tasks are expanded when available. Future skeleton-covered tasks are printed as `RESERVED_FUTURE_TASK`.

The script is read-only. It does not modify files, call GitHub, or deploy.

## Human Checkpoint Enforcement

Batch validation fails when any high-risk permission flag is true without a declared checkpoint:

- `payment_change_allowed`
- `mcp_change_allowed`
- `server_change_allowed`
- `plugin_install_allowed`
- `new_dependency_allowed`

Train dry-run also reports task-level human checkpoint status for roadmap tasks and batch-declared checkpoints.

## Auto-Merge Safety Rules

Stable low-risk train-driven auto-merge is allowed by default and remains controlled by repository policy, batch permissions, roadmap permissions, and required checks. If a batch sets `auto_merge_allowed=true`, it must include stop conditions for required GitHub check failure and scope validation failure.

Codex merge execution still requires policy gates:

- PR is mergeable
- required checks pass
- branch deletion after merge is enabled by repository policy
- no human checkpoint is bypassed

Auto merge remains blocked for human checkpoints, live deploys, server or cloud mutation, production or staging writes, secret or environment changes, payment/customer access, external writes or outreach, data repo mutation, Public API/MCP release, plugins, and new dependencies unless a later task explicitly records the required human checkpoint.

## Live Smoke Only vs Live Config Change

Live-smoke-only tasks may check the live site without changing server configuration. Live configuration changes are treated separately and must not be hidden inside live-smoke-only tasks.

`TRAIN-PR36-PR41` keeps PR37 and PR41 as live-smoke-only checkpoints and explicitly blocks live server configuration change.

## Package Scripts Added

```bash
npm run agent:batch:check
npm run agent:train-plan:check
```

`npm run agent:gate` now includes both checks.

## Negative Test Results

Temporary fixtures were created under `/tmp` and removed after the run.

| Test | Result |
| --- | --- |
| Missing required batch field should fail `batch-check` | PASS |
| Duplicate batch ID should fail | PASS |
| `payment_change_allowed=true` without human checkpoint should fail | PASS |
| `server_change_allowed=true` without human checkpoint should fail | PASS |
| Unknown task not in roadmap or skeleton should fail | PASS |
| Train plan with unknown `BATCH_ID` should fail | PASS |
| Train plan should pass for `TRAIN-PR42-PR46` | PASS |
| Train plan should pass for `TRAIN-PR50-PR51` with payment checkpoint declared | PASS |

## Validation Results

| Command | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run agent:tool:check` | PASS |
| `npm run agent:mcp-config:check` | PASS |
| `npm run agent:plugin-policy:check` | PASS |
| `npm run agent:batch:check` | PASS |
| `npm run agent:train-plan:check` | PASS |
| `npm run agent:scope:check -- OPS4B` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS after `npm run build` regenerated `.next/types` |
| `npm run build` | PASS |
| `npm run agent:gate` | PASS |
| `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR42-PR46` | PASS |
| `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR50-PR51` | PASS |

`npm run typecheck` initially failed because stale `.next/types` entries referenced missing generated files. `npm run build` regenerated `.next/types`, and the rerun of `npm run typecheck` passed. No generated files are part of this PR.

## What This PR Does Not Do

- Does not modify product code.
- Does not deploy.
- Does not execute PR42 or any future train.
- Does not install dependencies.
- Does not modify `package-lock.json`.
- Does not connect to Supabase production.
- Does not connect to Stripe.
- Does not configure MCP.
- Does not edit server config.
- Does not modify `/Users/rainie/Desktop/88cn-index-data`.

## Follow-Up OPS4BQ

OPS4BQ should run as a separate QA PR. It should verify the batch runner scripts and gate behavior from QA scope without modifying scripts, package files, product code, or deployment configuration.
