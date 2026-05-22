import { AssetCard } from "@/components/asset-card";
import { ToolCard } from "@/components/tool-card";
import type { Asset, Project, Tool } from "@/lib/types/asset";

function isTool(asset: Asset): asset is Tool {
  return asset.type === "tool";
}

type FeaturedSectionProps = {
  items: Asset[];
};

export function FeaturedSection({ items }: FeaturedSectionProps) {
  if (items.length === 0) return null;

  return (
    <section data-reveal className="mb-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div data-reveal-title>
          <h2 className="text-lg font-semibold tracking-tight">精选</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            代表作与近期维护的重点仓库
          </p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {items.map((asset) => (
          <div key={asset.id} data-reveal-item className="min-h-0">
            {isTool(asset) ? (
              <ToolCard tool={asset} featured />
            ) : (
              <FeaturedProjectCard project={asset} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <article>
      <AssetCard asset={project} featured />
    </article>
  );
}
