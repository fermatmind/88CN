# Codex Build Skill

Use this card when the roadmap assigns a task to `codex-build`.

## Rules

- Implement only the assigned roadmap task.
- Read `ops/tasks/roadmap.json` and confirm allowed paths before editing.
- Do not expand scope into adjacent product work.
- Do not merge the pull request unless the human team explicitly approves this exact PR merge and repo merge gates pass.
- Do not deploy unless the task explicitly grants deployment scope.
- Run all validations listed for the roadmap task.
- Create a draft PR with a scoped title and complete summary.

## Required Loop

1. Sync `main` with `origin/main`.
2. Create the task branch.
3. Read the relevant contracts under `ops/contracts/`.
4. Edit only allowed paths.
5. Run `npm run agent:scope:check -- <TASK_ID>`.
6. Run `npm run agent:redact:check`.
7. Run task validations.
8. Commit, push, and open a draft PR.

## Stop Conditions

- Required validation fails and cannot be fixed inside the assigned scope.
- A needed path is outside the roadmap allowlist.
- Product secrets, server addresses, or credential-bearing URLs appear in changed files.
- The task requires human-owned production secrets or account access.
