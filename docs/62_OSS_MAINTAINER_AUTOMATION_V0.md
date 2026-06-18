# OSS Maintainer Automation v0

## Purpose

PR55 adds safe maintainer automation scaffolding for the open data workflow. V0 is local and maintainer-controlled.

The automation helps produce validation summaries, label suggestions, and maintainer checklists. It does not take external action by itself.

## Files

- `ops/oss/maintainer-automation-policy.json`
- `ops/oss/review-labels.json`
- `scripts/oss/check-maintainer-automation.mjs`

## Maintainer-Controlled Policy

The policy allows:

- local payload validation
- local check summaries
- label suggestions
- maintainer checklists

The policy disables:

- external PR comments
- external issue creation
- approval events
- merge events
- credential requests
- data repo writes
- payment events
- MCP surfaces
- external model calls

## Label Suggestions

The label map is suggestion-only. Labels are not applied automatically.

Suggested labels include:

- `needs-maintainer-review`
- `needs-source-check`
- `privacy-boundary-check`
- `duplicate-review`
- `ready-for-human-import-review`

## Human Review Boundary

Maintainers stay in control of:

- applying labels
- writing external comments
- accepting data changes
- importing records
- publishing reviewed content

## Checker

Run:

```bash
npm run oss-maintainer:check
```

The checker verifies:

- the policy is maintainer-controlled
- summary generation is local only
- label handling is suggestion-only
- approval and merge behavior are disabled
- external comments are disabled
- external model calls are disabled
- data repo writes are disabled
- no payment, MCP, deploy, or server behavior is introduced

## What This PR Does Not Do

- Does not mutate `/Users/rainie/Desktop/88cn-index-data`.
- Does not create or update GitHub labels.
- Does not comment on external pull requests or issues.
- Does not approve or merge external contributions.
- Does not call OpenAI, Anthropic, Gemini, or other model APIs.
- Does not require production credentials.
- Does not change GitHub repository secrets.
- Does not add dependencies.
- Does not expose Public API or MCP behavior.
- Does not deploy.
