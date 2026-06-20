# SCOUT_STAGING1 Staging Sandbox Storage / Migration Checkpoint

Status: validation passed
Task: PR170 / SCOUT_STAGING1
Result: GO_SCOUT_STAGING2_LOCAL_ONLY
Date: 2026-06-20

## Result

PR170 decides the staging sandbox storage and migration checkpoint.

Result: `GO_SCOUT_STAGING2_LOCAL_ONLY`.

Meaning:

- the current PR169-PR172 staging train remains docs/local-only;
- no Supabase migration is created;
- no staging schema is created;
- no staging write is performed;
- no production write is performed;
- PR171 may proceed only as a local-only dry-run boundary unless a later explicit checkpoint authorizes a real staging write.

## Checkpoint

PR170 has `human_checkpoint=true`.

The user explicitly said `继续执行`, so PR170 proceeds only as a storage/migration decision. This checkpoint does not authorize migration files, Supabase writes, staging writes, production writes, runtime code, or public surfaces.

## Decision

Current decision:

| Area | Decision | Reason |
| --- | --- | --- |
| Durable staging DB | Not created now | Current train can finish no-publish readiness without durable persistence. |
| Supabase migration | Not authorized now | Migration files are forbidden in PR170 scope. |
| Staging write | Not authorized now | PR171 must default to local-only unless a later explicit checkpoint approves staging write. |
| Production write | Forbidden | Production data is outside this train. |
| Public surface | Forbidden | Staging data must not feed public routes, sitemap, Public API, MCP, reports, or data repo. |
| Runtime code | Not authorized now | No storage client, API route, worker, queue, or crawler is needed for this checkpoint. |

## Proposed Future Entities

If a later explicitly approved migration task creates staging storage, it should use separate internal tables or equivalent entities.

Recommended future entities:

```text
staging_scout_records
staging_scout_sources
staging_scout_reviews
staging_scout_batches
staging_scout_corrections
```

These names are planning inputs only. PR170 does not create tables or migration files.

## Proposed Future Field List

### `staging_scout_records`

```text
id
batch_id
staging_status
project_name_hint
official_website_url
github_url
docs_url
normalized_official_domain
normalized_github_owner
normalized_github_repo
canonical_candidate_key
quarantine_reason
review_note
source_confidence
created_at
updated_at
ttl_expires_at
deleted_at
```

### `staging_scout_sources`

```text
id
record_id
source_url
source_type
source_seen_at
source_staleness_state
last_local_dry_run_at
created_at
```

### `staging_scout_reviews`

```text
id
record_id
review_owner
review_status
reviewed_at
review_note
created_at
```

### `staging_scout_batches`

```text
id
batch_label
source_scope
input_manifest_path
created_at
rollback_status
deleted_at
```

### `staging_scout_corrections`

```text
id
record_id
correction_status
correction_note
corrected_at
created_at
```

All field lists are draft planning material. They must be re-reviewed before any migration.

## Denied Future Fields

Future staging storage must not include:

- founder emails;
- phone numbers;
- private social handles;
- customer names or logos;
- screenshots;
- copied competitor descriptions;
- copied directory descriptions;
- copied categories;
- rankings;
- scores;
- traffic;
- reviews;
- recommendations;
- cookies, sessions, tokens, credentials, analytics, billing, CRM, admin, bank, payment, or private telemetry data;
- public status;
- publish status;
- sitemap status;
- Public API status;
- MCP status;
- Growth status;
- investment recommendation, ranking, or endorsement fields.

## RLS / Access Boundary

If a future migration is approved, storage must be private by default.

Minimum access rules:

- service role or admin-only internal access;
- no anonymous reads;
- no public route reads;
- no sitemap reads;
- no Public API reads;
- no MCP reads;
- no report registry reads;
- no data repo export reads;
- reviewer-only update path;
- delete/tombstone path available for rollback and correction.

PR170 does not create RLS policies.

## Index / Constraint Planning

Future migration planning should consider:

- unique nullable `canonical_candidate_key` only within active non-deleted rows, if approved;
- index on `batch_id`;
- index on `staging_status`;
- index on `normalized_official_domain`;
- index on `normalized_github_owner`, `normalized_github_repo`;
- index on `ttl_expires_at`;
- index on `deleted_at`;
- foreign key from sources/reviews/corrections to records;
- batch rollback lookup.

These are planning notes only, not a schema.

## Rollback Plan

Future staging storage must support:

- rollback by `batch_id`;
- quarantine by `record_id`;
- soft delete / tombstone;
- source stale marking;
- correction note append;
- proof that public surfaces are unaffected;
- replay-safe local dry-run before write.

No rollback implementation is created in PR170.

## No-Public-Surface Proof

PR170 changes only docs/status/current/train metadata.

It does not change:

- `app/**`;
- `components/**`;
- `lib/**`;
- `scripts/**`;
- `supabase/**`;
- `deploy/**`;
- `middleware.ts`;
- `package.json`;
- `package-lock.json`;
- `public/**`;
- `.env*`;
- `/Users/rainie/Desktop/88cn-index-data/**`.

Therefore no staging data can reach:

- public frontend;
- sitemap;
- Public API;
- MCP;
- `/landscape`;
- `/tasks`;
- alternatives pages;
- public report pages;
- report registry;
- public JSON;
- distribution packs;
- data repo.

## PR171 Handoff

PR171 / SCOUT_STAGING2 should default to local-only dry-run.

Expected result:

- `PASS_SCOUT_STAGING_LOCAL_DRY_RUN`

If PR171 requires real staging DB writes, it must stop and report:

- `STAGING_WRITE_NOT_AUTHORIZED_LOCAL_ONLY`

PR171 must not write Supabase, staging, or production data unless a later explicit checkpoint authorizes the write target, payload, rollback path, and no-public-surface proof.

## Validation Results

Validation after PR170 edits:

| Check | Result |
| --- | --- |
| `npm run agent:scope:check -- PR170` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run agent:batch:check` | PASS |
| `npm run agent:train-plan:check` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| `npm run agent:gate` | PASS |
| `node scripts/check-landscape-boundary.mjs` | PASS |
| `npm run landscape:check` | PASS |
| `node scripts/check-sector-density-boundary.mjs` | PASS |
| `node scripts/check-task-discovery-boundary.mjs` | PASS |
| `node scripts/check-alternatives-canonical.mjs` | PASS |
| `git diff --check` | PASS |
