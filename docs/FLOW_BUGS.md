# Flow Bugs

PR #28 AI Search Readiness Checker QA found two P2 flow / public-surface issues. See `docs/40_AI_SEARCH_READINESS_CHECKER_QA.md` for the full report.

| Severity | Page | Viewport | Screenshot Path | Reproduction Steps | Observed Behavior | Expected Behavior | Suspected Component | Suggested Fix |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P2 | `/api/geo-checker` | API | `../screenshots/qa/pr28-live-geo-checker-result.png` | POST a URL containing embedded credentials to `/api/geo-checker`; locally also POST an IPv6 loopback URL sample. | Embedded-credential URL returns HTTP 502 Problem Details locally and live; IPv6 loopback returned HTTP 502 locally. | Guard-layer rejection should return HTTP 400 Problem Details before any fetch attempt. | `lib/geo-checker` SSRF guard / route validation ordering | Reject embedded credentials and IPv6 loopback hosts during URL validation before network fetch. |
| P2 | `/submit`, `/founders`, `/genesis` | Desktop | `../screenshots/qa/pr28-live-submit.png`; `../screenshots/qa/pr28-live-founders.png`; `../screenshots/qa/pr28-live-genesis.png` | Fetch public page HTML and scan for the PR #28 public-copy ban list. | One restricted link-promise term appears on all three pages. | Public pages should use approved 88CN language only. | Public page copy | Replace the restricted link-promise wording with an approved neutral phrase such as public project page or editorial listing. |
