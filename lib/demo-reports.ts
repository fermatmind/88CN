export interface DemoReport {
  slug: string;
  title: string;
  date: string;
  executiveSummary: string;
  methodology: string;
  topMovers: { name: string; description: string }[];
  newlyClaimed: { name: string; description: string }[];
  fastestDevMomentum: { name: string; description: string }[];
  commercialReadinessWatch: { name: string; description: string }[];
  seoGapPatterns: string;
  sourceConfidence: string;
  reportNotes: string;
}

export const demoReports: DemoReport[] = [
  {
    slug: "weekly-ai-project-signals-2026-06-21",
    title: "Weekly AI Project Signals — June 21, 2026",
    date: "2026-06-21",
    executiveSummary:
      "This week saw continued momentum in the open-source AI agent category, with multiple projects shipping new multi-agent orchestration features. Vector database projects maintained steady development velocity. Early-stage compliance automation tools showed growing interest from B2B SaaS adopters. No projects transitioned from pending review to published this week. Signal Score stability remained high across all published projects, with no significant score degradation observed.",
    methodology:
      "This report is generated from public signals only. Data sources include public GitHub repositories, official project websites, public documentation, and community channels. Dev Momentum signals are derived from commit frequency, release cadence, and contributor activity. Market Presence signals reflect public project discoverability and community engagement. No private data, revenue figures, or unverifiable claims are used. All Signal Scores are based on reviewed public snapshots.",
    topMovers: [
      {
        name: "Nucleus ML",
        description:
          "Gained 2 Signal Score points this week driven by a major release adding multi-GPU training support and improved documentation coverage. GitHub activity remained in the top percentile of indexed projects.",
      },
      {
        name: "VectorBase",
        description:
          "Added support for a new indexing algorithm and published performance benchmarks. Community contributions increased week-over-week, contributing to improved Dev Momentum and Trust Confidence scores.",
      },
    ],
    newlyClaimed: [
      {
        name: "No new claims",
        description:
          "No projects transitioned from unclaimed to claimed status this week. The claim system is in development. Existing claimed projects maintained their verification status.",
      },
    ],
    fastestDevMomentum: [
      {
        name: "Nucleus ML",
        description:
          "Consistently the highest Dev Momentum score among indexed projects. Weekly commit volume, contributor diversity, and release frequency place it in the top tier for development velocity.",
      },
      {
        name: "Aurora Code",
        description:
          "Steady development cadence with regular releases and responsive issue management. Community pull requests are reviewed and merged within industry-leading timeframes.",
      },
      {
        name: "VectorBase",
        description:
          "Strong and consistent Dev Momentum driven by feature additions, performance improvements, and growing community contributions. Documentation updates ship alongside code changes.",
      },
    ],
    commercialReadinessWatch: [
      {
        name: "Pulse Analytics",
        description:
          "Public documentation shows clear onboarding pathways and pricing tiers. Product positioning targets a well-defined analytics segment. Commercial readiness is assessed from public signals only; actual revenue data is not available.",
      },
      {
        name: "ComplyKit",
        description:
          "Targeting a compliance automation market with well-defined buyer personas. Public website and documentation indicate product-market exploration. Early-stage commercial readiness signals are present.",
      },
    ],
    seoGapPatterns:
      "Several published projects lack structured data markup, limiting rich result eligibility. Category pages in this report have been updated with schema.org ItemList and WebPage markup. Project detail pages with higher SEO Foundation scores tend to have better structured data coverage and clearer page information architecture.",
    sourceConfidence:
      "All Signal Scores in this report are based on public signals from reviewed snapshots. No private data, unverified claims, or fabricated metrics are used. Source confidence levels are displayed on each project page. Projects marked as 'Public Signals Only' rely exclusively on publicly available information.",
    reportNotes:
      "This is a demonstration report generated from demo project data. In production, weekly reports will be generated from reviewed data snapshots and will require editorial review before publication. Report content must not include fabricated metrics, invented revenue figures, or unverifiable claims.",
  },
  {
    slug: "open-source-ai-agent-momentum-june-2026",
    title: "Open-Source AI Agent Momentum — June 2026",
    date: "2026-06-01",
    executiveSummary:
      "Open-source AI agent projects showed strong sustained momentum through June 2026. Multi-agent orchestration emerged as the dominant development theme, with multiple frameworks adding support for hierarchical and sequential agent workflows. The open-source agent ecosystem continues to diversify beyond Python-centric frameworks into TypeScript and Rust-native implementations. Vector database integration has become a standard feature across agent frameworks, reflecting the maturation of the RAG + Agent pattern.",
    methodology:
      "This report analyzes public development signals from indexed open-source AI agent projects. Data sources include public GitHub repositories, release notes, documentation updates, and community channels. Dev Momentum scores are derived from commit frequency, release cadence, contributor diversity, and community engagement metrics. All signals are from publicly available sources. No private data, usage statistics, or commercial metrics are included. Signal Scores reflect public snapshots as of the report date.",
    topMovers: [
      {
        name: "Aurora Code",
        description:
          "Shipped a new multi-agent code review pipeline that coordinates multiple specialized reviewers. This architectural shift from single-agent to multi-agent review represents a significant product evolution.",
      },
      {
        name: "VectorBase",
        description:
          "Released native integrations with major agent frameworks, making it easier for agent projects to incorporate vector search capabilities. This positions VectorBase as infrastructure for the agent ecosystem.",
      },
    ],
    newlyClaimed: [
      {
        name: "No new claims",
        description:
          "No projects transitioned to claimed status during the June 2026 reporting period. The founder claim system is under development and will be reflected in future reports when active.",
      },
    ],
    fastestDevMomentum: [
      {
        name: "Nucleus ML",
        description:
          "Consistently the top Dev Momentum performer. Agent-related features including training pipeline automation are driving sustained high commit velocity across multiple repositories.",
      },
      {
        name: "Aurora Code",
        description:
          "Multi-agent architecture development has accelerated commit cadence. The transition from single-agent to orchestrated multi-agent review is a significant development.",
      },
      {
        name: "VectorBase",
        description:
          "Agent framework integrations and performance optimization work maintain strong Dev Momentum. Consistent release cadence with documented changelogs.",
      },
    ],
    commercialReadinessWatch: [
      {
        name: "ComplyKit",
        description:
          "Compliance automation intersects with agent-based workflows. Public product positioning increasingly references automated compliance as an agent-driven process. Commercial readiness signals are assessed from public materials only.",
      },
    ],
    seoGapPatterns:
      "Open-source agent projects generally have stronger SEO Foundation scores than proprietary counterparts due to public documentation, open repositories, and community-generated content. However, structured data adoption remains low across the category. Projects that add schema.org markup for documentation pages and changelogs may improve search visibility for developer-focused queries.",
    sourceConfidence:
      "This report draws exclusively from public sources. Open-source projects with active GitHub repositories receive higher source confidence ratings. Projects in this category benefit from transparent development practices that provide observable signals for all six Signal Score dimensions.",
    reportNotes:
      "This is a demonstration report. In production, category momentum reports will be generated on a monthly cadence from reviewed data snapshots. Reports require editorial review before publication. Agent ecosystem analysis is a developing editorial capability and will improve as more projects are indexed and verified.",
  },
];

export function getReportBySlug(slug: string): DemoReport | undefined {
  return demoReports.find((r) => r.slug === slug);
}
