import type { LifecycleState, SignalDimension, SourceConfidenceLevel } from "./constants";

export interface DemoProject {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  website: string;
  status: LifecycleState;
  signalScore: number;
  scores: Record<SignalDimension, number>;
  sourceConfidence: SourceConfidenceLevel;
  verificationStatus: string;
  publicSources: string[];
  editorialNote: string;
}

export const demoProjects: DemoProject[] = [
  {
    slug: "aurora-code",
    name: "Aurora Code",
    tagline:
      "Open-source AI code reviewer that runs in CI and catches bugs before merge.",
    category: "Developer Tools",
    website: "https://auroracode.dev",
    status: "published",
    signalScore: 78,
    scores: {
      productReadiness: 82,
      devMomentum: 85,
      marketPresence: 70,
      commercialReadiness: 65,
      seoFoundation: 75,
      trustConfidence: 80,
    },
    sourceConfidence: "public_signals",
    verificationStatus: "Not verified",
    publicSources: [
      "https://github.com/aurora-code/aurora",
      "https://auroracode.dev",
    ],
    editorialNote:
      "Editorial Note pending human review. Public signals show active development and growing community adoption.",
  },
  {
    slug: "pulse-analytics",
    name: "Pulse Analytics",
    tagline:
      "Privacy-first product analytics with zero-cookie tracking and first-party data ownership.",
    category: "Analytics",
    website: "https://pulseanalytics.io",
    status: "published",
    signalScore: 72,
    scores: {
      productReadiness: 78,
      devMomentum: 65,
      marketPresence: 75,
      commercialReadiness: 70,
      seoFoundation: 68,
      trustConfidence: 74,
    },
    sourceConfidence: "public_signals",
    verificationStatus: "Not verified",
    publicSources: [
      "https://github.com/pulse-analytics/pulse",
      "https://pulseanalytics.io",
      "https://docs.pulseanalytics.io",
    ],
    editorialNote:
      "Editorial Note pending human review. Product shows strong privacy positioning in a competitive analytics market.",
  },
  {
    slug: "nucleus-ml",
    name: "Nucleus ML",
    tagline:
      "Lightweight model training platform for small teams that runs on your own infrastructure.",
    category: "AI & Machine Learning",
    website: "https://nucleusml.com",
    status: "published",
    signalScore: 81,
    scores: {
      productReadiness: 84,
      devMomentum: 90,
      marketPresence: 68,
      commercialReadiness: 72,
      seoFoundation: 78,
      trustConfidence: 82,
    },
    sourceConfidence: "public_signals",
    verificationStatus: "Not verified",
    publicSources: [
      "https://github.com/nucleus-ml/nucleus",
      "https://nucleusml.com",
      "https://docs.nucleusml.com",
    ],
    editorialNote:
      "Editorial Note pending human review. Strong development velocity with consistent GitHub activity.",
  },
  {
    slug: "scribe-ai",
    name: "Scribe AI",
    tagline:
      "Meeting transcription and knowledge base that runs entirely on-device, no cloud uploads.",
    category: "Productivity",
    website: "https://scribeai.app",
    status: "claimed",
    signalScore: 68,
    scores: {
      productReadiness: 72,
      devMomentum: 60,
      marketPresence: 70,
      commercialReadiness: 66,
      seoFoundation: 62,
      trustConfidence: 70,
    },
    sourceConfidence: "public_signals",
    verificationStatus: "Founder not claimed",
    publicSources: [
      "https://github.com/scribeai/scribe",
      "https://scribeai.app",
    ],
    editorialNote:
      "Editorial Note pending human review. Local-first architecture is a differentiator in the transcription space.",
  },
  {
    slug: "vectorbase",
    name: "VectorBase",
    tagline:
      "Open-source vector database optimized for small to medium semantic search workloads.",
    category: "Infrastructure",
    website: "https://vectorbase.dev",
    status: "published",
    signalScore: 74,
    scores: {
      productReadiness: 76,
      devMomentum: 78,
      marketPresence: 62,
      commercialReadiness: 60,
      seoFoundation: 72,
      trustConfidence: 76,
    },
    sourceConfidence: "public_signals",
    verificationStatus: "Not verified",
    publicSources: [
      "https://github.com/vectorbase/vectorbase",
      "https://vectorbase.dev",
    ],
    editorialNote:
      "Editorial Note pending human review. Niche but well-executed vector database targeting the mid-market segment.",
  },
  {
    slug: "complykit",
    name: "ComplyKit",
    tagline:
      "Automated SOC 2 and ISO 27001 compliance preparation for early-stage SaaS teams.",
    category: "Security & Compliance",
    website: "https://complykit.io",
    status: "published",
    signalScore: 67,
    scores: {
      productReadiness: 70,
      devMomentum: 62,
      marketPresence: 68,
      commercialReadiness: 72,
      seoFoundation: 64,
      trustConfidence: 68,
    },
    sourceConfidence: "public_signals",
    verificationStatus: "Not verified",
    publicSources: [
      "https://github.com/complykit/complykit",
      "https://complykit.io",
    ],
    editorialNote:
      "Editorial Note pending human review. Early-stage compliance automation with growing interest from SaaS founders.",
  },
];

export function getProjectBySlug(
  slug: string
): DemoProject | undefined {
  return demoProjects.find((p) => p.slug === slug);
}

export function getPublishedProjects(): DemoProject[] {
  return demoProjects.filter((p) => p.status === "published" || p.status === "claimed" || p.status === "owner_verified");
}

export function getClaimedProjects(): DemoProject[] {
  return demoProjects.filter((p) => p.status === "claimed" || p.status === "owner_verified");
}
