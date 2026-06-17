# 88CN

88CN is an open structured signal index for AI projects.

It helps early AI builders, researchers, and future agent systems understand public AI projects through reviewed project profiles, machine-readability checks, public source links, and structured metadata.

88CN is not a generic AI tools directory, a paid machine-ranking system, an automated content farm, an investment platform, or a private-data collection product.

---

## Name and positioning

88CN is used as a compact infrastructure mark for the 88CN project.

The name does not imply a regional gate, financial product, search ranking promise, or commercial placement guarantee. In this repository, 88CN refers to the open project index, review workflow, and structured signal system used to describe public AI projects.

The meaning of the brand is built through code, reviewed data, public reports, and repeatable machine-readability checks.

---

## What 88CN does

88CN tracks public signals that make an AI project easier to verify, understand, and index:

- official website
- public documentation
- GitHub repository
- launch page
- project category
- technology stack
- machine-readable metadata
- founder-submitted corrections or claims
- admin review status

The first version of 88CN focuses on one practical problem:

> Many early AI projects launch with weak machine-readable structure. Their websites may lack clean HTML, canonical metadata, JSON-LD, sitemap visibility, or clear public source links.

88CN provides a structured workflow to detect, review, and improve those public project profiles.

---

## Current project status

88CN currently includes:

- Next.js App Router web application
- public project index pages
- submit and claim workflows
- admin review workflow
- public-surface hardening
- intake firewall and validation guards
- AI Search Readiness Checker
- external import integration for the open data repository
- production deployment on 88cn.com
- companion open data repository for public project metadata
- initial Seed 100 project corpus in the open data repository

The project is still in early alpha. Public data, project review rules, operational tooling, and machine-readability reports are being developed through small pull requests with strict review boundaries.

---

## Repository ecosystem

88CN is split into two repositories.

### Main web repository

`fermatmind/88CN`

This repository contains:

- the 88CN web application
- project pages
- submit and claim flows
- admin review screens
- API route contracts
- public-surface checks
- deployment and QA reports
- machine-readability tooling
- external import integration

### Open data repository

`fermatmind/88cn-index-data`

This repository contains public cold data for AI projects:

- project JSON files
- taxonomy
- schema validation
- privacy checks
- seed project manifest
- contribution rules

The open data repository does not contain private founder data, revenue data, API keys, analytics screenshots, payment data, or investor data.

---

## Data model and review policy

88CN separates public data from reviewed publication.

A project may pass through several states:

- submitted
- pending review
- quarantined
- scouted
- published
- founder claimed
- archived

Only reviewed public project profiles may be published.

Submitted, pending, quarantined, or unreviewed data must not be added to the public sitemap, public API, or future machine-readable agent payloads.

Runtime failures from imported public data, such as DNS failure, timeout, redirect loops, or unreachable websites, should be recorded as quarantine signals rather than silently promoted into public project records.

---

## Machine-readable profiles

88CN project profiles are designed to be clear for both humans and machines.

A published project profile may include:

- normalized project name
- canonical website URL
- project category
- public source links
- technology tags
- structured description
- public metadata checks
- review status

88CN does not promise search placement, traffic, third-party indexing outcomes, AI citations, or inclusion in any external system.

---

## AI Search Readiness Checker

The AI Search Readiness Checker inspects public website structure and reports basic machine-readability signals such as:

- title
- meta description
- canonical URL
- readable HTML
- JSON-LD presence
- schema type detection
- robots.txt availability
- sitemap.xml availability
- public source links

The checker does not call LLM APIs, does not use private website credentials, does not execute browser JavaScript, and does not store private data.

---

## Commercial boundary

88CN may later support human-visible featured placements for reviewed projects.

Any future featured placement must remain separate from the machine signal layer.

Featured placement must not change:

- project review status
- Signal Score
- Source Confidence
- sitemap inclusion
- public API ordering
- future MCP payloads
- organic ordering
- editorial review result

Paid visibility, if enabled, is a user-interface placement only.

---

## What 88CN is not

88CN is not:

- an AI tools directory clone
- a link-selling marketplace
- a search-placement service
- an automated pSEO content farm
- an investment product
- a fundraising platform
- a token project
- a private-data broker
- a promise of traffic, ranking, AI citation, or external discovery outcomes

---

## Local development

Install dependencies:

```bash
npm install
```

Run local checks:

```bash
npm run verify:day0
npm run policy:scan
npm run third-party:check
npm run db:schema:check
npm run public-surface:check
npm run intake:check
npm run external-import:check
npm run geo-checker:check
npm run lint
npm run typecheck
npm run build
```

Start the development server:

```bash
npm run dev
```

---

## Current execution focus

The current near-term roadmap is:

1. validate that the Seed 100 open data corpus can be consumed safely by the web application
2. ensure seed projects do not auto-publish or leak into the sitemap
3. quarantine runtime failures such as unreachable websites, DNS failures, timeouts, or redirect loops
4. run a machine-readability audit over the seed corpus
5. publish the first data-backed founder intent signal report
6. connect the report to the AI Search Readiness Checker, submit flow, and claim flow

The near-term goal is to produce a public, data-backed report that helps early AI founders understand how machine-readable their project websites are.

---

## Contribution policy

Contributions should be narrow, reviewable, and aligned with the project boundary.

For project data contributions, use the companion data repository:

```text
fermatmind/88cn-index-data
```

For application code changes, keep pull requests small and scoped.

Do not submit:

- private founder data
- emails or phone numbers
- API keys
- revenue or payment data
- analytics screenshots
- investment claims
- traffic promises
- copied descriptions from third-party directories

---

## Security and privacy

Do not commit secrets.

Do not commit:

- `.env.local`
- `.env.production`
- API keys
- SSH keys
- Supabase service role keys
- Stripe secrets
- OpenAI or Anthropic keys
- server IPs
- SSL certificates
- temporary GitHub archive URLs

Security-sensitive findings should be reported privately to the maintainer.

---

## Maintainer

88CN is currently maintained by FermatMind as a solo-founder, AI-native infrastructure project.

The project is built through small, auditable pull requests with strict separation between build tasks, QA tasks, public data, admin review, deployment operations, and future commercial surfaces.
