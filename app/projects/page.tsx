import { getPublishedProjects } from "@/lib/demo-projects";
import ProjectCard from "@/components/project-card";
import { siteTitle, siteDescription } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteTitle("Projects"),
  description: siteDescription(
    "Browse free AI project profiles on 88CN. Discover early-stage AI projects with public growth signals, Signal Scores, and editorial insights."
  ),
};

export default function ProjectsPage() {
  const projects = getPublishedProjects();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-terminal-fg">
          Projects
        </h1>
        <p className="text-sm text-terminal-dim">
          {projects.length} projects indexed with public growth signals.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm text-terminal-dim">
            No published projects yet.
          </p>
          <p className="mt-1 text-xs text-terminal-dim/60">
            Projects are listed here after editorial review and publication.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
