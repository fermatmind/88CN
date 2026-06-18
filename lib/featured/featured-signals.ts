import { getProjectBySlug, type DemoProject } from "@/lib/demo-projects";
import { isFeaturedEligibleProject } from "@/lib/featured/eligibility";
import { isFeaturedSignalsEnabled } from "@/lib/featured/flags";

export type FeaturedSurface = "home" | "category";

export interface FeaturedSignal {
  slug: string;
  categorySlug?: string;
  placementNote: string;
  source: "static-v0-fixture";
}

export interface FeaturedSignalViewModel {
  project: DemoProject;
  placementNote: string;
}

// Static v0 fixture only. This data is not used unless the server flag is true.
const featuredSignalFixtures: FeaturedSignal[] = [
  {
    slug: "aurora-code",
    categorySlug: "ai-agents",
    placementNote: "Reviewed public project with active development signals.",
    source: "static-v0-fixture",
  },
  {
    slug: "vectorbase",
    categorySlug: "open-source-ai",
    placementNote: "Reviewed public project with clear source references.",
    source: "static-v0-fixture",
  },
];

export function getFeaturedSignals({
  surface,
  categorySlug,
}: {
  surface: FeaturedSurface;
  categorySlug?: string;
}): FeaturedSignalViewModel[] {
  if (!isFeaturedSignalsEnabled()) return [];

  const viewModels: FeaturedSignalViewModel[] = [];

  for (const fixture of featuredSignalFixtures) {
    if (surface === "category" && fixture.categorySlug !== categorySlug) {
      continue;
    }

    const project = getProjectBySlug(fixture.slug);
    if (!isFeaturedEligibleProject(project)) {
      continue;
    }

    viewModels.push({
      project,
      placementNote: fixture.placementNote,
    });
  }

  return viewModels;
}
