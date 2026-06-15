import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
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
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-8 text-center sm:flex-row sm:justify-between sm:px-6">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="text-xs font-semibold tracking-tight text-terminal-fg">
            {SITE_NAME}
          </p>
          <p className="text-xs text-terminal-dim">{SITE_TAGLINE}</p>
        </div>

        <div className="flex items-center gap-4 text-xs text-terminal-dim">
          <Link
            href="/projects"
            className="hover:text-terminal-muted transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/submit"
            className="hover:text-terminal-muted transition-colors"
          >
            Submit
          </Link>
        </div>
      </div>
    </footer>
  );
}
