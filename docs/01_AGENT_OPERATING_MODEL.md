# 01 Agent Operating Model

## Role Split

88CN uses separate agent roles to reduce accidental release, fabricated data, and unsafe edits.

## Codex Computer Use

Codex Computer Use performs read-only QA and visual acceptance. It may write only QA reports, bug reports, build error notes, and QA screenshots.

It must run `scripts/codex-preflight.sh` before browser QA. If preflight fails, it records the failure and stops browser work.

## Implementation Agent

The implementation agent owns code, database, tests, queues, scoring, AI draft systems, and build configuration. It is responsible for fixing issues recorded during QA.

## Human Team

The human team owns production access, release approval, editorial approval, and public launch decisions. Codex may execute a final PR merge with `gh pr merge` when repo policy allows it, the PR is mergeable, required checks pass, and no human checkpoint is bypassed.

## Promotion Boundary

No model may automatically promote an item from review state to public state. Promotion requires a human decision.
