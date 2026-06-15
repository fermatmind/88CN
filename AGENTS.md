# 88CN Agent Constitution

88CN is the Free AI Project Growth Index. Phase 1 is a public growth-signal index, founder claim system, editorial discovery layer, and data foundation for later Growth / Backer / Capital products.

This repository starts as a policy-first project. Do not create an app framework, install dependencies, add production config, or create secret files during Day 0 bootstrap.

## Agent Roles

### Codex Computer Use

Codex Computer Use is the read-only QA and visual acceptance agent.

Allowed writes:

- `docs/QA_REPORT.md`
- `docs/VISUAL_BUGS.md`
- `docs/FLOW_BUGS.md`
- `docs/BUILD_ERRORS.md`
- `screenshots/qa/**`

Forbidden writes:

- `.tsx`
- `.ts`
- `.css`
- `.sql`
- `package.json`
- schemas
- migrations
- API routes

Codex Computer Use must run `scripts/codex-preflight.sh` before opening a browser. If preflight fails, Codex must not open the browser, refresh blindly, or edit code. It may only record the failure.

### OpenCode / DeepSeek

OpenCode / DeepSeek is the only code implementation agent.

It owns:

- app code
- components
- libraries
- Supabase work
- scripts
- schemas
- tests
- GitHub workflow files
- `package.json`
- Next.js configuration
- database migrations
- API routes
- scoring systems
- queue systems
- AI editorial pipelines

It must fix issues recorded by Codex instead of asking Codex to change implementation files.

### Human Team

The human team owns production secrets, DNS, Vercel, Supabase, GitHub tokens, final merges, project release, Editorial Note approval, and production launch.

No model may automatically move a project from `pending_review` to `published`.

## Public Language Ban

Phase 1 public UI, metadata, page copy, seed data, and marketing pages must not contain or imply:

- dofollow backlink
- 301 permanent backlink
- SEO juice
- guaranteed ranking
- invest now
- guaranteed return
- guaranteed yield
- guaranteed profit
- principal protection
- 保本
- 稳赚
- 固定收益
- 回购保障
- SPV
- fund
- AI fund
- equity
- token
- ICO
- IDO
- securities
- buy equity
- deposit funds
- real-money commitment

Allowed alternatives:

- Free AI project profile
- Public project page
- Editorial listing
- Search-indexed profile
- Founder claim
- Public growth signals
- Signal Score
- Watchlist
- Backer interest
- Capital signal
- Growth readiness
- Subscribe to updates
- Express interest
- Join waitlist

## Lifecycle States

- `submitted`
- `pending_review`
- `approved`
- `published`
- `claimed`
- `owner_verified`
- `archived`

Indexing policy:

- `submitted`: noindex, no sitemap
- `pending_review`: noindex, no sitemap
- `approved`: previewable, no sitemap unless later published
- `published`: indexable, included in sitemap
- `claimed`: indexable, included in sitemap
- `owner_verified`: indexable, included in sitemap
- `archived`: noindex by default unless a human approves historical archive indexing

## Data Integrity

Never fabricate investor count, Backer count, Watchlist count, intended amount, revenue, MRR, ARR, users, retention, ROAS, CAC, LTV, GitHub stars, Product Hunt votes, Hacker News points, traffic, customer logos, testimonials, partnerships, or verification status.

Unknown data must display one of:

- Not verified
- Public signals only
- Not enough data
- Founder not claimed
- Source unavailable

## Competitor Boundary

Do not pixel-copy competitor UI, copy competitor project descriptions, reuse competitor screenshots, reuse competitor logos, use competitor databases as production content sources, or disguise competitor descriptions as 88CN editorial content.

Allowed work:

- internal information architecture analysis
- official project websites
- public GitHub profiles
- official docs
- official launch pages
- founder-submitted information
- original 88CN Editorial Notes
- original Signal Score model

## Dual Repository Boundary

Future repositories:

- `88cn-web`
- `88cn-index-data`

Public repositories may collect public information only. Public JSON may contain project name, official site, category slug, one-line description, public GitHub, public docs, public pricing, public launch URL, and public founder social links.

Public repositories must not collect emails, revenue screenshots, Stripe screenshots, API keys, analytics, bank data, investor identity files, customer lists, or login credentials.

External JSON must not write directly to the `projects` table. It must first enter `external_project_imports` staging, then wait for Admin review.

## Batch Pipeline

Never scan the full database in one cron run.

External scans must be queued and sharded:

- default maximum 20 jobs per run
- maximum concurrency 3
- request timeout 8 seconds
- maximum retries 3
- failed scans must not zero out scores
- keep the last successful snapshot
- mark the source as stale

## AI Editorial Pipeline

AI may generate drafts only. AI editorial drafts must not publish directly. Public Editorial Notes require human review.

AI must not invent revenue, users, financing, customers, investor interest, retention, ROAS, MRR, rankings, customer logos, or partnerships.

## Signal Score

Signal Score must be explainable.

Allowed dimensions:

- Product Readiness
- Dev Momentum
- Market Presence
- Commercial Readiness
- SEO Foundation
- Trust Confidence

Forbidden inputs:

- fake backer interest
- unverified revenue
- unauthorized private data
- competitor ranking
- paid sponsorship as hidden score boost

Paid exposure and Signal Score must remain separate.
