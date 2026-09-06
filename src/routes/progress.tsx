import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpenCheck, Download, Flame, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FlagChip } from "@/components/FlagChip";
import { RecoveryBars } from "@/components/RecoveryBars";
import { TrendChart } from "@/components/TrendChart";
import { ERROR_RECOVERY, FLAG_LOG, PATIENT_MISTAKES, PATIENT_TREND, TARGET_BANK } from "@/lib/data";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress Report | Kivi" },
      { name: "description", content: "Your streak and clarity trend, plus an exportable phonetic accuracy log for your clinician." },
      { property: "og:title", content: "Progress Report | Kivi" },
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
          {view === "patient" ? "Your own summary" : "Clinician report, Anand K."}
        </p>
      </div>

      {view === "patient" ? (
        <div className="mt-8 space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="inline-flex items-center gap-2 text-sage-foreground">
                <Flame className="h-6 w-6" aria-hidden="true" />
                <span className="text-lg font-medium">Practice streak</span>
              </div>
              <p className="mt-3 font-metrics text-6xl font-semibold">{streak}</p>
              <p className="mt-1 text-muted-foreground">days in a row</p>
              <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
                No badges, no levels, just the fact that you showed up.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="inline-flex items-center gap-2 text-secondary">
                <Target className="h-6 w-6" aria-hidden="true" />
                <span className="text-lg font-medium">Latest clarity</span>
              </div>
              <p className="mt-3 font-metrics text-6xl font-semibold">
                {PATIENT_TREND[PATIENT_TREND.length - 1]}%
              </p>
              <p className="mt-1 text-muted-foreground">of words spoken clearly, last session</p>
              <p className="mt-5 inline-flex items-center gap-2 text-[0.95rem] font-medium text-sage-foreground">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
                Up {PATIENT_TREND[PATIENT_TREND.length - 1]! - PATIENT_TREND[0]!} points since you started
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="inline-flex items-center gap-2 text-secondary">
                <BookOpenCheck className="h-6 w-6" aria-hidden="true" />
                <span className="text-lg font-medium">Sessions done</span>
              </div>
              <p className="mt-3 font-metrics text-6xl font-semibold">{PATIENT_TREND.length}</p>
              <p className="mt-1 text-muted-foreground">completed readings so far</p>
              <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
                Your clinician sees the same numbers you do.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="text-xl font-medium">How your clarity is moving</h2>
            <p className="mt-1 text-[0.95rem] text-muted-foreground">
              Your last eight sessions. Slow and upward is exactly right.
            </p>
            <div className="mt-5">
              <TrendChart data={PATIENT_TREND} label="Clarity across your last eight sessions" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="text-xl font-medium">Each sound, and how it is recovering</h2>
            <p className="mt-1 text-[0.95rem] text-muted-foreground">
              One card per sound you are working on. Shorter bars on the right mean it slipped less
              often in your recent sessions.
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {ERROR_RECOVERY.map((e) => {
                const first = e.history[0]!;
                const now = e.history[e.history.length - 1]!;
                const better = first - now;
                const pct = first > 0 ? Math.round((better / first) * 100) : 0;
                return (
                  <article key={e.word} className="rounded-xl border border-border/70 bg-background p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-lg font-medium">“{e.word}”</p>
                      <FlagChip label={e.label} />
                    </div>
                    <p className="mt-1 text-[0.9rem] text-muted-foreground">{e.sound}</p>
                    <RecoveryBars
                      history={e.history}
                      label={`“${e.word}” slipped ${first} times six sessions ago and ${now} times in your latest session.`}
                    />
                    <p className="mt-3 inline-flex items-center gap-2 text-[0.95rem] font-medium text-sage-foreground">
                      <TrendingUp className="h-5 w-5" aria-hidden="true" />
                      {better > 0
                        ? `${pct}% fewer slips than when you started`
                        : "Holding steady, keep practising"}
                    </p>
                    <p className="mt-1 text-[0.9rem] text-muted-foreground">{e.tip}</p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[0.85rem] text-muted-foreground">
                        <span>Practice runs this month</span>
                        <span className="font-metrics">
                          {e.practised} of {e.goal}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2.5 w-full rounded-full bg-muted">
                        <div
                          className="h-2.5 rounded-full bg-primary"
                          style={{ width: `${Math.min(100, (e.practised / e.goal) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">

            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="text-xl font-medium">Words Kivi noticed in your last reading</h2>
              <p className="mt-1 text-[0.95rem] text-muted-foreground">
                These aren't failures, they're the exact spots where practice pays off.
              </p>
              <ul className="mt-5 space-y-3">
                {PATIENT_MISTAKES.map((m) => (
                  <li
                    key={m.word}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-background px-4 py-3"
                  >
                    <div>
                      <p className="text-lg font-medium">“{m.word}”</p>
                      <p className="text-[0.9rem] text-muted-foreground">{m.tip}</p>
                    </div>
                    <FlagChip label={m.label} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="text-xl font-medium">Words to practise next</h2>
              <p className="mt-1 text-[0.95rem] text-muted-foreground">
                The sounds your clinician is watching, with how often they've come up.
              </p>
              <ul className="mt-5 space-y-3">
                {TARGET_BANK.map((t) => (
                  <li key={t.id} className="rounded-xl border border-border/70 bg-background px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-lg font-medium">“{t.word}”</p>
                      <span className="font-metrics text-[0.9rem] text-muted-foreground">
                        {t.flagged}× flagged
                      </span>
                    </div>
                    <p className="mt-1 text-[0.9rem] text-muted-foreground">
                      {t.sound}, {t.note.toLowerCase()}
                    </p>
                  </li>
                ))}
              </ul>
              <Link
                to="/practice"
                className="kiwi-transition mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90"
              >
                Practise these now
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="text-xl font-medium">Your recent sessions</h2>
            <p className="mt-1 text-[0.95rem] text-muted-foreground">
              What you read, what came up, and how clearly it came out.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Your recent practice sessions</caption>
                <thead>
                  <tr className="border-b border-border text-[0.9rem] text-muted-foreground">
                    <th scope="col" className="py-3 pr-4 font-medium">Date</th>
                    <th scope="col" className="py-3 pr-4 font-medium">Reading</th>
                    <th scope="col" className="py-3 pr-4 font-medium">Kivi noticed</th>
                    <th scope="col" className="py-3 font-medium">Clarity</th>
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
                      <td className="py-4 font-metrics font-semibold text-secondary">{row.accuracy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-[0.9rem] text-muted-foreground">
              Kivi shows you patterns honestly. It never smooths over a slip, and it never scolds you
              for one either.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-border bg-card p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-medium">Phonetic accuracy log, Anand K.</h2>
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
                <FlagChip label={`${t.word}, ${t.sound} (${t.flagged}×)`} />
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.9rem] text-muted-foreground">
            Kivi flags patterns for your review. It does not diagnose, and it never smooths over an
            error.
          </p>
        </div>
      )}
    </AppShell>
  );
}
