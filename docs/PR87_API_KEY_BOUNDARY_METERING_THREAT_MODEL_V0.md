# PR87 API Key Boundary + Metering Threat Model v0

## Purpose

PR87 defines the disabled-by-default boundary for future Alpha Feed API key and
metering work. It is a contract and threat-model task only.

PR87 does not implement API key issuance, customer access, billing, payment,
Stripe, live metering, Laravel runtime, Supabase migration, production secrets,
external service connections, or data repository writes.

## Scope

This PR adds:

- `ops/contracts/api-key-metering-boundary.json`
- this threat model document
- task status updates
- a sidecar entry for checker scope limitations

The contract prepares later human-reviewed work without enabling runtime access.

## Non-Goals

PR87 does not:

- create API key issuance;
- create API key runtime validation;
- create customer access;
- create billing, payment, or Stripe behavior;
- create live metering;
- create a metering ledger runtime;
- create app routes or API endpoints;
- create Supabase migrations;
- create Laravel runtime;
- create Redis production behavior;
- add dependencies;
- add package scripts;
- create env files or production secrets;
- connect to external services;
- mutate `/Users/rainie/Desktop/88cn-index-data`;
- start PR88.

## Default Disabled Posture

The boundary contract requires these default flags:

```json
{
  "API_KEYS_ENABLED": false,
  "API_KEY_ISSUANCE_ENABLED": false,
  "METERING_ENABLED": false,
  "CUSTOMER_ACCESS_ENABLED": false,
  "BILLING_ENABLED": false
}
```

Any change from these defaults requires a later human checkpoint.

## API Key Issuance Boundary

PR87 does not issue keys and does not create a route or service that can issue
keys. Future issuance must remain disabled until human review approves the
specific storage, scope, revocation, rate-limit, audit, customer-access, and
production-secret design.

Future key states are limited to:

- `disabled`
- `created_pending_admin_review`
- `active`
- `revoked`
- `expired`
- `suspended`

## Key Storage Threat Model

API keys are credential material. Future implementations must store API keys as
non-reversible hashes, not plaintext.

Plaintext API keys must never be stored after initial one-time display.

Threats:

- plaintext storage leaks customer access;
- committed fixtures can be mistaken for usable credentials;
- logs can capture key material;
- weak scope can expose surfaces beyond Alpha Feed reads;
- missing revocation keeps compromised keys usable;
- missing audit trail prevents incident review.

Required future controls:

- hashed storage only;
- one-time display only after checkpointed issuance;
- no committed key-like samples;
- scoped keys;
- revocation and suspension;
- auditable administrative actions;
- fail-closed validation for revoked or expired keys.

## Rate Limit And Quota Boundary

No rate-limit runtime is added in PR87.

Future enablement must define:

- per-key request limits;
- per-window quota;
- burst limits;
- abuse lockout;
- admin-reviewed limit changes;
- bounded rejection behavior.

Rate limits must be in place before customer access is enabled.

## Metering Ledger Boundary

PR87 does not create live metering or a metering ledger.

Future metering event types are limited to:

- `api_request_counted`
- `api_request_rejected`
- `quota_window_started`
- `quota_window_reset`
- `key_revoked`
- `key_suspended`

Future metering payloads may reference only opaque key id, public route class,
timestamp, request status, and quota window. They must not capture raw payloads,
private founder data, admin notes, payment state, internal Source Confidence
inputs, or internal Signal Score inputs.

## Abuse Cases

The boundary is designed to prevent:

- enabling API keys before review;
- exposing customer access without approval;
- leaking private founder or admin fields;
- treating metering as billing;
- changing public ranking, sitemap, MCP, or editorial outcomes based on API use;
- storing plaintext key material;
- committing realistic key-like fixtures;
- using private statuses as feed records.

## Replay Risk

Future request validation must handle replay attempts through scoped keys,
bounded request windows, revocation checks, and auditable rejection events.
PR87 does not implement replay protection because no runtime request path is
created.

## Key Leakage Risk

Future leakage handling must support revocation, suspension, audit, and
rotation. Revoked keys must fail closed. Key material must not be logged,
committed, or stored in plaintext after initial one-time display.

## Customer Access Risk

Customer access is disabled by default. Any future customer access must require
human checkpoint approval and must use published-only allowlisted Alpha Feed
fields.

## Payment Coupling Risk

Metering is not billing. API request counts must not create payment state,
commercial placement, Featured Signals placement, Signal Score changes, Source
Confidence changes, sitemap inclusion changes, Public API ordering changes, MCP
payload ordering changes, or editorial review changes.

Billing or payment enablement requires a separate human checkpoint.

## Public API / MCP Boundary

The API key and metering boundary must remain separate from Public API and MCP
release decisions.

Future API key or metering behavior must not:

- release a Public API surface;
- change Public API organic ordering;
- change MCP payload ordering;
- expose MCP tools;
- add MCP runtime behavior;
- expose private/admin/payment fields.

## Alpha Feed Boundary

Future Alpha Feed access must use published-only reviewed local public records
and the PR82 snapshot field allowlist. Unknown facts must remain unknown, and
private founder/admin/payment fields must remain denied.

## Human Checkpoint Triggers

Human review is required before:

- enabling API key runtime;
- enabling API key issuance;
- enabling customer access;
- enabling billing or payment;
- creating production secrets or env setup;
- adding Supabase migrations;
- adding Laravel runtime;
- connecting external services;
- writing to the data repository.

## Future PR88 Scope

PR88 may define a disabled shell only after human review. It must not issue real
keys, enable customer access, create production secrets, or connect external
services without an explicit checkpoint.

## Future PR89 Scope

PR89 may define a metering ledger contract only. It must keep metering separate
from payment and must not create live metering or a billing coupling.

## Future PR90 QA Scope

PR90 must verify that PR88 and PR89 stay disabled, do not leak private fields,
do not alter Public API/MCP/sitemap behavior, and do not create customer access,
payment, deployment, external service, or data repository mutation.

## What This PR Does Not Do

PR87 creates no runtime API key behavior, no metering runtime, no payment
behavior, no deploy, no external write, no dependency, no Supabase migration, no
Laravel runtime, no production secret, and no PR88 work.

This PR is human-checkpointed by the PR87-PR90 train policy and must stop at
MERGE_READY. It must not be auto-merged.
