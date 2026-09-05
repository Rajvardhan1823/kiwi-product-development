import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Mic, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ASSIGNED_READING, PATIENT_TREND, presetById } from "@/lib/data";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — Kiwi" },
      { name: "description", content: "Today's assigned reading, your streak, and one tap into practice." },
      { property: "og:title", content: "Home — Kiwi" },
      { property: "og:description", content: "Today's assigned reading, your streak, and one tap into practice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { streak, presetId } = useSession();
  const preset = presetById(presetId);

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Good morning, Anand</h1>
          <p className="mt-1 text-muted-foreground">One session today. Take it at your own pace.</p>
        </div>
        <div
          className="inline-flex items-center gap-2 rounded-full bg-sage px-4 py-2 text-sage-foreground"
          aria-label={`Current streak: ${streak} days`}
        >
          <Flame className="h-5 w-5" aria-hidden="true" />
          <span className="font-metrics text-lg font-semibold">{streak}-day streak</span>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <article className="rounded-2xl border border-border bg-card p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-medium">Today's reading — {ASSIGNED_READING.title}</h2>
            <span className="rounded-full bg-accent px-3 py-1 text-[0.8rem] font-medium text-accent-foreground">
              {preset.name}
            </span>
          </div>
          <p className="mt-4 max-h-40 overflow-hidden text-xl leading-relaxed [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
            {ASSIGNED_READING.text}
          </p>
          <Link
            to="/practice"
            className="kiwi-transition mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
          >
            <Mic className="h-5 w-5" aria-hidden="true" />
            Open Practice Studio
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </article>

        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" aria-hidden="true" />
              <h2 className="text-lg font-medium">Clarity this week</h2>
            </div>
            <p className="mt-3 font-metrics text-4xl font-semibold text-secondary">
              {PATIENT_TREND[PATIENT_TREND.length - 1]}%
            </p>
            <p className="mt-1 text-[0.9rem] text-muted-foreground">
              Up from {PATIENT_TREND[0]}% eight sessions ago. Steady, honest progress.
            </p>
            <Link
              to="/progress"
              className="kiwi-transition mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-input bg-card px-4 py-2.5 font-medium hover:bg-accent"
            >
              See last progress summary
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-medium">Your focus right now</h2>
            <p className="mt-2 text-[0.95rem] text-muted-foreground">{preset.consequence}</p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
