# PR89 Metering Ledger Contract v0

## Purpose

PR89 defines the future metering ledger contract for Alpha Feed API key usage
accounting. It is a contract and documentation task only.

PR89 does not implement live metering, billing, payment, Stripe, customer
access, API key issuance, Supabase schema changes, Laravel runtime, Redis
production usage, external services, or production secrets.

Metering events are usage-accounting records only. They are not invoices,
payments, rankings, scores, recommendations, or evidence of commercial success.

## Scope

This PR adds:

- `ops/contracts/metering-ledger-contract.json`
- this contract document
- task status updates
- a sidecar entry for checker scope limitations

No runtime route, database migration, customer surface, payment flow, or
external delivery is created.

## Non-Goals

PR89 does not:

- implement live metering;
- record real usage events;
- implement billing or payment behavior;
- import or configure Stripe;
- issue, generate, store, list, rotate, revoke, or validate API keys;
- enable customer access;
- create Supabase migrations;
- create Laravel runtime;
- configure Redis production usage;
- add dependencies;
- add package scripts;
- create env files or production secrets;
- connect to external services;
- mutate `/Users/rainie/Desktop/88cn-index-data`;
- start PR90.

## Default Disabled Posture

The contract requires all future metering and adjacent runtime flags to default
to disabled:

```json
{
  "METERING_LEDGER_ENABLED": false,
  "METERING_RUNTIME_ENABLED": false,
  "BILLING_RUNTIME_ENABLED": false,
  "CUSTOMER_ACCESS_ENABLED": false,
  "API_KEY_RUNTIME_ENABLED": false
}
```

Changing these defaults requires a later human checkpoint.

## Append-Only Ledger Model

Future metering events must be append-only. A future implementation may append
new accounting events, reversal events, or adjustment events, but it must not
mutate or delete prior ledger events.

This protects auditability and prevents usage history from becoming a mutable
ranking, billing, or customer-state source.

## Idempotency Model

Future event writes must use a stable `idempotency_key`. A repeated append
attempt with the same `event_type` and `idempotency_key` must resolve to the
original accounting outcome and must not create a duplicate ledger event.

The idempotency key must not be derived from raw request bodies, raw response
bodies, plaintext API keys, bearer credentials, session credentials, payment
identifiers, or customer contact details.

## Event Type Model

The allowed future event types are:

- `api_request_counted`
- `api_request_rejected`
- `quota_window_started`
- `quota_window_reset`
- `rate_limit_applied`
- `key_revoked`
- `key_suspended`
- `key_expired`
- `snapshot_export_counted`
- `feed_access_rejected`

Future events may include only contract-declared accounting fields:

- `event_id`
- `event_type`
- `occurred_at`
- `idempotency_key`
- `actor_type`
- `key_id_reference`
- `project_scope`
- `request_scope`
- `units`
- `result`

`key_id_reference` must be a non-secret opaque reference. It must not contain a
plaintext API key, raw bearer credential, API key hash, API key hash salt, or
hash internals.

## Denied Fields

Metering events must not expose or store:

- `api_key_plaintext`
- `api_key_hash`
- `api_key_hash_salt`
- `bearer_credential`
- `session_credential`
- `service_role_key`
- `founder_email`
- `contact_email`
- `admin_notes`
- `review_notes`
- `payment_state`
- `stripe_customer_id`
- `invoice_id`
- `billing_address`
- `raw_request_body`
- `raw_response_body`
- `raw_payload`
- `private_telemetry`
- `source_confidence_internal`
- `signal_score_internal`
- `claim_credential`

## Denied Statuses

Future metering must not treat these lifecycle states as eligible feed or usage
records:

- `submitted`
- `pending`
- `pending_review`
- `quarantined`
- `scouted`
- `rejected`
- `needs_info`
- `archived_private`

## Key Reference Policy

Future metering may reference an opaque key id only after a separate human
checkpoint approves key runtime and storage. The reference must be non-secret
and must not reveal API key plaintext, hash values, salts, bearer credentials,
or session credentials.

## Retention Policy

PR89 does not create a runtime retention window because no ledger runtime exists.

A future retention policy must keep only the usage-accounting fields needed for
quota, abuse review, and operational reconciliation. Raw payloads, payment data,
private founder data, admin notes, and private telemetry must not be retained in
metering events.

## Replay And Deduplication Boundary

Future replay handling belongs to the idempotency layer. Duplicate append
attempts must be deduplicated by `event_type` and `idempotency_key`.

PR89 does not implement replay protection because no runtime request path,
ledger write path, queue worker, or database table is created.

## Rate-Limit And Quota Relationship

Future metering may support quota and rate-limit accounting, but rate-limit
enforcement and customer access remain disabled in PR89.

Any future runtime that counts usage, applies limits, resets quota windows, or
rejects feed access requires a later human checkpoint.

## Separation From Billing And Payment

Metering is usage accounting only. Metering events must not:

- generate invoices;
- create payment records;
- write payment state;
- create customer billing records;
- trigger Stripe behavior;
- decide commercial placement;
- imply customer payment status.

Billing or payment enablement requires a separate human checkpoint.

## Separation From Public API, MCP, And Sitemap

Future metering must not alter:

- Signal Score;
- Source Confidence;
- sitemap inclusion;
- Public API ordering;
- MCP payload ordering;
- Featured Signals placement;
- editorial review result.

Future metering must not expose private founder data, admin notes, payment
fields, raw database rows, API key plaintext, API key hash internals, or private
telemetry.

## No Customer Access

PR89 does not enable customer access, customer accounts, customer portals,
customer delivery, or paid access.

## No Live Metering

PR89 does not add metering routes, usage endpoints, queue workers, database
writes, event emitters, or runtime counters.

## No Supabase Migration

PR89 does not create or modify Supabase schema, migrations, RLS policies,
database functions, triggers, tables, or indexes.

## No Redis Production Usage

PR89 does not configure Redis, rate-limit storage, quota windows, production
queues, or production cache state.

## No Laravel Runtime

PR89 does not create a Laravel gateway, Laravel route, Laravel job, Laravel
model, Laravel middleware, or sync runtime.

## Human Checkpoint Triggers

Human review is required before:

- `real_metering_runtime`
- `database_migration`
- `customer_access`
- `billing_or_payment`
- `stripe_integration`
- `production_secret`
- `laravel_gateway_runtime`
- `redis_production_usage`
- `external_service_delivery`

## Relationship To PR87

PR87 defines the broader API key and metering threat model. PR89 narrows that
boundary into a future append-only usage-accounting ledger contract.

PR89 does not relax PR87 disabled defaults or human checkpoint requirements.

## Relationship To PR88

PR88 adds a disabled API key shell. PR89 does not enable that shell, does not
issue API keys, and does not add customer access to it.

## Future PR90 QA Scope

PR90 must verify that PR88 and PR89 remain disabled and do not introduce live
metering, billing, payment, Stripe, customer access, Supabase migrations,
Laravel runtime, Redis production usage, production secrets, external service
delivery, key-like committed fixtures, or data repository mutation.

PR90 must also verify that metering does not change Public API, MCP, sitemap,
Featured Signals, Signal Score, Source Confidence, or editorial review behavior.

## Validation Scope

PR89 roadmap scope forbids `scripts/**` and `package.json`, so PR89 does not add
a committed checker or npm script. Equivalent validation uses the contract,
roadmap-listed checks, scope guard, redaction guard, and temporary `/tmp`
positive and negative probes.

## What This PR Does Not Do

PR89 creates no live metering, no billing, no payment, no Stripe integration, no
customer access, no API key issuance, no Supabase schema change, no Laravel
runtime, no Redis production usage, no external service, no production secret,
no deployment, no dependency, and no PR90 work.

This task is human-checkpointed by the PR87-PR90 train policy. It must stop at
MERGE_READY, must not be auto-merged, and must not deploy.
