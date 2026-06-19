# OPS9A2 Non-PR Task Batch Runner Compatibility Implementation v0

Result: NON_PR_BATCH_COMPAT_PASS_NO_TRAIN_REGISTERED

## Scope

OPS9A2 implements the OPS9A scan recommendation: allow explicitly allowlisted non-PR task IDs in batch/train tooling while preserving existing PR-number train behavior.

This task does not run `TRAFFIC3`, `TRAFFIC3B`, `TRAFFIC4`, `TRAIN-TRAFFIC3-TRAFFIC7-DEMAND-SURFACE`, product pages, deployment, Supabase, external writes, data-repository mutation, `GROWTH0`, `BETA1`, `I18N0`, `OPS9B`, or `PR101`.

## Source Input

OPS9A concluded that non-PR train batching was blocked because `scripts/agent/batch-check.mjs` accepted only `PR<number>` tasks and rejected all other task IDs. OPS9A also recorded that `scripts/check-landscape-boundary.mjs` was lifecycle-scoped to `TRAFFIC2B/PASS` in `ops/tasks/current.json`.

OPS9A2 uses that scan as the immediate source. During this implementation, `origin/main` advanced with TRAFFIC3 already merged, so OPS9A2 keeps the current main next task as `TRAFFIC3B` and does not register a stale TRAFFIC3-starting train.

## What Changed

- `scripts/agent/batch-check.mjs` now classifies task IDs as existing `PR<number>` tasks, allowlisted non-PR tasks, or invalid tasks.
- `scripts/agent/train-plan-check.mjs` now renders `type`, `risk_flags`, and `stop_reason`, and fails clearly for unsafe non-PR train plans.
- `scripts/check-landscape-boundary.mjs` now validates the `/landscape` surface independently after `TRAFFIC2B` is complete instead of requiring `ops/tasks/current.json` to remain `TRAFFIC2B` forever.
- `ops/tasks/roadmap.json` registers `OPS9A2` with a narrow runner-maintenance scope.
- `ops/tasks/current.json` records `OPS9A2` as validation-passed while keeping `next_recommended_task` aligned with current main: `TRAFFIC3B`.
- `ops/trains/current.json` keeps the default `next_recommended_train` on the existing PR-number train for compatibility.
- `ops/trains/batches.json` is not changed to add a non-PR train because TRAFFIC3 already merged on `origin/main`; a `TRAIN-TRAFFIC3-TRAFFIC7` registry entry would be stale.

## Preserved PR-Number Behavior

Existing PR-number tasks still support roadmap task objects and skeleton-reserved IDs. PR-number batches are not required to use the new non-PR-only metadata. The default train-plan check still reads `ops/trains/current.json` and passes against the existing PR train.

Verified behavior:

- `npm run agent:batch:check` passes with existing PR-number batches.
- `npm run agent:train-plan:check` passes with the default PR-number train.
- A temporary PR-number batch based on `TRAIN-PR98-PR100-B2B-ALPHA-QA-READINESS` passed both `batch-check` and `train-plan-check`.

## Supported Non-PR Task ID Families

Only these non-PR task ID families are accepted:

- `TRAFFIC\d+[A-Z]?`
- `GROWTH\d+[A-Z]?`
- `OPS\d+[A-Z]?\d?`
- `I18N\d+[A-Z]?`
- `BETA\d+[A-Z]?`

Examples accepted only when fully registered in roadmap:

- `TRAFFIC3`
- `TRAFFIC3B`
- `TRAFFIC3Q`
- `TRAFFIC7`
- `GROWTH0`
- `GROWTH1`
- `OPS9A2`
- `OPS9B`
- `I18N0`
- `BETA1`

Examples rejected:

- `FOO1`
- `TRAFFICX`
- `GROWTH`
- `OPS`
- `random-task`
- `TRAFFIC999` when not registered
- `PRX`
- `PR-100`

## Roadmap Registration Requirement

Every non-PR batch task must be fully registered in `ops/tasks/roadmap.json`. Skeleton-only non-PR tasks are rejected.

Required roadmap fields for non-PR batch tasks:

- `id`
- `title`
- `role`
- `type`
- `repo`
- `allowed_paths`
- `forbidden_paths`
- `validations`
- `definition_of_done`
- `deployment`
- `human_checkpoint`

For non-PR tasks, dependencies listed in `depends_on` must exist in roadmap or skeleton metadata, and the task role must be allowed by the batch.

## Non-PR Batch Risk Policy

Non-PR batches must explicitly declare these risk flags:

- `external_service_allowed`
- `data_repo_mutation_allowed`
- `public_api_release_allowed`
- `customer_access_allowed`
- `pii_collection_allowed`
- `social_posting_allowed`
- `outreach_automation_allowed`

The runner also enforces existing risk flags:

- `live_deploy_allowed`
- `server_change_allowed`
- `payment_change_allowed`
- `mcp_change_allowed`
- `plugin_install_allowed`
- `new_dependency_allowed`

If any risk flag is `true`, the non-PR batch must be non-auto-merge and must declare an explicit human checkpoint. Checkpointed or future-checkpointed tasks cannot auto-run in an auto-merge batch.

## Train-Plan Behavior

`scripts/agent/train-plan-check.mjs` now prints:

- task id
- title
- role
- type
- deployment
- human checkpoint
- can auto-merge
- risk flags
- stop reason
- notes

It fails clearly for unknown task IDs, skeleton-only non-PR tasks, missing required roadmap fields, risk flags without checkpoint posture, and checkpoint-required tasks inside auto-merge batches.

## Landscape Checker Lifecycle Fix

`scripts/check-landscape-boundary.mjs` still verifies:

- `/landscape` source files exist
- no `/tasks`, `/zh-CN`, or `/landscape/sectors` route exists
- forbidden imports, fields, public-copy terms, unsafe links, and sitemap expansion are rejected
- package and data-repo safety checks still run

The checker no longer fails solely because `ops/tasks/current.json` advanced beyond `TRAFFIC2B`. For later current tasks, it requires the current task to be registered in roadmap, `TRAFFIC2B` to remain recorded as validated in `docs/TASK_STATUS.md`, and the current status to be a known lifecycle state.

## Positive Probes

Positive probes passed:

- Existing `npm run agent:batch:check`.
- Existing `npm run agent:train-plan:check`.
- Temporary safe non-PR batch fixture passed both `batch-check` and `train-plan-check`.
- Temporary PR-number batch fixture passed both `batch-check` and `train-plan-check`.
- `node scripts/check-landscape-boundary.mjs` passed with `current_task=OPS9A2`.
- `npm run landscape:check` passed with `current_task=OPS9A2`.

## Negative Probes

Temporary `/tmp` fixture probes passed by failing both `batch-check` and `train-plan-check` as expected:

1. Unknown non-PR family `FOO1`.
2. Typo task ID `TRAFFICX`.
3. Unregistered non-PR task `TRAFFIC999`.
4. Skeleton-only non-PR task `TRAFFIC9`.
5. Non-PR batch with `live_deploy_allowed=true` and no checkpoint.
6. Non-PR batch with `payment_change_allowed=true` and no checkpoint.
7. Non-PR batch with `mcp_change_allowed=true` and no checkpoint.
8. Non-PR batch with `external_service_allowed=true` and no checkpoint.
9. Non-PR batch with `data_repo_mutation_allowed=true` and no checkpoint.
10. Non-PR auto-merge batch containing checkpoint-required `GROWTH1`.

## Train Registration

OPS9A2 does not register:

`TRAIN-TRAFFIC3-TRAFFIC7-DEMAND-SURFACE`

Reason: after OPS9A merged, `origin/main` advanced with TRAFFIC3 already completed. Registering a train that begins with `TRAFFIC3` would create a stale executable train and could invite rerunning completed work.

The runner compatibility is instead proven through temporary safe non-PR batch fixtures and negative probes. A later roadmap recut can register an updated non-PR train if it reflects current task order.

No GROWTH train is registered.

## Exact Next Task

The exact next task from current main is:

`TRAFFIC3B Sector Density / Market Map Implementation v0`

OPS9A2 does not start `TRAFFIC3B`.

## What This PR Does Not Do

This PR does not implement `/landscape/sectors`, `/tasks`, `/zh-CN`, alternatives expansion, growth agents, API routes, MCP routes, payment routes, customer routes, data-feed routes, Supabase changes, deployment, external writes, outreach automation, PII storage, data-repo mutation, `TRAFFIC3B`, `TRAFFIC4`, `GROWTH0`, `BETA1`, `I18N0`, `OPS9B`, or `PR101`.
