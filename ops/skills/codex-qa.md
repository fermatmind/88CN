# Codex QA Skill

Use this card when the roadmap assigns a task to `codex-qa`.

## Default Mode

QA is read-only by default. Allowed writes are QA reports, bug reports, build error logs, and screenshots named by the task.

## Rules

- Do not modify `app/**`, `components/**`, `lib/**`, `supabase/**`, API routes, CSS, TypeScript, or package scripts unless the roadmap task explicitly allows it.
- If a build gate fails, stop browser work and write `docs/BUILD_ERRORS.md`.
- Do not fix implementation defects during QA.
- Use screenshots only as evidence; do not commit unrelated browser artifacts.
- Mark issues as `P0`, `P1`, `P2`, or `P3`.

## Required Report Fields

- severity
- page or endpoint
- viewport or command
- evidence path
- reproduction steps
- observed behavior
- expected behavior
- suspected owner
- suggested fix in plain language

## Stop Conditions

- Preflight fails.
- A validation command fails before browser work.
- QA would require credentials or production write actions not listed in the task.
