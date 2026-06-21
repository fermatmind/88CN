import Link from "next/link";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChartBar, Search } from "lucide-react";

interface SiteHeaderProps {
  className?: string;
}

export default function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-terminal-border bg-terminal-bg/95 backdrop-blur supports-[backdrop-filter]:bg-terminal-bg/80",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-terminal-fg hover:text-terminal-muted transition-colors"
        >
          <ChartBar className="h-4 w-4 text-terminal-ring" />
          <span>{SITE_NAME}</span>
        </Link>

        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-md px-1 py-1.5 text-[11px] font-medium text-terminal-muted transition-colors hover:bg-terminal-surface hover:text-terminal-fg sm:px-3 sm:text-xs"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/projects"
            aria-label="Search projects"
            className="ml-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-md border border-terminal-border text-terminal-muted transition-colors hover:border-terminal-ring hover:text-terminal-fg sm:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
