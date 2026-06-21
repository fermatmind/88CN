import Link from "next/link";
import {
  ConsolePageHeader,
  DiscoveryShell,
  EmptyState,
  HeroSearchConsole,
} from "@/components/public-ui";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <DiscoveryShell className="space-y-8">
      <ConsolePageHeader
        eyebrow="Page unavailable"
        title="This public page is not available"
        description="The page may not be part of the reviewed public projection surface, or it may not be eligible for public display."
      />

      <EmptyState
        title="Fail-closed public route"
        body="Only eligible reviewed public profiles and finite collections are shown."
      />

      <HeroSearchConsole />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/projects", label: "Browse projects" },
          { href: "/collections", label: "Browse collections" },
          { href: "/methodology", label: "Read methodology" },
          { href: "/submit", label: "Submit a project" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:border-sky-300 hover:text-slate-950"
          >
            {link.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </DiscoveryShell>
  );
}
