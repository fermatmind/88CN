# SCOUT0R Mass Ingestion Sandbox + Audit + Report Train Split Readiness

Date: 2026-06-20
Task ID: PR132
Alias: SCOUT0R
Role: codex-research / codex-build
Result: GO_SCOUT0
Exact next task: PR133 / SCOUT0 Mass Project Ingestion Sandbox Boundary Scan v0
Exact next train: TRAIN-PR133-SCOUT0-BOUNDARY

## Scope

PR132 splits the proposed SCOUT / AUDIT / REPORT roadmap into safe PR-numbered
tasks and dependency-aware train batches. It is roadmap, readiness, policy, and
metadata work only.

This PR does not implement any ingestion agent, crawler, audit worker, report
generator, public route, API route, MCP route, Supabase mutation, data-repository
mutation, external scan, browser research, platform login, outreach, or deploy.

## Current Source State

| Source | State | Decision |
| --- | --- | --- |
| Main repo branch | PR132 is rebased onto `origin/main` at `2c4bc9baabbbd2cc5e27985deff3e67ed137862c`. | PASS |
| Current Growth state on `origin/main` | `ops/tasks/current.json` had `GROWTH4Q`, result `PASS_GROWTH_PHASE_CLOSED`. | PASS |
| Growth closeout | GROWTH4Q closed the Growth drafts/no-auto-send phase before PR132 final validation. | PASS |
| Data repo | `/Users/rainie/Desktop/88cn-index-data` was clean on `main...origin/main`. | PASS |
| PR range | PR122-PR131 are occupied by demand-side traffic. PR132-PR144 were unused before this PR. | PASS |
| Runner compatibility | PR-number aliases avoid non-PR alias pattern risk. | PASS |

SCOUT0 is not started by PR132. PR133 / SCOUT0 is only registered as the exact
next executable task and train.

## Strategic Patch Matrix

| Patch | Encoded future task | Required rule |
| --- | --- | --- |
| Polite audit / egress safety | PR136 / AUDIT0, PR139 / AUDIT1, PR141 / AUDIT2 | Per-domain cooldown, global concurrency, robots-aware fetch policy, explicit User-Agent policy, timeout budget, retry/backoff, 403/429 classified as `blocked_by_waf`, no WAF bypass, and no proxy rotation for evasion. |
| Multi-asset canonical resolver | PR138 / SCOUT4 | Define `entity_id`, `repo_asset_id`, `web_asset_id`, `source_evidence_id`, `dedupe_group_id`, `canonical_confidence`, and `conflict_reason`; handle multi-domain, multi-project, rename, migration, fork, template, wrapper, org, and repo ambiguity. |
| Report TTL + correction loop | PR137 / REPORT0, PR142 / REPORT1, PR143 / REPORT2 | Require audit timestamp, snapshot date, stale label, claim/correction trigger, re-audit rule, case-study status update, and bounded negative wording. |
| Provenance weight threshold | PR134 / SCOUT1 | Define source reliability, official-source presence, GitHub/docs evidence, multi-source overlap, manual seed override, noise threshold, excluded source classes, and scam/spam/adult/gambling/malware exclusion. |
| Anonymous sandbox aggregate disclosure | PR135 / SCOUT2, PR142 / REPORT1, PR143 / REPORT2, PR144 / SCOUTQ | Only aggregate anonymous sandbox counts may be disclosed before review. Project-level scouted details, sitemap entries, API/MCP payloads, global market counts, and complete-landscape claims remain forbidden. |

Permitted anonymous example counts for later policy discussion:

- Observed sandbox candidates: 400+ unreviewed public identities
- Audit-ready sample: 120 public URLs
- Reviewed public sample: 3

## Dependency Graph

```text
PR132 / SCOUT0R
  -> PR133 / SCOUT0
       -> PR134 / SCOUT1
       -> PR135 / SCOUT2
       -> PR136 / AUDIT0
       -> PR137 / REPORT0
PR134 + PR135 -> PR138 / SCOUT4
PR136 + PR135 -> PR139 / AUDIT1
PR134 + PR135 + PR138 -> PR140 / SCOUT3
PR140 + PR139 -> PR141 / AUDIT2
PR141 + PR137 -> PR142 / REPORT1
PR141 + PR137 -> PR143 / REPORT2
PR140 + PR138 + PR141 + PR142 + PR143 -> PR144 / SCOUTQ
REPORT1 + REPORT2 + SCOUTQ -> later second-round Growth registration only
```

Second-round Growth2 and Growth1 are not registered in PR132. A later GROWTH5R
or equivalent should decide that after SCOUTQ.

## Proposed PR Alias Map

| PR | Alias | Title |
| --- | --- | --- |
| PR132 | SCOUT0R | Mass Ingestion Sandbox + Audit + Report Train Split Readiness Scan v0 |
| PR133 | SCOUT0 | Mass Project Ingestion Sandbox Boundary Scan v0 |
| PR134 | SCOUT1 | Public Identity Source Policy v0 |
| PR135 | SCOUT2 | Scouted Sandbox Schema / Contract v0 |
| PR136 | AUDIT0 | Audit Egress / Politeness Readiness Scan v0 |
| PR137 | REPORT0 | Report TTL + Correction Policy v0 |
| PR138 | SCOUT4 | Canonical Resolver Boundary v0 |
| PR139 | AUDIT1 | Batch Geo-Checker Audit Boundary v0 |
| PR140 | SCOUT3 | Local Identity Ingestion Dry Run v0 |
| PR141 | AUDIT2 | Local Batch Audit Dry Run v0 |
| PR142 | REPORT1 | AI Project Readiness Aggregate Report v0 |
| PR143 | REPORT2 | Chinese Outbound AI Project Readiness Report v0 |
| PR144 | SCOUTQ | Scouted Sandbox QA / No-Publish QA v0 |

## Registered Task Matrix

| Task | Depends on | Role | Purpose | Public surface |
| --- | --- | --- | --- | --- |
| PR132 / SCOUT0R | GROWTH4Q | codex-research | Split and register roadmap/trains. | None |
| PR133 / SCOUT0 | PR132, GROWTH4Q | codex-research | First SCOUT boundary task. | None |
| PR134 / SCOUT1 | PR133 | codex-research | Source and provenance policy. | None |
| PR135 / SCOUT2 | PR133 | codex-research | Sandbox contract and no-public-surface rule. | None |
| PR136 / AUDIT0 | PR133 | codex-research | Egress and politeness policy. | None |
| PR137 / REPORT0 | PR133 | codex-research | TTL and correction policy. | None |
| PR138 / SCOUT4 | PR134, PR135 | codex-research | Multi-asset canonical resolver boundary. | None |
| PR139 / AUDIT1 | PR136, PR135 | codex-research | Batch audit boundary. | None |
| PR140 / SCOUT3 | PR134, PR135, PR138 | codex-research | Later local-only dry-run contract. | None |
| PR141 / AUDIT2 | PR140, PR139 | codex-research | Later local-only audit dry-run contract. | None |
| PR142 / REPORT1 | PR141, PR137 | codex-research | Aggregate report boundary. | None |
| PR143 / REPORT2 | PR141, PR137 | codex-research | Chinese outbound report boundary. | None |
| PR144 / SCOUTQ | PR140, PR138, PR141, PR142, PR143 | codex-qa | No-publish QA closer. | None |

## Registered Train Matrix

| Train | Tasks | Purpose |
| --- | --- | --- |
| TRAIN-PR133-SCOUT0-BOUNDARY | PR133 | Run SCOUT0 first as a standalone boundary task. |
| TRAIN-PR134-PR137-SCOUT-AUDIT-REPORT-BOUNDARIES | PR134, PR135, PR136, PR137 | Source, sandbox, egress, and report-policy boundaries after SCOUT0. |
| TRAIN-PR138-PR139-RESOLVER-AUDIT-BOUNDARIES | PR138, PR139 | Resolver and batch audit boundaries. |
| TRAIN-PR140-PR141-LOCAL-DRY-RUNS | PR140, PR141 | Local dry-run contracts only; no implementation in PR132. |
| TRAIN-PR142-PR143-READINESS-REPORTS | PR142, PR143 | Aggregate and Chinese outbound readiness report boundaries. |
| TRAIN-PR144-SCOUT-QA | PR144 | Final no-publish QA closer. |

## Parallelization Map

| Stage | Parallelization |
| --- | --- |
| PR133 / SCOUT0 | Must run first and alone. |
| PR134, PR135, PR136, PR137 | Logically parallel after PR133, but registered as one sequential train for reviewability. |
| PR138 and PR139 | Can proceed after their dependencies; registered as one sequential train. |
| PR140 and PR141 | Sequential because AUDIT2 depends on SCOUT3 and AUDIT1. |
| PR142 and PR143 | Logically parallel after AUDIT2 and REPORT0; registered as one sequential train. |
| PR144 / SCOUTQ | Must run last and alone. |

## Risk Flag Matrix

Every registered SCOUT/AUDIT/REPORT train sets these flags to `false`:

| Flag | Value |
| --- | --- |
| auto_merge_allowed | false |
| live_deploy_allowed | false |
| server_change_allowed | false |
| payment_change_allowed | false |
| mcp_change_allowed | false |
| public_api_release_allowed | false |
| plugin_install_allowed | false |
| new_dependency_allowed | false |
| external_service_allowed | false |
| data_repo_mutation_allowed | false |
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
| crawler_runtime_allowed | false |

Dry-run tasks additionally require:

- `local_only=true`
- `output_under_tmp=true`
- `no_prod_write=true`
- `no_supabase_write=true`
- `no_data_repo_write=true`
- `no_public_page=true`
- `no_sitemap=true`

## Runner Compatibility Decision

PR-number aliases are used for train execution because OPS9A2 runner
compatibility is already proven for `PR<number>` task IDs. The SCOUT/AUDIT/REPORT
aliases are metadata labels only. No non-PR SCOUT/AUDIT/REPORT task IDs are used
inside `ops/trains/batches.json`.

## Findings

No active PR132 findings.

## Validation Plan

Required PR132 validations:

- `npm run verify:day0`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run agent:redact:check`
- `npm run agent:batch:check`
- `npm run agent:train-plan:check`
- `npm run agent:scope:check -- PR132`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run agent:gate`
- `node scripts/check-landscape-boundary.mjs`
- `npm run landscape:check`
- `node scripts/check-sector-density-boundary.mjs`
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR133-SCOUT0-BOUNDARY`
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR134-PR137-SCOUT-AUDIT-REPORT-BOUNDARIES`
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR138-PR139-RESOLVER-AUDIT-BOUNDARIES`
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR140-PR141-LOCAL-DRY-RUNS`
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR142-PR143-READINESS-REPORTS`
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR144-SCOUT-QA`

Relevant optional checks should run when available:

- `npm run task-discovery:check || true`
- `npm run alternatives-canonical:check || true`
- `npm run report-distribution:check || true`

## Validation Results

| Command | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run agent:batch:check` | PASS |
| `npm run agent:train-plan:check` | PASS |
| `npm run agent:scope:check -- PR132` | PASS |
| `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR133-SCOUT0-BOUNDARY` | PASS |
| `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR134-PR137-SCOUT-AUDIT-REPORT-BOUNDARIES` | PASS |
| `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR138-PR139-RESOLVER-AUDIT-BOUNDARIES` | PASS |
| `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR140-PR141-LOCAL-DRY-RUNS` | PASS |
| `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR142-PR143-READINESS-REPORTS` | PASS |
| `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR144-SCOUT-QA` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS with existing Supabase Edge Runtime warning |
| `npm run agent:gate` | PASS |
| `node scripts/check-landscape-boundary.mjs` | PASS |
| `npm run landscape:check` | PASS |
| `node scripts/check-sector-density-boundary.mjs` | PASS |
| `npm run task-discovery:check || true` | Alias missing; direct checker run instead |
| `node scripts/check-task-discovery-boundary.mjs` | PASS |
| `npm run alternatives-canonical:check || true` | Alias missing; direct checker run instead |
| `node scripts/check-alternatives-canonical.mjs` | PASS |
| `npm run report-distribution:check || true` | Alias missing; direct dry-run run instead |
| `npm run report-distribution-pack:generate -- --dry-run` | PASS |

## Exact Next Task And Train

Exact next task:

`PR133 / SCOUT0 Mass Project Ingestion Sandbox Boundary Scan v0`

Exact next train:

`TRAIN-PR133-SCOUT0-BOUNDARY`

Execution condition:

Do not start SCOUT1, SCOUT2, SCOUT3, SCOUT4, AUDIT0, AUDIT1, AUDIT2, REPORT0,
REPORT1, REPORT2, SCOUTQ, second-round Growth, BETA1, I18N0, OPS8D, OPS10A, or
PR101 directly from PR132.

## What This PR Does Not Do

PR132 does not:

- start PR133, SCOUT0, SCOUT1, SCOUT2, SCOUT3, SCOUT4, AUDIT0, AUDIT1,
  AUDIT2, REPORT0, REPORT1, REPORT2, or SCOUTQ;
- implement ingestion, crawling, scraping, audit workers, report generators, or
  public pages;
- use browser or computer-use competitor research;
- log in to any platform;
- submit forms;
- create accounts;
- copy competitor descriptions;
- collect private contact data;
- store PII;
- run batch geo-checker audit;
- mutate Supabase;
- mutate `/Users/rainie/Desktop/88cn-index-data`;
- deploy;
- start second-round Growth2 or Growth1;
- start BETA1, I18N0, OPS8D, OPS10A, or PR101.
