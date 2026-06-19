# PR81 Alpha Data Feed Boundary + Threat Model v0

## Result

Validation target: PR81 defines the Alpha Data Feed boundary and threat model only.

This task does not implement a runtime feed, customer access, export endpoint, API key runtime, metering runtime, payment flow, Laravel gateway, Supabase migration, Redis production config, external delivery, or data repository mutation.

## Boundary Contract

Machine-readable contract:

- `ops/contracts/alpha-feed-boundary.json`

Contract posture:

| Area | Decision |
| --- | --- |
| Feed runtime | Not allowed in PR81 |
| Customer access | Not allowed in PR81 |
| Export endpoint | Not allowed in PR81 |
| API key runtime | Not allowed in PR81 |
| Metering runtime | Not allowed in PR81 |
| Payment or billing | Not allowed in PR81 |
| External delivery | Not allowed in PR81 |
| Data repo mutation | Not allowed in PR81 |
| Supabase schema change | Not allowed in PR81 |
| Laravel runtime | Not allowed in PR81 |
| Redis production usage | Not allowed in PR81 |

## Source Rule

Future Alpha Data Feed artifacts may only be derived from reviewed local public records.

Allowed lifecycle state:

- `published`

Denied lifecycle states:

- `submitted`
- `pending_review`
- `approved`
- `archived`
- `quarantined`
- `rejected`
- `scouted_unreviewed`
- `admin_review`

The boundary denies raw database row export, request-time external crawling, hidden scoring input export, and inferred facts.

## Allowed Public Fields

Future feed artifacts may use only explicit public fields:

- `project_slug`
- `project_name`
- `canonical_url`
- `category`
- `short_description`
- `public_source_links`
- `technology_tags`
- `published_at`
- `updated_at`
- `profile_status`
- `public_profile_url`
- `machine_readability_summary`
- `public_changelog_summary`

Unknown facts must remain unknown. Missing values must not be filled with invented data.

## Denied Fields

The Alpha Data Feed boundary denies:

- private founder or submitter contact fields;
- admin notes, review comments, reviewer identifiers, and review queue state;
- external import quarantine details and raw payloads;
- raw Supabase rows;
- audit and notification event payloads;
- payment, commercial order, customer key, API key, and metering fields;
- internal Source Confidence inputs;
- internal Signal Score inputs and hidden score weights;
- private source notes, private telemetry, and claim secrets.

## Threat Model

| Abuse path | Required control |
| --- | --- |
| Raw row export leaks private fields | Explicit allowlist serialization only |
| Non-public lifecycle states appear in feed artifacts | Published-only lifecycle filter |
| Admin review notes leak through broad serialization | Deny admin and review fields |
| Private contact fields leak through founder or claim metadata | Deny all private contact and claim-secret fields |
| Payment or commercial-order state leaks through buyer-facing surfaces | Deny payment and commercial-order fields |
| Hidden scoring inputs are treated as public feed data | Deny Source Confidence and Signal Score internals |
| Feed copy implies financial advice or guaranteed outcomes | Copy review against public language boundary |
| Runtime feed access is enabled early | Human checkpoint before runtime, keys, metering, or delivery |

## Copy Boundary

Allowed framing:

- public signal snapshot;
- reviewed public metadata;
- research-oriented evidence;
- machine readability summary;
- growth readiness signal;
- future waitlist-style interest.

Denied framing:

- financial advice;
- recommendation to buy or sell;
- guaranteed traffic, ranking, citation, revenue, profit, funding, customer, or buyer outcome;
- ownership-sale language;
- restricted capital-product language;
- payment-required customer access without checkpoint.

## Definition Of Done

| Requirement | Status | Evidence |
| --- | --- | --- |
| Alpha Feed boundary exists | PASS | `ops/contracts/alpha-feed-boundary.json` |
| Allowed public fields defined | PASS | Contract `allowed_public_fields` and this document |
| Denied private/admin/payment/internal fields defined | PASS | Contract `denied_fields` and this document |
| Financial advice boundary exists | PASS | Copy boundary section |
| No customer data | PASS | Runtime/customer access disabled and private fields denied |
| No API key runtime | PASS | Release posture disables API key runtime |
| No billing | PASS | Release posture disables payment or billing |
| No export endpoint | PASS | Release posture disables export endpoint |

## Validation Plan

Required PR81 validations:

- `npm run verify:day0`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run agent:scope:check -- PR81`

Additional train-runner validations:

- `npm run agent:redact:check`
- `npm run agent:tool:check`
- `npm run agent:mcp-config:check`
- `npm run agent:plugin-policy:check`
- `npm run agent:batch:check`
- `npm run agent:train-plan:check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run agent:gate`

## Next Task

PR82 may proceed after PR81 is merged, local `main` is synced to `origin/main`, the worktree is clean, and post-merge validation passes.
