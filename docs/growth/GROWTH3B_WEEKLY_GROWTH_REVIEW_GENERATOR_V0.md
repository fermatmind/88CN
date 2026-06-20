# GROWTH3B Weekly Growth Review Generator v0

Date: 2026-06-20
Role: Codex-Research
Result: PASS_LOCAL_REVIEW_CONTRACT_ONLY
Next task: GROWTH3Q Weekly Growth Review QA v0

## Scope

GROWTH3B defines the local-only weekly growth review packet that a future
generator may emit. The current roadmap scope forbids `scripts/**`, runtime
code, package metadata, public assets, routes, Supabase, deployment files, and
data-repo writes, so this task documents the generator contract instead of
adding executable generator code.

The review packet is local-only and redacted. It does not connect live
analytics, call external dashboards, import CRM data, read private server logs,
collect user data, write Supabase, mutate `/Users/rainie/Desktop/88cn-index-data`,
or deploy.

## Input Contract

A compliant local review packet may use only:

- merged PR number, title, URL, merge SHA, and task alias;
- committed task status rows;
- committed docs-only QA findings;
- local checker result names and pass/fail status;
- local build route inventory summaries;
- manually supplied aggregate notes clearly labeled as manual;
- redacted follow-up items that contain no private user, customer, contact,
  billing, analytics, or server-log fields.

It must not connect to Google Search Console, Cloudflare analytics, Vercel
analytics, Ahrefs, social dashboards, ad platforms, newsletter tools, CRM
systems, payment systems, Supabase production data, or private server logs.

## Output Contract

A compliant weekly review packet contains only:

- `manifest.json`, with task id, date range, source PRs, and safety flags;
- `README.md`, explaining the packet is local and redacted;
- `weekly-review.md`, with narrative summary and follow-up recommendations;
- `merged-prs.json`, with PR titles, URLs, task aliases, and merge SHAs;
- `validation-matrix.json`, with local command names and result summaries;
- `manual-aggregate-notes.md`, with explicitly human-supplied notes;
- `redaction-checklist.md`;
- `no-external-action-checklist.md`.

No output file may be committed by default. If a future executable generator is
approved, it must write under `/tmp` or another ignored local path by default.

## Manifest Template

```json
{
  "task": "GROWTH3B",
  "mode": "local_review_only",
  "dateRange": "manual-human-supplied",
  "sourcePrs": [
    {
      "number": 162,
      "title": "GROWTH3A: Weekly Growth Review Boundary v0",
      "task": "GROWTH3A",
      "mergeSha": "6f0c677adb8b2776158bae1b024e33e2dd8f6ce1"
    }
  ],
  "safetyFlags": {
    "liveAnalyticsConnection": false,
    "externalServiceWrite": false,
    "platformLogin": false,
    "crmImport": false,
    "emailSend": false,
    "dmSend": false,
    "socialPost": false,
    "piiIncluded": false,
    "browserSessionExport": false,
    "supabaseWrite": false,
    "dataRepoMutation": false,
    "deploy": false
  }
}
```

## Weekly Review Template

```text
# Weekly Growth Review - {date_range}

Draft only - local review required.

## Merged Work

- {task_alias}: {pr_title} ({pr_url}) at {merge_sha}

## Local Validation

- {command}: {result}

## Manual Aggregate Notes

These notes were supplied by a human reviewer. Do not infer live analytics,
traffic, conversion, customer, or search visibility metrics from them.

## Redacted Follow-Ups

- {follow_up_owner_or_role}: {redacted_follow_up}

## Negative Confirmations

- No live analytics connection.
- No external service write.
- No platform login.
- No CRM import.
- No PII included.
- No data repo mutation.
- No deploy.
```

## Redaction Checklist

Before a human uses the review packet:

- remove private contacts, customer names, billing data, and support details;
- remove raw analytics, server logs, request traces, IP addresses, and
  credentials;
- confirm manually supplied aggregates are labeled as manual;
- remove unsupported trend, traffic, ranking, adoption, or customer claims;
- confirm no command asks Codex to log in, send, post, deploy, or call external
  APIs.

## Negative Boundary Probes

GROWTH3Q should verify that this artifact does not introduce:

- executable weekly review generator code;
- analytics API clients or dashboard connectors;
- CRM import logic;
- private server log parsing;
- unredacted user/customer/contact fields;
- committed generated weekly packets;
- route, sitemap, app, API, MCP, Supabase, package, script, deploy, or public
  asset changes;
- data-repo mutation;
- live email, DM, social, GitHub issue/comment, or external platform action.

## Validation Evidence

GROWTH3B must pass:

- `npm run verify:day0`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run agent:redact:check`
- `npm run agent:scope:check -- GROWTH3B`
- `npm run agent:batch:check`
- `node scripts/agent/train-plan-check.mjs --batch TRAIN-GROWTH3-WEEKLY-REVIEW-QA`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run agent:gate`
- direct landscape, sector-density, task-discovery, alternatives, and report
  distribution dry-run checks

The GROWTH3A boundary has been merged on `origin/main` at
`6f0c677adb8b2776158bae1b024e33e2dd8f6ce1`.

## What This PR Does Not Do

This PR does not add executable generator code, generate weekly review packets,
connect analytics, import CRM data, read private server logs, collect user data,
call external dashboards, send email, send DMs, post externally, log in to
platforms, write Supabase, change app/runtime code, change sitemap behavior,
deploy, mutate the data repo, start GROWTH3Q, start GROWTH4Q, start GROWTHQ,
start BETA1, start I18N0, start OPS8D, start OPS10A, or start PR101.
