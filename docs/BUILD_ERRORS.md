# Build Errors

No build or preflight errors recorded yet.

| Date | Command | Error | Status |
| --- | --- | --- | --- |
| 2026-06-16 | Aliyun Workbench remote validation | Production validation/build commands could not be completed because Workbench repeatedly disconnected with WebSocket errors; local SSH to the server timed out during banner exchange. | BLOCKED |
| 2026-06-16 | PR #19 Cloud Assistant continuation | Cloud Assistant command editor did not reliably replace command content, leaving a partial script visible. The command was not executed to avoid unsafe server-side changes. | BLOCKED |
| 2026-06-16 | Local SSH retry | TCP connection to port 22 was established, but SSH timed out during banner exchange before authentication. | BLOCKED |
| 2026-06-18 | OPS-0 main repo `npm run verify:day0` / `npm run policy:scan` | Current `origin/main` fails policy scan because `README.md:190` contains a restricted public-copy term. Other main repo checks, including build, passed when run independently. | PARTIAL |
