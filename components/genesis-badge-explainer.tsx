import { cn } from "@/lib/utils";
import { Shield, Globe, Users, Code, Link, TrendingUp } from "lucide-react";

interface GenesisBadgeExplainerProps {
  className?: string;
}

const ATTRIBUTES = [
  {
    icon: Globe,
    title: "Public Signals Only",
    description:
      "The Genesis Badge is based exclusively on publicly available project data. No private analytics, revenue figures, or unverifiable claims are used to determine badge eligibility.",
  },
  {
    icon: Users,
    title: "Founder Claimed",
    description:
      "Badge eligibility requires founder verification. Projects must be claimed by their founders through one of the supported verification methods before badge consideration.",
  },
  {
    icon: Shield,
    title: "Source Confidence",
    description:
      "Projects must maintain a minimum source confidence level. Active public repositories, transparent documentation, and verifiable development activity are key confidence indicators.",
  },
  {
    icon: TrendingUp,
    title: "Signal Profile",
    description:
      "The Genesis Badge reflects a project's signal profile across all six Signal Score dimensions. It indicates that a project has established observable public growth signals across multiple dimensions.",
  },
  {
    icon: Code,
    title: "Optional Embed Planned",
    description:
      "In a future phase, verified projects may embed a Genesis Badge on their own websites. This embed will be optional and will not require reciprocal links, payment, or any mandatory attribution format.",
  },
  {
    icon: Link,
    title: "No Forced Link Placement",
    description:
      "The Genesis Badge does not require, imply, or incentivize reciprocal links. There are no SEO obligations, link schemes, or ranking promises associated with the badge. Badge display is purely informational.",
  },
];

export function GenesisBadgeExplainer({
  className,
}: GenesisBadgeExplainerProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <section className="text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-terminal-ring bg-terminal-elevated">
          <Shield className="h-6 w-6 text-terminal-muted" />
        </div>
        <p className="text-xs text-terminal-dim leading-relaxed max-w-lg mx-auto">
          The Genesis Badge recognizes early projects that have established
          verifiable public growth signals and completed founder verification.
          It is not a ranking, endorsement, or commercial certification.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ATTRIBUTES.map((attr) => (
          <div
            key={attr.title}
            className="rounded-lg border border-terminal-border bg-terminal-surface p-4"
          >
            <attr.icon className="mb-2.5 h-4 w-4 text-terminal-muted" />
            <h3 className="mb-1 text-xs font-semibold text-terminal-fg">
              {attr.title}
            </h3>
            <p className="text-[11px] text-terminal-dim leading-relaxed">
              {attr.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
        <h3 className="mb-2 text-sm font-semibold text-terminal-fg">
          Important Notes
        </h3>
        <ul className="space-y-1.5 text-xs text-terminal-dim">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-terminal-dim" />
            The Genesis Badge is not a ranking guarantee. It reflects public
            signal status at the time of verification.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-terminal-dim" />
            Badge criteria, eligibility, and display format are subject to
            change as the 88CN index evolves.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-terminal-dim" />
            The embed feature is planned for a future phase and is not yet
            available.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-terminal-dim" />
            No ranking guarantees, traffic promises, or SEO benefits are
            associated with the Genesis Badge.
          </li>
        </ul>
      </div>
    </div>
  );
}
