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
  featured?: boolean;
};

export function AssetCard({
  asset,
  children,
  className,
  style,
  featured = false,
}: AssetCardProps) {
  return (
    <a
      href={asset.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-card-hover
      style={style}
      className={cn(
        "group/card relative block h-full outline-none will-change-transform",
        "focus-visible:ring-2 focus-visible:ring-accent-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      aria-label={`${asset.name}，前往 GitHub 仓库`}
    >
      <div
        data-card-glow
        className="pointer-events-none absolute -inset-2 z-0 rounded-2xl bg-accent-brand/20 opacity-0 blur-2xl"
        aria-hidden
      />
      <Card
        className={cn(
          "relative z-10 h-full border-border/80 bg-card/90 backdrop-blur-sm",
          "group-hover/card:border-accent-brand/50 group-hover/card:shadow-xl group-hover/card:shadow-accent-brand/10",
          featured && "border-accent-brand/25 lg:min-h-[220px]",
        )}
      >
        {featured ? (
          <div className="h-1.5 w-full rounded-t-xl bg-linear-to-r from-accent-brand via-accent-brand/80 to-transparent" />
        ) : null}
        <CardHeader className={featured ? "pb-2" : undefined}>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className={featured ? "text-xl" : "text-lg"}>
              <h3 className="font-semibold tracking-tight">{asset.name}</h3>
            </CardTitle>
            <ArrowUpRight
              data-card-arrow
              className="size-4 shrink-0 text-muted-foreground"
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
                className="font-mono text-xs group-hover/card:border-accent-brand/30 group-hover/card:bg-accent-brand/10"
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
