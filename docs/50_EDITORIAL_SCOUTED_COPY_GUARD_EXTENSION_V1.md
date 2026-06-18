# Editorial + Scouted Public Copy Guard Extension v1

## Summary

PR43 extends the PR38 brand voice and public copy guard. It does not rebuild the base guard and does not change product copy.

## Extension Surfaces

The guard now explicitly covers:

- editorial draft notes and review comments
- scouted profile copy
- conversion CTA copy
- claim, correct, and remove request copy

## Guard Behavior

The extension checks that these surfaces stay factual, source-grounded, and non-promissory. It blocks restricted link-exchange wording, placement promises, traffic promises, ranking promises, and citation promises through negative probes.

Positive probes model acceptable language for public signals, founder claims, admin review, and correction/removal requests.

## Relationship To PR38

PR38 remains the base brand voice and public copy guard. PR43 adds surface coverage and additional probes for upcoming editorial and scouted profile work.

## Validation

- `npm run brand-voice:check`
- `npm run editorial-copy:check`

## Definition of Done

- Guard blocks restricted link, return, placement, and citation promise wording.
- Guard explicitly covers editorial, scouted, claim, correct, and remove surfaces.
- Negative probes fail closed.
- Task extends PR38 instead of rebuilding the base guard.
- Product copy is not modified in this task.
- PR44 can proceed.
