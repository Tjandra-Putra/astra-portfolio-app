"use client";

import { useEffect, useState } from "react";
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSelector, useDispatch } from "react-redux";
import { Sun, Moon, Settings, Menu, X } from "lucide-react";

import { removeUserInfo } from "@/app/redux/features/user-slice";
import { useHideOnScroll } from "@/components/fx/use-hide-on-scroll";
import { AstraLogo } from "@/components/brand/astra-mark";

const Navbar: React.FC = () => {
  const userInfo = useSelector((state: any) => state.userReducer);
  const { userId, isLoaded } = useAuth();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const hidden = useHideOnScroll();

  useEffect(() => setMounted(true), []);
  // Only clear on a CONFIRMED signed-out state. Clerk reports `userId: null`
  // until it finishes loading, so the unguarded version wiped userInfo (and its
  // persisted copy) on every refresh — which is what made the redux-backed
  // pages come back empty.
  useEffect(() => {
    if (isLoaded && !userId) dispatch(removeUserInfo());
  }, [isLoaded, userId, dispatch]);
  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { href: userInfo?.id ? `/profile/${userInfo.id}` : "/", label: "Overview" },
    { href: "/projects", label: "Projects" },
    { href: "/experiences", label: "Experience" },
    { href: "/education", label: "Education" },
    { href: "/certificate", label: "Certificates" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) =>
    pathname === href || (href.startsWith("/profile") && pathname.startsWith("/profile"));

  return (
    <header
      className={`sticky top-0 z-40 pt-[var(--gutter)] transition-[transform,opacity] duration-500 ease-glass ${
        hidden && !open ? "pointer-events-none -translate-y-[130%] opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="wrap flex items-center gap-3">
        {/* Brand */}
        {/* Always the landing page — the signed-in user's own portfolio is
            reachable from the "Overview" link. */}
        <Link
          href="/"
          aria-label="Astra home"
          className="glass-bright flex h-9 shrink-0 items-center gap-2 rounded-tile pl-1.5 pr-1.5 sm:h-10 sm:gap-2.5 transition-transform duration-300 ease-glass hover:-translate-y-0.5 sm:pr-4"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-xs bg-ink text-[11px] font-bold text-stage sm:h-7 sm:w-7 sm:text-[12px]">A</span>
          <span className="hidden text-[15px] font-semibold tracking-tight text-ink sm:inline">Astra</span>
        </Link>

        {/* Desktop nav — separate glass pills, active one recessed */}
        <nav className="seg hidden lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`seg-btn ${isActive(l.href) ? "is-on" : ""}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="iconbtn"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Moon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              ) : (
                <Sun className="h-[18px] w-[18px]" strokeWidth={1.75} />
              )
            ) : (
              <span className="h-[18px] w-[18px]" />
            )}
          </button>

          <SignedIn>
            <Link href="/manage" aria-label="Manage" className="iconbtn hidden sm:grid">
              <Settings className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </Link>
            <span className="glass-bright grid h-9 w-9 place-items-center rounded-tile sm:h-10 sm:w-10">
              <UserButton
                appearance={{ elements: { avatarBox: { width: "1.75rem", height: "1.75rem" } } }}
                afterSignOutUrl="/"
              />
            </span>
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in" className="btn btn-acc">
              Sign in
            </Link>
          </SignedOut>

          <button onClick={() => setOpen((v) => !v)} aria-label="Menu" aria-expanded={open} className="iconbtn lg:hidden">
            {open ? <X className="h-[18px] w-[18px]" strokeWidth={1.75} /> : <Menu className="h-[18px] w-[18px]" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="wrap mt-3 lg:hidden">
          <nav className="glass rise p-2" aria-label="Main">
            <div className="grid gap-1.5 sm:grid-cols-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex h-11 items-center rounded-tile px-4 text-[0.9375rem] transition-colors ${
                    isActive(l.href) ? "glass-bright font-semibold text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
