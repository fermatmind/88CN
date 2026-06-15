export interface DemoCollection {
  slug: string;
  title: string;
  inclusionCriteria: string;
  editorialSummary: string;
  whyIncluded: string;
  projectSlugs: string[];
  lastUpdated: string;
}

export const demoCollections: DemoCollection[] = [
  {
    slug: "chinese-ai-projects-going-global",
    title: "Chinese AI Projects Going Global",
    inclusionCriteria:
      "AI projects with primary development teams based in China that have English-language product pages, international user bases, or open-source communities with global contributor participation.",
    editorialSummary:
      "This collection tracks Chinese AI projects that are building for international audiences. These projects demonstrate product maturity, English documentation quality, and global community engagement. Inclusion does not imply endorsement or verification of any specific claims.",
    whyIncluded:
      "These projects represent an important segment of the global AI ecosystem. Chinese AI projects with international reach often bring unique approaches to model efficiency, deployment infrastructure, and application design that complement Western-centric AI development patterns.",
    projectSlugs: ["nucleus-ml", "complykit"],
    lastUpdated: "2026-06-15",
  },
  {
    slug: "open-source-ai-agents",
    title: "Open-Source AI Agents",
    inclusionCriteria:
      "AI agent frameworks, platforms, and tools released under permissive open-source licenses (MIT, Apache-2.0, BSD, GPL) with active public repositories and documented APIs.",
    editorialSummary:
      "This collection highlights open-source AI agent projects with active development communities. Open-source agent frameworks are building the infrastructure layer for autonomous AI systems. This collection tracks projects with transparent development, community governance, and permissive licensing.",
    whyIncluded:
      "Open-source AI agent projects provide the foundation for the next generation of autonomous AI systems. Their public development model allows for community auditing, collaborative improvement, and broad ecosystem integration that proprietary alternatives cannot match.",
    projectSlugs: ["aurora-code", "vectorbase"],
    lastUpdated: "2026-06-15",
  },
  {
    slug: "ai-products-ready-for-paid-growth",
    title: "AI Products Ready for Paid Growth",
    inclusionCriteria:
      "AI products that demonstrate commercial readiness through public pricing pages, documented onboarding, clear target audience definition, and observable product-market fit signals.",
    editorialSummary:
      "This collection identifies AI products that have moved beyond beta and hobbyist usage to demonstrate readiness for paid customer acquisition. Commercial readiness is assessed from public signals including pricing transparency, onboarding documentation, and observable market traction.",
    whyIncluded:
      "Commercial readiness is a key growth signal. Products in this collection have public indicators of revenue-readiness. This does not mean these products have revenue or are profitable — only that they show public commercial readiness signals.",
    projectSlugs: ["pulse-analytics", "complykit"],
    lastUpdated: "2026-06-15",
  },
  {
    slug: "ai-tools-with-public-github",
    title: "AI Tools with Public GitHub",
    inclusionCriteria:
      "AI projects with active, publicly accessible GitHub repositories showing recent commits, open issues, community contributions, and documented development practices.",
    editorialSummary:
      "This collection tracks AI tools with transparent development practices. Public GitHub activity is one of the strongest signals for dev momentum and community health. This collection includes projects across all categories that maintain active public repositories.",
    whyIncluded:
      "Public GitHub activity is the most reliable public signal for development velocity, community engagement, and project sustainability. Projects in this collection demonstrate commitment to open development practices.",
    projectSlugs: ["aurora-code", "nucleus-ml", "vectorbase", "scribe-ai"],
    lastUpdated: "2026-06-15",
  },
  {
    slug: "mcp-servers-for-builders",
    title: "MCP Servers for Builders",
    inclusionCriteria:
      "Projects implementing the Model Context Protocol (MCP) server specification, enabling AI applications to connect with external tools, data sources, and services through a standardized interface.",
    editorialSummary:
      "MCP servers represent an emerging standard for AI-tool integration. This collection tracks MCP server implementations across categories, from database connectors to API wrappers to development tools. The MCP ecosystem is early but shows rapid growth.",
    whyIncluded:
      "MCP is gaining traction as a standard for AI application integration. Projects implementing MCP servers are building the interoperability layer that will define how AI tools connect with external systems. Early tracking of this ecosystem provides a foundation for future analysis.",
    projectSlugs: ["aurora-code", "vectorbase"],
    lastUpdated: "2026-06-15",
  },
];

export function getCollectionBySlug(
  slug: string
): DemoCollection | undefined {
  return demoCollections.find((c) => c.slug === slug);
}
