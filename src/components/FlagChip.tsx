import { AlertTriangle, Gauge, VolumeX } from "lucide-react";

/**
 * Flagged words always carry an icon and a plain-language label in addition to
 * the amber underline, colour is never the only signal.
 */
export function FlagIcon({ label, className = "h-4 w-4" }: { label: string; className?: string }) {
  if (label.includes("rushed") || label.includes("pause")) return <Gauge className={className} aria-hidden="true" />;
  if (label.includes("altered")) return <AlertTriangle className={className} aria-hidden="true" />;
  return <VolumeX className={className} aria-hidden="true" />;
}

export function FlagChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-flag px-2.5 py-0.5 text-[0.8rem] font-medium text-flag-foreground">
      <FlagIcon label={label} className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
