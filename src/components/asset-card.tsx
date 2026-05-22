import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatUpdatedAt } from "@/lib/format-date";
import type { AssetBase } from "@/lib/types/asset";

type AssetCardProps = {
  asset: AssetBase;
  children?: React.ReactNode;
};

export function AssetCard({ asset, children }: AssetCardProps) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">
          <h3 className="font-semibold tracking-tight">{asset.name}</h3>
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {asset.description}
        </CardDescription>
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
      <CardFooter className="flex flex-col items-start gap-3 border-t-0 bg-transparent">
        <div className="flex flex-wrap gap-1.5">
          {asset.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-mono text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex w-full items-center justify-between gap-2 text-xs text-muted-foreground">
          <time dateTime={asset.updatedAt}>
            更新于 {formatUpdatedAt(asset.updatedAt)}
          </time>
          <a
            href={asset.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
          >
            GitHub
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
