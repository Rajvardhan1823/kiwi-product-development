import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpenText, ChartLine, ClipboardList, Home, Mic } from "lucide-react";
import type { ReactNode } from "react";
import { KiwiWordmark } from "./KiwiLogo";

const NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/practice", label: "Practice Studio", icon: Mic },
  { to: "/target-bank", label: "Target Bank", icon: BookOpenText },
  { to: "/progress", label: "Progress", icon: ChartLine },
  { to: "/dashboard", label: "Clinician View", icon: ClipboardList },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { location } = useRouterState();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link to="/home" aria-label="Kiwi home" className="kiwi-transition hover:opacity-85">
            <KiwiWordmark className="h-8" />
          </Link>
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-1">
              {NAV.map(({ to, label, icon: Icon }) => {
                const active = location.pathname.startsWith(to);
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      aria-current={active ? "page" : undefined}
                      className={`kiwi-transition inline-flex min-h-11 items-center gap-2 rounded-lg px-3.5 text-[0.95rem] font-medium ${
                        active
                          ? "bg-primary text-primary-foreground"
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
