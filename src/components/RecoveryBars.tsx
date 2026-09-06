interface Props {
  /** Slips per session, oldest first. Fewer is better. */
  history: number[];
  label: string;
}

/**
 * Calm bar view of how often one sound still slips, session by session.
 * Shorter bars on the right mean the sound is recovering.
 */
export function RecoveryBars({ history, label }: Props) {
  const max = Math.max(...history, 1);
  return (
    <div className="mt-3">
      <div className="flex items-end gap-1.5" style={{ height: 56 }} role="img" aria-label={label}>
        {history.map((v, i) => {
          const latest = i === history.length - 1;
          return (
            <span
              key={i}
              className="flex-1 rounded-t-md"
              style={{
                height: `${Math.max(8, (v / max) * 100)}%`,
                backgroundColor: latest ? "var(--secondary)" : "var(--sage)",
                opacity: latest ? 1 : 0.55 + (i / history.length) * 0.3,
              }}
            />
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-[0.8rem] text-muted-foreground">
        <span>6 sessions ago</span>
        <span>Latest</span>
      </div>
    </div>
  );
}
