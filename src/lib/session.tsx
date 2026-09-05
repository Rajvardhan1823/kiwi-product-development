import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ASSIGNED_READING } from "./data";

interface SessionState {
  presetId: string;
  setPresetId: (id: string) => void;
  onboarded: boolean;
  completeOnboarding: () => void;
  streak: number;
  sessionsCompleted: number;
  completeSession: () => void;
  hydrated: boolean;
}

const SessionContext = createContext<SessionState | null>(null);

const KEY = "kiwi-session-v1";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [presetId, setPresetIdState] = useState(ASSIGNED_READING.recommendedPreset);
  const [onboarded, setOnboarded] = useState(false);
  const [streak, setStreak] = useState(12);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.presetId) setPresetIdState(parsed.presetId);
        if (typeof parsed.onboarded === "boolean") setOnboarded(parsed.onboarded);
        if (typeof parsed.streak === "number") setStreak(parsed.streak);
        if (typeof parsed.sessionsCompleted === "number") setSessionsCompleted(parsed.sessionsCompleted);
      }
    } catch {
      // ignore — prototype only
    }
    setHydrated(true);
  }, []);

  const persist = useCallback(
    (next: Partial<{ presetId: string; onboarded: boolean; streak: number; sessionsCompleted: number }>) => {
      try {
        const current = { presetId, onboarded, streak, sessionsCompleted };
        localStorage.setItem(KEY, JSON.stringify({ ...current, ...next }));
      } catch {
        // ignore
      }
    },
    [presetId, onboarded, streak, sessionsCompleted],
  );

  const value = useMemo<SessionState>(
    () => ({
      presetId,
      setPresetId: (id) => {
        setPresetIdState(id);
        persist({ presetId: id });
      },
      onboarded,
      completeOnboarding: () => {
        setOnboarded(true);
        persist({ onboarded: true });
      },
      streak,
      sessionsCompleted,
      completeSession: () => {
        const nextSessions = sessionsCompleted + 1;
        const nextStreak = sessionsCompleted === 0 ? streak + 1 : streak;
        setSessionsCompleted(nextSessions);
        setStreak(nextStreak);
        persist({ sessionsCompleted: nextSessions, streak: nextStreak });
      },
      hydrated,
    }),
    [presetId, onboarded, streak, sessionsCompleted, hydrated, persist],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
