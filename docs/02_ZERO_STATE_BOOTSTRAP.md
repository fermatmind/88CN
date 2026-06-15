# 02 Zero State Bootstrap

This repository starts with policy documents and local verification scripts only.

## Day 0 Allowed Work

- create the agent constitution
- create the risk document wall
- create local policy scans
- create local health preflight script
- create QA output placeholders

## Day 0 Disallowed Work

- application framework scaffolding
- dependency installation
- production configuration
- secret file creation
- external network calls for setup
- database schema creation
- deployment setup

## Verification

Run:

```bash
npm run verify:day0
```

The Day 0 verification passes only when required files exist and the policy scan finds no unsafe public wording outside approved policy documents.
