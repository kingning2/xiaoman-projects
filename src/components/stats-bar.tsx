import { formatUpdatedAt } from "@/lib/format-date";

type StatsBarProps = {
  projectCount: number;
  toolCount: number;
  latestUpdatedAt: string | null;
};

export function StatsBar({
  projectCount,
  toolCount,
  latestUpdatedAt,
}: StatsBarProps) {
  return (
    <section
      data-reveal
      className="mb-12 grid gap-4 rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-sm sm:grid-cols-3"
    >
      <StatItem label="开源项目" value={projectCount} dataStat="projects" />
      <StatItem label="实用工具" value={toolCount} dataStat="tools" />
      <div data-stat-block className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          最近更新
        </p>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">
          {latestUpdatedAt ? formatUpdatedAt(latestUpdatedAt) : "—"}
        </p>
      </div>
    </section>
  );
}

function StatItem({
  label,
  value,
  dataStat,
}: {
  label: string;
  value: number;
  dataStat: string;
}) {
  return (
    <div data-stat-block className="space-y-1">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className="text-2xl font-semibold tracking-tight text-accent-brand tabular-nums"
        data-stat={dataStat}
        data-stat-value={value}
      >
        {value}
      </p>
    </div>
  );
}
