import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, UserRound, Stethoscope, BookOpenText } from "lucide-react";
import { useState } from "react";
import { KiwiBird, KiwiWordmark } from "@/components/KiwiLogo";
import { PresetCard } from "@/components/PresetCard";
import { WaveformBloom } from "@/components/WaveformBloom";
import { ASSIGNED_READING, PRESETS } from "@/lib/data";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welcome to Kiwi — Speech Rehabilitation Companion" },
      {
        name: "description",
        content:
          "Kiwi is a private, on-device practice partner between speech therapy sessions. Get set up in three gentle steps.",
      },
      { property: "og:title", content: "Welcome to Kiwi" },
      {
        property: "og:description",
        content: "A private, on-device practice partner between speech therapy sessions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const [step, setStep] = useState(0);
  const { presetId, setPresetId, completeOnboarding } = useSession();
  const navigate = useNavigate();

  const finish = () => {
    completeOnboarding();
    // Onboarding ends on the Practice Studio — never a blank home screen.
    navigate({ to: "/practice" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-3xl flex-col px-6 py-10">
        <div className="flex items-center justify-between">
          <KiwiWordmark className="h-9" />
          <span className="font-metrics text-sm text-muted-foreground" aria-live="polite">
            Step {step + 1} of 3
          </span>
        </div>

        <ol className="mt-6 flex gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`}
            />
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
              what it hears — honestly and kindly — so your progress is real, and yours.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6">
                <UserRound className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="mt-3 text-lg font-medium">For you, the person practising</h2>
                <p className="mt-1 text-[0.95rem] text-muted-foreground">
                  One task at a time. No timers, no pressure. Your recordings stay on this device.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <Stethoscope className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="mt-3 text-lg font-medium">For your clinician</h2>
                <p className="mt-1 text-[0.95rem] text-muted-foreground">
                  Clear, honest logs of every session — not guesswork from memory.
                </p>
              </div>
            </div>
            <div className="mt-10 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="kiwi-transition inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
              >
                Continue <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section aria-labelledby="step-reading" className="mt-12">
            <h1 id="step-reading" className="text-3xl font-medium tracking-tight">
              Your clinician left you a reading
            </h1>
            <p className="mt-2 text-muted-foreground">
              Assigned by {ASSIGNED_READING.clinician}. You'll practise this in your first session.
            </p>
            <article className="mt-6 rounded-2xl border border-border bg-card p-8">
              <div className="flex items-center gap-3">
                <BookOpenText className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="text-xl font-medium">{ASSIGNED_READING.title}</h2>
              </div>
              <p className="mt-4 text-xl leading-relaxed">{ASSIGNED_READING.text}</p>
              <div className="mt-6 rounded-xl bg-muted px-4 py-2">
                <WaveformBloom height={36} bars={30} />
                <p className="mt-1 text-center text-[0.85rem] text-muted-foreground">
                  A reference recording is included — you can listen before you speak.
                </p>
              </div>
            </article>
            <StepNav onBack={() => setStep(0)} onNext={() => setStep(2)} nextLabel="Choose your focus" />
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="step-preset" className="mt-12">
            <h1 id="step-preset" className="text-3xl font-medium tracking-tight">
              Before you start — what should Kiwi listen for?
            </h1>
            <p className="mt-2 text-muted-foreground">
              This is your Therapy Preset. It decides what Kiwi points out while you practise. You
              can change it any time.
            </p>
            <div className="mt-8 grid gap-5">
              {PRESETS.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  selected={presetId === preset.id}
                  recommended={preset.id === ASSIGNED_READING.recommendedPreset}
                  onSelect={() => setPresetId(preset.id)}
                />
              ))}
            </div>
            <StepNav onBack={() => setStep(1)} onNext={finish} nextLabel="Start practising" />
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
