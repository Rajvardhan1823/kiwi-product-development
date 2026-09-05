interface Props {
  /** Bars animate outward while the patient speaks. */
  active?: boolean;
  /** Index of the bar that carries the example flag marker. */
  flagAt?: number;
  height?: number;
  bars?: number;
  className?: string;
}

/**
 * Waveform Bloom — the product mark. A soft waveform that blooms outward as
 * the patient speaks. Replaces the cartoon mascot entirely.
 */
export function WaveformBloom({ active = false, flagAt, height = 56, bars = 28, className = "" }: Props) {
  const items = Array.from({ length: bars }, (_, i) => i);
  const mid = (bars - 1) / 2;

  return (
    <div
      className={`flex items-center justify-center gap-[3px] ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      {items.map((i) => {
        const distance = Math.abs(i - mid) / mid;
        const base = 0.28 + (1 - distance) * 0.72;
        const isFlag = flagAt === i;
        return (
          <span
            key={i}
            className={active ? "waveform-bar rounded-full" : "rounded-full"}
            style={{
              width: 4,
              height: Math.max(6, height * base),
              backgroundColor: isFlag ? "var(--flag-foreground)" : "var(--primary)",
              opacity: isFlag ? 1 : 0.35 + (1 - distance) * 0.5,
              animationDelay: `${(i % 7) * 0.14}s`,
            }}
          />
        );
      })}
    </div>
  );
}
