import { AssetCard } from "@/components/asset-card";
import type { Project } from "@/lib/types/asset";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article>
      <AssetCard asset={project} />
    </article>
  );
}
