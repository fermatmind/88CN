import { FeaturedPlacementLabel } from "@/components/featured/FeaturedPlacementLabel";
import { FeaturedSignalCard } from "@/components/featured/FeaturedSignalCard";
import {
  getFeaturedSignals,
  type FeaturedSurface,
} from "@/lib/featured/featured-signals";
import { cn } from "@/lib/utils";

export function FeaturedVerifiedSignals({
  surface,
  categorySlug,
  className,
}: {
  surface: FeaturedSurface;
  categorySlug?: string;
  className?: string;
}) {
  const signals = getFeaturedSignals({ surface, categorySlug });

  if (signals.length === 0) return null;

  return (
    <section className={cn("mx-auto w-full max-w-5xl px-4 sm:px-6", className)}>
      <div className="rounded-lg border border-terminal-border bg-terminal-bg/80 p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <FeaturedPlacementLabel />
            <h2 className="mt-3 text-lg font-semibold tracking-tight text-terminal-fg">
              Featured Verified Signals
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-terminal-dim">
              Human-visible placement for reviewed public projects. Organic
              project ordering and machine-readable data stay unchanged.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {signals.map((signal) => (
            <FeaturedSignalCard key={signal.project.slug} signal={signal} />
          ))}
        </div>
      </div>
    </section>
  );
}
