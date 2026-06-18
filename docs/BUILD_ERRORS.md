# Build Errors

No active build or policy errors after PR #30 README policy unblock.

| Date | Command | Error | Status |
| --- | --- | --- | --- |
| 2026-06-16 | Aliyun Workbench remote validation | Production validation/build commands could not be completed because Workbench repeatedly disconnected with WebSocket errors; local SSH to the server timed out during banner exchange. | BLOCKED |
| 2026-06-16 | PR #19 Cloud Assistant continuation | Cloud Assistant command editor did not reliably replace command content, leaving a partial script visible. The command was not executed to avoid unsafe server-side changes. | BLOCKED |
| 2026-06-16 | Local SSH retry | TCP connection to port 22 was established, but SSH timed out during banner exchange before authentication. | BLOCKED |
| 2026-06-18 | OPS-0 main repo `npm run verify:day0` / `npm run policy:scan` | Resolved by PR #30. Current `npm run verify:day0`, `npm run policy:scan`, `npm run third-party:check`, and `npm run build` pass after refresh. | RESOLVED |
