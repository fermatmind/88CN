# REPORT0 TTL and Correction Policy v0

Status: validation passed  
Task: PR137 / REPORT0  
Result: GO_REPORT1_REPORT2_DEPENDENCY  
Date: 2026-06-20

## Decision

REPORT0 defines freshness, timestamp, correction, and safe wording rules for future readiness reports that may summarize reviewed scouted or audited records. It does not create a report generator, public report page, sitemap entry, distribution pack source, Public API field, MCP tool, crawler, audit worker, external submission, deployment, Supabase write, or companion data repo mutation.

Future REPORT1 and REPORT2 work may define report contracts only if they preserve this policy and remain within their own roadmap scope.

## Timestamp Rule

Every report finding must be framed as an observation at a specific time. Preferred wording:

- "At 2026-06-20, the local audit observed ..."
- "As of 2026-06-20, this field was not verified by the reviewed sources."
- "The latest reviewed local snapshot did not include ..."

Avoid timeless or permanent claims. Do not imply a project is permanently broken, unsafe, untrustworthy, inactive, abandoned, or low quality because a local snapshot failed or lacked data.

## TTL Model

| Artifact | Freshness label | Default TTL | Required handling after TTL |
| --- | --- | --- | --- |
| Source identity | `identity_snapshot` | 90 days | Mark stale until re-reviewed. |
| Audit result | `audit_snapshot` | 30 days | Do not use as current claim without re-audit. |
| Availability failure | `availability_snapshot` | 14 days | Treat as temporary unless repeated and reviewed. |
| Report summary | `report_snapshot` | 30 days | Display report date and source snapshot date. |
| Correction note | `correction_snapshot` | 180 days | Keep linked to the affected report row. |

TTL expiry must not delete the last successful snapshot. It changes freshness posture only.

## Correction and Claim Path

Future reports must define a human-owned correction path:

1. Founder or reviewer identifies an outdated or incorrect observation.
2. Reviewer records source URLs and timestamp.
3. Record is marked `needs_reaudit` or `correction_pending`.
4. A later local audit or manual review updates the local snapshot.
5. Report row receives an `updated_at`, `fixed_at`, or `correction_note` field as appropriate.

No correction path may auto-publish, auto-promote, auto-index, or mutate production public data without a later human-reviewed publishing task.

## Safe Negative Wording

Allowed wording:

- "Not verified in reviewed public sources."
- "Source unavailable during the local check."
- "No reviewed evidence in the local snapshot."
- "Needs re-audit before being described as current."
- "Founder not claimed."

Disallowed wording:

- permanent negative labels;
- defamatory or motive-based claims;
- certainty about private facts;
- unsupported quality judgments;
- commercial or financial inferences;
- claims that a project intentionally hides, misleads, fails, or violates rules without reviewed legal/editorial basis.

## Report Row Contract

Future report rows should include:

```json
{
  "report_version": "readiness_report_v0",
  "snapshot_date": "2026-06-20",
  "source_snapshot_date": "2026-06-20",
  "freshness_label": "audit_snapshot",
  "ttl_expires_at": "2026-07-20",
  "wording_mode": "timestamped_observation",
  "correction_status": "none",
  "public_surface_allowed": false
}
```

`public_surface_allowed` must remain false until a later report task explicitly authorizes publication and passes no-publish QA.

## Handoff

REPORT1 may define an aggregate readiness report contract. REPORT2 may define a Chinese outbound report contract. Both must keep timestamped wording, TTL, correction, safe negative wording, and no automatic publication.

Do not start REPORT1, REPORT2, SCOUT3, SCOUT4, AUDIT1, AUDIT2, SCOUTQ, second-round Growth, BETA1, I18N0, OPS8D, OPS10A, or PR101 from this PR.

## Validation

| Check | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run agent:train-plan:check -- --batch TRAIN-PR134-PR137-SCOUT-AUDIT-REPORT-BOUNDARIES` | PASS |
| `npm run agent:scope:check -- PR137` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
