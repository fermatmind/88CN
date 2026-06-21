import Link from "next/link";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SiteHeaderProps {
  className?: string;
}

export default function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-terminal-bg/90 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-terminal-bg/75 sm:px-6",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between gap-3 rounded-[1.35rem] border border-slate-200 bg-white px-4 shadow-sm">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 text-base font-semibold tracking-tight text-slate-950 transition-colors hover:text-slate-700"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
            8
          </span>
          <span>{SITE_NAME}</span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="flex min-w-0 items-center gap-2">
          <Link
            href="/projects"
            aria-label="Search projects"
            className="hidden h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-600 transition-colors hover:border-sky-300 hover:text-slate-950 sm:inline-flex"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>
          <Link
            href="/submit"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Submit
          </Link>
        </nav>
      </div>
    </header>
  );
}
