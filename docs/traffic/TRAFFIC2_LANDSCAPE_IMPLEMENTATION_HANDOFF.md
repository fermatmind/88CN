# TRAFFIC2 Landscape Implementation Handoff

Result: GO_TRAFFIC2B

## Exact Next Task

TRAFFIC2B AI Project Landscape Landing Implementation v0.

Do not start TRAFFIC2B inside TRAFFIC2.

## Recommended TRAFFIC2B Allowed Paths

- `app/landscape/page.tsx`
- `components/landscape/**`
- `lib/landscape/**`
- `lib/seo/**`
- `app/sitemap.ts` only if sitemap inclusion is required
- `scripts/check-landscape-boundary.mjs`
- `docs/traffic/TRAFFIC2B_*.md`
- `docs/TASK_STATUS.md`
- `ops/tasks/current.json`
- `ops/tasks/roadmap.json`
- `package.json` only if checker script registration is required

## Recommended TRAFFIC2B Forbidden Paths

- `supabase/**`
- `deploy/**`
- `middleware.ts` unless required by route policy
- `package-lock.json` unless dependency explicitly allowed
- `.env*`
- `public/**`
- `gateway/**`
- `/Users/rainie/Desktop/88cn-index-data/**`
- API routes
- MCP routes
- payment routes
- customer routes

## Recommended TRAFFIC2B Validations

- `npm run verify:day0`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run agent:redact:check`
- `npm run agent:scope:check -- TRAFFIC2B`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run agent:gate`
- `node scripts/check-landscape-boundary.mjs`

## Recommended Checker Contract

`scripts/check-landscape-boundary.mjs` should verify:

- `/landscape` exists only in TRAFFIC2B or later implementation scope;
- `/tasks` routes are not introduced;
- `/zh-CN` routes are not introduced;
- no generated SEO pages are created;
- no public assets are required;
- project data comes only from reviewed/published public-safe sources;
- forbidden fields are not imported or rendered;
- public copy avoids restricted claim types;
- low-data state uses reviewed-sample wording;
- sitemap includes `/landscape` only when route is safe;
- Featured Signals do not affect sitemap, Public API ordering, MCP payloads, Signal Score, Source Confidence, organic route ordering, or editorial review.

## Required TRAFFIC2B Evidence

TRAFFIC2B should produce:

- route implementation summary;
- safe data source evidence;
- checker output;
- sitemap decision evidence;
- copy boundary evidence;
- build and gate evidence;
- confirmation no `/tasks`, `/zh-CN`, API, MCP, payment, customer, or data repo mutation occurred.
