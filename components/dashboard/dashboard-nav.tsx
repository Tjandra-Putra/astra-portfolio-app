"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  LayoutGrid,
  User,
  FolderKanban,
  GraduationCap,
  Award,
  ArrowUpRight,
  Shield,
} from "lucide-react";

import { resolveProfileId } from "@/lib/viewed-profile";

export type NavCounts = Partial<Record<"projects" | "education" | "certificate", number>>;

/**
 * Persistent dashboard navigation.
 *
 * The old dashboard was a hub-and-spoke: every move between sections meant
 * going back to /manage first. This keeps every section one click away and
 * always shows where you are, which is the single biggest usability change.
 *
 * Sticky rail from `lg`, and a horizontally scrollable pill strip below that —
 * no drawer to open, so the same navigation is visible at every size.
 */
export function DashboardNav({ counts = {} }: { counts?: NavCounts }) {
  const pathname = usePathname();
  const userInfo = useSelector((s: any) => s.userReducer);
  const profileId = resolveProfileId(userInfo?.id);
  const isAdmin = userInfo?.role === "ADMIN";

  const items = [
    { href: "/manage", label: "Overview", icon: LayoutGrid, exact: true },
    { href: "/manage/profile", label: "Profile", icon: User },
    { href: "/manage/projects", label: "Work", icon: FolderKanban, count: counts.projects },
    { href: "/manage/education", label: "Education", icon: GraduationCap, count: counts.education },
    { href: "/manage/certificate", label: "Certificates", icon: Award, count: counts.certificate },
  ];

  // `exact` on Overview only, or every route would match it.
  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label="Dashboard" className="lg:sticky lg:top-[calc(var(--gutter)+72px)]">
      {/* ── Rail (lg and up) ── */}
      <div className="glass pad hidden lg:block">
        <p className="tt-mono px-3 pb-3 pt-1">Manage</p>
        <ul className="grid gap-1.5">
          {items.map(({ href, label, icon: Icon, count, exact }) => {
            const on = active(href, exact);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={on ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-tile px-3 py-2.5 transition-colors duration-200 ${
                    on ? "glass-bright font-semibold text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span className="min-w-0 flex-1 truncate text-[0.875rem]">{label}</span>
                  {typeof count === "number" && (
                    <span className="font-mono text-[0.6875rem] text-muted-ink">
                      {String(count).padStart(2, "0")}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <hr className="rule my-2.5" />

        {profileId && (
          <Link href={`/profile/${profileId}`} className="flex items-center gap-3 rounded-tile px-3 py-2.5 text-ink-soft transition-colors hover:text-ink">
            <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span className="text-[0.875rem]">View public page</span>
          </Link>
        )}
        {isAdmin && (
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 rounded-tile px-3 py-2.5 transition-colors ${
              pathname.startsWith("/admin") ? "glass-bright font-semibold text-ink" : "text-ink-soft hover:text-ink"
            }`}
          >
            <Shield className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span className="text-[0.875rem]">Admin</span>
          </Link>
        )}
      </div>

      {/* ── Pill strip (below lg) ── */}
      <div className="scrollbar-none -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] lg:hidden">
        <div className="seg w-max">
          {items.map(({ href, label, icon: Icon, exact }) => (
            <Link key={href} href={href} className={`seg-btn ${active(href, exact) ? "is-on" : ""}`}>
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin/dashboard" className={`seg-btn ${pathname.startsWith("/admin") ? "is-on" : ""}`}>
              <Shield className="h-4 w-4" strokeWidth={1.75} />
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
