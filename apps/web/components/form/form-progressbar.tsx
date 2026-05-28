type Props = {
  current: number; // 1-based
  total: number;
};

export function FormProgress({ current, total }: Props) {
  const pct = Math.round(((current - 1) / total) * 100);

  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 tabular-nums">
        {current} / {total}
      </span>
    </div>
  );
}