# PR72 Alternatives Canonical Policy v0

## Scope

PR72 defines the canonical policy for future curated alternatives pages.

Roadmap scope for PR72 is policy-only. This task does not add public routes, sitemap entries, libraries, scripts, API routes, MCP behavior, payment behavior, dependencies, deploy configuration, external index pings, or data repository writes.

## Canonical Route Model

Alternatives pages are finite, reviewed comparison surfaces. They must be backed by a literal allowlist entry before they can be implemented.

Allowed route shape:

```text
/alternatives/{canonical-pair-slug}
```

Forbidden route shapes:

- `/alternatives?from=a&to=b`
- `/alternatives/{a}/{b}` unless a later task proves deterministic canonical handling
- catch-all alternatives routes
- generated routes for every project pair
- generated routes from categories, tags, collections, verticals, search terms, or external crawls

## Pair Ordering Rule

Each alternatives pair must contain exactly two reviewed project slugs.

Canonical order is deterministic:

```text
left_slug < right_slug
```

The comparison uses lowercase ASCII slug lexical order. The canonical pair slug is:

```text
{left_slug}-vs-{right_slug}
```

Example:

```text
nucleus-ml < vectorbase
canonical path: /alternatives/nucleus-ml-vs-vectorbase
```

The reversed pair must never become a second indexable page. A later implementation must choose one of these safe behaviors:

- redirect reversed route to the canonical path;
- return `notFound()` for reversed route;
- emit a single canonical URL and keep the reversed route non-indexable.

PR73 should prefer redirect or `notFound()` over serving duplicate public content.

## Canonical Mapping

Every published alternatives page must declare:

- `canonicalSlug`
- `leftProjectSlug`
- `rightProjectSlug`
- `canonicalPath`
- `status`
- `sitemapEligible`
- `lastReviewed`
- `summary`
- `neutralRationale`
- `sourceNotes`

The canonical path must equal `/alternatives/{canonicalSlug}`.

The canonical slug must equal `{leftProjectSlug}-vs-{rightProjectSlug}` after applying the ordering rule.

## Route Cap

V0 route cap:

```text
max_published_alternatives_routes_v0 = 3
```

The cap applies to published, sitemap-eligible alternatives pages. Draft and noindex entries may exist only if a later roadmap task explicitly allows a registry file, but they must not enter the sitemap.

PR73 should implement fewer than the cap if reviewed local evidence does not support three safe pairs.

## Allowlist Rule

An alternatives route can be public only when all conditions pass:

- both project slugs exist in local reviewed project records;
- both projects have `status: "published"`;
- both projects have public source links;
- pair appears in a literal allowlist entry;
- route count remains within the V0 cap;
- pair uses the canonical ordering rule;
- page copy is neutral and factual;
- sitemap eligibility is explicitly true;
- no unreviewed, scouted, submitted, pending-review, quarantined, rejected, claimed, owner-verified, or archived project leaks into the page.

Unknown projects and unlisted pairs must not become public or indexable.

## Copy Safety

Alternatives pages may describe:

- public product positioning;
- public source availability;
- category or workflow differences;
- reviewed local Signal Score fields already exposed on project profiles;
- source-confidence and verification status as already defined by local profile data.

Alternatives pages must not:

- call one project the best unless a later human-approved policy defines exact evidence;
- imply ranking superiority without cited local evidence;
- defame or disparage a project, founder, company, maintainer, or competitor;
- imply guaranteed traffic, ranking, citation, backlink, revenue, investor, adoption, compliance, safety, or certification outcomes;
- invent users, revenue, financing, customers, retention, or market position;
- use private analytics, customer lists, screenshots, billing data, credentials, or founder-private material.

Tone must stay factual, neutral, and discovery-oriented.

## Sitemap Policy

Sitemap inclusion is allowed only for canonical alternatives entries where:

- `status === "published"`;
- `sitemapEligible === true`;
- route cap is not exceeded;
- pair ordering rule passes;
- both projects resolve to local `status: "published"` records;
- copy safety checks pass.

Reversed, unknown, draft, noindex, archived, or under-threshold entries must not appear in sitemap output.

## Checker Contract For PR73

PR72 cannot add a checker because the roadmap forbids `scripts/**`. PR73 should add a local checker that validates:

- registry size and published route count cap;
- pair slug ordering;
- canonical path mapping;
- reversed route duplicate prevention;
- published-only project filtering;
- unknown pairs are not public;
- sitemap uses only canonical allowlisted entries;
- no arbitrary route generation or query-param route generation;
- no forbidden public-copy patterns;
- no IndexNow, Google Indexing API, Public API, MCP, payment, deploy, dependency, or data repo mutation.

## Definition Of Done

- [x] Slug ordering rule exists.
- [x] Duplicate route prevention is defined.
- [x] Canonical mapping exists.
- [x] Max comparison route cap exists.
- [x] Arbitrary alternatives pages are forbidden.
- [x] N-squared route generation is forbidden.
- [x] Competitor defamation is forbidden.
- [x] Ranking, traffic, citation, and backlink promises are forbidden.
- [x] Neutral factual language requirement exists.
- [x] Alternatives lifecycle and sitemap policy are documented.

## Proceed Decision

PR73 can proceed after PR72 merges and cleanup completes. PR73 must implement only a tiny allowlisted alternatives surface and should add the machine checker within its roadmap scope.
