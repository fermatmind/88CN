# TRAFFIC5Q Alternatives Expansion QA v0

Status: validation passed

PR wrapper: PR127

Result: PASS

## Scope

TRAFFIC5Q verifies the PR126 alternatives expansion. This QA task is documentation and status only. It does not modify alternatives runtime code, route generation, sitemap logic, registry data, checker scripts, package metadata, app routes, API routes, deploy config, or the data repository.

## QA Verdict

PASS. PR126 added exactly one PR125-approved canonical pair and kept alternatives route generation finite.

Verified outcomes:

- published curated alternatives count is 4;
- new canonical path `/alternatives/aurora-code-vs-vectorbase` is generated;
- reverse duplicate `/alternatives/vectorbase-vs-aurora-code` is not registered and is absent from sitemap output;
- `scripts/check-alternatives-canonical.mjs` passes with 4 published routes;
- sitemap artifact contains exactly 4 alternatives URLs;
- `/zh-CN` and `/landscape/sectors` remain absent from sitemap output;
- no data repo mutation occurred.

## Evidence

### Canonical Checker

Command:

```sh
node scripts/check-alternatives-canonical.mjs
```

Result:

```text
alternatives-canonical:check passed (4 published routes)
```

### Registry Probe

Published alternatives slugs:

```text
aurora-code-vs-nucleus-ml
nucleus-ml-vs-vectorbase
complykit-vs-pulse-analytics
aurora-code-vs-vectorbase
```

Reverse registration probe:

```text
vectorbase-vs-aurora-code: absent
```

### Build Artifact Probe

Generated alternatives HTML files:

```text
.next/server/app/alternatives/aurora-code-vs-nucleus-ml.html
.next/server/app/alternatives/aurora-code-vs-vectorbase.html
.next/server/app/alternatives/complykit-vs-pulse-analytics.html
.next/server/app/alternatives/nucleus-ml-vs-vectorbase.html
```

### Sitemap Artifact Probe

Alternatives URLs in `.next/server/app/sitemap.xml.body`:

```text
/alternatives/aurora-code-vs-nucleus-ml
/alternatives/nucleus-ml-vs-vectorbase
/alternatives/complykit-vs-pulse-analytics
/alternatives/aurora-code-vs-vectorbase
```

Negative sitemap probes:

```text
/alternatives/vectorbase-vs-aurora-code: absent
/zh-CN: absent
/landscape/sectors: absent
```

## Validation Commands

- `node scripts/check-alternatives-canonical.mjs`
- `npm run verify:day0`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run agent:redact:check`
- `npm run agent:scope:check -- PR127`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run agent:gate`

## Findings

- P0: none
- P1: none
- P2: none
- P3: no new PR127 sidecar

## Next

Proceed to PR128 / TRAFFIC6A Report Distribution Pack Boundary v0. Do not add more alternatives pairs in PR127 cleanup.
