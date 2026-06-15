import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChartBar, ArrowRight, PlusCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-terminal-surface/50 via-terminal-bg to-terminal-bg pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="mb-6 flex items-center justify-center gap-2">
            <ChartBar className="h-5 w-5 text-terminal-muted" />
            <span className="text-sm font-mono tracking-widest uppercase text-terminal-dim">
              Free AI Project Growth Index
            </span>
          </div>

          <h1 className="mb-4 text-5xl font-bold tracking-tight text-terminal-fg sm:text-7xl">
            {SITE_NAME}
          </h1>

          <p className="mb-3 text-xl font-medium text-terminal-muted sm:text-2xl">
            {SITE_TAGLINE}
          </p>

          <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-terminal-dim">
            Discover, track and claim early AI projects with public growth
            signals. Free AI project profiles, editorial listings, and
            search-indexed discovery for builders and early adopters.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/projects"
              className={cn(
                "inline-flex items-center gap-2 rounded-md border border-terminal-border",
                "bg-terminal-fg px-6 py-2.5 text-sm font-semibold text-terminal-bg",
                "hover:bg-terminal-muted transition-colors"
              )}
            >
              Explore Projects
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/submit"
              className={cn(
                "inline-flex items-center gap-2 rounded-md border border-terminal-border",
                "px-6 py-2.5 text-sm font-medium text-terminal-muted",
                "hover:border-terminal-ring hover:text-terminal-fg hover:bg-terminal-surface transition-colors"
              )}
            >
              Submit Project
              <PlusCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0">
          <div className="mx-auto flex max-w-lg items-center justify-center gap-8 text-[10px] font-mono uppercase tracking-widest text-terminal-dim/50">
            <span>Public Growth Signals</span>
            <span className="text-terminal-border">|</span>
            <span>Editorial Discovery</span>
            <span className="text-terminal-border">|</span>
            <span>Founder Claims</span>
          </div>
        </div>
      </section>
    </div>
  );
}
