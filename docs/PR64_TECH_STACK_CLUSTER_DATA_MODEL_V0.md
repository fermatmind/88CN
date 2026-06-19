# PR64 Tech Stack Cluster Data Model v0

## Purpose

PR64 defines the data model and boundary contract for future tech-stack cluster pages. It does not implement public stack pages, dynamic routes, sitemap entries, external indexing calls, Public API exposure, MCP exposure, payment behavior, deploy steps, or data repo mutation.

The machine-readable source of truth is `ops/contracts/tech-stack-cluster-boundary.json`.

## Cluster Model

Each tech-stack cluster is a finite registry entry, not a generated page family.

| Field | Requirement |
| --- | --- |
| `slug` | Literal allowlisted route slug. No wildcard, catch-all, or param template. |
| `title` | Human-readable cluster label. |
| `status` | One of `draft`, `noindex`, `published`, or `archived`. |
| `route_path` | Literal `/stacks/<slug>` path. |
| `sitemap_eligible` | `true` only when status is `published` and evidence thresholds pass. |
| `project_slugs` | Local reviewed project slugs. Public pages may show only `status=published` projects. |
| `evidence_threshold` | Minimum published project and public-source requirements. |
| `cluster_rationale` | Short explanation of why the cluster exists and what user intent it serves. |

## Published-Only Eligibility

A project is eligible for a public stack page only when all conditions pass:

- Project lifecycle status is exactly `published`.
- Project has at least one reviewed public source.
- Project is present in a local allowlist for that stack cluster.
- Project is not sourced from submitted, pending, approved-preview, scouted, quarantined, rejected, archived, or private records.
- Unknown or unverified metrics remain unknown and are not inferred.

`claimed` and `owner_verified` may be indexable elsewhere in the product, but PR64/PR65 stack pages use the stricter `published` rule.

## Route Lifecycle

| Status | Public route | Sitemap | Notes |
| --- | --- | --- | --- |
| `draft` | No | No | Candidate only. |
| `noindex` | Preview only if a later task explicitly allows it | No | Must not leak into sitemap. |
| `published` | Yes, only after evidence threshold passes | Yes, only when `sitemap_eligible=true` | External pings still forbidden in this train. |
| `archived` | No by default | No | Historical exception requires later approval. |

## V0 Allowlist Contract

PR64 reserves a maximum of four candidate stack slugs for PR65:

- `nextjs`
- `supabase`
- `local-llm`
- `mcp`

These are candidates, not automatically published pages. PR65 may publish only the subset that can be mapped to local `status=published` project records with reviewed public sources.

## Forbidden Patterns

- Catch-all stack routes.
- Pages generated for every technology tag.
- Cartesian product pages such as stack x category x geography.
- Runtime crawling of external sources.
- Runtime reads from `88cn-index-data`.
- Data repo mutation.
- Google Indexing API.
- Live IndexNow ping.
- AI-generated filler pages.
- Traffic, ranking, citation, backlink, payment, or investment claims.

## Validation Contract

PR64 does not add a repository script because the roadmap only allows the contract path and docs for this task. The contract is still machine-checkable. The local PR64 validation asserts:

- All required top-level keys exist.
- Status values include `draft`, `noindex`, `published`, and `archived`.
- `eligible_project_statuses` is exactly `published`.
- Excluded status list contains unreviewed/scouted/quarantined/rejected states.
- Candidate route count is capped.
- Forbidden patterns include arbitrary route generation, external indexing, payment, MCP, Public API, and data repo mutation.

## Definition Of Done

- [x] Stack cluster model exists.
- [x] Published-only source rule is defined.
- [x] Unreviewed, scouted, quarantined, rejected, and archived records are excluded.
- [x] Dynamic arbitrary stack pages are forbidden.
- [x] Minimum evidence threshold is defined.
- [x] Status values include `draft`, `noindex`, `published`, and `archived`.
- [x] Sitemap eligibility is explicit.
- [x] Machine-checkable contract validates threshold expectations.
- [x] Cluster lifecycle is documented.

## Proceed Decision

PR65 can proceed after PR64 is merged and cleaned. PR65 must use the PR64 contract and publish only a small, allowlisted `/stacks/[slug]` surface backed by local `status=published` project data.
