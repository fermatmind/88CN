import {
  MethodologyPanel,
  PageShell,
  SectionHeader,
} from "@/components/public-ui";
import { siteDescription, siteTitle } from "@/lib/seo";
import {
  CheckCircle2,
  Link as LinkIcon,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteTitle("Methodology"),
  description: siteDescription(
    "How 88CN builds public project pages from reviewed projections, official source links, and timestamped public signals."
  ),
};

const PRINCIPLES = [
  {
    title: "Reviewed public projection",
    body: "Public pages render from the reviewed published projection layer only.",
    icon: ShieldCheck,
  },
  {
    title: "Official source links",
    body: "Project pages keep official website, docs, and public repository links visible for verification.",
    icon: LinkIcon,
  },
  {
    title: "Timestamped review",
    body: "Cards and detail pages show when the public projection was last reviewed.",
    icon: TimerReset,
  },
  {
    title: "Finite navigation",
    body: "Collections use explicit inclusion criteria and avoid broad faceted page generation.",
    icon: CheckCircle2,
  },
];

export default function MethodologyPage() {
  return (
    <PageShell size="prose" className="space-y-8">
      <SectionHeader
        eyebrow="Public methodology"
        title="How 88CN Builds Public Pages"
        description="88CN is a reviewed public signal directory. The interface is built to make source checking fast while keeping private pipeline material out of the public product."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((principle) => {
          const Icon = principle.icon;

          return (
            <section
              key={principle.title}
              className="rounded-lg border border-terminal-border bg-terminal-surface p-5 shadow-sm"
            >
              <Icon className="mb-3 h-5 w-5 text-terminal-ring" />
              <h2 className="text-sm font-semibold text-terminal-fg">
                {principle.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-terminal-dim">
                {principle.body}
              </p>
            </section>
          );
        })}
      </div>

      <MethodologyPanel
        title="Public data boundary"
        body="Public UI shows project name, summary, category, public model, signal chips, official links, collection membership, lifecycle display, and review timestamps. Non-public pipeline material is excluded from the product surface."
      />

      <MethodologyPanel
        title="Indexing boundary"
        body="Sitemaps include eligible published projections and published collections only. Search and listing pages paginate results instead of generating broad query landing pages."
      />
    </PageShell>
  );
}
