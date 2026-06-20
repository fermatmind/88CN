# SCOUT_IMPL1 Scouted Sandbox Persistence Boundary v0

Status: validation passed
Task: PR147 / SCOUT_IMPL1
Result: GO_SCOUT_IMPL2
Date: 2026-06-20

## Result

PR147 defines the persistence boundary for future scouted sandbox data.

Result: `GO_SCOUT_IMPL2`.

This PR is boundary-only. It does not create a schema, Supabase migration, database write path, staging write, production write, runtime code, worker, crawler, queue, public route, sitemap entry, Public API field, MCP tool, data repo file, or FermatMind repo change.

## Persistence Posture

The scouted sandbox remains private-by-default and local-by-default until a later checkpoint explicitly approves another storage target.

Default storage posture:

- docs/contracts and local `/tmp` artifacts only;
- no production database;
- no production Supabase write;
- no staging database write without a later checkpoint;
- no public lifecycle promotion;
- no direct write to `/Users/rainie/Desktop/88cn-index-data`;
- no automatic publication path.

## Allowed Future Fields

Future scouted records, if separately approved, may contain only public-safe identity and provenance metadata:

| Field class | Examples | Rule |
| --- | --- | --- |
| Sandbox identity | `sandbox_id`, `source_observation_id`, `dedupe_group_id` | Internal IDs only; not public slugs. |
| Public identity hints | project name, official site URL, public GitHub URL, public docs URL | Public sources only; unknown values stay unknown. |
| Source metadata | source type, source URL, observed timestamp, source confidence label | Must preserve provenance and timestamp. |
| Review metadata | sandbox status, review recommendation, quarantine reason | Internal review only; no public lifecycle promotion. |
| Audit eligibility | eligible URL, reason, cooldown class | Eligibility only; no external audit run implied. |
| Freshness metadata | snapshot date, stale-after date, correction status | Required for report reuse. |

## Denied Future Fields

Denied fields must not be persisted in the scouted sandbox:

- private email, phone, address, or contact handles;
- login-required data;
- cookies, session data, browser exports, or tokens;
- customer lists, private logos, private testimonials, screenshots, analytics, billing, bank, revenue, MRR, ARR, retention, CAC, LTV, ROAS, investor identities, or financing documents;
- inferred revenue, users, backers, watchlists, investment interest, verification status, or founder identity;
- copied competitor descriptions, reviews, comments, rankings, or scraped third-party editorial copy;
- raw HTML dumps or broad crawl payloads;
- permanent negative labels;
- public slugs or sitemap eligibility flags unless a later reviewed publication task approves them.

## Sandbox States

Allowed sandbox-only states:

| State | Meaning | Public eligibility |
| --- | --- | --- |
| `scouted` | Public identity candidate observed with minimum provenance. | None. |
| `audit_pending` | Candidate may be eligible for a later local/fixture audit dry run. | None. |
| `quarantined` | Candidate has weak provenance, restricted source, copy risk, identity conflict, privacy risk, or access issue. | None. |
| `review_candidate` | Candidate has enough public provenance for human review. | None until later human approval. |
| `stale` | Candidate needs recheck before reuse. | None. |

These states do not map to production lifecycle states and do not create a path to `approved`, `published`, `claimed`, or `owner_verified`.

## Public Surface Boundary

Scouted sandbox records must not appear in:

- public frontend pages;
- sitemap output;
- robots indexability changes;
- Public API responses;
- MCP tool responses or schemas;
- `/landscape` links, counts, density maps, sector maps, or copy;
- `/tasks` discovery pages;
- alternatives pages, registries, pair pages, or comparisons;
- public reports as project-level detail;
- report distribution packs;
- external search pings or submissions.

Aggregate anonymous counts may only be discussed in docs or later reviewed report drafts when they do not identify individual unreviewed projects.

## Staging-Only Possibility

Staging storage may be considered only after PR148 decides the migration/storage checkpoint.

Before any staging write:

- human checkpoint required;
- staging-only target required;
- no production write;
- no public route effect;
- no sitemap effect;
- no Public API or MCP exposure;
- no data repo mutation;
- rollback/delete plan required;
- redaction and PII denial confirmed.

## Data Repo Boundary

`/Users/rainie/Desktop/88cn-index-data` remains read-only for this train. It must not receive raw scouted sandbox records, private review data, audit logs, PII, queue payloads, or generated reports from SCOUT_IMPL work.

## Handoff To PR148

`PR148 / SCOUT_IMPL2` should decide whether future storage requires:

- no database and local-only artifacts;
- staging-only schema after human checkpoint;
- a later split migration task;
- explicit table/contract candidates;
- no production schema in this phase.

PR148 must not create migration files or write databases unless a later approved task changes that scope.

## Validation Results

| Check | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run agent:batch:check` | PASS |
| `npm run agent:train-plan:check` | PASS |
| `npm run agent:scope:check -- PR147` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| `npm run agent:gate` | PASS |
| `node scripts/check-landscape-boundary.mjs` | PASS |
| `npm run landscape:check` | PASS |
| `node scripts/check-sector-density-boundary.mjs` | PASS |
| `node scripts/check-task-discovery-boundary.mjs` | PASS |
| `node scripts/check-alternatives-canonical.mjs` | PASS |

## What This PR Does Not Do

- Does not create schemas or migrations.
- Does not write Supabase.
- Does not write staging or production databases.
- Does not create runtime code, workers, crawlers, queues, or packages.
- Does not expose scouted records publicly.
- Does not change sitemap, Public API, MCP, `/landscape`, `/tasks`, alternatives, or reports.
- Does not store PII.
- Does not copy competitor descriptions.
- Does not mutate the data repo.
