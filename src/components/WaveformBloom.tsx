interface Props {
  /** Bars animate outward while the patient speaks. */
  active?: boolean;
  /** Live microphone loudness, 0–1. When given, bars follow the real voice. */
  level?: number;
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
export function WaveformBloom({ active = false, level, flagAt, height = 56, bars = 28, className = "" }: Props) {
  const items = Array.from({ length: bars }, (_, i) => i);
  const mid = (bars - 1) / 2;
  const live = typeof level === "number";

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
        const liveScale = live ? 0.14 + level! * (0.5 + (1 - distance)) : 1;
        return (
          <span
            key={i}
            className={active && !live ? "waveform-bar rounded-full" : "kiwi-transition rounded-full"}
            style={{
              width: 4,
              height: Math.max(5, height * base * liveScale),
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
