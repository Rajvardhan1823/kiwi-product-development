interface Props {
  data: number[];
  label: string;
  height?: number;
}

/** Simple, calm line trend — no motion, no flashing. */
export function TrendChart({ data, label, height = 160 }: Props) {
  const width = 420;
  const min = Math.min(...data) - 6;
  const max = Math.max(...data) + 4;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / (max - min)) * height;
    return [x, y] as const;
  });
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${path} L${width},${height} L0,${height} Z`;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${label}. From ${data[0]} percent to ${data[data.length - 1]} percent across ${data.length} sessions.`}
      >
        <path d={area} fill="var(--sage)" opacity="0.7" />
        <path d={path} fill="none" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4.5" fill="var(--card)" stroke="var(--secondary)" strokeWidth="2.5" />
        ))}
      </svg>
      <figcaption className="mt-2 text-[0.9rem] text-muted-foreground">{label}</figcaption>
    </figure>
  );
}
