# PR85 Data Cleansing Rules + Freshness Model v0

## Result

Validation target: PR85 defines data cleansing and freshness model rules only.

This task does not implement a runtime feed, endpoint, DB migration, customer output, external write, or data repository mutation.

## Contract

Machine-readable contract:

- `ops/contracts/data-cleansing-freshness.json`

The contract defines duplicate slug policy, canonical URL policy, freshness policy, archive and source failure handling, source conflict handling, and the public-safe Source Confidence boundary.

## Dedupe Policy

| Case | Rule | Snapshot action |
| --- | --- | --- |
| Duplicate slugs | Fail closed | Exclude conflicting records until reviewed |
| Duplicate canonical URLs | Review required | Do not choose a winner automatically |
| Source conflict | Prefer reviewed local record | Use unknown when conflict is unresolved |

## Canonicalization

Slug rules:

- lowercase only;
- hyphen-separated;
- pattern `^[a-z0-9]+(?:-[a-z0-9]+)*$`;
- invalid slugs are excluded until reviewed.

URL rules:

- prefer reviewed HTTPS canonical URLs;
- remove trailing slash except origin root;
- remove tracking query parameters;
- remove fragments;
- lowercase host;
- malformed URLs are excluded until corrected.

Tracking query parameters denied by default:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`
- `gclid`
- `fbclid`
- `mc_cid`
- `mc_eid`

## Freshness Model

| State | Rule | Public label |
| --- | --- | --- |
| Fresh | Reviewed within 90 days | recently reviewed |
| Watch | Reviewed within 180 days | review aging |
| Stale | Older than 180 days | stale review |
| Unknown | Review date unavailable | review date unavailable |

Stale records may remain snapshot candidates only when the lifecycle is still `published` and required public fields remain safe. Unknown review dates require all required public fields to pass validation.

## Source Failure Handling

| Source state | Rule |
| --- | --- |
| Redirect chain | Maximum 5 hops; cross-origin redirects require review |
| DNS failure | Mark source stale; keep last reviewed public fields if still published |
| 404 | Mark unavailable and require review before future inclusion |
| 410 | Treat as removed source and require review before future inclusion |
| 5xx | Treat as temporary source failure; keep last reviewed public fields if still published |
| Malformed URL | Exclude affected source link until corrected |

Failures must not zero out public scores or invent replacement facts.

## Lifecycle Handling

| Lifecycle condition | Snapshot action |
| --- | --- |
| Archived project | Exclude by default |
| Renamed project | Emit reviewed canonical slug only after redirect or alias review |
| Merged project | Emit surviving reviewed public record only |
| Removed project | Exclude from future snapshots |

## Source Confidence Boundary

Public-safe labels:

- `public_signals`
- `source_unavailable`
- `not_enough_data`

Denied internals:

- Source Confidence inputs;
- hidden score weights;
- reviewer notes;
- raw evidence payloads;
- Signal Score internals.

Public labels may be emitted only when already reviewed for public display. Internal inputs stay private.

## Checker Scope Note

PR85 roadmap allows only `docs/PR85_*.md`, `ops/contracts/data-cleansing-freshness.json`, task metadata, and status/sidecar docs. It does not allow `scripts/**` or `package.json`, so PR85 does not add a dedicated checker script. PR86 QA must validate this contract in its allowed QA scope.

## Definition Of Done

| Requirement | Status | Evidence |
| --- | --- | --- |
| Cleansing rules exist | PASS | `ops/contracts/data-cleansing-freshness.json` |
| Duplicate detection policy | PASS | Dedupe policy section |
| Canonical URL policy | PASS | Canonicalization section |
| Freshness policy | PASS | Freshness model section |
| Archived stale handling | PASS | Lifecycle and source failure handling |
| Private fields denied | PASS | Contract denied fields and Source Confidence boundary |

## Validation Plan

Required PR85 validations:

- `npm run verify:day0`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run agent:scope:check -- PR85`

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

PR86 QA may proceed after PR85 is merged, local `main` is synced to `origin/main`, the worktree is clean, and post-merge validation passes.
