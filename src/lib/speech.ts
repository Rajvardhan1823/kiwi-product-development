/**
 * Real browser voice helpers for the Kiwi demo.
 * - speak(): reference audio via the built-in speech synthesiser.
 * - useMicLevel(): live microphone loudness for the waveform bloom.
 * - useDictation(): live word-by-word recognition where the browser supports it.
 * Everything stays on the device — nothing is uploaded.
 */

export function voicesReady(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return resolve();
    if (speechSynthesis.getVoices().length > 0) return resolve();
    const t = setTimeout(resolve, 600);
    speechSynthesis.addEventListener(
      "voiceschanged",
      () => {
        clearTimeout(t);
        resolve();
      },
      { once: true },
    );
  });
}

export function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export async function speak(text: string, opts: { rate?: number; onEnd?: () => void } = {}) {
  if (!speechSupported()) {
    opts.onEnd?.();
    return;
  }
  await voicesReady();
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = opts.rate ?? 0.88;
  u.pitch = 1;
  u.lang = "en-US";
  const preferred = speechSynthesis
    .getVoices()
    .find((v) => /en-(US|GB|IN)/i.test(v.lang) && /female|samantha|google|zira|aria/i.test(v.name));
  if (preferred) u.voice = preferred;
  u.onend = () => opts.onEnd?.();
  u.onerror = () => opts.onEnd?.();
  speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (speechSupported()) speechSynthesis.cancel();
}

/* ---------- microphone ---------- */

export interface MicHandle {
  stop: () => void;
}

export async function startMicLevel(onLevel: (v: number) => void): Promise<MicHandle> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  source.connect(analyser);
  const buf = new Uint8Array(analyser.frequencyBinCount);
  let raf = 0;
  const tick = () => {
    analyser.getByteTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) {
      const v = (buf[i]! - 128) / 128;
      sum += v * v;
    }
    onLevel(Math.min(1, Math.sqrt(sum / buf.length) * 4));
    raf = requestAnimationFrame(tick);
  };
  tick();
  return {
    stop: () => {
      cancelAnimationFrame(raf);
      stream.getTracks().forEach((t) => t.stop());
      source.disconnect();
      void ctx.close();
    },
  };
}

/* ---------- dictation ---------- */

type SR = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export function dictationSupported() {
  if (typeof window === "undefined") return false;
  const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function startDictation(onWords: (words: string[], final: boolean) => void): { stop: () => void } | null {
  if (!dictationSupported()) return null;
  const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition!;
  const rec = new Ctor();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = "en-US";
  let finalText = "";
  rec.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const alt = e.results[i]![0]!.transcript;
      // browsers mark finality on the result; treat all as interim then append
      interim += alt + " ";
    }
    const all = (finalText + " " + interim).trim();
    onWords(all.split(/\s+/).filter(Boolean), false);
  };
  rec.onerror = () => {};
  rec.onend = () => {
    if (finalText) onWords(finalText.split(/\s+/).filter(Boolean), true);
  };
  try {
    rec.start();
  } catch {
    return null;
  }
  return { stop: () => rec.stop() };
}

/* ---------- comparison ---------- */

const norm = (s: string) => s.toLowerCase().replace(/[^a-z']/g, "");

/** Compare what was heard with the reference text, word by word. */
export function compareToReference(
  reference: string,
  heard: string[],
): Array<{ word: string; flag?: string }> {
  const ref = reference.split(/\s+/).filter(Boolean);
  const heardNorm = heard.map(norm).filter(Boolean);
  const out: Array<{ word: string; flag?: string }> = [];
  let h = 0;
  for (let i = 0; i < ref.length && h <= heardNorm.length; i++) {
    const target = norm(ref[i]!);
    if (h >= heardNorm.length) break;
    const got = heardNorm[h]!;
    if (got === target) {
      out.push({ word: ref[i]! });
      h++;
    } else if (heardNorm[h + 1] && norm(heardNorm[h + 1]!) === target) {
      // an extra word slipped in
      out.push({ word: ref[i]!, flag: "extra sound" });
      h += 2;
    } else if (similar(got, target)) {
      out.push({ word: ref[i]!, flag: target.length > got.length ? "dropped sound" : "altered sound" });
      h++;
    } else {
      out.push({ word: ref[i]!, flag: "altered sound" });
      h++;
    }
  }
  return out;
}

function similar(a: string, b: string) {
  if (!a || !b) return false;
  if (a[0] === b[0]) return true;
  const shared = [...new Set(a)].filter((c) => b.includes(c)).length;
  return shared / Math.max(a.length, b.length) > 0.5;
}
