# PR61 Global Intent Taxonomy + Scaled Content Boundary v0

## Purpose

This document defines the governance layer for future Global Intent Interception Web surfaces. It exists before PR64+ product work so route creation, publication, sitemap inclusion, and external notification cannot drift into arbitrary scaled pages.

PR61 is governance only. It does not implement public pages, dynamic routes, sitemap entries, external index pings, Public API changes, MCP changes, payment behavior, deploy steps, or data repo writes.

## Intent Taxonomy

Intent surfaces must fit one of the approved page types below before any later implementation task can propose a route.

| Page type | Purpose | Required source of truth | Default status | Publication ceiling |
| --- | --- | --- | --- | --- |
| `stack` | Explain a bounded technology-stack cluster for project discovery. | Reviewed local registry entry and public project evidence. | `draft` | Published only after evidence and route-review thresholds pass. |
| `collection` | Curate a small editorial set around a real discovery need. | Reviewed collection rationale and allowlisted projects. | `draft` | Published only when every included item is reviewed. |
| `vertical` | Group projects by a narrow industry or use-case segment. | Approved vertical taxonomy and local reviewed project snapshots. | `draft` | Published only with an explicit scope cap. |
| `alternative` | Present a curated alternative set with canonical policy. | Canonical target and reviewed comparison rationale. | `draft` | Published only when route caps and canonical ownership are defined. |
| `report` | Summarize bounded aggregate signals or editorial research. | Report registry and reviewed source notes. | `draft` | Published only through existing report publication controls. |

Approved intent taxonomy keys:

```json
{
  "version": "PR61-v0",
  "allowed_page_types": ["stack", "collection", "vertical", "alternative", "report"],
  "allowed_statuses": ["draft", "noindex", "published", "archived"],
  "default_status": "draft",
  "default_indexing": "noindex",
  "route_source": "allowlisted_registry_only"
}
```

## Route Creation Thresholds

A future route can move from idea to implementation only when all thresholds pass:

| Threshold | Requirement |
| --- | --- |
| User intent | The page answers a specific founder, builder, maintainer, or researcher discovery question. |
| Evidence | Claims are backed by reviewed local project records or official public sources. Unknown fields remain unknown. |
| Scope cap | The route belongs to a finite allowlist, not an open-ended parameter space. |
| Editorial value | The page adds curation, taxonomy, or aggregate signal context; it is not a rewritten list of thin summaries. |
| Lifecycle status | Draft and noindex surfaces stay out of sitemap and external notifications. |
| Human review | Publication requires a reviewed registry status and owner/reviewer metadata in the later route registry. |

## Scaled Content Boundary

Forbidden:

- Arbitrary pSEO route generation from unbounded slugs, pairwise comparisons, categories, tags, or scraped keywords.
- AI-generated filler pages that exist only to occupy search queries.
- Runtime route discovery from query parameters, external crawls, live APIs, or user-submitted keywords.
- N-squared comparison generation without an explicit canonical cap.
- Sitemap inclusion for `draft`, `noindex`, or unreviewed routes.
- Public pages that imply ranking guarantees, paid promotion as organic score, investment solicitation, or unverified growth claims.
- Google Indexing API usage.
- Live IndexNow ping without a later explicit human checkpoint.
- Data repo mutation from this train.

Allowed:

- Governance documents.
- A finite route registry in a later PR62 scope.
- Local validation documents that define what later checkers must enforce.
- QA reports that verify no public runtime route, sitemap, external ping, Public API, MCP, payment, deploy, or data repo mutation was introduced.

## Publication And Sitemap Policy

| Status | Public route allowed | Sitemap allowed | External index notification allowed |
| --- | --- | --- | --- |
| `draft` | No | No | No |
| `noindex` | Preview only if a later task explicitly implements it | No | No |
| `published` | Yes, only after review | Yes, only if registry marks sitemap eligible | No live ping unless a later human checkpoint approves |
| `archived` | Historical route only if approved | No by default | No |

The default state for every future intent route is `draft` plus `noindex`. Published status is an explicit exception, not the default.

## Future Checker Contract

PR61 cannot add a script because the roadmap forbids `scripts/**` for this task. A later checker may validate the PR61 boundary by asserting:

- Intent route definitions use only the approved page types.
- Route status is one of `draft`, `noindex`, `published`, or `archived`.
- Routes are finite allowlist entries, not dynamic catch-all generation.
- Non-`published` routes are excluded from sitemap eligibility.
- Google Indexing API strings or clients are absent from intent route code.
- IndexNow live ping code is absent unless a checkpointed task adds an approved dry-run or live path.
- Public copy does not use forbidden public-language claims.

## Definition Of Done

- [x] Intent taxonomy exists.
- [x] Route creation thresholds are defined.
- [x] Arbitrary pSEO route generation is forbidden.
- [x] AI-generated filler pages are forbidden.
- [x] Google Indexing API usage is forbidden.
- [x] Live IndexNow ping requires a later human checkpoint.
- [x] Sitemap inclusion requires reviewed `published` status.
- [x] No public pages, runtime routes, sitemap entries, external pings, Public API, MCP, payment, deploy, or data repo mutation are introduced.
- [x] Docs specify the machine-checkable boundary for later PRs.

## Proceed Decision

PR62 can proceed after PR61 is merged and cleaned. PR62 must create only the allowlisted route registry contract; it must not implement public runtime pages or sitemap inclusion.
