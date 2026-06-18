# QA Report

## Latest Run

- Date: 2026-06-18
- Scope: PR39 Brand Voice and Public Copy Guard QA
- Role: Codex-QA / governance verification
- Result: PASS
- Blocked: No

## Summary

- PR38 added machine-readable brand voice rules in `ops/copy/brand-voice-rules.json`.
- PR38 added `npm run brand-voice:check`.
- PR39 verified the checker with positive and negative synthetic probes.
- PR39 verified the checker scans public source roots without modifying app code.
- No browser QA was required because this is a governance-script QA task with no public UI changes.
- No screenshots were captured.

## Probe Coverage

The exact synthetic probe text remains in the allowlisted policy-source file `ops/copy/brand-voice-rules.json`. This QA report records probe classes instead of copying risky public-copy phrases into a non-policy report file.

| Probe Class | Expected | Observed |
| --- | --- | --- |
| Factual public signal wording | PASS | PASS |
| Non-promise checker disclaimer | PASS | PASS |
| Badge limitation disclaimer | PASS | PASS |
| Outcome-limitation disclaimer | PASS | PASS |
| `ranking_promise` negative probe | FAIL CLOSED | PASS |
| `traffic_promise` negative probe | FAIL CLOSED | PASS |
| `ai_citation_promise` negative probe | FAIL CLOSED | PASS |
| `link_exchange_claim` negative probe | FAIL CLOSED | PASS |
| `generic_outcome_promise` rule | FAIL CLOSED when used as a positive claim | PASS |

## Source Scan

| Check | Result |
| --- | --- |
| Restricted claim groups loaded | PASS, 5 groups |
| Public source files scanned | PASS, 72 files |
| Positive probes | PASS, 4 probes |
| Negative probes | PASS, 5 probes fail closed |
| App code modified by PR39 | PASS, none |
| PR39 scope gate | PASS |

## Validation Commands

| Command | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run brand-voice:check` | PASS |
| `npm run agent:scope:check -- PR39` | PASS |

## Findings

- P0: none
- P1: none
- P2: none
- P3: none

## Recommendation

PR39 is complete. PR40 Genesis Badge Founder Explainer v1 can proceed after this QA PR is merged.
