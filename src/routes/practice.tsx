import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Flag, Mic, Play, Repeat, Square, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FlagChip, FlagIcon } from "@/components/FlagChip";
import { PresetCard } from "@/components/PresetCard";
import { WaveformBloom } from "@/components/WaveformBloom";
import { ASSIGNED_READING, DRILL_SENTENCES, MOCK_TRANSCRIPT, PRESETS, presetById } from "@/lib/data";
import { useSession } from "@/lib/session";
import {
  compareToReference,
  dictationSupported,
  speak,
  speechSupported,
  startDictation,
  startMicLevel,
  stopSpeaking,
} from "@/lib/speech";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice Studio — Kiwi" },
      { name: "description", content: "Record against your reference reading. Kiwi flags dropped or altered sounds as you speak — honestly, never judgementally." },
      { property: "og:title", content: "Practice Studio — Kiwi" },
      { property: "og:description", content: "Record against your reference reading with honest, near-live feedback." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PracticeStudio,
});

type Phase = "idle" | "recording" | "done";

function PracticeStudio() {
  const { presetId, setPresetId, completeSession } = useSession();
  const preset = presetById(presetId);
  const [phase, setPhase] = useState<Phase>("idle");
  const [presetOpen, setPresetOpen] = useState(false);
  const [flaggedPassage, setFlaggedPassage] = useState(false);
  const [drill, setDrill] = useState<{ word: string; sentences: string[] } | null>(null);
  const [loopIndex, setLoopIndex] = useState(0);
  const sessionCounted = useRef(false);
  const [speaking, setSpeaking] = useState(false);
  const [level, setLevel] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [liveWords, setLiveWords] = useState<string[]>([]);
  const [usedMic, setUsedMic] = useState(false);
  const [liveWordsOn, setLiveWordsOn] = useState(false);
  const micRef = useRef<{ stop: () => void } | null>(null);
  const dictRef = useRef<{ stop: () => void } | null>(null);

  const stopEverything = () => {
    micRef.current?.stop();
    micRef.current = null;
    dictRef.current?.stop();
    dictRef.current = null;
    setLevel(0);
  };

  useEffect(() => () => {
    stopEverything();
    stopSpeaking();
  }, []);

  const play = (text: string) => {
    if (!speechSupported()) return;
    setSpeaking(true);
    void speak(text, { onEnd: () => setSpeaking(false) });
  };

  // Live transcript from the microphone, compared with the reference reading.
  const liveTranscript = useMemo(
    () => (liveWordsOn ? compareToReference(ASSIGNED_READING.text, liveWords) : []),
    [liveWordsOn, liveWords],
  );

  // Simulated transcript (used only when the browser can't do live dictation).
  const [visibleCount, setVisibleCount] = useState(0);
  useEffect(() => {
    if (phase !== "recording" || liveWordsOn) return;
    if (visibleCount >= MOCK_TRANSCRIPT.length) {
      const t = setTimeout(() => {
        setPhase("done");
        if (!sessionCounted.current) {
          sessionCounted.current = true;
          completeSession();
        }
      }, 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleCount((c) => c + 1), 650);
    return () => clearTimeout(t);
  }, [phase, visibleCount, completeSession, liveWordsOn]);

  const startRecording = async () => {
    stopSpeaking();
    setSpeaking(false);
    setVisibleCount(0);
    setLiveWords([]);
    setMicError(null);
    setFlaggedPassage(false);
    setDrill(null);
    sessionCounted.current = false;
    try {
      micRef.current = await startMicLevel(setLevel);
      setUsedMic(true);
      const dict = dictationSupported() ? startDictation((words) => setLiveWords(words)) : null;
      dictRef.current = dict;
      setLiveWordsOn(Boolean(dict));
    } catch {
      setUsedMic(false);
      setLiveWordsOn(false);
      setMicError("Kiwi couldn't reach your microphone, so this run is a simulated demo.");
    }
    setPhase("recording");
  };

  const stopRecording = () => {
    stopEverything();
    setPhase("done");
    if (!sessionCounted.current) {
      sessionCounted.current = true;
      completeSession();
    }
  };

  const shownTranscript = liveWordsOn ? liveTranscript : MOCK_TRANSCRIPT.slice(0, visibleCount);

  const flaggedWords = useMemo(() => shownTranscript.filter((w) => w.flag), [shownTranscript]);

  const openDrill = (word: string) => {
    const key = word.toLowerCase().replace(/[^a-z]/g, "");
    const sentences = DRILL_SENTENCES[key] ?? Object.values(DRILL_SENTENCES)[0]!;
    setLoopIndex(0);
    setDrill({ word: word.replace(/[^a-zA-Z]/g, ""), sentences });
  };

  return (
    <AppShell>
      {/* Persistent preset pill — never re-asked, always explained, one tap to change */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-[0.95rem] font-medium text-primary-foreground">
            {preset.name}
          </span>
          <span className="text-[0.9rem] text-muted-foreground">{preset.consequence}</span>
        </div>
        <button
          type="button"
          onClick={() => setPresetOpen(true)}
          className="kiwi-transition inline-flex min-h-11 items-center rounded-lg border border-input bg-card px-4 py-2 text-[0.95rem] font-medium hover:bg-accent"
        >
          Change focus
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section aria-labelledby="reference-heading" className="rounded-2xl border border-border bg-card p-8">
          <div className="flex items-center justify-between gap-3">
            <h1 id="reference-heading" className="text-2xl font-medium tracking-tight">
              {ASSIGNED_READING.title}
            </h1>
            <button
              type="button"
              aria-label="Play reference audio"
              onClick={() => (speaking ? (stopSpeaking(), setSpeaking(false)) : play(ASSIGNED_READING.text))}
              className="kiwi-transition inline-flex min-h-11 items-center gap-2 rounded-lg bg-secondary px-4 py-2 font-medium text-secondary-foreground hover:opacity-90"
            >
              {speaking ? <Square className="h-5 w-5" aria-hidden="true" /> : <Play className="h-5 w-5" aria-hidden="true" />}
              {speaking ? "Stop audio" : "Listen first"}
            </button>
          </div>
          <p className="mt-5 text-2xl leading-relaxed">{ASSIGNED_READING.text}</p>
          <p className="mt-4 text-[0.9rem] text-muted-foreground">
            No timer, no countdown. Start whenever you're ready, stop whenever you like.
          </p>
          {micError && (
            <p className="mt-2 text-[0.9rem] font-medium text-flag-foreground">{micError}</p>
          )}
        </section>

        <section aria-labelledby="record-heading" className="flex flex-col rounded-2xl border border-border bg-card p-8">
          <h2 id="record-heading" className="text-xl font-medium">
            {phase === "recording" ? "Listening…" : phase === "done" ? "Session complete" : "Ready when you are"}
          </h2>
          <div className="mt-4 flex-1 rounded-xl bg-muted px-4 py-6">
            <WaveformBloom
              active={phase === "recording" || speaking}
              level={phase === "recording" && usedMic ? level : undefined}
              height={64}
              bars={32}
            />
          </div>
          {phase === "done" && (
            <p className="mt-4 inline-flex items-center gap-2 text-[0.95rem] font-medium text-sage-foreground">
              <Check className="h-5 w-5" aria-hidden="true" />
              Logged to your progress and your clinician's dashboard.
            </p>
          )}
          <div className="mt-5">
            {phase !== "recording" ? (
              <button
                type="button"
                onClick={startRecording}
                className="kiwi-transition inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-lg font-medium text-primary-foreground hover:opacity-90"
              >
                <Mic className="h-5 w-5" aria-hidden="true" />
                {phase === "done" ? "Record again" : "Start recording"}
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="kiwi-transition inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-primary bg-card px-6 py-3.5 text-lg font-medium text-primary hover:bg-accent"
              >
                <Square className="h-5 w-5" aria-hidden="true" /> Stop
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Transcript */}
      <section aria-labelledby="transcript-heading" className="mt-8 rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="transcript-heading" className="text-xl font-medium">
            What Kiwi heard
          </h2>
          {phase !== "idle" && (
            <span className="font-metrics text-[0.9rem] text-muted-foreground" aria-live="polite">
              {flaggedWords.length} flagged {flaggedWords.length === 1 ? "word" : "words"}
            </span>
          )}
        </div>

        {phase === "idle" ? (
          <p className="mt-4 text-muted-foreground">
            Your transcript appears here as you speak. Flagged words are marked with an icon, an
            amber underline, and a plain-language label — never just a colour.
          </p>
        ) : (
          <>
            <p className="mt-5 flex flex-wrap gap-x-2.5 gap-y-4 text-2xl leading-relaxed" aria-live="polite">
              {shownTranscript.map((w, i) =>
                w.flag ? (
                  <button
                    key={i}
                    type="button"
                    onClick={() => openDrill(w.word)}
                    title={`${w.flag} — tap to practise this word`}
                    className="kiwi-transition rounded-md border-b-[3px] border-flag-foreground bg-flag px-1.5 font-medium text-flag-foreground hover:brightness-95"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <FlagIcon label={w.flag} className="h-4 w-4" />
                      {w.word}
                    </span>
                  </button>
                ) : (
                  <span key={i}>{w.word}</span>
                ),
              )}
              {phase === "recording" && <span className="text-muted-foreground">…</span>}
            </p>
            {flaggedWords.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-[0.9rem] text-muted-foreground">Flagged:</span>
                {flaggedWords.map((w, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => openDrill(w.word)}
                    className="kiwi-transition rounded-full hover:brightness-95"
                  >
                    <FlagChip label={`${w.word.replace(/[^a-zA-Z,.'’]/g, "")} — ${w.flag}`} />
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Quick Actions */}
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="text-[0.95rem] font-medium text-muted-foreground">Quick actions</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => play(ASSIGNED_READING.text)}
              className="kiwi-transition inline-flex min-h-11 items-center gap-2 rounded-lg border border-input bg-card px-4 py-2.5 font-medium hover:bg-accent"
            >
              <Play className="h-4.5 w-4.5" aria-hidden="true" /> Replay reference audio
            </button>
            <button
              type="button"
              onClick={() => setFlaggedPassage((f) => !f)}
              aria-pressed={flaggedPassage}
              className={`kiwi-transition inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2.5 font-medium ${
                flaggedPassage
                  ? "border-flag-foreground bg-flag text-flag-foreground"
                  : "border-input bg-card hover:bg-accent"
              }`}
            >
              <Flag className="h-4.5 w-4.5" aria-hidden="true" />
              {flaggedPassage ? "Passage flagged for your clinician" : "Flag this passage"}
            </button>
            <button
              type="button"
              disabled={flaggedWords.length === 0}
              onClick={() => flaggedWords[0] && openDrill(flaggedWords[0].word)}
              className="kiwi-transition inline-flex min-h-11 items-center gap-2 rounded-lg border border-input bg-card px-4 py-2.5 font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Repeat className="h-4.5 w-4.5" aria-hidden="true" /> Loop a flagged word
            </button>
          </div>
        </div>
      </section>

      {/* Adaptive drill overlay */}
      {drill && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="drill-heading"
          className="fixed inset-0 z-30 flex items-center justify-center bg-foreground/40 p-6"
        >
          <div className="w-full max-w-2xl rounded-2xl bg-card p-8 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="drill-heading" className="text-2xl font-medium tracking-tight">
                  Repetition loop — “{drill.word}”
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Kiwi built these practice sentences around the sound you flagged. Go slowly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrill(null)}
                aria-label="Close drill"
                className="kiwi-transition inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-input hover:bg-accent"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <ol className="mt-6 flex flex-col gap-3">
              {drill.sentences.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => {
                      setLoopIndex(i);
                      play(s);
                    }}
                    aria-pressed={loopIndex === i}
                    className={`kiwi-transition w-full rounded-xl border-2 px-5 py-4 text-left text-xl leading-relaxed min-h-11 ${
                      loopIndex === i ? "border-primary bg-accent" : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    <span className="mr-2 font-metrics text-sm text-muted-foreground">{i + 1}.</span>
                    {s}
                  </button>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex items-center justify-between">
              <WaveformBloom active={speaking} height={36} bars={20} />
              <button
                type="button"
                onClick={() => setDrill(null)}
                className="kiwi-transition inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90"
              >
                Done for now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preset change overlay */}
      {presetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preset-dialog-heading"
          className="fixed inset-0 z-30 flex items-center justify-center bg-foreground/40 p-6"
        >
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-8 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="preset-dialog-heading" className="text-2xl font-medium tracking-tight">
                  What should Kiwi listen for?
                </h2>
                <p className="mt-1 text-muted-foreground">
                  You can change this any time — it's your practice.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPresetOpen(false)}
                aria-label="Close preset chooser"
                className="kiwi-transition inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-input hover:bg-accent"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 grid gap-4">
              {PRESETS.map((p) => (
                <PresetCard
                  key={p.id}
                  preset={p}
                  selected={presetId === p.id}
                  recommended={p.id === ASSIGNED_READING.recommendedPreset}
                  onSelect={() => {
                    setPresetId(p.id);
                    setPresetOpen(false);
                  }}
                />
              ))}
            </div>
            <p className="mt-4 text-[0.9rem] text-muted-foreground">
              Prefer to browse first?{" "}
              <Link to="/progress" className="font-medium text-primary underline">
                See how your focus affects your reports
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
