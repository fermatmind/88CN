# Flow Bugs

No flow or API contract bugs found in the 2026-06-16 PR #16 API / Admin / Public Surface QA pass.

The PR #13 validation-ordering finding is verified fixed: invalid submit and claim payloads now return HTTP 400 before Supabase availability is checked.

| Severity | Page | Viewport | Screenshot Path | Reproduction Steps | Observed Behavior | Expected Behavior | Suspected Component | Suggested Fix |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
