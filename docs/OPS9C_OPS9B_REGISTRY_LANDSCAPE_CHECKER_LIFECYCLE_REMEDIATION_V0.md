# OPS9C OPS9B Registry + Landscape Checker Lifecycle Remediation v0

Date: 2026-06-20
Role: Codex-Build
Result: PASS
Exact next recommended task: OPS9B rerun from clean `origin/main` with exact SHA approval

## Summary

OPS9C resolves the two local blockers recorded by OPS9B after PR #150 merged:

- `OPS9B` was not registered for `agent:scope:check -- OPS9B`.
- `landscape:check` and the sector-density checker still rejected the
  PR123-approved finite `/tasks/[slug]` route and task sitemap entry.

OPS9C does not rerun OPS9B, deploy, live-smoke production, touch Aliyun, modify
product routes, or change public UI behavior.

## Precondition

PR #150, `OPS9B: Demand-Side Traffic Surface Deploy + Live Smoke v0`, was merged
before OPS9C started. The OPS9C branch started from clean `origin/main` at
`890bf96c29f4b11d0bfe9e89ffef496e0702c638`.

## Registry Changes

`ops/tasks/roadmap.json` now registers:

- `OPS9B` as a human-checkpointed `live-deploy` task for demand-side traffic
  deploy/live-smoke evidence. It allows only evidence/status files and forbids
  product/runtime code, scripts, deploy config, package metadata, secrets,
  public assets, screenshots, and data-repo mutation.
- `OPS9C` as a non-deploy remediation task that allows only the demand-side
  checker lifecycle files, task metadata, and OPS9C docs/status files.

`ops/tasks/current.json` records OPS9C as validation-passed and points the next
recommended task back to an OPS9B rerun.

## Checker Lifecycle Change

`scripts/check-landscape-boundary.mjs` and
`scripts/check-sector-density-boundary.mjs` still validate the `/landscape`
surface, forbidden imports, forbidden public-copy fields, unsafe links, sitemap
safety, status lifecycle, and data-repo cleanliness.

The checkers no longer treat the existence of `app/tasks` or task sitemap
entries as an automatic failure. Instead, finite task routes are accepted only
when `scripts/check-task-discovery-boundary.mjs` passes.

The checkers still reject:

- broad `/tasks` index links or sitemap entries;
- `/zh-CN`;
- `/landscape/sectors`;
- unsafe `/api`, `/admin`, auth, scouted, buyer-interest, API-key, payment, and
  customer-like links;
- task route changes not accepted by the task-discovery checker.

## Validation Results

| Command | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run agent:batch:check` | PASS, 37 batches, 144 roadmap tasks, 80 skeleton tasks |
| `npm run agent:train-plan:check` | PASS |
| `npm run agent:scope:check -- OPS9C` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| `npm run agent:gate` | PASS |
| `npm run agent:scope:check -- OPS9B` | PASS after OPS9C commit, clean diff |
| `node scripts/check-landscape-boundary.mjs` | PASS |
| `npm run landscape:check` | PASS |
| `node scripts/check-task-discovery-boundary.mjs` | PASS |
| `node scripts/check-sector-density-boundary.mjs` | PASS |
| `npm run task-discovery:check || true` | TOLERATED: npm script is not registered; direct checker passed |

## Negative Probes

Temporary fixture probes are used only outside committed repo paths. They must
not leave repo-tracked changes behind.

| Probe | Result |
| --- | --- |
| Broad `/tasks` index fixture | PASS, checker failed as expected |
| `/zh-CN` fixture | PASS, checker failed as expected |
| `/landscape/sectors` fixture | PASS, checker failed as expected |
| Unsafe sitemap/API fixture | PASS, checker failed as expected |
| Under-threshold task slug fixture | PASS, task-discovery checker failed as expected |

## What This Task Does Not Do

- Does not rerun OPS9B.
- Does not deploy.
- Does not run live smoke.
- Does not touch Aliyun production state.
- Does not modify product routes, components, libraries, API routes, Supabase,
  deploy files, package metadata, public assets, screenshots, or secrets.
- Does not mutate `/Users/rainie/Desktop/88cn-index-data`.
- Does not start GROWTH0, BETA1, I18N0, PR101, or any new traffic task.
