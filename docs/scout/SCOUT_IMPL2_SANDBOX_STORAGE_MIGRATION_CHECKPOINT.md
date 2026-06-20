# SCOUT_IMPL2 Sandbox Storage / Migration Checkpoint v0

Status: validation passed
Task: PR148 / SCOUT_IMPL2
Result: GO_SCOUT_IMPL3_LOCAL_ONLY
Date: 2026-06-20

## Result

PR148 decides the storage and migration checkpoint for the scouted sandbox.

Result: `GO_SCOUT_IMPL3_LOCAL_ONLY`.

The current SCOUT implementation stage remains local/docs/tmp-artifact only. It does not require a Supabase migration, staging database write, production database write, runtime storage path, worker queue, public route, sitemap entry, Public API field, MCP tool, data repo file, or FermatMind repo change.

Any future staging schema, staging write, production write, or durable worker-backed persistence must be split into a later explicitly approved task.

## Storage Decision Matrix

| Option | Decision | Reason | Required follow-up |
| --- | --- | --- | --- |
| Docs-only boundary records | Allowed now | Fits the current train scope and preserves no-publish guarantees. | Keep records in reviewed docs only. |
| Local `/tmp` dry-run artifacts | Allowed for later local dry runs | Useful for deterministic validation without repo pollution or database writes. | Artifacts must be timestamped, redacted, and disposable. |
| Committed fixture samples | Not approved by default | Fixtures can become accidental public data or stale source truth. | Requires a later fixture-specific task with redaction rules. |
| Supabase staging schema | Not approved now | Schema design is not yet needed to finish the no-publish sandbox train. | Split to a later human-checkpointed migration task if needed. |
| Supabase staging write | Not approved now | Write path would cross the current checkpoint boundary. | Requires staging-only target, rollback/delete plan, and explicit approval. |
| Supabase production schema | Forbidden in this phase | Production persistence is outside SCOUT_IMPL2 scope. | Needs a separate production readiness task and human approval. |
| Production database write | Forbidden | Unreviewed scouted records must not enter production data planes. | No follow-up in this train. |
| Public JSON or data repo export | Forbidden | Unreviewed scouted records must not become public distribution data. | No follow-up in this train. |
| Runtime worker persistence | Not approved now | Worker placement and queue behavior require later implementation gates. | Split to a later worker/runtime task after placement readiness. |

## Approved Current Posture

The approved posture after PR148 is:

- no database for scouted sandbox records in this train;
- no migration files in this train;
- no Supabase write in this train;
- no staging write unless a later approved task changes the boundary;
- no production write;
- no public route, sitemap, Public API, MCP, or data repo exposure;
- local dry-run output may use `/tmp` only when a later task explicitly creates a dry-run command or artifact contract;
- docs may describe aggregate methodology and boundaries, but must not publish unreviewed project-level records.

## Candidate Future Contract

If a later human-approved migration task becomes necessary, it should start from this minimum contract:

| Class | Candidate fields | Rule |
| --- | --- | --- |
| Internal identity | `sandbox_id`, `source_observation_id`, `dedupe_group_id` | Internal-only identifiers; not public slugs. |
| Public identity hints | `project_name`, `official_site_url`, `public_github_url`, `public_docs_url` | Public source only; unknown values stay unknown. |
| Source provenance | `source_type`, `source_url`, `observed_at`, `source_confidence_label` | Required for every candidate. |
| Review state | `sandbox_status`, `quarantine_reason`, `review_recommendation` | Internal review only; no lifecycle promotion. |
| Freshness | `snapshot_at`, `stale_after`, `correction_status` | Needed before report reuse. |
| Audit handoff | `audit_eligible`, `audit_reason`, `audit_cooldown_class` | Eligibility only; no external audit run implied. |

Denied fields remain the PR147 denied set: private contact data, login-required data, cookies/session/tokens, customer/private/analytics/billing/revenue data, inferred traction or verification, copied competitor text, raw crawl dumps, public slugs, sitemap flags, and publication lifecycle states.

## Migration Checkpoint Requirements

A later migration task must include all of the following before any schema file or DB write:

1. Human checkpoint that names the exact task and storage target.
2. Staging-only or production-specific approval, with production defaulting to no.
3. Explicit table or contract name.
4. Exact allowed fields and denied fields.
5. PII and private-data denial review.
6. Rollback and delete plan.
7. Seed/test data policy that does not fabricate metrics.
8. No public route effect.
9. No sitemap effect.
10. No Public API or MCP exposure.
11. No data repo mutation.
12. Data retention and stale-record handling.

Without those requirements, the default remains local/docs/tmp only.

## Handoff To PR149

`PR149 / SCOUT_IMPL3` may define a local sandbox write dry-run boundary or artifact contract. It must not write staging or production databases under the PR148 result.

If PR149 needs staging write behavior, it must stop for a separate human checkpoint before the write path is implemented or executed.

## Handoff To PR150

`PR150 / SCOUT_IMPLQ` can QA the no-publish posture by verifying:

- no migration files exist from PR146-PR149;
- no Supabase write path exists from PR146-PR149;
- no scouted sandbox records appear in public frontend, sitemap, Public API, MCP, `/landscape`, `/tasks`, alternatives, reports, distribution packs, or the data repo;
- status docs and current task metadata point to the next approved task only.

## Validation Results

| Check | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run agent:batch:check` | PASS |
| `npm run agent:train-plan:check` | PASS |
| `npm run agent:scope:check -- PR148` | PASS |
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
- Does not add runtime code, workers, crawlers, queues, packages, or scripts.
- Does not create public pages, sitemap entries, Public API fields, or MCP tools.
- Does not publish scouted records.
- Does not store PII or private data.
- Does not mutate the data repo.
- Does not mutate FermatMind repos.
