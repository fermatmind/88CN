import { siteTitle, siteDescription, noIndex } from "@/lib/seo";
import { PlusCircle, FileText, Search, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteTitle("Submit a Project"),
  description: siteDescription(
    "Submit a free AI project profile to 88CN. Public growth signals, editorial review, and search-indexed discovery for early AI projects."
  ),
  ...noIndex(),
};

const BENEFITS = [
  {
    icon: FileText,
    title: "Free AI Project Profile",
    description:
      "A public project page indexed by search engines and discoverable by the 88CN community.",
  },
  {
    icon: Search,
    title: "Editorial Listing",
    description:
      "Projects pass through editorial review and are listed alongside public growth signals and Signal Scores.",
  },
  {
    icon: ShieldCheck,
    title: "Publisher Claim",
    description:
      "Founders can claim their profile and manage public project information after verification.",
  },
];

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-terminal-border bg-terminal-surface">
          <PlusCircle className="h-5 w-5 text-terminal-muted" />
        </div>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-terminal-fg">
          Submit a Project
        </h1>
        <p className="text-sm text-terminal-dim leading-relaxed max-w-lg mx-auto">
          Share an early AI project for inclusion in the 88CN free AI project
          growth index. Submissions are reviewed for public growth signals and
          editorial quality.
        </p>
      </div>

      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-lg border border-terminal-border bg-terminal-surface p-5"
          >
            <benefit.icon className="mb-3 h-5 w-5 text-terminal-muted" />
            <h3 className="mb-1.5 text-sm font-semibold text-terminal-fg">
              {benefit.title}
            </h3>
            <p className="text-xs text-terminal-dim leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-terminal-border bg-terminal-surface p-8 text-center">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-terminal-border">
          <PlusCircle className="h-4 w-4 text-terminal-dim" />
        </div>
        <h2 className="mb-2 text-sm font-semibold text-terminal-fg">
          Submission Coming Soon
        </h2>
        <p className="text-xs text-terminal-dim leading-relaxed max-w-sm mx-auto">
          The project submission form is under development. In the meantime,
          express interest and we will notify you when submissions open.
        </p>
      </div>
    </div>
  );
}
