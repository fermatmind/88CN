# GROWTH0T Growth Train Registration + Readiness Scan v0

Date: 2026-06-20
Role: Codex-Build / Codex-Research
Result: BLOCKED_RUNNER_COMPATIBILITY
Exact next remediation: GROWTH0T2 runner compatibility or task-alias decision

## Scope

GROWTH0T scans the Growth split-task registry after GROWTH0, attempts safe
non-PR Growth train registration, and validates runner compatibility. This is
docs, roadmap, status, and train-registry metadata work only.

This task does not implement GROWTH1A, GROWTH1B, GROWTH1Q, GROWTH2A, GROWTH2B,
GROWTH2Q, GROWTH3A, GROWTH3B, GROWTH3Q, or GROWTHQ. It does not create growth
agents, founder lead queues, outreach drafts, report distribution drafts, weekly
growth review generators, external posts, GitHub Issues, CRM records, PII
stores, platform logins, browser-session exports, live analytics connections,
Supabase writes, data-repo mutations, or deployments.

## Source Inputs

- `docs/growth/GROWTH0_GROWTH_AGENT_BOUNDARY_SCAN.md`
- `docs/OPS9A2_NON_PR_TASK_BATCH_RUNNER_COMPATIBILITY_IMPLEMENTATION.md`
- `docs/OPS9B_DEMAND_SIDE_TRAFFIC_SURFACE_DEPLOY_LIVE_SMOKE_V0.md`
- `docs/traffic/TRAFFIC7_DEMAND_SIDE_TRAFFIC_QA_V0.md`
- `docs/TASK_STATUS.md`
- `docs/QA_REPORT.md`
- `docs/SIDECAR_ISSUES.md`
- `ops/tasks/roadmap.json`
- `ops/tasks/current.json`
- `ops/trains/current.json`
- `ops/trains/batches.json`

## GROWTH0 Summary

GROWTH0 established the controlling rule:

Codex may prepare. Humans execute.

GROWTH0 registered `GROWTH1A/B/Q`, `GROWTH2A/B/Q`, `GROWTH3A/B/Q`, and
`GROWTHQ`, but intentionally did not register train metadata because
`ops/trains/**` was outside its scope.

## Readiness Answers

| Question | Answer |
| --- | --- |
| Are GROWTH1A/B/Q fully registered? | Yes. |
| Are GROWTH2A/B/Q fully registered? | Yes. |
| Are GROWTH3A/B/Q and GROWTHQ fully registered? | Yes. |
| Do any Growth tasks allow external writing? | No. |
| Do any Growth tasks allow email, DM, or social posting? | No. |
| Do any Growth tasks allow CRM writes? | No. |
| Do any Growth tasks allow PII storage? | No. |
| Do any Growth tasks require platform login, cookies, or sessions? | No. |
| Do any Growth tasks require live analytics? | No. |
| Do any Growth tasks require Supabase writes or data repo mutation? | No. |
| Are implementation tasks drafts-only / local-only? | Yes. GROWTH1B, GROWTH2B, and GROWTH3B remain local-only draft/review work. |
| Are QA tasks no-auto-send/no-external-post focused? | Yes. |
| Can OPS9A2 runner support the Growth trains? | Not fully. It supports numbered Growth task IDs, but rejects `GROWTHQ`. |
| Which Growth trains should be registered? | Intended trains remain GROWTH2, GROWTH1, and GROWTH3, but none are registered in GROWTH0T because the required GROWTH3 train cannot pass runner checks. |
| Which Growth train should run first? | Intended first train is `TRAIN-GROWTH2-REPORT-DISTRIBUTION-DRAFTS`, after runner remediation. |
| Should BETA1 remain paused? | Yes. |
| Should I18N0 remain paused? | Yes. |
| Should OPS8D / OPS10A remain paused? | Yes. |
| Should PR101 remain paused? | Yes. |
| What is the exact next task/train? | No Growth train should run yet. Exact next remediation is `GROWTH0T2`, a narrow runner compatibility or task-alias decision. |

## Registered Task Readiness Matrix

| Task | Role | Type | Status | Starts in GROWTH0T? |
| --- | --- | --- | --- | --- |
| GROWTH1A | codex-research | growth-boundary | Registered | No |
| GROWTH1B | codex-research | future-checkpointed | Registered | No |
| GROWTH1Q | codex-qa | qa | Registered | No |
| GROWTH2A | codex-research | growth-boundary | Registered | No |
| GROWTH2B | codex-research | future-checkpointed | Registered | No |
| GROWTH2Q | codex-qa | qa | Registered | No |
| GROWTH3A | codex-research | growth-boundary | Registered | No |
| GROWTH3B | codex-research | research | Registered | No |
| GROWTH3Q | codex-qa | qa | Registered | No |
| GROWTHQ | codex-qa | qa | Registered | No |

## Growth Train Registration Matrix

| Train | Tasks | Registration status | Probe result |
| --- | --- | --- | --- |
| TRAIN-GROWTH1-FOUNDER-ACQUISITION-DRAFTS | GROWTH1A, GROWTH1B, GROWTH1Q | Not registered | Explicit train-plan probe passed. |
| TRAIN-GROWTH2-REPORT-DISTRIBUTION-DRAFTS | GROWTH2A, GROWTH2B, GROWTH2Q | Not registered | Explicit train-plan probe passed. |
| TRAIN-GROWTH3-WEEKLY-REVIEW-QA | GROWTH3A, GROWTH3B, GROWTH3Q, GROWTHQ | Not registered | Explicit train-plan probe failed because `GROWTHQ` does not match the current allowlisted non-PR task ID pattern. |

GROWTH0T does not leave a partial Growth train registry behind. Because the
required final GROWTH3/GROWTHQ train cannot pass the existing runner, all Growth
train registrations are deferred until the runner compatibility or task-alias
decision is made in a later narrow task.

## Runner Compatibility Blocker

OPS9A2 documents the non-PR task ID family for Growth as:

`GROWTH\\d+[A-Z]?`

That pattern accepts IDs such as `GROWTH0`, `GROWTH1A`, `GROWTH2Q`, and
`GROWTH3Q`. It does not accept `GROWTHQ`.

The explicit train-plan probe for `TRAIN-GROWTH3-WEEKLY-REVIEW-QA` failed with:

`GROWTHQ must use PR<number> or allowlisted non-PR id family`

GROWTH0T must not edit `scripts/**` or weaken validators, so this is recorded as
`BLOCKED_RUNNER_COMPATIBILITY`.

## Risk Flag Matrix

The intended Growth trains must keep these flags false when they are eventually
registered:

| Flag | Required value |
| --- | --- |
| auto_merge_allowed | false |
| live_deploy_allowed | false |
| server_change_allowed | false |
| payment_change_allowed | false |
| mcp_change_allowed | false |
| plugin_install_allowed | false |
| new_dependency_allowed | false |
| external_service_allowed | false |
| data_repo_mutation_allowed | false |
| public_api_release_allowed | false |
| customer_access_allowed | false |
| pii_collection_allowed | false |
| social_posting_allowed | false |
| outreach_automation_allowed | false |
| email_send_allowed | false |
| dm_send_allowed | false |
| crm_write_allowed | false |
| platform_login_allowed | false |
| browser_session_export_allowed | false |
| live_analytics_connection_allowed | false |

`continue_on_sidecar` may be `true` only for non-blocking P3 sidecar findings.

## Recommended Execution Order After Remediation

Default order after runner compatibility is fixed or a safe task-alias decision
is made:

1. `TRAIN-GROWTH2-REPORT-DISTRIBUTION-DRAFTS`
2. `TRAIN-GROWTH1-FOUNDER-ACQUISITION-DRAFTS`
3. `TRAIN-GROWTH3-WEEKLY-REVIEW-QA`

Reason: demand-side surfaces are already live. Distribution-draft readiness can
prepare public attention around `/landscape`, `/tasks/[slug]`, alternatives, and
reports before founder acquisition work uses those surfaces as proof. Weekly
review should come last after the first two Growth lanes have artifacts to
review.

## Pause Recommendations

- BETA1 remains paused.
- I18N0 remains paused.
- OPS8D remains paused.
- OPS10A remains paused.
- PR101 remains paused.

None of those tasks are started by GROWTH0T.

## Validation Evidence

Baseline validation on clean `origin/main` at
`49b290cf52907b1a2b76c72d591c381b0c492960` passed:

- `npm run verify:day0`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run agent:redact:check`
- `npm run agent:batch:check`
- `npm run agent:train-plan:check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run agent:gate`
- `node scripts/check-landscape-boundary.mjs`
- `npm run landscape:check`
- `node scripts/check-sector-density-boundary.mjs`
- direct task discovery checker
- direct alternatives canonical checker
- report distribution pack dry-run

Pre-revert train probes:

- `node scripts/agent/train-plan-check.mjs --batch TRAIN-GROWTH1-FOUNDER-ACQUISITION-DRAFTS` passed.
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-GROWTH2-REPORT-DISTRIBUTION-DRAFTS` passed.
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-GROWTH3-WEEKLY-REVIEW-QA` failed on `GROWTHQ` runner ID compatibility.

Post-revert validation must pass with no partial Growth train registry.

## What This PR Does Not Do

This PR does not register Growth trains, start any Growth train, implement Growth
tasks or agents, generate founder lead queues, generate outreach drafts, generate
report distribution drafts, create weekly growth reviews, contact founders, send
email, send DMs, post externally, create GitHub Issues, log in to a platform,
create CRM records, store PII, scrape contacts, use browser sessions or cookies,
connect live analytics, write Supabase, mutate
`/Users/rainie/Desktop/88cn-index-data`, deploy, start BETA1, start I18N0, start
OPS8D, start OPS10A, or start PR101.
