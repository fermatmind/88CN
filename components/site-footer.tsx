import Link from "next/link";
import { NAV_LINKS, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SiteFooterProps {
  className?: string;
}

export default function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-terminal-border bg-terminal-bg",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-tight text-terminal-fg">
            {SITE_NAME}
          </p>
          <p className="max-w-md text-xs leading-5 text-terminal-dim">
            {SITE_TAGLINE}. Public pages show reviewed published projections
            and official source links.
          </p>
        </div>

        <nav className="flex flex-wrap gap-3 text-xs text-terminal-dim">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-terminal-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
