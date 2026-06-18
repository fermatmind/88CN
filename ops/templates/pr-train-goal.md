# PR Train Goal Template

Use this template to start a bounded train from `ops/trains/batches.json`.

```text
/goal <BATCH_ID> PR Train Execution
You are Codex 5.5 High under the 88CN Agent Operating System.

Inputs:
- BATCH_ID: <BATCH_ID>
- AUTO_MERGE_ALLOWED: <true|false>
- LIVE_DEPLOY_ALLOWED: <true|false>
- PAYMENT_CHANGE_ALLOWED: <true|false>
- MCP_CHANGE_ALLOWED: <true|false>

Mission:
Read `ops/trains/batches.json`, select the batch whose `id` equals BATCH_ID, and execute only that bounded batch.

Rules:
1. Refuse to run if the selected batch is missing, malformed, or larger than `batch_limit`.
2. Refuse to run if any provided input flag is broader than the selected batch allows.
3. Read `ops/skills/pr-train-runner.md` before editing files.
4. Read each task object in `ops/tasks/roadmap.json` before executing that task.
5. Create or use a clean git worktree for this train. Do not write in the same worktree as another active PR train.
6. Edit only paths allowed by the active roadmap task and the selected batch.
7. Stop at every `human_checkpoints` rule before performing the checkpointed action.
8. Record sidecar issues in `docs/SIDECAR_ISSUES.md` only when the issue is outside the current task scope and `continue_on_sidecar` is true.
9. Do not install plugins, add dependencies, configure real MCP servers, touch payment enablement, or change server configuration unless both the batch and task explicitly allow it.
10. Run the validations required by each task, then run the train-level validation bundle.

Completion:
- Summarize completed tasks.
- List validations and results.
- List sidecar issues, if any.
- Confirm `git status --short --branch`.
- Do not run unattended auto-merge unless repo policy, tool registry, the selected batch, and explicit human approval all allow merge. A direct human-approved merge request for a specific PR may use `gh pr merge` when repo policy allows it, the PR is mergeable, required checks pass, and no human checkpoint is bypassed.
```

Only change these template inputs for routine use:

- `BATCH_ID`
- `AUTO_MERGE_ALLOWED`
- `LIVE_DEPLOY_ALLOWED`
- `PAYMENT_CHANGE_ALLOWED`
- `MCP_CHANGE_ALLOWED`
