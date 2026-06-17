# Flow Bugs

PR #28 AI Search Readiness Checker QA found two P2 flow / public-surface issues. Both are remediated in the PR #27 branch and need live redeploy verification after merge. See `docs/40_AI_SEARCH_READINESS_CHECKER_QA.md` for the full report.

| Severity | Page | Viewport | Screenshot Path | Reproduction Steps | Observed Behavior | Expected Behavior | Suspected Component | Suggested Fix |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P2 | `/api/geo-checker` | API | `../screenshots/qa/pr28-live-geo-checker-result.png` | POST a URL containing embedded credentials to `/api/geo-checker`; locally also POST an IPv6 loopback URL sample. | Original deployed snapshot returned HTTP 502 Problem Details for these samples. PR #27 branch now returns HTTP 400 Problem Details locally. | Guard-layer rejection should return HTTP 400 Problem Details before any fetch attempt. | `lib/geo-checker` SSRF guard / route validation ordering | Fixed in PR #27 branch; redeploy and rerun live smoke after merge. |
| P2 | `/submit`, `/founders`, `/genesis` | Desktop | `../screenshots/qa/pr28-live-submit.png`; `../screenshots/qa/pr28-live-founders.png`; `../screenshots/qa/pr28-live-genesis.png` | Fetch public page HTML and scan for the PR #28 public-copy ban list. | Original deployed snapshot contained one restricted link-promise term on all three pages. PR #27 branch removes it from public UI files. | Public pages should use approved 88CN language only. | Public page copy | Fixed in PR #27 branch; redeploy and rerun live public-copy scan after merge. |
