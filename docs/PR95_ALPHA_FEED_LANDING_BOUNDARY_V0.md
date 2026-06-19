# PR95 Alpha Feed Landing Boundary v0

## Result

PR95 adds a static Alpha Feed landing boundary at `/alpha-feed`.

This task does not create live feed delivery, buyer payment, customer signup,
PII collection, API key runtime, metering runtime, Supabase writes, CRM/email
provider integration, external service calls, deploy changes, or data repo
mutation.

## Scope

Changed files:

- `app/alpha-feed/page.tsx`
- `scripts/check-alpha-feed-landing.mjs`
- `docs/PR95_ALPHA_FEED_LANDING_BOUNDARY_V0.md`
- `docs/TASK_STATUS.md`
- `ops/tasks/current.json`
- `ops/tasks/roadmap.json`

PR95 also narrows its roadmap forbidden paths to resolve exact allowed-path
conflicts for `app/alpha-feed/**`, `app/backers/**`, and the PR95 checker path.
Product/runtime paths outside those exact PR95 allowances remain forbidden.

## Landing Boundary

The `/alpha-feed` page frames Alpha Feed as:

- future public-signal snapshots;
- reviewed public metadata;
- machine-readability evidence;
- research-oriented public data;
- local snapshot readiness evidence;
- boundary and QA history.

The page does not include a form, submit action, payment link, API key request,
customer account flow, external endpoint, or private data collection.

## Copy Boundary

The page states that Alpha Feed content is not financial advice and is not an
investment recommendation. It does not promise external outcomes, access to
private data, live API access, customer acquisition, rankings, citations,
revenue, or traffic.

The checker validates the repository public-language ban and PR95-specific
phrasing boundaries without listing restricted literals in this document.

## Definition Of Done

| Requirement | Status | Evidence |
| --- | --- | --- |
| No financial advice | PASS | `/alpha-feed` boundary copy |
| No investment recommendation | PASS | `/alpha-feed` boundary copy |
| No restricted capital-product language | PASS | `scripts/check-alpha-feed-landing.mjs` |
| No guarantee of returns | PASS | `scripts/check-alpha-feed-landing.mjs` |
| No customer signup requiring payment | PASS | No form, no payment link, no account flow |
| No private data | PASS | Page excludes private founder/admin fields |
| No API access | PASS | Page states no live API access and has no endpoint |

## Validation Plan

Required roadmap validations:

- `npm run verify:day0`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run agent:scope:check -- PR95`

Additional train validations:

- `npm run agent:redact:check`
- `npm run agent:tool:check`
- `npm run agent:mcp-config:check`
- `npm run agent:plugin-policy:check`
- `npm run agent:batch:check`
- `npm run agent:train-plan:check`
- `node scripts/check-alpha-feed-landing.mjs`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run agent:gate`
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-PR95-PR97-ALPHA-FEED-LANDING-EVIDENCE`

## Next Task

PR96 may proceed only after PR95 is merged, local `main` is synced to
`origin/main`, and the worktree is clean. PR96 remains human-checkpointed for
PII collection, customer signup, payment, CRM/email provider, Supabase write,
or external service behavior.

PR96 was not started by PR95.
