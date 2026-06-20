# SCOUT4 Canonical Resolver Boundary v0

Status: validation passed  
Task: PR138 / SCOUT4  
Result: GO_SCOUT3_DEPENDENCY  
Date: 2026-06-20

## Decision

SCOUT4 defines the canonical identity resolution boundary for future scouted sandbox records. It does not implement a resolver, script, route, database schema, migration, crawler, public page, sitemap change, Public API change, MCP tool, deployment, Supabase write, or companion data repo mutation.

Future SCOUT3 local dry-run work may use this boundary only as a contract dependency.

## Identity Model

| Field | Purpose | Rule |
| --- | --- | --- |
| `entity_id` | Local sandbox identity key | Stable local key; not a public slug or production ID. |
| `canonical_url` | Primary official URL | Must come from SCOUT1-approved official source or human note. |
| `canonical_host` | Normalized host | Lowercase host, remove tracking params, preserve meaningful path only when needed. |
| `aliases` | Alternate public names or URLs | Evidence-backed only; never sourced from private/contact data. |
| `source_fingerprints` | Dedupe support | Derived from allowed public source URLs and names. |
| `conflict_status` | Resolver outcome | `clear`, `possible_duplicate`, `identity_conflict`, or `quarantined`. |

## Resolver Rules

1. Official site evidence outranks third-party listing evidence.
2. Repository ownership can support identity only when linked from official assets or clearly controlled by the project.
3. Similar names are not enough to merge records.
4. Shared category, stack, or keyword signals are not enough to merge records.
5. Redirects require safe audit handling and must not be followed through unsafe chains.
6. A conflict keeps records out of public surfaces until a human reviewer resolves it.
7. Quarantine is preferred over an unsafe merge.

## Conflict Handling

| Condition | Outcome |
| --- | --- |
| Same official host and same project name | Candidate for same `entity_id`. |
| Same name but different official hosts | `identity_conflict` until reviewed. |
| Same host but different product paths | `possible_duplicate` unless source proves separate products. |
| Repository name matches but official link is absent | Keep as unmerged secondary signal. |
| Third-party listing conflicts with official source | Official source wins; listing remains secondary evidence. |
| Private or restricted source is needed to decide | `quarantined`. |

## Visibility Boundary

Canonical resolution must not create:

- public project slugs;
- sitemap entries;
- `/landscape` counts or links;
- `/tasks` matches;
- alternatives pairs;
- report rows;
- Public API fields;
- MCP fields;
- data repo files;
- Supabase records;
- external pings or writes.

It only improves local sandbox identity hygiene for a future reviewed workflow.

## Handoff

SCOUT3 may define a local-only identity ingestion dry-run contract after this boundary. If SCOUT3 scope remains docs-only, it must stop at a contract and not create an executable resolver or committed output.

Do not start SCOUT3 implementation, AUDIT1, AUDIT2, REPORT1, REPORT2, SCOUTQ, second-round Growth, BETA1, I18N0, OPS8D, OPS10A, or PR101 from this PR.

## Validation

| Check | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run agent:train-plan:check -- --batch TRAIN-PR138-PR139-RESOLVER-AUDIT-BOUNDARIES` | PASS |
| `npm run agent:scope:check -- PR138` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
