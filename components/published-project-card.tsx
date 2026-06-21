import type { PublishedProjectProjection } from "@/lib/projects/published-projection";
import { ProjectCard } from "@/components/public-ui";

interface PublishedProjectCardProps {
  project: PublishedProjectProjection;
  className?: string;
}

export function PublishedProjectCard({
  project,
  className,
}: PublishedProjectCardProps) {
  return <ProjectCard project={project} className={className} />;
}
