import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Languages, Mic, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LANGUAGES, PATIENT_TREND, languageByCode, presetById } from "@/lib/data";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Your practice today | Kiwi" },
      { name: "description", content: "Your reading for today, your streak, and one tap into practice." },
      { property: "og:title", content: "Your practice today | Kiwi" },
      { property: "og:description", content: "Your reading for today, your streak, and one tap into practice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { streak, presetId, profile, setProfile } = useSession();
  const preset = presetById(presetId);
  const language = languageByCode(profile.language);

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">
            Good to see you, {profile.name || "friend"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            You have one reading waiting today. Take it at your own pace, and stop whenever you like.
          </p>
        </div>
        <div
          className="inline-flex items-center gap-2 rounded-full bg-sage px-4 py-2 text-sage-foreground"
          aria-label={`Your current streak: ${streak} days`}
        >
          <Flame className="h-5 w-5" aria-hidden="true" />
          <span className="font-metrics text-lg font-semibold">{streak} days in a row</span>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <article className="rounded-2xl border border-border bg-card p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-medium">Your reading today: {language.title}</h2>
            <span className="rounded-full bg-accent px-3 py-1 text-[0.8rem] font-medium text-accent-foreground">
              {preset.name}
            </span>
          </div>
          <p className="mt-4 max-h-40 overflow-hidden text-xl leading-relaxed [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
            {language.text}
          </p>
          <p className="mt-4 text-[0.95rem] text-muted-foreground">
            You will hear it read aloud first, then read it back in your own time.
          </p>
          <Link
            to="/practice"
            className="kiwi-transition mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
          >
            <Mic className="h-5 w-5" aria-hidden="true" />
            Start your practice
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </article>

        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" aria-hidden="true" />
              <h2 className="text-lg font-medium">How clearly you spoke</h2>
            </div>
            <p className="mt-3 font-metrics text-4xl font-semibold text-secondary">
              {PATIENT_TREND[PATIENT_TREND.length - 1]}%
            </p>
            <p className="mt-1 text-[0.9rem] text-muted-foreground">
              You were at {PATIENT_TREND[0]}% eight sessions ago. That is steady, real progress.
            </p>
            <Link
              to="/progress"
              className="kiwi-transition mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-input bg-card px-4 py-2.5 font-medium hover:bg-accent"
            >
              See your full progress
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-medium">What Kiwi is listening for</h2>
            <p className="mt-2 text-[0.95rem] text-muted-foreground">{preset.consequence}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <label className="grid gap-2">
              <span className="inline-flex items-center gap-2 text-lg font-medium">
                <Languages className="h-5 w-5 text-primary" aria-hidden="true" />
                Your practice language
              </span>
              <select
                value={profile.language}
                onChange={(e) => setProfile({ language: e.target.value })}
                className="min-h-11 rounded-xl border border-input bg-background px-4 py-2.5"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label} ({l.native})
                  </option>
                ))}
              </select>
              <span className="text-[0.9rem] text-muted-foreground">
                Kiwi reads aloud and listens in this language.
              </span>
            </label>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
