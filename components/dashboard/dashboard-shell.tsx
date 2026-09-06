"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { UserButton } from "@clerk/nextjs";
import { Sun, Moon, Search, ChevronRight } from "lucide-react";

import { DashboardNav, type NavCounts } from "./dashboard-nav";
import { CommandPalette } from "./command-palette";

/** Path segment → readable crumb. */
const CRUMBS: Record<string, string> = {
  manage: "Manage",
  profile: "Profile",
  projects: "Work",
  education: "Education",
  certificate: "Certificates",
  add: "New",
  edit: "Edit",
  admin: "Admin",
  dashboard: "Overview",
};

function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 sm:flex">
      {parts.map((part, i) => {
        // Ids are long uuids — show them as a short reference, not a wall of hex.
        const isId = part.length > 20;
        const label = isId ? `#${part.slice(0, 6)}` : CRUMBS[part] || part;
        const href = "/" + parts.slice(0, i + 1).join("/");
        const last = i === parts.length - 1;

        return (
          <span key={href} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-ink" strokeWidth={2} />}
            {last ? (
              <span className="truncate text-[0.8125rem] font-semibold text-ink">{label}</span>
            ) : (
              <Link href={href} className="truncate text-[0.8125rem] text-muted-ink transition-colors hover:text-ink">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

/**
 * Dashboard app frame.
 *
 * Deliberately NOT the public site's layout. The public pages are a document:
 * a floating pill masthead over one long scrolling column. This is an app:
 * a full-height frame that does not itself scroll, a solid masthead with
 * breadcrumbs, a persistent section rail, and a content column that scrolls on
 * its own — so the navigation never leaves the screen.
 *
 * The old dashboard was a 570px centred card with hub-and-spoke navigation:
 * every move between sections meant returning to /manage first.
 *
 * The PAGE scrolls normally and the masthead + rail are sticky, rather than a
 * fixed `100svh` frame with an inner scroll container. Same app feel — nav
 * never leaves the screen — but scrolling cannot break: an inner scroller
 * depends on an unbroken `min-h-0` flex chain, and `100svh` is unreliable on
 * mobile where browser chrome resizes the viewport.
 *
 * Pages inside may use `.rise` (pure CSS, always safe). `.reveal` also works
 * again now that the window is the scroller.
 */
export function DashboardShell({ children, counts }: { children: React.ReactNode; counts?: NavCounts }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="stage flex min-h-[100svh] flex-col">
      <CommandPalette />

      {/* ── Masthead: full-width bar, not floating pills.
             `bg-stage` so content cannot show through the gutter above it. ── */}
      <header className="sticky top-0 z-40 bg-stage px-[var(--gutter)] pb-3.5 pt-[var(--gutter)]">
        <div className="glass flex h-[58px] items-center gap-3 rounded-panel px-3">
          <Link href="/" aria-label="Astra home" className="flex shrink-0 items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xs bg-ink text-[12px] font-bold text-stage">A</span>
          </Link>

          <span className="hidden h-5 w-px shrink-0 bg-hairline-2 sm:block" />
          <Breadcrumbs />

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              onClick={() =>
                document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))
              }
              className="glass-lite hidden h-9 items-center gap-2 rounded-tile pl-2.5 pr-2 text-muted-ink transition-colors hover:text-ink md:flex"
              aria-label="Open command palette"
            >
              <Search className="h-4 w-4" strokeWidth={1.75} />
              <span className="text-[0.8125rem]">Jump to…</span>
              <kbd className="glass-well rounded-xs px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-ink">⌘K</kbd>
            </button>

            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="iconbtn iconbtn-sm"
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <Moon className="h-4 w-4" strokeWidth={1.75} />
                ) : (
                  <Sun className="h-4 w-4" strokeWidth={1.75} />
                )
              ) : (
                <span className="h-4 w-4" />
              )}
            </button>

            <span className="glass-lite grid h-9 w-9 place-items-center rounded-tile">
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: { width: "1.5rem", height: "1.5rem" } } }} />
            </span>
          </div>
        </div>
      </header>

      {/* ── Body: sticky rail beside normally-scrolling content ── */}
      <div className="flex flex-1 gap-3.5 px-[var(--gutter)] pb-[var(--gutter)]">
        <aside className="hidden w-[228px] shrink-0 lg:block">
          <DashboardNav counts={counts} />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="lg:hidden">
            <DashboardNav counts={counts} />
          </div>
          <div className="pb-6 pt-3.5 lg:pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
