# PR62 Intent Route Registry v0

## Purpose

This document defines the allowlisted route registry contract for future Global Intent Interception Web pages. It converts the PR61 taxonomy boundary into a finite registry format without adding public runtime pages, sitemap entries, route generation, external pings, Public API changes, MCP changes, payment behavior, deploy steps, or data repo writes.

PR62 is registry governance only. A future product PR may implement a physical registry file or runtime reader only if its roadmap scope explicitly allows those paths.

## Registry Contract

Every future intent route must be represented as one finite registry entry before it can be implemented.

```json
{
  "version": "PR62-v0",
  "entries": [
    {
      "id": "stack-ai-agent-workflow-v0",
      "page_type": "stack",
      "status": "draft",
      "path": "/intent/stacks/ai-agent-workflow",
      "canonical_url": null,
      "sitemap_eligible": false,
      "indexing_policy": "noindex",
      "evidence_threshold": {
        "minimum_reviewed_projects": 5,
        "minimum_official_sources_per_project": 1,
        "requires_editorial_rationale": true,
        "requires_scope_cap": true
      },
      "owners": {
        "content_owner": "editorial",
        "review_owner": "human-review-required"
      },
      "source_notes": [],
      "last_reviewed_at": null
    }
  ]
}
```

## Required Fields

| Field | Required | Rule |
| --- | --- | --- |
| `id` | Yes | Stable registry id. It must not be generated from unreviewed search keywords. |
| `page_type` | Yes | One of `stack`, `collection`, `vertical`, `alternative`, or `report`. |
| `status` | Yes | One of `draft`, `noindex`, `published`, or `archived`. |
| `path` | Yes | Future route path. It must be a literal allowlisted path, not a glob, catch-all, or parameter template. |
| `canonical_url` | Yes | `null` until canonical ownership is reviewed; required before `published`. |
| `sitemap_eligible` | Yes | `true` only when `status` is `published` and review thresholds pass. |
| `indexing_policy` | Yes | `noindex` unless `status` is `published`. |
| `evidence_threshold` | Yes | Minimum reviewed evidence required before implementation or publication. |
| `owners` | Yes | Safe team-level owner/reviewer labels only; no private contact data. |
| `source_notes` | Yes | Reviewed source summary references. No secrets, private analytics, or credentials. |
| `last_reviewed_at` | Yes | ISO date string or `null` before review. |

## Status Lifecycle

| Status | Meaning | Public route | Sitemap | External notification |
| --- | --- | --- | --- | --- |
| `draft` | Candidate registry entry only. | No | No | No |
| `noindex` | Preview or review candidate if later implemented. | Only if a later task explicitly allows preview | No | No |
| `published` | Human-reviewed and eligible for public indexable surface. | Yes if later runtime implementation exists | Yes only when `sitemap_eligible=true` | No live ping unless a later checkpoint approves |
| `archived` | Retired or historical route. | No by default | No by default | No |

`draft` is the default for every new entry. `published` is an explicit reviewed exception.

## Page Types

| Page type | Allowed use | Additional constraints |
| --- | --- | --- |
| `stack` | Bounded technology-stack cluster. | Requires reviewed project evidence and a finite stack definition. |
| `collection` | Curated editorial collection. | Requires a collection rationale and reviewed included entries. |
| `vertical` | Narrow industry or use-case grouping. | Requires a scope cap and no broad category expansion. |
| `alternative` | Curated alternatives route. | Requires canonical target and capped alternative set. |
| `report` | Aggregate signal or editorial research report. | Must follow existing report publication controls. |

## Evidence Threshold Metadata

Each entry must declare:

- `minimum_reviewed_projects`: non-negative integer appropriate to page type.
- `minimum_official_sources_per_project`: non-negative integer.
- `requires_editorial_rationale`: boolean.
- `requires_scope_cap`: boolean.
- `forbidden_evidence`: no private analytics, customer lists, private founder data, credentials, payment data, or unverified claims.

Unknown metrics must stay unknown and must not be inferred.

## Sitemap Eligibility

Sitemap eligibility is false unless all of the following are true:

- `status` is `published`.
- `sitemap_eligible` is explicitly `true`.
- `canonical_url` is set and reviewed.
- Evidence thresholds pass.
- Public-copy policy scan passes.
- The route is not generated from arbitrary keyword expansion.

Draft, noindex, and archived entries are never sitemap eligible by default.

## Validation Contract

PR62 cannot add a checker script because the roadmap forbids `scripts/**` for this task. A later checker may validate the registry by asserting:

- Every route is a literal allowlist entry.
- `page_type` is one of the five approved values.
- `status` is one of `draft`, `noindex`, `published`, or `archived`.
- `draft`, `noindex`, and `archived` entries have `sitemap_eligible=false`.
- `published` entries have a reviewed `canonical_url`.
- No entry uses catch-all params, wildcard paths, query-driven routes, or unbounded slug templates.
- No entry authorizes Google Indexing API, live IndexNow ping, Public API exposure, MCP exposure, payment behavior, deploy action, or data repo mutation.

## Definition Of Done

- [x] Route registry format exists.
- [x] Registry supports `draft`, `noindex`, `published`, and `archived`.
- [x] Registry supports `stack`, `collection`, `vertical`, `alternative`, and `report`.
- [x] Registry supports evidence threshold metadata.
- [x] Registry supports sitemap eligibility flag.
- [x] Registry supports canonical URL metadata.
- [x] Registry supports safe owner/reviewer metadata.
- [x] No runtime page generation is introduced.
- [x] No sitemap inclusion is introduced.
- [x] Docs define the machine-checkable route registry lifecycle.

## Proceed Decision

PR63 can proceed after PR62 is merged and cleaned. PR63 must QA PR61 and PR62 boundaries only; it must not fix product code or implement runtime pages.
