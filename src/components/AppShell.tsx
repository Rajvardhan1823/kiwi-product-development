import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { BookOpenText, ChartLine, ClipboardList, Home, Mic, Stethoscope, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { KiwiWordmark } from "./KiwiLogo";
import { useSession, type Role } from "@/lib/session";

const PATIENT_NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/practice", label: "Practice Studio", icon: Mic },
  { to: "/progress", label: "My Progress", icon: ChartLine },
] as const;

const CLINICIAN_NAV = [
  { to: "/dashboard", label: "Caseload", icon: ClipboardList },
  { to: "/target-bank", label: "Target Bank", icon: BookOpenText },
  { to: "/progress", label: "Reports", icon: ChartLine },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { location } = useRouterState();
  const { role, setRole, profile } = useSession();
  const navigate = useNavigate();
  const clinician = role === "clinician";
  const nav = clinician ? CLINICIAN_NAV : PATIENT_NAV;

  const switchTo = (next: Role) => {
    setRole(next);
    navigate({ to: next === "clinician" ? "/dashboard" : "/home" });
  };

  return (
    <div className={`min-h-screen text-foreground ${clinician ? "bg-muted" : "bg-background"}`}>
      {/* Mode band — makes it obvious whose screen this is, with no login needed */}
      <div
        className={`w-full ${clinician ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground"}`}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-2">
          <p className="inline-flex items-center gap-2 text-[0.9rem] font-medium">
            {clinician ? (
              <Stethoscope className="h-4.5 w-4.5" aria-hidden="true" />
            ) : (
              <UserRound className="h-4.5 w-4.5" aria-hidden="true" />
            )}
            {clinician
              ? "Clinician workspace, Dr. Meera Rao, SLP"
              : `Practice space for ${profile.name || "you"}${profile.age ? `, age ${profile.age}` : ""}`}

          </p>
          <div className="inline-flex items-center gap-2 text-[0.85rem]">
            <span className="opacity-80">Demo: switch view</span>
            <div className="inline-flex rounded-lg bg-background/15 p-0.5">
              {(["patient", "clinician"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => switchTo(r)}
                  aria-pressed={role === r}
                  className={`kiwi-transition rounded-md px-3 py-1 font-medium ${
                    role === r ? "bg-background text-foreground" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {r === "patient" ? "Patient" : "Clinician"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-20 border-b bg-card/95 backdrop-blur ${
          clinician ? "border-foreground/25" : "border-border"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link
            to={clinician ? "/dashboard" : "/home"}
            aria-label="Kiwi home"
            className="kiwi-transition flex items-center gap-3 hover:opacity-85"
          >
            <KiwiWordmark className="h-8" />
            <span
              className={`hidden rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold uppercase tracking-wide sm:inline ${
                clinician ? "bg-foreground text-background" : "bg-accent text-accent-foreground"
              }`}
            >
              {clinician ? "Clinician" : "Patient"}
            </span>
          </Link>
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-1">
              {nav.map(({ to, label, icon: Icon }) => {
                const active = location.pathname.startsWith(to);
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      aria-current={active ? "page" : undefined}
                      className={`kiwi-transition inline-flex min-h-11 items-center gap-2 rounded-lg px-3.5 text-[0.95rem] font-medium ${
                        active
                          ? clinician
                            ? "bg-foreground text-background"
                            : "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                      <span className="hidden md:inline">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
