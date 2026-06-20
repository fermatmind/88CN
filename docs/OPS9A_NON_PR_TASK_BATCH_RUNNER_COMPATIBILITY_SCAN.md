# OPS9A Non-PR Task Batch Runner Compatibility Scan v0

Result: GO_OPS9A_IMPLEMENTATION_IF_CONTINUOUS_TRAIN_IS_REQUIRED

## Scope

OPS9A scans whether the current PR train runner can safely support non-PR task IDs such as `TRAFFIC3`, `GROWTH0`, and `OPS9A`.

This scan is docs, status, and roadmap work only. It does not modify runner scripts, register a TRAFFIC/GROWTH batch, execute a train, deploy, touch runtime code, install dependencies, call external services, mutate Supabase, or mutate the data repository.

## Current State

The current runner stack is still PR-number oriented:

- `scripts/agent/batch-check.mjs` validates every batch task through `taskNumber()`, which only accepts `^PR(\d+)$`.
- `scripts/agent/batch-check.mjs` fails a batch if any task does not produce a PR number.
- `ops/trains/batches.json` contains PR-number trains only.
- `scripts/agent/train-plan-check.mjs` can print task rows for any task ID that is present in roadmap or skeletons, but it only reads batches after they pass registry selection.
- `scripts/agent/gate.sh` runs `npm run agent:batch:check` and `npm run agent:train-plan:check`, so any invalid non-PR batch would fail the default agent gate.
- `ops/trains/current.json` still requires `next_recommended_train` to reference an existing batch, and its current value is retained as a PR train for checker compatibility.

Therefore, registering a batch such as `TRAIN-TRAFFIC3-TRAFFIC7` would fail today before execution.

## Direct Evidence

| Area | Evidence | Compatibility Result |
| --- | --- | --- |
| Batch task ID parser | `scripts/agent/batch-check.mjs` uses `^PR(\d+)$` in `taskNumber()` | Blocks `TRAFFIC3`, `GROWTH0`, `OPS9A`, and similar non-PR IDs |
| Batch validation | `batch.tasks.map(taskNumber)` must produce a number for every task | Non-PR tasks fail with `tasks must use PR<number> ids` |
| Current train fallback | `scripts/agent/train-plan-check.mjs` defaults to `current.next_recommended_train` | Requires train-oriented current metadata |
| Roadmap coverage | `TRAFFIC3` through `TRAFFIC7` and `GROWTH0` through `GROWTH3` exist as roadmap tasks | Single-task execution is available without train registration |
| Gate integration | `scripts/agent/gate.sh` runs batch and train-plan checks | Any incompatible non-PR batch blocks `agent:gate` |
| Landscape lifecycle checker | `scripts/check-landscape-boundary.mjs` asserts `ops/tasks/current.json` is `TRAFFIC2B/PASS` | Current-task metadata cannot be freely advanced during OPS9A without fixing checker lifecycle assumptions |

## Compatibility Decision

Non-PR train batching is not safe to enable by registry changes alone.

Safe support requires a follow-up implementation task that changes runner validation intentionally and preserves all existing PR-number train behavior. Until that implementation lands, TRAFFIC and GROWTH tasks should run one task at a time.

## Recommended Implementation Boundary

If continuous TRAFFIC/GROWTH train execution is required, use a follow-up task named `OPS9A2 Non-PR Task Batch Runner Compatibility Implementation v0` or equivalent. Do not reuse `OPS9B`, because OPS9B is already reserved in planning discussions for demand-side deploy and live smoke.

That implementation should be narrow:

1. Keep existing `PR<number>` task acceptance unchanged.
2. Add explicit allowlisted non-PR task ID families, for example `TRAFFIC\d+[A-Z]?`, `GROWTH\d+[A-Z]?`, and `OPS\d+[A-Z]?`.
3. Require every non-PR batch task to exist in `ops/tasks/roadmap.json`; do not allow skeleton-only non-PR train execution.
4. Require non-PR batches to declare no deploy, no external write, no dependency, no server config, no plugin install, and no payment change unless a named human checkpoint is present.
5. Keep `batch_limit` and `stop_on` checks unchanged.
6. Add negative fixture coverage showing unknown IDs, typo IDs, unregistered IDs, and checkpointed high-risk IDs fail.
7. Decide whether `ops/trains/current.json` needs a separate `next_recommended_task` or whether non-PR trains must always be invoked through explicit `--batch`.
8. Make lifecycle-sensitive checkers, especially `landscape:check`, safe after TRAFFIC2B before changing `ops/tasks/current.json` defaults.

## Non-PR Batch Policy

Recommended default policy for the first non-PR train support:

- `auto_merge_allowed`: true by default for stable docs-only, status-only, readiness, and QA tasks when no human checkpoint or high-risk flag is present.
- `live_deploy_allowed`: false.
- `payment_change_allowed`: false.
- `mcp_change_allowed`: false unless each MCP task is human-checkpointed.
- `server_change_allowed`: false.
- `plugin_install_allowed`: false.
- `new_dependency_allowed`: false.
- `continue_on_sidecar`: true only for documented non-blocking checker debt.
- `human_checkpoints`: required for deploy, external write, server config, payment-adjacent, MCP runtime, PII, outreach, analytics connection, data repo mutation, or production configuration work.

## TRAFFIC/GROWTH Execution Recommendation

Current exact recommendation:

1. If the goal is fastest demand-side progress, run `TRAFFIC3` as a single docs-only task next.
2. If the goal is continuous train execution, implement runner compatibility first through a separate OPS9A implementation task.
3. Do not register `TRAIN-TRAFFIC3-TRAFFIC7` until the runner compatibility implementation and its negative probes pass.
4. Do not start `GROWTH0` before the demand-side traffic boundary is clearer unless the human team explicitly reprioritizes it.

## Sidecar Findings

OPS9A opens one non-blocking sidecar:

- The landscape checker remains lifecycle-scoped to `TRAFFIC2B/PASS`. This is compatible with current validation only because OPS9A does not modify `ops/tasks/current.json`. A later checker-maintenance task should make `landscape:check` verify the `/landscape` surface without requiring the current task to remain `TRAFFIC2B`.

## Validation Notes

Expected validation set for OPS9A scan:

- `npm run verify:day0`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run agent:redact:check`
- `npm run agent:batch:check`
- `npm run agent:train-plan:check`
- `npm run agent:scope:check -- OPS9A`

## Final Recommendation

Do not change the runner in this scan PR.

Proceed with one of two paths:

- `NO_CHANGE_RUN_TRAFFIC3`: run `TRAFFIC3` next as a single docs-only boundary task.
- `GO_OPS9A_IMPLEMENTATION`: if continuous TRAFFIC/GROWTH trains are required, create a separate implementation PR that updates the runner validator, negative probes, and lifecycle checker assumptions before registering any non-PR train.
