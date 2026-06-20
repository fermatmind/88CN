# SCOUT0 Mass Ingestion Sandbox Boundary v0

Status: validation passed  
Task: PR133 / SCOUT0  
Result: GO_SCOUT1_SCOUT2_AUDIT0_REPORT0  
Date: 2026-06-20

## Decision

SCOUT0 approves only a policy and contract lane for a future scouted sandbox. It does not approve ingestion code, crawler runtime, external source scanning, database writes, public route changes, sitemap changes, Public API changes, MCP changes, `/landscape` counts, `/tasks` discovery, alternatives expansion, report publication, deployment, or companion data repo mutation.

The next allowed train can define source policy, sandbox contract, audit egress boundaries, and report freshness policy. Each follow-on task must remain inside its own roadmap scope.

## Sandbox States

| State | Meaning | Public surface | Next action |
| --- | --- | --- | --- |
| `scouted` | A candidate project identity has been locally observed from an allowed public source and has minimum provenance metadata. | None. It is not indexable and not eligible for sitemap, Public API, MCP, `/landscape`, `/tasks`, alternatives, reports, or public counts. | Review source policy and sandbox contract before any audit. |
| `audit_pending` | A `scouted` candidate is eligible for a future local-only audit dry run after policy and egress boundaries are accepted. | None. | Wait for AUDIT0/AUDIT1/AUDIT2 gates. |
| `quarantined` | A candidate has insufficient provenance, unsafe copy risk, identity conflict, restricted source, privacy risk, or external-access failure. | None. | Keep out of all public surfaces until a human clears the issue through a later reviewed process. |
| `review_candidate` | A candidate has enough public provenance to be considered by a human reviewer, but has not been approved, published, claimed, or owner verified. | None. | Human review only; no automatic publication. |

These sandbox states are intentionally separate from the production lifecycle states in `AGENTS.md`. They do not create a shortcut to `approved`, `published`, `claimed`, or `owner_verified`.

## Visibility Boundary

The scouted sandbox is private-by-default and local-by-default until a later task explicitly changes that posture. A sandbox record must not:

- enter sitemap output;
- change robots behavior;
- appear in `/landscape` aggregates, counts, links, sectors, density maps, or public copy;
- appear in `/tasks` pages or task-to-project discovery;
- appear in alternatives pages, pair registries, comparisons, or canonical route generation;
- appear in public report pages, report distribution packs, report snippets, or public archive data;
- appear in Public API responses or serializers;
- appear in MCP tools or schemas;
- create an admin action that publishes or promotes records automatically;
- create an external ping, search submission, deploy, or runtime recalculation.

## Source and Copy Boundary

Future scouted candidates may only use public-safe identity facts from approved source classes defined by SCOUT1. SCOUT0 does not approve any source collection by itself.

Forbidden inputs include private contacts, email addresses, customer lists, analytics, credentials, login-required pages, copied competitor descriptions, scraped reviews/comments, private screenshots, cookies, social session exports, and data from bypassed or rate-limited targets.

Unknown fields must remain unknown. The sandbox must not infer commercial traction, investor interest, customer logos, private financing, revenue, usage, verification status, or founder identity from weak signals.

## Audit Boundary

SCOUT0 does not approve an audit worker. Future audit work must wait for AUDIT0 and AUDIT1 boundaries. Before any local audit dry run, the system must have:

- a source-policy decision for eligible URLs;
- a sandbox contract that keeps records out of public surfaces;
- egress rules for timeout, retries, cooldown, concurrency, redirects, robots-aware handling, and failure taxonomy;
- a no-bypass rule for access restrictions, forms, login pages, cookies, browser automation at scale, proxy rotation, or attack-like probing;
- an output destination outside the repo unless a later task explicitly allows a committed artifact.

## Sidecar Policy

Pre-existing unrelated findings can be recorded in `docs/SIDECAR_ISSUES.md` and must not block this train. A finding is blocking only if it proves current-scope failure, forbidden path mutation, private data exposure, copied restricted source text, runtime/public-surface exposure, external write, Supabase write, data repo mutation, required-check failure, or a P0/P1 risk introduced by this task.

## Validation

| Check | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run agent:batch:check` | PASS |
| `npm run agent:train-plan:check -- --batch TRAIN-PR133-SCOUT0-BOUNDARY` | PASS |
| `npm run agent:scope:check -- PR133` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| `npm run agent:gate` | PASS |
| `npm run landscape:check` | PASS |
| `node scripts/check-sector-density-boundary.mjs` | PASS |
| `node scripts/check-task-discovery-boundary.mjs` | PASS |
| `node scripts/check-alternatives-canonical.mjs` | PASS |
| `npm run report-distribution-pack:generate -- --dry-run` | PASS |

## Handoff

Next allowed tasks:

- PR134 / SCOUT1: public identity source policy.
- PR135 / SCOUT2: scouted sandbox contract.
- PR136 / AUDIT0: egress and politeness readiness.
- PR137 / REPORT0: TTL and correction policy.

Do not start PR138-PR144, second-round Growth, BETA1, I18N0, OPS8D, OPS10A, or PR101 from this PR.
