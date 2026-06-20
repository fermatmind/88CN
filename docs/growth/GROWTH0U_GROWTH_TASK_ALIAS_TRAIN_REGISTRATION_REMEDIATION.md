# GROWTH0U Growth Task Alias + Train Registration Remediation v0

Date: 2026-06-20
Role: Codex-Build / Codex-Research
Result: GROWTH_TRAINS_REGISTERED_WITH_ALIAS
Exact next train: TRAIN-GROWTH2-REPORT-DISTRIBUTION-DRAFTS
Exact next task: GROWTH2A Report Distribution Agent Boundary v0

## Scope

GROWTH0U remediates the GROWTH0T runner compatibility blocker by registering a
runner-compatible alias for the final Growth QA closer and registering safe
Growth train batches.

This is docs, roadmap, status, and train-registry work only. It does not modify
runner scripts, broaden validation patterns, start a Growth train, implement
Growth agents, generate founder lead queues, generate outreach drafts, generate
report distribution drafts, generate weekly growth reviews, contact founders,
send email, send DMs, post externally, create GitHub Issues, log in to a
platform, create CRM records, store PII, scrape contacts, connect live analytics,
write Supabase, mutate `/Users/rainie/Desktop/88cn-index-data`, or deploy.

## Source Inputs

- `docs/growth/GROWTH0_GROWTH_AGENT_BOUNDARY_SCAN.md`
- `docs/growth/GROWTH0T_GROWTH_TRAIN_REGISTRATION_READINESS.md`
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
- `scripts/agent/batch-check.mjs`
- `scripts/agent/train-plan-check.mjs`

## GROWTH0T Blocker Summary

GROWTH0T verified that `GROWTH1A/B/Q`, `GROWTH2A/B/Q`,
`GROWTH3A/B/Q`, and `GROWTHQ` were registered and safe, but it could not
register the complete Growth train set. The blocker was runner compatibility:
OPS9A2 accepts non-PR Growth task IDs shaped like `GROWTH\\d+[A-Z]?`, such as
`GROWTH1A`, `GROWTH2Q`, and `GROWTH3Q`, but not `GROWTHQ`.

GROWTH0T correctly did not edit `scripts/**`, did not weaken the validator, and
did not leave a partial Growth train registry behind.

## Remediation Decision

GROWTH0U uses the preferred narrow remediation:

- keep historical `GROWTHQ` in roadmap for continuity;
- register `GROWTH4Q` as the runner-compatible alias and successor for final
  Growth Ops no-auto-send QA;
- use `GROWTH4Q`, not `GROWTHQ`, in `TRAIN-GROWTH3-WEEKLY-REVIEW-QA`;
- do not broaden regex validation;
- do not modify runner scripts.

## GROWTH4Q Alias Task Registration

`GROWTH4Q` is registered as:

- title: Growth Ops No-Auto-Send QA Closer v0
- role: `codex-qa`
- type: `qa`
- dependency: `GROWTH3Q`
- deployment: `none`
- data repo: `none`
- allowed paths: `docs/growth/GROWTH4Q_*.md`, QA/status/task metadata only

It is a QA closer only. It verifies that Growth artifacts remain drafts-only,
manual-review-only, and free of sender, poster, CRM, PII, login, cookie/session,
external-write, contact-scraping, live-analytics, Supabase, deploy, and data-repo
mutation behavior.

## GROWTHQ Historical Status

`GROWTHQ` remains registered as the historical alias from GROWTH0. It is marked
in roadmap metadata as not recommended for train execution, with `GROWTH4Q` as
its train successor.

No train batch includes `GROWTHQ`.

## Registered Train Matrix

| Train | Tasks | Status | Purpose |
| --- | --- | --- | --- |
| TRAIN-GROWTH2-REPORT-DISTRIBUTION-DRAFTS | GROWTH2A, GROWTH2B, GROWTH2Q | Registered | Report distribution boundary, local-only draft generation, and no-external-post QA. |
| TRAIN-GROWTH1-FOUNDER-ACQUISITION-DRAFTS | GROWTH1A, GROWTH1B, GROWTH1Q | Registered | Founder acquisition boundary, local-only lead queue / outreach draft generation, and no-auto-send QA. |
| TRAIN-GROWTH3-WEEKLY-REVIEW-QA | GROWTH3A, GROWTH3B, GROWTH3Q, GROWTH4Q | Registered | Weekly growth review boundary, local/manual aggregate review generator, QA, and final no-auto-send Growth Ops QA closer. |

## Risk Flag Matrix

Every registered Growth train sets these flags to `false`:

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

`continue_on_sidecar` is `true` only for non-blocking P3 sidecar findings.

## Runner Compatibility Evidence

The registered train tasks all match OPS9A2 non-PR task ID constraints. In
particular, the final train uses `GROWTH4Q`, not `GROWTHQ`.

Required explicit checks:

- `node scripts/agent/train-plan-check.mjs --batch TRAIN-GROWTH2-REPORT-DISTRIBUTION-DRAFTS`
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-GROWTH1-FOUNDER-ACQUISITION-DRAFTS`
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-GROWTH3-WEEKLY-REVIEW-QA`

## Recommended Execution Order

1. `TRAIN-GROWTH2-REPORT-DISTRIBUTION-DRAFTS`
2. `TRAIN-GROWTH1-FOUNDER-ACQUISITION-DRAFTS`
3. `TRAIN-GROWTH3-WEEKLY-REVIEW-QA`

Reason: demand-side traffic surfaces are live. Report distribution drafts should
come first to create public attention around `/landscape`, `/tasks`,
alternatives, and reports. Founder acquisition can then use those surfaces as
proof. Weekly growth review comes last after distribution and founder artifacts
exist.

## Pause Recommendations

- BETA1 remains paused.
- I18N0 remains paused.
- OPS8D remains paused.
- OPS10A remains paused.
- PR101 remains paused.

None of those tasks are started by GROWTH0U.

## Exact Next Task And Train

Exact next train:

`TRAIN-GROWTH2-REPORT-DISTRIBUTION-DRAFTS`

Exact next task:

`GROWTH2A Report Distribution Agent Boundary v0`

Do not start the train inside GROWTH0U.

## What This PR Does Not Do

This PR does not modify runner scripts, weaken validators, start any Growth
train, implement Growth tasks or agents, generate founder lead queues, generate
outreach drafts, generate report distribution drafts, create weekly growth
reviews, contact founders, send email, send DMs, post externally, create GitHub
Issues, log in to a platform, create CRM records, store PII, scrape contacts,
use browser sessions or cookies, connect live analytics, write Supabase, mutate
`/Users/rainie/Desktop/88cn-index-data`, deploy, start BETA1, start I18N0, start
OPS8D, start OPS10A, or start PR101.
