import Link from "next/link";
import { EmptyState, HeroSearch, PageShell } from "@/components/public-ui";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <PageShell size="prose" className="space-y-8">
      <EmptyState
        title="Page not available"
        body="This page is not part of the public published projection surface, or it is not available."
      />

      <HeroSearch compact />

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { href: "/projects", label: "Browse projects" },
          { href: "/collections", label: "Browse collections" },
          { href: "/methodology", label: "Read methodology" },
          { href: "/submit", label: "Submit a project" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between rounded-lg border border-terminal-border bg-terminal-surface px-4 py-3 text-sm font-semibold text-terminal-muted transition-colors hover:border-terminal-ring hover:text-terminal-fg"
          >
            {link.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
