# QA Report

## Latest Run

- Date: 2026-06-19
- Scope: PR77 GitHub Profile Mirror QA
- Role: Codex-QA
- Result: PASS
- Blocked: No

## Summary

- PR77 verifies the PR75 mirror spec and PR76 local-only generator boundary.
- The generator dry-run produced 6 markdown files under `/tmp/88cn-github-profile-mirror-pr77`.
- Generator output reported `externalWrite: false` and `dataRepoMutation: false`.
- Negative probes confirmed repo output paths and remote sources are rejected with non-zero exits.
- No generated mirror markdown was committed, and `/Users/rainie/Desktop/88cn-index-data` remained clean.
- No external indexing call, Public API exposure, MCP exposure, payment behavior, deploy step, dependency change, screenshot write, external repository write, GitHub Pages deploy, or data repo mutation was introduced.

## GitHub Profile Mirror Evidence

| Check | Result |
| --- | --- |
| PR75 mirror spec exists and defines reviewed-public source boundary | PASS |
| PR76 generator exists after merge on `main` | PASS |
| Local dry-run with `--dry-run --source local --out /tmp/88cn-github-profile-mirror-pr77 --no-write-external` generated 6 markdown files | PASS |
| Output path under repo was rejected | PASS |
| Remote source was rejected | PASS |
| Generated markdown did not include email, `sourceConfidence`, `signalScore`, external write fields, or data mutation fields | PASS |
| Generated markdown used public-signal labels and approved unknown labels | PASS |
| Data repository remained clean | PASS |

## Alternatives Page Evidence

| Check | Result |
| --- | --- |
| `/alternatives/[slug]` uses `generateStaticParams()` from the finite canonical registry | PASS |
| Unknown or ineligible alternatives slugs call `notFound()` | PASS |
| Registry includes exactly three published, sitemap-eligible canonical routes | PASS |
| Alternatives projects resolve only from local `status: "published"` records | PASS |
| Sitemap uses `getPublishedCuratedAlternatives()` for alternatives entries | PASS |
| Reversed slugs are absent from the registry, static params, and sitemap helper output | PASS |

## Vertical Page Evidence

| Check | Result |
| --- | --- |
| `/verticals/[slug]` uses `generateStaticParams()` from the finite registry | PASS |
| Unknown or ineligible vertical slugs call `notFound()` | PASS |
| Registry includes exactly three published, sitemap-eligible vertical grids | PASS |
| Vertical grid projects resolve only from local `status: "published"` records | PASS |
| Sitemap uses `getPublishedVerticalAssetGrids()` for vertical entries | PASS |
| Source grep found no `scribe-ai` or claimed-record inclusion in vertical routes, registry helper, or sitemap | PASS |

## Collection Page Evidence

| Check | Result |
| --- | --- |
| `/collections/[slug]` uses `generateStaticParams()` from the finite registry | PASS |
| Unknown or ineligible collection slugs call `notFound()` | PASS |
| Registry includes exactly three published, sitemap-eligible collections | PASS |
| Collection projects resolve only from local `status: "published"` records | PASS |
| Sitemap uses `getPublishedCuratedCollections()` for collection entries | PASS |
| Collection route and sitemap no longer use `demoCollections` for collection routing | PASS |

## Screenshots

None. PR77 forbids `screenshots/**`, so QA used source inspection, generator output inspection, command output, and repository state checks.

## Validation Commands

| Command | Result |
| --- | --- |
| `node scripts/generate-github-profile-mirror.mjs --dry-run --source local --out /tmp/88cn-github-profile-mirror-pr77 --no-write-external` | PASS |
| `node scripts/generate-github-profile-mirror.mjs --dry-run --source local --out /Users/rainie/Desktop/88CN/generated/github-profile-mirror --no-write-external` | PASS, rejected with non-zero exit |
| `node scripts/generate-github-profile-mirror.mjs --dry-run --source remote --out /tmp/88cn-github-profile-mirror-pr77 --no-write-external` | PASS, rejected with non-zero exit |
| `npm run agent:scope:check -- PR77` | PASS |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |

## Findings

- P0: none
- P1: none
- P2: none
- P3: none

## Recommendation

PR77 can merge after full gate passes. TRAIN-PR75-PR77 can close after PR77 post-merge cleanup and final train validation. Do not start PR78 from this train.
