import { AssetCard } from "@/components/asset-card";
import type { Tool } from "@/lib/types/asset";

type ToolCardProps = {
  tool: Tool;
  featured?: boolean;
};

export function ToolCard({ tool, featured }: ToolCardProps) {
  return (
    <article>
      <AssetCard asset={tool} featured={featured}>
        <div className="space-y-1 rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5">
          <p className="text-xs font-medium text-muted-foreground">
            解决的问题
          </p>
          <p className="text-sm leading-relaxed text-foreground">
            {tool.problemSolved}
          </p>
        </div>
      </AssetCard>
    </article>
  );
}
