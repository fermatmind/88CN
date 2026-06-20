# GROWTH3A Weekly Growth Review Boundary v0

Date: 2026-06-20
Role: Codex-Research
Result: GO_GROWTH3B
Next task: GROWTH3B Weekly Growth Review Generator v0

## Scope

GROWTH3A defines the safe boundary for a weekly growth review assistant before
any local review-generator work. This is boundary and handoff documentation
only. It does not connect live analytics, import CRM data, read private server
logs, collect user data, call external dashboards, write Supabase, mutate
`/Users/rainie/Desktop/88cn-index-data`, or deploy.

The current GROWTH3B roadmap scope is docs/status/roadmap only. GROWTH3B must
not add executable generator code, scripts, app/runtime files, package metadata,
committed generated output, analytics integrations, private data imports, or
data-repo changes unless a later roadmap task explicitly changes that scope.

## Allowed Inputs

Future local-only weekly review work may reference:

- merged PR numbers, titles, merge SHAs, and task aliases;
- task status rows already committed to this repository;
- docs-only QA findings already committed to this repository;
- local checker results from commands run in this repository;
- public route counts from local build output;
- manually supplied aggregate notes from a human reviewer;
- redacted issue summaries that do not include private user, customer, contact,
  analytics, billing, or server-log details;
- explicit no-action confirmations such as no deploy, no external send, no
  data-repo mutation, or no live analytics connection.

Manually supplied aggregates must be clearly labeled as human-provided and must
not be expanded into invented metrics.

## Forbidden Inputs

The assistant must not connect to, import from, scrape, or summarize:

- Google Search Console, Cloudflare analytics, Vercel analytics, Ahrefs, social
  dashboards, ad platforms, newsletter platforms, CRM systems, payment systems,
  Supabase production data, or server logs;
- emails, DMs, personal accounts, customer records, private founder contacts,
  browser sessions, cookies, or logged-in platform state;
- unredacted user data, IP addresses, private request traces, billing records,
  or support transcripts;
- `/Users/rainie/Desktop/88cn-index-data` files;
- any source that requires a platform login or external API call.

If a weekly review needs live analytics later, that requires a separate
human-checkpointed scope change before implementation.

## Output Boundary

Within the current docs-only scope, GROWTH3B may document a future local review
packet contract for:

- weekly summary heading and date range;
- merged PR/task table;
- local validation matrix;
- route/checker inventory summary;
- redacted QA findings;
- manually supplied aggregate notes;
- follow-up recommendation list;
- explicit no-external-action and no-private-data confirmations.

No output should be committed as generated analytics. A future executable
generator, if separately approved, must write only to `/tmp` or another ignored
local path by default.

## Redaction Rules

Weekly review drafts must:

- exclude private contact, customer, billing, analytics, and server-log fields;
- avoid raw command output that contains secrets or local credentials;
- avoid unreviewed live metrics and unsupported trend claims;
- label human-supplied aggregates as manual notes;
- keep external execution recommendations as human-owned decisions;
- include negative confirmations when a task explicitly avoided deploy, sends,
  platform login, CRM writes, PII storage, or data-repo mutation.

## GROWTH3B Handoff

GROWTH3B may proceed only as a local weekly review contract task within its
roadmap allowed paths. It should produce a reviewable packet spec with safety
flags that remain false for:

- live analytics connection;
- external service write;
- platform login;
- CRM import;
- email or DM send;
- social post;
- PII inclusion;
- browser session export;
- Supabase write;
- data repo mutation;
- deploy.

If the team later wants executable weekly review generation, that requires a
separate scope change before implementation. GROWTH3B must not infer permission
to edit `scripts/**`, `app/**`, `lib/**`, package files, public assets, or the
data repo from this boundary.

## Validation Evidence

GROWTH3A must pass:

- `npm run verify:day0`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run agent:redact:check`
- `npm run agent:scope:check -- GROWTH3A`
- `npm run agent:batch:check`
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-GROWTH3-WEEKLY-REVIEW-QA`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run agent:gate`
- direct landscape, sector-density, task-discovery, alternatives, and report
  distribution dry-run checks

The GROWTH1 train has been closed on `origin/main` at
`2f57c757f5ec20579f576b2d43ce9d53d41d3c12`.

## What This PR Does Not Do

This PR does not generate a weekly review, connect analytics, import CRM data,
read private server logs, collect user data, call external dashboards, send
email, send DMs, post externally, log in to platforms, write Supabase, change
app/runtime code, change sitemap behavior, deploy, mutate the data repo, start
GROWTH3B, start GROWTH3Q, start GROWTH4Q, start GROWTHQ, start BETA1, start
I18N0, start OPS8D, start OPS10A, or start PR101.
