# SCOUT2 Scouted Sandbox Contract v0

Status: validation passed  
Task: PR135 / SCOUT2  
Result: GO_SCOUT3_SCOUT4_AUDIT1  
Date: 2026-06-20

## Decision

SCOUT2 defines a machine-readable contract for future scouted sandbox records. This PR does not add a database schema, migration, runtime type, ingestion script, crawler, audit worker, public page, sitemap entry, Public API field, MCP tool, deployment, or companion data repo mutation.

The contract is private-by-default and sandbox-only. A record that satisfies this contract is still not approved, published, claimed, owner verified, reportable, indexable, or public.

## Record Envelope

Future sandbox records should use an envelope equivalent to:

```json
{
  "schema_version": "scouted_sandbox_v0",
  "sandbox_id": "local-stable-id",
  "status": "scouted",
  "entity": {
    "project_name": "Example",
    "canonical_url": "https://example.com",
    "source_urls": []
  },
  "provenance": {
    "source_policy_version": "SCOUT1_PUBLIC_IDENTITY_SOURCE_POLICY_V0",
    "source_classes": [],
    "retrieved_at": "2026-06-20T00:00:00Z",
    "reviewed_by": null
  },
  "safety": {
    "public_surface_allowed": false,
    "sitemap_allowed": false,
    "public_api_allowed": false,
    "mcp_allowed": false,
    "landscape_allowed": false,
    "tasks_allowed": false,
    "alternatives_allowed": false,
    "report_allowed": false,
    "external_write_allowed": false,
    "data_repo_mutation_allowed": false
  }
}
```

## Required Fields

| Field | Required | Notes |
| --- | --- | --- |
| `schema_version` | Yes | Must be `scouted_sandbox_v0` until a later contract version is approved. |
| `sandbox_id` | Yes | Local stable identifier; not a public slug and not a production primary key. |
| `status` | Yes | One of `scouted`, `audit_pending`, `quarantined`, `review_candidate`. |
| `entity.project_name` | Yes | Public-safe name from SCOUT1-approved source class. |
| `entity.canonical_url` | Conditional | Required before audit eligibility; normalized later by SCOUT4. |
| `entity.source_urls` | Yes | Public-safe source URLs with no login, private, cookie, contact, or bypass dependency. |
| `provenance.source_classes` | Yes | Must match SCOUT1 classes. |
| `provenance.retrieved_at` | Yes | UTC timestamp from local observation or review. |
| `provenance.reviewed_by` | Conditional | Required for manual override or review-candidate promotion. |
| `safety.*_allowed` | Yes | Must default to false. |

## Optional Fields

Allowed optional fields are limited to public-safe identity support:

- `entity.public_repository_url`
- `entity.public_docs_url`
- `entity.public_launch_url`
- `entity.category_hint`
- `entity.original_internal_note`
- `provenance.manual_override_reason`
- `audit.last_attempted_at`
- `audit.last_result`
- `audit.failure_taxonomy`
- `quality.identity_conflict_notes`

Optional fields must not store private contacts, personal emails, customer data, private analytics, billing data, screenshots, cookies, access tokens, reviewer credentials, unreviewed copied descriptions, commercial claims, investor claims, customer logos, or verification assertions.

## Status Transitions

| From | To | Allowed when |
| --- | --- | --- |
| none | `scouted` | Minimum SCOUT1-approved source evidence exists. |
| `scouted` | `audit_pending` | Canonical URL exists, source URLs are allowed, and no privacy/source-copy conflict is present. |
| `scouted` | `quarantined` | Provenance is weak, source is restricted, identity conflicts exist, or privacy/copy risk appears. |
| `audit_pending` | `quarantined` | Audit boundary or source policy fails. |
| `audit_pending` | `review_candidate` | Future audit dry run passes and human-review prerequisites are met. |
| `quarantined` | `scouted` | Human reviewer clears the issue with allowed public evidence. |

No transition may move a sandbox record to `approved`, `published`, `claimed`, or `owner_verified`.

## Denied Surfaces

The contract requires false defaults for all public and external surfaces:

- sitemap output;
- robots/indexing changes;
- public project routes;
- `/scouted` public visibility beyond existing private/gated behavior;
- `/landscape` counts, links, sectors, or density;
- `/tasks` matching;
- alternatives pages or route registries;
- public reports or report distribution pack sources;
- Public API serializers;
- MCP tool responses;
- Supabase production tables;
- companion data repo files;
- external search/index pings;
- external outreach, posting, messaging, CRM, or browser session export.

## Handoff

SCOUT3 may define a local identity ingestion dry-run contract against this envelope if its own roadmap scope allows it. SCOUT4 may define canonical URL and entity identity resolution. AUDIT1 may define batch audit boundaries after AUDIT0 is accepted.

Do not start SCOUT3, SCOUT4, AUDIT0, AUDIT1, AUDIT2, REPORT0, REPORT1, REPORT2, SCOUTQ, second-round Growth, BETA1, I18N0, OPS8D, OPS10A, or PR101 from this PR.

## Validation

| Check | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run agent:train-plan:check -- --batch TRAIN-PR134-PR137-SCOUT-AUDIT-REPORT-BOUNDARIES` | PASS |
| `npm run agent:scope:check -- PR135` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
