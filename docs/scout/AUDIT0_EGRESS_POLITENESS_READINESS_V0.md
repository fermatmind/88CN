# AUDIT0 Egress Politeness Readiness v0

Status: validation passed  
Task: PR136 / AUDIT0  
Result: GO_AUDIT1  
Date: 2026-06-20

## Decision

AUDIT0 defines the egress, politeness, and failure-handling boundary for future local audit dry runs. It does not create an audit worker, crawler, queue, script, package command, browser automation, database write, public route, sitemap change, Public API change, MCP tool, deployment, or companion data repo mutation.

Future AUDIT1/AUDIT2 work may proceed only if it inherits this boundary and remains within its own roadmap scope.

## Required Egress Defaults

| Control | Required default |
| --- | --- |
| Batch size | Small bounded batches only; PR139/PR141 must define exact limits before any dry run. |
| Concurrency | Maximum 3 concurrent requests unless a stricter task-level limit is chosen. |
| Request timeout | Maximum 8 seconds. |
| Retries | Maximum 3 attempts, including initial attempt, with backoff. |
| Cooldown | Per-host cooldown required between attempts. |
| User agent | Identify the request as a local readiness audit; no impersonation. |
| Robots-aware behavior | Respect disallow or unavailable robots signals conservatively. |
| Request type | Prefer HEAD or lightweight GET where appropriate. |
| Output | Local-only under `/tmp` unless a later task explicitly allows committed artifacts. |
| Production writes | Forbidden. |

## Failure Taxonomy

Future audit results must classify failures without zeroing out previous successful state:

| Failure | Meaning | Required handling |
| --- | --- | --- |
| `blocked_by_waf` | 403, 429, bot-protection interstitial, challenge page, or clear access-control block | Stop for that target; do not bypass. |
| `robots_disallowed` | Robots policy disallows the intended request | Stop for that target. |
| `timeout` | Request exceeds timeout | Retry within retry limit, then mark stale or unavailable. |
| `dns_error` | DNS lookup fails | Retry within limit, then mark unavailable. |
| `tls_error` | TLS handshake/certificate failure | Retry within limit, then mark unavailable. |
| `redirect_loop` | Redirect chain exceeds safe limit | Stop for that target. |
| `unsupported_content` | Non-HTML or unsuitable response for the audit | Record as unavailable for that audit dimension. |
| `source_unavailable` | Source cannot be reached without unsafe behavior | Keep last successful snapshot if one exists. |

## Hard No Rules

Future audit work must not:

- bypass WAF, access controls, CAPTCHA, forms, login, paywalls, robots restrictions, or rate limits;
- use proxy rotation, stealth headers, cookie/session export, credentialed browser sessions, or login automation;
- submit forms, create accounts, trigger emails, post comments, send messages, or write to external services;
- crawl broadly or recursively;
- run public-route-time recalculation;
- mutate Supabase, production data, companion data repo files, public JSON, sitemap, robots, Public API, MCP, or report registries;
- use failed scans to erase or downgrade previously reviewed successful snapshots.

## Result Contract

An audit attempt should eventually produce a local-only result object equivalent to:

```json
{
  "audit_version": "audit_egress_v0",
  "sandbox_id": "local-stable-id",
  "target_url": "https://example.com",
  "attempted_at": "2026-06-20T00:00:00Z",
  "status": "blocked_by_waf",
  "http_status": 403,
  "retries_used": 0,
  "duration_ms": 0,
  "external_write_performed": false,
  "public_surface_changed": false,
  "data_repo_mutated": false
}
```

## Stop Conditions

A future audit run must stop if it encounters:

- required check failure;
- forbidden path mutation;
- public surface exposure;
- private or contact-like data capture;
- copied restricted source text;
- external write;
- Supabase or data repo mutation;
- broad crawl behavior;
- repeated host failures that exceed the batch policy;
- any P0/P1 safety finding.

## Handoff

AUDIT1 may define batch audit eligibility and result boundaries. AUDIT2 may define a local dry-run contract if roadmap scope allows it.

Do not start AUDIT1, AUDIT2, SCOUT3, SCOUT4, REPORT0, REPORT1, REPORT2, SCOUTQ, second-round Growth, BETA1, I18N0, OPS8D, OPS10A, or PR101 from this PR.

## Validation

| Check | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run agent:train-plan:check -- --batch TRAIN-PR134-PR137-SCOUT-AUDIT-REPORT-BOUNDARIES` | PASS |
| `npm run agent:scope:check -- PR136` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
