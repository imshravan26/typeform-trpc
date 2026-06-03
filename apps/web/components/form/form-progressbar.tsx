type Props = {
  current: number;
  total: number;
};

export function FormProgress({ current, total }: Props) {
  const pct = Math.round(((current - 1) / total) * 100);

  return (
    <div className="flex items-center gap-3 font-mono text-xs text-[var(--text-muted)]">
      <div className="relative h-px flex-1 overflow-hidden bg-[var(--border)]">
        <div
          className="absolute inset-y-0 left-0 bg-[var(--accent)] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 tabular-nums">
        {current} / {total}
      </span>
    </div>
  );
}
