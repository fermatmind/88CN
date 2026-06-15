# 07 Runtime Guards

Runtime guards define required checks before browser QA, public indexing, and lifecycle transitions.

## Browser QA Guard

Codex Computer Use must run:

```bash
scripts/codex-preflight.sh
```

The script checks `APP_URL`, defaulting to `http://localhost:3000`, and requires `/api/healthz` to return HTTP 200.

If the check fails:

- do not open a browser
- do not refresh repeatedly
- do not edit implementation files
- write the failure to `docs/BUILD_ERRORS.md`

## Indexing Guard

Lifecycle state controls index behavior:

| State | Index Policy | Sitemap Policy |
| --- | --- | --- |
| `submitted` | noindex | excluded |
| `pending_review` | noindex | excluded |
| `approved` | preview only | excluded unless public state is reached |
| `published` | indexable | included |
| `claimed` | indexable | included |
| `owner_verified` | indexable | included |
| `archived` | noindex by default | excluded by default |

## Promotion Guard

Lifecycle promotion into a public state requires human approval.
