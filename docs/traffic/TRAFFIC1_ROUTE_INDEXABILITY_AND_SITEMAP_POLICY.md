# TRAFFIC1 Route Indexability and Sitemap Policy

Result: GO_TRAFFIC2

## Route-Level Indexability Gate

Default rule:

- a demand-side route can be indexable only if it has at least 3 reviewed/published projects;
- if fewer than 3 reviewed/published projects are available, the route must be `noindex, follow`;
- under-threshold routes must not be included in sitemap;
- under-threshold routes can still be linked internally when useful for navigation and when copy is safe.

Allowed lifecycle states for demand-side indexable project data:

- `published`
- `claimed`
- `owner_verified`

Forbidden lifecycle or review states for demand-side indexable content:

- `submitted`
- `pending_review`
- `quarantined`
- `scouted`
- `rejected`
- `private`
- `draft_only`
- unreviewed records

## Exceptions

| Exception | Indexability rule | Sitemap rule | Notes |
| --- | --- | --- | --- |
| Pure reports | May be indexable if reviewed and published. | Include only reviewed/published reports. | Report quality is the gate, not project count alone. |
| `/geo-checker` | May be indexable as a static tool page. | Include static tool route only. | Generated result pages and query URLs must not be indexed. |
| `/zh-CN/geo-checker` | May be indexable if manually reviewed and not auto-translated. | Include static reviewed route only. | Must avoid outcome promises. |
| `/landscape` | May be indexable as a hub if it links only to safe surfaces and does not make unsupported count claims. | Include hub when reviewed. | Child pages still need thresholds. |

## Sitemap Eligibility

A route is sitemap-eligible only when all of these are true:

1. The route is indexable.
2. The route uses reviewed/published project data only.
3. The route is part of a finite allowlist when dynamic.
4. Task routes are finite allowlist routes only.
5. Alternatives routes are finite allowlist routes only.
6. The route does not accept arbitrary dynamic params.
7. The route is not generated from query parameters.
8. The route excludes submitted, pending, quarantined, scouted, rejected, private, draft-only, and unreviewed data.
9. The route is not an API, MCP, payment, admin, customer, buyer-interest, or internal route.
10. The route is not a disabled shell route.
11. The route is not an API-key, metering, checkout, or customer signup endpoint.
12. The route is not auto-translated at scale.
13. The route is not an under-threshold task, sector, or alternatives page.

## Canonical Policy

| Route family | Canonical rule |
| --- | --- |
| `/landscape` | Self-canonical. |
| `/landscape/sectors` | Self-canonical when implemented as a stable family. |
| `/tasks/[slug]` | Self-canonical only if slug is allowlisted and route is indexable. |
| `/alternatives/[slug]` | Canonical only if pair is approved in canonical order. |
| Reverse alternatives pair | Do not generate. |
| N-by-N alternatives | Do not generate. |
| `/zh-CN/*` | Canonical/hreflang implementation deferred to I18N tasks; TRAFFIC1 defines future intent only. |
| Reports | Self-canonical when reviewed and published. |
| Noindex/unreviewed pages | Must not be canonical targets. |

## Noindex Fallbacks

Use `noindex, follow` when:

- reviewed/published project count is below 3;
- route copy is not manually reviewed;
- route has incomplete source-link evidence;
- route has unresolved canonical ambiguity;
- route is useful for navigation but not ready for search;
- route is a generated checker result;
- route is a draft, disabled shell, or under-review surface.

## Forbidden Indexing Patterns

- Fake global counts.
- Unreviewed project pages as demand-side indexable content.
- Submitted, pending, quarantined, scouted, rejected, private, draft-only, or unreviewed records in sitemap.
- Arbitrary dynamic pages.
- Query-param pages.
- Buyer-interest, API-key, payment, admin, customer, API, or MCP routes.
- Auto-translated pages at scale.
- Paid inclusion or Featured Signals as a sitemap criterion.
