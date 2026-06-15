import type { DemoCategory } from "@/lib/demo-categories";
import type { DemoProject } from "@/lib/demo-projects";
import ProjectCard from "@/components/project-card";
import { MethodologyBlock } from "@/components/methodology-block";
import { cn } from "@/lib/utils";
import { Layers, GitFork, Zap, HelpCircle } from "lucide-react";

interface CategoryHubProps {
  category: DemoCategory;
  projects: DemoProject[];
  className?: string;
}

export function CategoryHub({
  category,
  projects,
  className,
}: CategoryHubProps) {
  const ranked = [...projects].sort(
    (a, b) => b.signalScore - a.signalScore
  );

  return (
    <div className={cn("space-y-12", className)}>
      <section>
        <div className="mb-2 flex items-center gap-2">
          <Layers className="h-4 w-4 text-terminal-muted" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-terminal-dim">
            Category Hub
          </span>
        </div>
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-terminal-fg">
          {category.title}
        </h1>
        <p className="max-w-3xl text-sm text-terminal-muted leading-relaxed">
          {category.overview}
        </p>
      </section>

      <section className="rounded-lg border border-terminal-border bg-terminal-surface p-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-terminal-fg">
          <Zap className="h-4 w-4 text-amber-500" />
          Why This Category Matters
        </h2>
        <p className="text-xs text-terminal-dim leading-relaxed">
          {category.whyMatters}
        </p>
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-terminal-fg">
          <Layers className="h-4 w-4 text-terminal-muted" />
          Signal-Ranked Projects
        </h2>
        {ranked.length === 0 ? (
          <p className="text-xs text-terminal-dim">
            No projects indexed in this category yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {ranked.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-terminal-border bg-terminal-surface p-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-terminal-fg">
          <GitFork className="h-4 w-4 text-terminal-muted" />
          Fastest Dev Momentum
        </h2>
        <p className="text-xs text-terminal-dim leading-relaxed">
          {category.fastestDevMomentum}
        </p>
      </section>

      <section className="rounded-lg border border-terminal-border bg-terminal-surface p-6">
        <h2 className="mb-3 text-sm font-semibold text-terminal-fg">
          Open Source vs Commercial
        </h2>
        <p className="text-xs text-terminal-dim leading-relaxed">
          {category.openSourceVsCommercial}
        </p>
      </section>

      <MethodologyBlock
        methodologyNote={category.methodologyNote}
        sourceConfidenceNote={category.sourceConfidenceNote}
      />

      {category.faqs.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-terminal-fg">
            <HelpCircle className="h-4 w-4 text-terminal-muted" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {category.faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-lg border border-terminal-border bg-terminal-surface p-4"
              >
                <h3 className="mb-1.5 text-xs font-semibold text-terminal-fg">
                  {faq.q}
                </h3>
                <p className="text-xs text-terminal-dim leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
