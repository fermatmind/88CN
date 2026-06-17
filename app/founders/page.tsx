import { FounderValueCard } from "@/components/founder-value-card";
import { webPageJSONLD } from "@/lib/structured-data";
import { siteTitle, siteDescription } from "@/lib/seo";
import {
  FileText,
  Shield,
  Edit3,
  TrendingUp,
  Award,
  Ban,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteTitle("For Founders"),
  description: siteDescription(
    "Why founders should create a free AI project profile on 88CN. Clean structured public profiles, source confidence improvement, and verified signal tracking."
  ),
  robots: { index: true, follow: true },
};

const VALUES = [
  {
    icon: FileText,
    title: "Create a Clean, Structured Public Profile",
    description:
      "A free AI project profile on 88CN gives your project a structured, search-indexed public page. The profile includes your project name, description, category, public sources, and growth signal indicators — all in one consistent format designed for discoverability by potential users and collaborators.",
  },
  {
    icon: Shield,
    title: "Improve Source Confidence",
    description:
      "By claiming your project and linking verified public sources (official website, GitHub repository, documentation), you improve the source confidence level of your project's public profile. Higher source confidence means more reliable signal data and better representation in the index.",
  },
  {
    icon: Edit3,
    title: "Add Public Project Details",
    description:
      "Claimed projects can maintain up-to-date public information including product description, category classification, public links, and growth milestones. This ensures your project is accurately represented in the 88CN index and discovered through relevant category and collection pages.",
  },
  {
    icon: TrendingUp,
    title: "Prepare for Verified Signal Profile",
    description:
      "As the 88CN Signal Score system matures, verified projects will benefit from more complete signal profiles. Early claiming establishes your project's presence in the index and positions it for future signal enhancements, editorial inclusion, and report coverage.",
  },
  {
    icon: Award,
    title: "Optional Genesis Badge",
    description:
      "Verified projects may be eligible for the Genesis Badge, which recognizes early projects with established public growth signals. The badge is optional and informational — it is not a ranking, endorsement, or commercial certification. Display is voluntary and free of obligations.",
  },
  {
    icon: Ban,
    title: "What We Do Not Promise",
    description:
      "88CN does not promise traffic, ranking improvements, SEO benefits, or link placement. The index is a public discovery tool based on growth signals — not a traffic-generation service. Project profiles are informational. There are no guaranteed outcomes from listing or claiming.",
  },
];

export default function FoundersPage() {
  const baseUrl =
    process.env.APP_URL ?? "http://localhost:3000";
  const pageUrl = `${baseUrl}/founders`;

  const webPageLD = webPageJSONLD(
    pageUrl,
    "For Founders",
    "Why founders should create a free AI project profile on 88CN."
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLD) }}
      />

      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-terminal-border bg-terminal-surface">
          <FileText className="h-5 w-5 text-terminal-muted" />
        </div>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-terminal-fg">
          For Founders
        </h1>
        <p className="text-sm text-terminal-dim leading-relaxed max-w-lg mx-auto">
          Why claim your AI project on 88CN and how a structured public profile
          helps your project get discovered through public growth signals.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {VALUES.map((value) => (
          <FounderValueCard
            key={value.title}
            icon={value.icon}
            title={value.title}
            description={value.description}
          />
        ))}
      </div>

      <div className="rounded-lg border border-terminal-border bg-terminal-surface p-6">
        <h2 className="mb-3 text-sm font-semibold text-terminal-fg">
          How to Get Started
        </h2>
        <div className="space-y-3 text-xs text-terminal-dim leading-relaxed">
          <p>
            The founder claim system is under development. When active, project
            founders will be able to:
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-1">
            <li>Locate their project on 88CN (if already indexed)</li>
            <li>
              Submit a new project for editorial review (if not yet indexed)
            </li>
            <li>
              Claim an existing project profile through domain email, DNS
              TXT, GitHub repository verification, or manual review
            </li>
            <li>
              Update public project information after claim verification
            </li>
            <li>
              Track public growth signals and Signal Score changes over time
            </li>
          </ol>
          <p>
            All claims are subject to editorial review. Claiming a project is
            free. There are no paid placement options, no sponsored rankings,
            and no commercial obligations.
          </p>
        </div>
      </div>
    </div>
  );
}
