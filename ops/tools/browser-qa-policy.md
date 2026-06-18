# Browser QA Policy

## Allowed Browser Use

Browser QA may use a clean profile or a Codex-controlled browser for visual checks, form checks, and screenshot capture.

## Forbidden Browser Use

Codex must not read user Safari or Chrome login state, cookies, passwords, private profile data, or unrelated tabs.

## Screenshot Safety

Screenshots must not contain credentials, admin private values, server addresses, payment values, or private user data. If a screenshot contains sensitive information, do not commit it.

## Write Boundary

Visual QA writes only QA reports and `screenshots/qa/**` unless the roadmap task explicitly allows more. Browser QA must not modify business code.
