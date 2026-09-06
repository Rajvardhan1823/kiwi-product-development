import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ASSIGNED_READING } from "./data";

export type Role = "patient" | "clinician";

export interface PatientProfile {
  name: string;
  age: string;
  language: string;
  workingOn: string;
}

interface SessionState {
  role: Role;
  setRole: (r: Role) => void;
  presetId: string;
  setPresetId: (id: string) => void;
  profile: PatientProfile;
  setProfile: (p: Partial<PatientProfile>) => void;
  onboarded: boolean;
  completeOnboarding: () => void;
  streak: number;
  sessionsCompleted: number;
  completeSession: () => void;
  hydrated: boolean;
}

const SessionContext = createContext<SessionState | null>(null);

const KEY = "kiwi-session-v1";

const DEFAULT_PROFILE: PatientProfile = {
  name: "Anand",
  age: "58",
  language: "en-US",
  workingOn: "Speaking clearly after a stroke",
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("patient");
  const [presetId, setPresetIdState] = useState(ASSIGNED_READING.recommendedPreset);
  const [profile, setProfileState] = useState<PatientProfile>(DEFAULT_PROFILE);
  const [onboarded, setOnboarded] = useState(false);
  const [streak, setStreak] = useState(12);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.role === "patient" || parsed.role === "clinician") setRoleState(parsed.role);
        if (parsed.presetId) setPresetIdState(parsed.presetId);
        if (parsed.profile && typeof parsed.profile === "object")
          setProfileState({ ...DEFAULT_PROFILE, ...parsed.profile });
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
    (next: Partial<{ role: Role; presetId: string; profile: PatientProfile; onboarded: boolean; streak: number; sessionsCompleted: number }>) => {
      try {
        const current = { role, presetId, profile, onboarded, streak, sessionsCompleted };
        localStorage.setItem(KEY, JSON.stringify({ ...current, ...next }));
      } catch {
        // ignore
      }
    },
    [role, presetId, profile, onboarded, streak, sessionsCompleted],
  );

  const value = useMemo<SessionState>(
    () => ({
      role,
      setRole: (r: Role) => {
        setRoleState(r);
        persist({ role: r });
      },
      presetId,
      setPresetId: (id) => {
        setPresetIdState(id);
        persist({ presetId: id });
      },
      profile,
      setProfile: (p) => {
        const next = { ...profile, ...p };
        setProfileState(next);
        persist({ profile: next });
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
    [role, presetId, profile, onboarded, streak, sessionsCompleted, hydrated, persist],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
