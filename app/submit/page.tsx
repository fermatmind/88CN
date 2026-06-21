import { PageShell, SectionHeader } from "@/components/public-ui";
import SubmitForm from "@/components/submit-form";
import { noIndex, siteDescription, siteTitle } from "@/lib/seo";
import { FileText, Search, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: siteTitle("Submit a Project"),
  description: siteDescription(
    "Submit a free AI project profile to 88CN for editorial review."
  ),
  ...noIndex(),
};

const BENEFITS = [
  {
    icon: FileText,
    title: "Public Project Profile",
    description:
      "Eligible submissions may become public profiles after editorial review.",
  },
  {
    icon: Search,
    title: "Reviewed Public Signals",
    description:
      "Use public source links so reviewers can verify the project surface.",
  },
  {
    icon: ShieldCheck,
    title: "Founder Claim Path",
    description:
      "Founders can request corrections after a claim review is completed.",
  },
];

export default function SubmitPage() {
  return (
    <PageShell size="prose" className="space-y-8">
      <SectionHeader
        eyebrow="Submit"
        title="Submit a Project"
        description="Share public project information for editorial review. Submission does not guarantee publication, placement, or search treatment."
        action={
          <Link
            href="/founding-slots"
            className="inline-flex items-center rounded-md border border-terminal-border px-3 py-2 text-xs font-semibold text-terminal-muted transition-colors hover:border-terminal-ring hover:text-terminal-fg"
          >
            Founder FAQ
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-lg border border-terminal-border bg-terminal-surface p-4 shadow-sm"
          >
            <benefit.icon className="mb-3 h-5 w-5 text-terminal-ring" />
            <h3 className="mb-1.5 text-sm font-semibold text-terminal-fg">
              {benefit.title}
            </h3>
            <p className="text-xs leading-5 text-terminal-dim">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      <SubmitForm />
    </PageShell>
  );
}
