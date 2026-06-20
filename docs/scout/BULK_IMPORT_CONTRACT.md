# BULK_IMPORT_CONTRACT v0

Status: validation passed
Task: PR185 / BULK_IMPORT_CONTRACT
Result: BULK_IMPORT_CONTRACT_READY
Date: 2026-06-21

## Result

PR185 defines the bulk import contract for the 20k-50k data-plane train.

Result: `BULK_IMPORT_CONTRACT_READY`.

This is a contract-only PR. It does not import seed rows, write Supabase, write staging, write production, create a worker, create a queue, run external HTTP audit, mutate the data repository, expose a public route, change sitemap behavior, release Public API or MCP data, deploy, or touch server/cloud resources.

## Scope

In scope:

- define the batch manifest shape;
- define deterministic row hashes and batch hashes;
- define source evidence mapping into the PR184 project contract tables;
- define accepted, needs-review, rejected, quarantined, duplicate, and rollback handling;
- define no-public defaults for every imported row;
- define 20k-50k batch limits, retry boundaries, and stop conditions;
- define handoff requirements for future implementation PRs.

Out of scope:

- actual seed import;
- Supabase write, staging write, or production write;
- migration file or schema change;
- runtime worker, queue, retry code, resolver code, crawler, or external HTTP audit;
- public frontend, sitemap, Public API, MCP, report page, or search release;
- data repository mutation;
- server, deploy, Aliyun, Tencent, or FermatMind resource change.

## Inputs

Future import batches may read only approved local or reviewed handoff artifacts.

Allowed input classes:

| Input class | Purpose | Public exposure |
| --- | --- | --- |
| Identity seed rows | Candidate project names and source pointers | Never public by default |
| Source evidence rows | Official-site, docs, GitHub, launch, or directory-hint provenance | Never public until reviewed |
| Canonical candidate rows | Normalized identity linkage from prior local resolver work | Never public by default |
| Review findings | Human-review blockers and notes | Admin/backstage only |
| Manifest metadata | Batch identity, source scope, checksums, and operator note | Admin/backstage only |

Forbidden input classes:

- private contact details;
- billing, payment, analytics, CRM, bank, invoice, or private account material;
- login sessions, cookies, private credentials, or secret-bearing values;
- copied third-party descriptions, copied categories, copied screenshots, or reused logos;
- unreviewed claims about revenue, users, retention, traffic, investment, or commercial performance.

## Batch Manifest

Every future import batch must have a manifest before any write-capable implementation runs.

Required manifest fields:

```json
{
  "manifest_version": "bulk_import_contract_v0",
  "batch_id": "batch_YYYYMMDD_scope_sequence",
  "batch_label": "human-readable internal label",
  "source_scope": "approved_local_seed_handoff",
  "input_artifact_count": 0,
  "expected_row_count": 0,
  "max_row_count": 500,
  "row_hash_algorithm": "sha256:v1",
  "batch_hash_algorithm": "sha256:v1",
  "created_at": "ISO-8601 timestamp",
  "created_by": "human_or_agent_ref",
  "review_owner": "human_review_owner_ref",
  "write_target": "staging_only",
  "public_exposure_default": "none",
  "rollback_required": true,
  "dry_run_required": true,
  "no_auto_publish": true
}
```

Manifest rules:

- `batch_id` must be unique and stable.
- `expected_row_count` must match the reviewed input row count.
- `max_row_count` must not exceed 500 rows for the first write-capable implementation.
- Larger 20k-50k ingestion must be sharded into many small batches.
- `public_exposure_default` must remain `none`.
- `no_auto_publish` must remain `true`.
- A batch with missing hash, missing review owner, or missing rollback plan must not run.

## Row Hash

Each row must have a deterministic row hash before import.

Canonical row hash input:

```text
manifest_version
batch_id
source_url
project_name_hint
official_website_url
github_url
docs_url
source_type
observed_at
claim_boundary
```

Normalization rules:

- trim surrounding whitespace;
- lowercase URL scheme and hostname for hash input;
- remove URL fragments;
- remove common tracking query parameters;
- preserve the original source URL separately for provenance;
- use empty string for absent optional fields;
- never include private notes, credentials, private contact data, or local file paths in the row hash.

Hash algorithm:

```text
row_hash = sha256(join(canonical_fields, "\n"))
```

Row hash requirements:

- repeated identical canonical input must produce the same hash;
- changed source URL, project identity, or claim boundary must produce a new hash;
- duplicate row hashes in one batch must be rejected before any write;
- duplicate row hashes across batches must be treated as duplicate or needs-review, not silently overwritten.

## Batch Hash

The batch hash is the ordered hash of row hashes plus manifest identity.

```text
batch_hash_input =
  manifest_version + "\n" +
  batch_id + "\n" +
  sort(row_hashes).join("\n")

batch_hash = sha256(batch_hash_input)
```

Batch hash requirements:

- the same reviewed row set must produce the same batch hash;
- adding, removing, or changing any row must change the batch hash;
- the batch hash must be recorded before write-capable import starts;
- rollback evidence must include `batch_id` and `batch_hash`.

## Source Evidence Mapping

Future implementation should map rows into the PR184 schema as follows.

| Source field | Target table | Target field | Default visibility |
| --- | --- | --- | --- |
| project name hint | `project_entities` | `display_name` | backstage only |
| normalized project name | `project_entities` | `normalized_name` | backstage only |
| category hint | `project_entities` | `primary_category` | backstage only |
| open/commercial hint | `project_entities` | `open_source_or_commercial` | backstage only |
| source URL | `source_evidences` | `source_url` | backstage only |
| source role | `source_evidences` | `source_role` | backstage only |
| source type | `source_evidences` | `source_type` | backstage only |
| official-source flag | `source_evidences` | `is_official_source` | backstage only |
| evidence hash | `source_evidences` | `evidence_hash` | backstage only |
| GitHub URL | `repo_assets` | `github_url` | backstage only |
| repo owner/name | `repo_assets` | `repo_owner`, `repo_name` | backstage only |
| website/docs URL | `web_assets` | `url` | backstage only |
| website/docs domain | `web_assets` | `domain` | backstage only |
| review decision | `review_decisions` | `decision`, `decision_reason` | admin only |

Default inserted states:

```text
project_entities.lifecycle_status = seed_hint
project_entities.review_state = not_reviewed
source_evidences.visibility = backstage_only
audit_observations.visibility = backstage_only
published_projections.seo_indexable = false
```

PR185 does not create or insert those rows. These are future implementation rules only.

## Row Outcomes

Every candidate row must end in exactly one pre-write outcome before a write-capable importer proceeds.

| Outcome | Meaning | Future write eligibility | Public eligibility |
| --- | --- | --- | --- |
| `accepted` | Meets minimum identity and provenance requirements | May insert as `seed_hint` only | None |
| `needs_review` | Valid enough to inspect but ambiguous or incomplete | May insert only with `review_state=needs_review` if approved by implementation scope | None |
| `duplicate` | Same row hash or same canonical identity as an existing reviewed row | Do not insert as a new entity | None |
| `quarantined` | Privacy, provenance, copy, identity, or safety concern | Do not insert into public projection | None |
| `rejected` | Invalid, unsafe, unsupported, or outside source scope | Do not insert | None |
| `rollback_pending` | Previously accepted batch needs reversal | Only rollback operation may proceed | None |

Minimum acceptance rules:

- at least one official or reviewable public source URL exists;
- project name is present and normalized;
- source URL is syntactically valid `http` or `https`;
- source type is allowlisted;
- row hash is present and unique in the batch;
- no forbidden private, payment, analytics, CRM, credential, or copied-content fields are present;
- no public status is granted by import alone.

## Quarantine Rules

Rows must be quarantined before write when any of these conditions appear:

- invalid or non-public source URL;
- source scope is not approved for import;
- source evidence conflicts with another candidate;
- duplicate identity cannot be safely resolved;
- copied third-party description or copied category text is present;
- private contact, private account, analytics, billing, or credential-like material is present;
- row makes unverified revenue, users, retention, traffic, commercial performance, or investment claims;
- source evidence is stale, missing, unreachable, or directory-hint-only without an official-source confirmation.

Quarantine record requirements:

```text
batch_id
row_hash
quarantine_reason
source_scope
review_owner
created_at
```

Quarantined rows remain admin/backstage only and must never feed sitemap, public routes, Public API, MCP, report pages, project listings, task pages, alternatives pages, collections, or landscape modules.

## Retry Boundaries

PR185 defines future import retry boundaries but does not implement retries.

Recommended first write-capable importer limits:

| Setting | Limit |
| --- | --- |
| Rows per batch | 500 maximum |
| Jobs per run | 20 maximum |
| Concurrency | 3 maximum |
| Attempts per row | 3 maximum, including initial attempt |
| Per-row timeout | 8 seconds for future external checks, not needed for pure local import |
| Failed-row behavior | Preserve last successful state; never zero out or overwrite reviewed data |
| Batch stop threshold | Stop if more than 5 percent of rows fail structural validation |

20k-50k scale rule:

- do not run a full 20k-50k import in one process;
- shard by source scope, category, or reviewed manifest;
- every shard needs its own `batch_id`, `batch_hash`, summary, and rollback evidence;
- failed shards must not block inspection of successful shards, but they must block publication of their own rows.

## Rollback Contract

Every write-capable future import must be reversible by `batch_id`.

Rollback evidence required:

```text
batch_id
batch_hash
row_hashes
created_entity_ids
created_source_evidence_ids
created_repo_asset_ids
created_web_asset_ids
created_review_decision_ids
rollback_started_at
rollback_finished_at
rollback_status
```

Rollback modes:

| Mode | Use case | Required behavior |
| --- | --- | --- |
| `no_data_written` | Dry run or failed pre-write validation | Record no-op rollback |
| `delete_empty_seed_rows` | Newly inserted rows have no review history | Delete created rows in dependency order |
| `tombstone_reviewed_rows` | Rows have review history | Preserve evidence and review trail; set non-public stale/archive state |
| `disable_projection` | A later task accidentally projected rows | Set `seo_indexable=false` and remove public projection path before any destructive cleanup |

Destructive rollback is forbidden after human review data exists unless a separate checkpoint approves it.

## No-Public Default

Bulk import does not publish.

Forbidden by import alone:

- `published` lifecycle state;
- `published_approved` review state;
- `published_projections.seo_indexable=true`;
- sitemap inclusion;
- public project listing;
- public project detail page;
- public report surface;
- Public API or MCP exposure;
- task, alternatives, collections, or landscape inclusion.

Only a later manual review and publish task may move reviewed projection rows into public surfaces.

## Future Implementation Handoff

Future implementation PRs must preserve these boundaries:

- PR194 / BULK_IMPORT_WORKER may implement a bounded importer only within its approved scope;
- implementation must run dry-run validation before write;
- implementation must refuse missing manifest, missing hashes, duplicate row hashes, missing rollback plan, or missing review owner;
- implementation must default every row to non-public states;
- implementation must emit a summary with accepted, needs-review, duplicate, quarantined, rejected, and rollback counts;
- implementation must not mutate `/Users/rainie/Desktop/88cn-index-data`;
- implementation must not import private seed artifacts into the repository;
- implementation must not run external HTTP audit unless a later task explicitly authorizes it.

## Validation Evidence

Passing validations:

- `npm run verify:day0`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run agent:redact:check`
- `npm run agent:batch:check`
- `npm run agent:train-plan:check`
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-DATA-PLANE`
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-SERVER-READINESS`
- `npm run agent:scope:check -- PR185`
- `npm run lint`
- `npm run typecheck`
- `node scripts/check-landscape-boundary.mjs`
- `npm run landscape:check`
- `node scripts/check-sector-density-boundary.mjs`
- `node scripts/check-task-discovery-boundary.mjs`
- `node scripts/check-alternatives-canonical.mjs`
- `npm run build`
- `npm run agent:gate`
- `git diff --check`

## Next

After PR185 merges, continue to PR186 / SERVER_CAPACITY_READINESS.

PR186 is read-only server readiness. If the merged OPS-SERVER0R evidence fully satisfies PR186, verify equivalence from clean `origin/main` and either skip according to the goal or create only the narrow registry/status PR required by the roadmap.
