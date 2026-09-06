import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpenText, Languages, Mic, Play, Sparkles, Square, Stethoscope, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { KiwiBird, KiwiWordmark } from "@/components/KiwiLogo";
import { PresetCard } from "@/components/PresetCard";
import { WaveformBloom } from "@/components/WaveformBloom";
import { ASSIGNED_READING, LANGUAGES, PRESETS, languageByCode } from "@/lib/data";
import { useSession } from "@/lib/session";
import { speak, speechSupported, stopSpeaking } from "@/lib/speech";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welcome to Kiwi | Speech Practice Companion" },
      {
        name: "description",
        content:
          "Kiwi is a private, on device practice partner between speech therapy sessions. Get set up in four gentle steps.",
      },
      { property: "og:title", content: "Welcome to Kiwi" },
      {
        property: "og:description",
        content: "A private, on device practice partner between speech therapy sessions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const TOTAL_STEPS = 4;

function Onboarding() {
  const [step, setStep] = useState(0);
  const { presetId, setPresetId, completeOnboarding, setRole, profile, setProfile } = useSession();
  const navigate = useNavigate();
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const language = languageByCode(profile.language);

  useEffect(() => () => stopSpeaking(), []);

  const play = (id: string, text: string) => {
    if (!speechSupported()) return;
    if (speakingId === id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(id);
    void speak(text, { lang: profile.language, onEnd: () => setSpeakingId(null) });
  };

  const enterClinician = () => {
    setRole("clinician");
    completeOnboarding();
    navigate({ to: "/dashboard" });
  };

  const finish = () => {
    setRole("patient");
    completeOnboarding();
    navigate({ to: "/practice" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-3xl flex-col px-6 py-10">
        <div className="flex items-center justify-between">
          <KiwiWordmark className="h-9" />
          <span className="font-metrics text-sm text-muted-foreground" aria-live="polite">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
        </div>

        <ol className="mt-6 flex gap-2" aria-hidden="true">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <li key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </ol>

        {step === 0 && (
          <section aria-labelledby="step-who" className="mt-12">
            <div className="flex justify-center">
              <KiwiBird className="h-28 w-28" />
            </div>
            <h1 id="step-who" className="mt-8 text-center text-4xl font-medium tracking-tight">
              A practice partner that listens, and never judges.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted-foreground">
              Kiwi helps you practise speaking between sessions with your clinician. It points out
              what it hears, honestly and kindly, so your progress is real, and yours.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="kiwi-transition rounded-2xl border-2 border-border bg-card p-6 text-left hover:border-primary"
              >
                <UserRound className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="mt-3 text-lg font-medium">I'm here to practise</h2>
                <p className="mt-1 text-[0.95rem] text-muted-foreground">
                  One task at a time. No timers, no pressure. Your recordings stay on this device.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-medium text-primary">
                  Set up my practice <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </button>
              <button
                type="button"
                onClick={enterClinician}
                className="kiwi-transition rounded-2xl border-2 border-border bg-card p-6 text-left hover:border-foreground"
              >
                <Stethoscope className="h-6 w-6 text-foreground" aria-hidden="true" />
                <h2 className="mt-3 text-lg font-medium">I'm a clinician</h2>
                <p className="mt-1 text-[0.95rem] text-muted-foreground">
                  Clear, honest logs of every session, not guesswork from memory.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-medium">
                  Open my caseload <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </button>
            </div>
            <p className="mt-6 text-center text-[0.9rem] text-muted-foreground">
              No sign in. Pick a view now and switch any time from the bar at the top.
            </p>
          </section>
        )}

        {step === 1 && (
          <section aria-labelledby="step-you" className="mt-12">
            <h1 id="step-you" className="text-3xl font-medium tracking-tight">
              A few details, so Kiwi can greet you properly
            </h1>
            <p className="mt-2 text-muted-foreground">
              This stays on your device. There is no account and no password.
            </p>
            <div className="mt-8 grid gap-5 rounded-2xl border border-border bg-card p-8">
              <label className="grid gap-2">
                <span className="font-medium">What should Kiwi call you?</span>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ name: e.target.value })}
                  className="min-h-11 rounded-xl border border-input bg-background px-4 py-2.5 text-lg"
                  placeholder="Your first name"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-medium">Your age</span>
                <input
                  value={profile.age}
                  onChange={(e) => setProfile({ age: e.target.value.replace(/[^0-9]/g, "") })}
                  inputMode="numeric"
                  className="min-h-11 w-40 rounded-xl border border-input bg-background px-4 py-2.5 font-metrics text-lg"
                  placeholder="58"
                />
              </label>
              <label className="grid gap-2">
                <span className="inline-flex items-center gap-2 font-medium">
                  <Languages className="h-5 w-5 text-primary" aria-hidden="true" />
                  Language you want to practise in
                </span>
                <select
                  value={profile.language}
                  onChange={(e) => setProfile({ language: e.target.value })}
                  className="min-h-11 rounded-xl border border-input bg-background px-4 py-2.5 text-lg"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label} ({l.native})
                    </option>
                  ))}
                </select>
                <span className="text-[0.9rem] text-muted-foreground">
                  Kiwi will read aloud and listen in this language. You can change it any time.
                </span>
              </label>
              <label className="grid gap-2">
                <span className="font-medium">What are you working on?</span>
                <input
                  value={profile.workingOn}
                  onChange={(e) => setProfile({ workingOn: e.target.value })}
                  className="min-h-11 rounded-xl border border-input bg-background px-4 py-2.5 text-lg"
                  placeholder="Speaking clearly after a stroke"
                />
              </label>
            </div>
            <StepNav onBack={() => setStep(0)} onNext={() => setStep(2)} nextLabel="See how a session works" />
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="step-session" className="mt-12">
            <h1 id="step-session" className="text-3xl font-medium tracking-tight">
              Here is exactly how your first session will go
            </h1>
            <p className="mt-2 text-muted-foreground">
              Four minutes, four simple moments. Nothing starts until you press a button.
            </p>

            <ol className="mt-8 grid gap-4">
              {[
                {
                  icon: Play,
                  title: "1. You listen first",
                  body: "Kiwi reads your passage aloud at a gentle pace, so you know how it should sound. You can replay it as often as you like.",
                },
                {
                  icon: Mic,
                  title: "2. You read it back",
                  body: "Press the big button and speak. The bars move with your voice while you record, so you can see Kiwi is listening. Stop whenever you want.",
                },
                {
                  icon: Sparkles,
                  title: "3. Kiwi shows what it heard",
                  body: "Your words appear on screen. Anything that came out differently gets a small marker and a plain sentence explaining what happened.",
                },
                {
                  icon: BookOpenText,
                  title: "4. You practise one word",
                  body: "Tap a marked word and Kiwi builds four short sentences around that sound, and reads each one aloud for you.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4 rounded-2xl border border-border bg-card p-6">
                  <Icon className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h2 className="text-lg font-medium">{title}</h2>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <article className="mt-8 rounded-2xl border-2 border-primary/30 bg-card p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <BookOpenText className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-xl font-medium">{language.title}</h2>
                </div>
                <span className="rounded-full bg-accent px-3 py-1 text-[0.8rem] font-medium text-accent-foreground">
                  Assigned by {ASSIGNED_READING.clinician}
                </span>
              </div>
              <p className="mt-4 text-xl leading-relaxed">{language.text}</p>
              <div className="mt-6 rounded-xl bg-muted px-4 py-4">
                <button
                  type="button"
                  onClick={() => play("reading", language.text)}
                  className="kiwi-transition inline-flex min-h-11 items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 font-medium text-secondary-foreground hover:opacity-90"
                >
                  {speakingId === "reading" ? (
                    <Square className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Play className="h-5 w-5" aria-hidden="true" />
                  )}
                  {speakingId === "reading" ? "Stop the example" : "Hear the example read aloud"}
                </button>
                <div className="mt-3">
                  <WaveformBloom height={36} bars={30} />
                </div>
                <p className="mt-1 text-center text-[0.85rem] text-muted-foreground">
                  This is real audio, in {language.label}. Listening never records you.
                </p>
              </div>
            </article>
            <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} nextLabel="Choose your focus" />
          </section>
        )}

        {step === 3 && (
          <section aria-labelledby="step-preset" className="mt-12">
            <h1 id="step-preset" className="text-3xl font-medium tracking-tight">
              Before you start, what should Kiwi listen for?
            </h1>
            <p className="mt-2 text-muted-foreground">
              This is your Therapy Preset. It decides what Kiwi points out while you practise. You
              can change it any time.
            </p>
            <div className="mt-8 grid gap-5">
              {PRESETS.map((preset) => (
                <div key={preset.id} className="grid gap-2">
                  <PresetCard
                    preset={preset}
                    selected={presetId === preset.id}
                    recommended={preset.id === ASSIGNED_READING.recommendedPreset}
                    onSelect={() => setPresetId(preset.id)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      play(
                        preset.id,
                        `${preset.name}. ${preset.consequence} For example, ${preset.exampleFlag}.`,
                      )
                    }
                    className="kiwi-transition inline-flex min-h-11 w-fit items-center gap-2 rounded-lg border border-input bg-card px-4 py-2 text-[0.95rem] font-medium hover:bg-accent"
                  >
                    {speakingId === preset.id ? (
                      <Square className="h-4.5 w-4.5" aria-hidden="true" />
                    ) : (
                      <Play className="h-4.5 w-4.5" aria-hidden="true" />
                    )}
                    {speakingId === preset.id ? "Stop" : "Hear an example of this feedback"}
                  </button>
                </div>
              ))}
            </div>
            <StepNav onBack={() => setStep(2)} onNext={finish} nextLabel="Start practising" />
          </section>
        )}
      </div>
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  nextLabel,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}) {
  return (
    <div className="mt-10 flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="kiwi-transition inline-flex min-h-11 items-center gap-2 rounded-lg border border-input bg-card px-5 py-3 font-medium hover:bg-accent"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Back
      </button>
      <button
        type="button"
        onClick={onNext}
        className="kiwi-transition inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
      >
        {nextLabel} <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
