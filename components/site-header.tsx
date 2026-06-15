import Link from "next/link";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChartBar } from "lucide-react";

interface SiteHeaderProps {
  className?: string;
}

export default function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full overflow-x-clip border-b border-terminal-border bg-terminal-bg/95 backdrop-blur supports-[backdrop-filter]:bg-terminal-bg/80",
        className
      )}
    >
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-terminal-fg hover:text-terminal-muted transition-colors"
        >
          <ChartBar className="h-4 w-4" />
          <span>{SITE_NAME}</span>
        </Link>

        <nav className="flex min-w-0 items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium text-terminal-muted hover:text-terminal-fg hover:bg-terminal-surface transition-colors sm:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
