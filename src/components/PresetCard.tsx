import { BadgeCheck } from "lucide-react";
import type { TherapyPreset } from "@/lib/data";
import { FlagChip } from "./FlagChip";
import { WaveformBloom } from "./WaveformBloom";

interface Props {
  preset: TherapyPreset;
  selected: boolean;
  recommended?: boolean;
  onSelect: () => void;
}

/**
 * A Preset is a large card with a one-line consequence — never a dropdown row.
 * Each card shows a mocked 3-second waveform with one example flag so the
 * patient hears the consequence of the choice before committing to it.
 */
export function PresetCard({ preset, selected, recommended, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`kiwi-transition relative flex w-full flex-col gap-4 rounded-2xl border-2 bg-card p-6 text-left min-h-11 ${
        selected
          ? "border-primary shadow-[0_0_0_4px_var(--accent)]"
          : "border-border hover:border-primary/50"
      }`}
    >
      {recommended && (
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-sage px-3 py-1 text-[0.8rem] font-medium text-sage-foreground">
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Your clinician suggested this
        </span>
      )}
      <div>
        <h3 className="text-xl font-medium">{preset.name}</h3>
        <p className="mt-1 text-[1.05rem] font-medium text-primary">{preset.consequence}</p>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{preset.detail}</p>
      </div>
      <div className="rounded-xl bg-muted px-4 py-3">
        <WaveformBloom active={selected} flagAt={16} height={40} bars={26} />
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[0.8rem] text-muted-foreground">What Kiwi would flag:</span>
          <FlagChip label={preset.exampleFlag} />
        </div>
      </div>
      <span
        className={`kiwi-transition self-start rounded-lg px-4 py-2 text-[0.95rem] font-medium ${
          selected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
        }`}
      >
        {selected ? "Selected" : "Choose this focus"}
      </span>
    </button>
  );
}
