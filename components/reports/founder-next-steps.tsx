import Link from "next/link";
import type { FounderStep } from "@/lib/reports/seed-100-readiness-report";

interface FounderNextStepsProps {
  steps: FounderStep[];
}

export function FounderNextSteps({ steps }: FounderNextStepsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {steps.map((step) => {
        const content = (
          <>
            <h3 className="text-xs font-semibold text-terminal-fg">
              {step.label}
            </h3>
            <p className="mt-2 text-[11px] leading-relaxed text-terminal-dim">
              {step.body}
            </p>
          </>
        );

        if (step.href) {
          return (
            <Link
              key={step.label}
              href={step.href}
              className="block rounded-md border border-terminal-border bg-terminal-surface p-4 transition-colors hover:border-terminal-ring"
            >
              {content}
            </Link>
          );
        }

        return (
          <div
            key={step.label}
            className="rounded-md border border-terminal-border bg-terminal-surface p-4"
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
