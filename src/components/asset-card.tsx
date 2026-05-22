import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatUpdatedAt } from "@/lib/format-date";
import type { AssetBase } from "@/lib/types/asset";

type AssetCardProps = {
  asset: AssetBase;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function AssetCard({
  asset,
  children,
  className,
  style,
}: AssetCardProps) {
  return (
    <a
      href={asset.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      className={cn(
        "group/card block h-full outline-none transition-[transform,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] active:duration-150",
        "focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50",
        className,
      )}
      aria-label={`${asset.name}，前往 GitHub 仓库`}
    >
      <Card className="h-full border-zinc-200/80 transition-colors duration-300 group-hover/card:border-zinc-300 group-hover/card:bg-white">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">
              <h3 className="font-semibold tracking-tight">{asset.name}</h3>
            </CardTitle>
            <ArrowUpRight
              className="size-4 shrink-0 text-zinc-400 transition-all duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-zinc-700"
              aria-hidden
            />
          </div>
          <CardDescription className="line-clamp-3">
            {asset.description}
          </CardDescription>
        </CardHeader>
        {children ? <CardContent>{children}</CardContent> : null}
        <CardFooter className="flex flex-col items-start gap-3 border-t-0 bg-transparent">
          <div className="flex flex-wrap gap-1.5">
            {asset.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="font-mono text-xs transition-colors group-hover/card:bg-zinc-100"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <time
            dateTime={asset.updatedAt}
            className="text-xs text-muted-foreground"
          >
            更新于 {formatUpdatedAt(asset.updatedAt)}
          </time>
        </CardFooter>
      </Card>
    </a>
  );
}
