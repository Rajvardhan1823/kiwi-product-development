import { createFileRoute } from "@tanstack/react-router";
import { Lock, Play, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { TARGET_BANK } from "@/lib/data";

export const Route = createFileRoute("/target-bank")({
  head: () => ({
    meta: [
      { title: "Target Bank | Kivi" },
      { name: "description", content: "The specific sounds and words this patient is working on, with replay audio for each." },
      { property: "og:title", content: "Target Bank | Kivi" },
      { property: "og:description", content: "The specific sounds and words this patient is working on." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TargetBank,
});

interface Entry {
  id: number;
  word: string;
  sound: string;
  note: string;
  addedBy: string;
  flagged: number;
}

function TargetBank() {
  const [entries, setEntries] = useState<Entry[]>(TARGET_BANK);
  const [word, setWord] = useState("");
  const [sound, setSound] = useState("");
  const [note, setNote] = useState("");

  const addEntry = (e: FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;
    setEntries((prev) => [
      ...prev,
      {
        id: Date.now(),
        word: word.trim(),
        sound: sound.trim() || ",",
        note: note.trim() || "Added by clinician",
        addedBy: "Dr. Rao",
        flagged: 0,
      },
    ]);
    setWord("");
    setSound("");
    setNote("");
  };

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Target Bank</h1>
          <p className="mt-1 text-muted-foreground">
            The specific sounds and words you're working on, not a general dictionary.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-[0.9rem] text-muted-foreground">
          <Lock className="h-4 w-4" aria-hidden="true" /> Patient view is read-only
        </span>
      </div>

      <ul className="mt-8 grid gap-4" aria-label="Target words and sounds">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card px-6 py-5"
          >
            <button
              type="button"
              aria-label={`Replay reference audio for ${entry.word}`}
              className="kiwi-transition inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:opacity-90"
            >
              <Play className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="min-w-40 flex-1">
              <p className="text-xl font-medium">{entry.word}</p>
              <p className="text-[0.9rem] text-muted-foreground">{entry.sound}</p>
            </div>
            <p className="flex-[2] text-[0.95rem] text-muted-foreground">{entry.note}</p>
            <div className="text-right">
              <p className="font-metrics text-2xl font-semibold text-flag-foreground">{entry.flagged}</p>
              <p className="text-[0.8rem] text-muted-foreground">times flagged</p>
            </div>
            <p className="w-full text-[0.8rem] text-muted-foreground sm:w-auto">Added by {entry.addedBy}</p>
          </li>
        ))}
      </ul>

      <section aria-labelledby="clinician-add" className="mt-10 rounded-2xl border border-dashed border-primary/40 bg-card p-8">
        <h2 id="clinician-add" className="text-xl font-medium">
          Clinician, add a target
        </h2>
        <p className="mt-1 text-[0.95rem] text-muted-foreground">
          New entries appear in the patient's bank with reference audio attached.
        </p>
        <form onSubmit={addEntry} className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <label className="flex flex-col gap-1.5">
            <span className="text-[0.9rem] font-medium">Word or phrase</span>
            <input
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g. corner"
              className="min-h-11 rounded-lg border border-input bg-background px-4 py-2.5 text-base"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[0.9rem] font-medium">Target sound</span>
            <input
              value={sound}
              onChange={(e) => setSound(e.target.value)}
              placeholder="e.g. /r/ final"
              className="min-h-11 rounded-lg border border-input bg-background px-4 py-2.5 text-base"
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="kiwi-transition inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-5 w-5" aria-hidden="true" /> Add target
            </button>
          </div>
          <label className="flex flex-col gap-1.5 sm:col-span-3">
            <span className="text-[0.9rem] font-medium">Note for the patient (optional)</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Watch the ending when tired"
              className="min-h-11 rounded-lg border border-input bg-background px-4 py-2.5 text-base"
            />
          </label>
        </form>
      </section>
    </AppShell>
  );
}
