import { createFileRoute } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FlagChip } from "@/components/FlagChip";
import { TrendChart } from "@/components/TrendChart";
import { FLAG_LOG, PATIENTS, presetById } from "@/lib/data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Analysis Dashboard — Kiwi for Clinicians" },
      { name: "description", content: "Patient list, per-patient accuracy trends, and a session-by-session flag log for speech-language pathologists." },
      { property: "og:title", content: "Analysis Dashboard — Kiwi for Clinicians" },
      { property: "og:description", content: "Objective session data across your caseload, instead of patient self-report." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [selectedId, setSelectedId] = useState(PATIENTS[0].id);
  const patient = PATIENTS.find((p) => p.id === selectedId) ?? PATIENTS[0];
  const preset = presetById(patient.preset);
  const log = FLAG_LOG.filter((r) => r.patient === patient.name);

  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Analysis Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Objective session data across your caseload — not what a patient remembers to mention.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
        <nav aria-label="Patient list" className="flex flex-col gap-3">
          {PATIENTS.map((p) => {
            const active = p.id === selectedId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                aria-pressed={active}
                className={`kiwi-transition rounded-2xl border-2 bg-card px-5 py-4 text-left min-h-11 ${
                  active ? "border-primary" : "border-border hover:border-primary/40"
                }`}
              >
                <p className="text-lg font-medium">{p.name}</p>
                <p className="text-[0.9rem] text-muted-foreground">{p.condition}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-[0.85rem] text-sage-foreground">
                  <Flame className="h-4 w-4" aria-hidden="true" />
                  <span className="font-metrics">{p.streak}-day streak</span>
                </p>
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-card p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-medium tracking-tight">{patient.name}</h2>
                <p className="text-muted-foreground">Last session {patient.lastSession}</p>
              </div>
              <div className="text-right">
                <p className="font-metrics text-4xl font-semibold text-secondary">
                  {patient.trend[patient.trend.length - 1]}%
                </p>
                <p className="text-[0.85rem] text-muted-foreground">current accuracy</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-accent px-4 py-1.5 text-[0.9rem] font-medium text-accent-foreground">
                Recommended preset: {preset.name}
              </span>
              <span className="rounded-full bg-muted px-4 py-1.5 text-[0.9rem] text-muted-foreground">
                <span className="font-metrics">{patient.sessionsThisWeek}</span> sessions this week
              </span>
            </div>
            <div className="mt-6 max-w-xl">
              <TrendChart data={patient.trend} label={`Accuracy trend for ${patient.name}, last eight sessions`} />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-8">
            <h2 className="text-xl font-medium">Session flag log</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Session-by-session flag log for {patient.name}</caption>
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
                  {log.length > 0 ? (
                    log.map((row, i) => (
                      <tr key={i} className="border-b border-border/70">
                        <td className="py-4 pr-4 font-metrics">{row.date}</td>
                        <td className="py-4 pr-4">{row.session}</td>
                        <td className="py-4 pr-4">
                          <FlagChip label={row.top} />
                        </td>
                        <td className="py-4 pr-4 font-metrics">{row.flags}</td>
                        <td className="py-4 font-metrics font-semibold text-secondary">{row.accuracy}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-muted-foreground">
                        No sessions logged for this patient yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
