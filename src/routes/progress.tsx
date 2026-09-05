import { createFileRoute } from "@tanstack/react-router";
import { Download, Flame } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FlagChip } from "@/components/FlagChip";
import { TrendChart } from "@/components/TrendChart";
import { FLAG_LOG, PATIENT_TREND, TARGET_BANK } from "@/lib/data";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress Report — Kiwi" },
      { name: "description", content: "Your streak and clarity trend, plus an exportable phonetic accuracy log for your clinician." },
      { property: "og:title", content: "Progress Report — Kiwi" },
      { property: "og:description", content: "Your streak and clarity trend across recent practice sessions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Progress,
});

function Progress() {
  const { streak, role } = useSession();
  const view = role;
  const [exported, setExported] = useState(false);

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Progress</h1>
          <p className="mt-1 text-muted-foreground">
            {view === "patient"
              ? "The record of your recovery, in your own voice."
              : "Session-level detail for the patient you are reviewing."}
          </p>
        </div>
        <p className="rounded-full bg-card px-4 py-2 text-[0.9rem] text-muted-foreground">
          {view === "patient" ? "Your own summary" : "Clinician report — Anand K."}
        </p>
      </div>

      {view === "patient" ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="inline-flex items-center gap-2 text-sage-foreground">
              <Flame className="h-6 w-6" aria-hidden="true" />
              <span className="text-lg font-medium">Practice streak</span>
            </div>
            <p className="mt-3 font-metrics text-6xl font-semibold">{streak}</p>
            <p className="mt-1 text-muted-foreground">days in a row with a completed session</p>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">
              That's the only score here. No badges, no levels — just the fact that you showed up.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="text-xl font-medium">Clarity trend</h2>
            <p className="mt-1 text-[0.95rem] text-muted-foreground">
              Your last eight sessions. Slow and upward is exactly right.
            </p>
            <div className="mt-5">
              <TrendChart data={PATIENT_TREND} label="Clarity across your last eight sessions" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-border bg-card p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-medium">Phonetic accuracy log — Anand K.</h2>
            <button
              type="button"
              onClick={() => setExported(true)}
              className="kiwi-transition inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90"
            >
              <Download className="h-5 w-5" aria-hidden="true" />
              {exported ? "Export prepared" : "Export log"}
            </button>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Session-by-session phonetic accuracy log</caption>
              <thead>
                <tr className="border-b border-border text-[0.9rem] text-muted-foreground">
                  <th scope="col" className="py-3 pr-4 font-medium">Date</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Session</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Most frequent flag</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Flags</th>
                  <th scope="col" className="py-3 font-medium">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {FLAG_LOG.filter((r) => r.patient === "Anand K.").map((row, i) => (
                  <tr key={i} className="border-b border-border/70">
                    <td className="py-4 pr-4 font-metrics">{row.date}</td>
                    <td className="py-4 pr-4">{row.session}</td>
                    <td className="py-4 pr-4">
                      <FlagChip label={row.top} />
                    </td>
                    <td className="py-4 pr-4 font-metrics">{row.flags}</td>
                    <td className="py-4 font-metrics font-semibold text-secondary">{row.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="mt-8 text-lg font-medium">Recurring targets</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {TARGET_BANK.map((t) => (
              <li key={t.id}>
                <FlagChip label={`${t.word} — ${t.sound} (${t.flagged}×)`} />
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.9rem] text-muted-foreground">
            Kiwi flags patterns for your review. It does not diagnose, and it never smooths over an
            error.
          </p>
        </div>
      )}
    </AppShell>
  );
}
