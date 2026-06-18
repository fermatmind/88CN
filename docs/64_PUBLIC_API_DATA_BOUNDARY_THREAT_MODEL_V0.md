# Public API Data Boundary Threat Model v0

## Purpose

PR57 defines the data boundary for a possible future read-only Public API. It is a contract, threat model, and checker task only.

PR57 does not implement or expose a public API endpoint.

## Scope

This task covers:

- published-only status rules
- explicit field allowlist
- denied fields and denied statuses
- serialization rules
- privacy and abuse threats
- rate-limit expectations
- PR58 implementation preconditions

This task does not change app runtime behavior.

## Non-Goals

PR57 does not:

- create `app/api/public`
- create a public API route
- expose external API behavior
- add API keys, metering, or bulk export behavior
- change sitemap behavior
- change MCP behavior
- change payment behavior
- change Signal Score behavior
- change Source Confidence behavior
- change deploy or server configuration
- mutate the data repository

## Published-Only Boundary

A future Public API may expose only records with `published` status. No other lifecycle, staging, review, scouted, or quarantine state is part of the PR57 allowlist.

Allowed status:

- `published`

Denied statuses and states:

- `submitted`
- `pending_review`
- `approved`
- `claimed`
- `owner_verified`
- `archived`
- `quarantined`
- `rejected`
- `scouted_unreviewed`
- `admin_review`

Unknown, unpublished, staged, or denied records must return an error shape without leaking private review state or existence details.

## Field Allowlist

A future implementation must serialize public API output from an explicit allowlist only:

- `slug`
- `name`
- `canonical_url`
- `category`
- `short_description`
- `public_source_links`
- `technology_tags`
- `published_at`
- `updated_at`
- `profile_status`
- `structured_metadata_summary`

The implementation must not reuse broad project row serialization.

## Denied Fields

Denied fields include:

- founder, submitter, claim, contact, or other email fields
- private founder data
- admin notes
- review comments
- reviewer IDs
- review decisions
- review queue state
- external import IDs
- external import status
- quarantine reasons or details
- raw payloads
- raw Supabase rows
- audit events
- notification events
- payment data
- payment state
- featured payment state
- commercial order state
- private source notes
- Source Confidence internals
- Signal Score internals
- hidden scoring details
- scouted unreviewed payloads

## Serialization Rules

Future API serialization must:

- build responses from the allowlist
- reject denied fields by default
- avoid broad row spreading
- avoid raw Supabase row exposure
- preserve unknown-value handling
- avoid inferring missing facts
- include request IDs once an endpoint exists

## Privacy Threats

Primary privacy risks are:

- exposing founder or submitter contact fields
- leaking admin review notes
- leaking rejected, quarantined, or staged data
- exposing internal notification or audit state
- exposing private source notes
- exposing raw import payloads

Mitigation:

- use the allowlist as the only serialization source
- keep denied fields explicit in the contract
- validate output before any future external release
- keep unpublished and staged states out of public API results

## Scraping And Abuse Threats

Primary abuse risks are:

- high-volume scraping of machine-readable records
- repeated probing of unpublished slugs
- attempts to infer review state from response differences
- bulk collection beyond the intended public discovery surface

Future PR58 must document and enforce request bounds before external release. API keys, metering, and bulk export are out of scope for PR57.

## Hallucination And Data-Poisoning Threats

Primary data-quality risks are:

- treating unreviewed imports as public facts
- turning AI editorial drafts into public claims
- inferring missing metrics from incomplete source material
- letting staged or scouted records become machine-readable facts before review

Mitigation:

- derive machine-readable output from reviewed local snapshots only
- preserve unknown-value labels
- keep AI-generated drafts behind human review
- keep public responses limited to factual reviewed fields

## Staged, Scouted, And Quarantined Leakage Threats

The Public API boundary denies:

- submitted records
- pending review records
- quarantined records
- rejected records
- unreviewed scouted records
- admin review metadata
- raw import payloads

Future code must treat these as non-public, even when a slug or project-like row exists internally.

## Payment And Commercial Leakage Threats

The Public API boundary denies:

- payment state
- featured payment state
- commercial order state
- checkout state
- paid placement state
- private backer or buyer state

Future API behavior must not affect organic ordering, sitemap inclusion, Signal Score, Source Confidence, or report data.

## Future MCP Dependency Warning

Any future MCP surface must depend on a reviewed Public API boundary. MCP must not bypass this contract, read raw database rows directly, or expose private, staged, payment, commercial, or admin-review fields.

PR57 does not touch MCP code and does not expose MCP behavior.

## PR58 Preconditions

PR58 may proceed only after this boundary passes. PR58 remains a human-checkpoint implementation train and must:

- enforce `published` as the only allowed status
- enforce the field allowlist in code
- block denied fields and denied statuses in output validation
- avoid broad row serialization
- document request bounds before external release
- keep payment and commercial state out of API output
- keep MCP out of scope
- avoid sitemap, score, source-confidence, deploy, and server-config changes

## What This PR Does Not Do

PR57 does not implement or expose a public API endpoint. It does not create public API routes, change app runtime behavior, touch MCP, touch payment, install dependencies, deploy, change server config, or mutate the data repository.
