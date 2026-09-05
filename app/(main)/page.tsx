"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search, Sun, Moon, ArrowUpRight, ArrowRight, Users, FolderOpen, GraduationCap,
  Award, Link2, Share2, Layers, Briefcase, CheckCircle2, Sparkles, Globe,
} from "lucide-react";

import { MotionLayer } from "@/components/fx/motion-layer";
import { GlassScene } from "@/components/fx/glass-scene";
import { Tilt } from "@/components/fx/tilt";
import { Counter } from "@/components/fx/counter";
import { MeshCrosshairs } from "@/components/fx/mesh-crosshairs";
import { StageDecor } from "@/components/fx/stage-decor";
import { LandingMotion } from "@/components/fx/landing-motion";
import { patternFor } from "@/lib/pattern";
import { AstraLogo, AstraMark } from "@/components/brand/astra-mark";
import { useHideOnScroll } from "@/components/fx/use-hide-on-scroll";
import { getJSON } from "@/lib/data-client";

const FALLBACK = "https://vutz38vdur.ufs.sh/f/O8iVoUnKSnAlP7J3LDxbvrzVStD23fJj4xZMB9eRcLgWuknX";
type Profile = { id: string; name?: string; jobTitle?: string; bio?: string; imageUrl?: string; updatedAt?: string };

/* ══ Masthead ═══════════════════════════════════════════════ */
function Masthead() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const userInfo = useSelector((s: any) => s.userReducer);
  const hidden = useHideOnScroll();
  useEffect(() => setMounted(true), []);

  return (
    <header
      className={`sticky top-0 z-40 pt-[var(--gutter)] transition-[transform,opacity] duration-500 ease-glass ${
        hidden ? "pointer-events-none -translate-y-[130%] opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="wrap flex items-center gap-3">
        <Link
          href="/"
          aria-label="Astra home"
          className="glass-bright flex h-9 shrink-0 items-center gap-2 rounded-tile pl-1.5 pr-3 sm:h-10 sm:gap-2.5 sm:pr-4 transition-transform duration-300 ease-glass hover:-translate-y-0.5"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-xs bg-ink text-[11px] font-bold text-stage sm:h-7 sm:w-7 sm:text-[12px]">A</span>
          <span className="text-[15px] font-semibold tracking-tight text-ink">Astra</span>
        </Link>

        <nav className="seg ml-1 hidden md:flex" aria-label="Sections">
          <a href="#what" className="seg-btn">What you get</a>
          <a href="#how" className="seg-btn">How it works</a>
          <a href="#directory" className="seg-btn">Directory</a>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label="Toggle theme" className="iconbtn">
            {mounted ? (resolvedTheme === "dark" ? <Moon className="h-[18px] w-[18px]" strokeWidth={1.75} /> : <Sun className="h-[18px] w-[18px]" strokeWidth={1.75} />) : <span className="h-[18px] w-[18px]" />}
          </button>
          <SignedOut>
            <Link href="/sign-in" className="btn btn-acc">Sign in</Link>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => (userInfo?.id ? router.push("/manage") : toast.error("User ID not found."))}
              className="btn btn-acc"
            >
              Dashboard
            </button>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

/* ══ Miniature product widgets — illustrate the sections ════ */
function MiniProject() {
  return (
    <div className="glass-bright pad-sm w-full">
      <div className="flex items-start justify-between gap-3">
        <span className="glass-lite grid h-9 w-9 place-items-center rounded-xs">
          <Layers className="h-[16px] w-[16px] text-ink" strokeWidth={1.75} />
        </span>
        <span className="chip chip-acc">Case study</span>
      </div>
      <p className="tt-h3 mt-3">Ferry booking platform</p>
      <p className="tt-sub mt-0.5">Next.js · Prisma · Stripe</p>
      <div className="glass-well mt-3 flex items-center justify-between rounded-xs px-3 py-2">
        <span className="tt-mono">Shipped</span>
        <span className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-ink">
          <span className="pin" /> Live
        </span>
      </div>
    </div>
  );
}

function MiniTimeline() {
  const rows = [
    { role: "Software Engineer", org: "Pure Storage", on: true },
    { role: "Product Intern", org: "GovTech", on: false },
  ];
  return (
    <div className="glass-bright pad-sm w-full">
      <div className="flex items-center justify-between">
        <p className="tt-h3">Experience</p>
        <span className="tt-mono">2 roles</span>
      </div>
      <div className="mt-3 grid gap-2">
        {rows.map((r) => (
          <div key={r.role} className="glass-lite flex items-center gap-3 rounded-xs px-3 py-2.5">
            <span className={`grid h-7 w-7 place-items-center rounded-xs ${r.on ? "bg-acc text-on-acc" : "glass-well text-ink-soft"}`}>
              <Briefcase className="h-3.5 w-3.5 text-ink" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.8125rem] font-semibold text-ink">{r.role}</p>
              <p className="tt-sub truncate text-[0.75rem]">{r.org}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniCredential() {
  return (
    <div className="glass-bright pad-sm w-full">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xs bg-acc text-on-acc">
          <CheckCircle2 className="h-[16px] w-[16px]" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p className="tt-h3 truncate">AWS Solutions Architect</p>
          <p className="tt-sub truncate">Verified · 2025</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {["ID", "Issuer", "Doc"].map((k) => (
          <div key={k} className="glass-well grid place-items-center rounded-xs py-2">
            <span className="tt-mono text-[0.625rem]">{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ Directory ══════════════════════════════════════════════ */

/**
 * Placeholder rows so the directory reads as a directory while the platform is
 * young. Explicitly labelled "Sample" and deliberately not links: presenting
 * invented people as real published portfolios would be misleading, so these
 * are obviously illustrative and go nowhere.
 */
const SAMPLES: { role: string; blurb: string }[] = [
  { role: "Product Designer", blurb: "Design systems, prototyping and the messy middle of shipping product." },
  { role: "Data Engineer", blurb: "Pipelines, warehousing and making dashboards people actually trust." },
  { role: "Frontend Engineer", blurb: "Interfaces, motion and the details that make software feel considered." },
  { role: "ML Engineer", blurb: "Applied models, evaluation harnesses and putting research into production." },
  { role: "Security Analyst", blurb: "Threat modelling, detection engineering and incident write-ups." },
];

function ProfileCard({ p, user, i }: { p: Profile; user: any; i: number }) {
  const img = p.imageUrl || (user && p.id === user.publicMetadata?.userId && user.imageUrl) || FALLBACK;
  return (
    <Link
      href={`/profile/${p.id}`}
      className={`glass-lite lift sheen group flex flex-col rounded-tile p-4 sm:col-span-3 lg:col-span-4 ${patternFor(p.id)}`}
    >
      <div className="flex items-start gap-3">
        <img src={img} alt="" className="h-12 w-12 shrink-0 rounded-tile object-cover shadow-e1" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.9375rem] font-semibold tracking-tight text-ink">{p.name || "Unnamed"}</p>
          <p className="tt-sub truncate">{p.jobTitle || "Creator"}</p>
        </div>
        <span className="expand"><ArrowUpRight className="h-4 w-4" strokeWidth={1.75} /></span>
      </div>

      <p className="tt-body mt-3 line-clamp-2 min-h-[2.6em]">{p.bio || "No bio published yet."}</p>

      <div className="mt-4 flex items-center gap-2">
        <span className="chip chip-acc"><span className="pin" /> Live</span>
        {p.updatedAt && (
          <span className="tt-mono ml-auto">{new Date(p.updatedAt).toLocaleDateString("en-SG")}</span>
        )}
      </div>
    </Link>
  );
}

function SampleCard({ s, i }: { s: { role: string; blurb: string }; i: number }) {
  return (
    <div
      aria-hidden="true"
      className={`glass-lite flex select-none flex-col rounded-tile p-4 opacity-55 sm:col-span-3 lg:col-span-4 ${patternFor(s.role)}`}
    >
      <div className="flex items-start gap-3">
        <span className="glass-well grid h-12 w-12 shrink-0 place-items-center rounded-tile">
          <Users className="h-[18px] w-[18px] text-muted-ink" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.9375rem] font-semibold tracking-tight text-muted-ink">
            Your name here
          </p>
          <p className="tt-sub truncate">{s.role}</p>
        </div>
      </div>

      <p className="tt-body mt-3 line-clamp-2 min-h-[2.6em]">{s.blurb}</p>

      <div className="mt-4 flex items-center gap-2">
        <span className="chip">Sample</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"recent" | "az">("recent");
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    (async () => {
      try {
        const data = await getJSON<Profile[]>("/api/profile");
        setProfiles(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("[PROFILE_GET_ERROR]", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q ? profiles.filter((p) => p.name?.toLowerCase().includes(q) || p.jobTitle?.toLowerCase().includes(q)) : [...profiles];
    return base.sort((a, b) =>
      sort === "az" ? (a.name || "").localeCompare(b.name || "") : new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    );
  }, [profiles, query, sort]);

  const marqueeWords = ["Projects", "Case studies", "Experience", "Education", "Certificates", "Skills", "Resume", "One link"];

  return (
    <div className="stage flex min-h-[100svh] flex-col">
      <span className="progress" />
      <MotionLayer />
      <LandingMotion />
      <Masthead />

      <main className="flex-1">
        {/* ══ HERO ══════════════════════════════════════════ */}
        {/* Full-viewport hero. Subtracts the masthead (its sticky pill plus the
            --gutter top inset) so the fold lands exactly at the viewport edge
            rather than overflowing by the header's height. */}
        <section data-anim="hero" className="wrap relative flex min-h-[calc(100svh-80px)] flex-col justify-center gap-8 pb-6 pt-4">
          <StageDecor className="[--x:0]" data-anim="decor" />
          <div className="orb left-[-8%] top-[-6%] h-[380px] w-[380px] sm:h-[520px] sm:w-[520px]" />

          <div className="bento w-full flex-1 items-center">
            <div data-anim="hero-copy" className="sm:col-span-6 lg:col-span-6">
              <span className="tt-mono rise inline-flex items-center gap-2">
                <span className="pin" /> Portfolio platform
              </span>
              <h1 className="tt-hero rise mt-6" style={{ animationDelay: "60ms" }}>
                Your work,
                <br />
                one <span className="acc">link.</span>
              </h1>
              <p className="tt-lead rise mt-7 max-w-md" style={{ animationDelay: "120ms" }}>
                Astra turns your projects, experience, education and certificates into a portfolio that looks
                considered — without you touching a line of code.
              </p>

              <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "180ms" }}>
                <SignedOut>
                  <Link href="/sign-in" className="btn btn-acc btn-lg">
                    Create your portfolio
                    <ArrowRight className="hov-arrow h-[18px] w-[18px]" strokeWidth={2} />
                  </Link>
                </SignedOut>
                <a href="#directory" className="btn btn-glass btn-lg">Browse the directory</a>
              </div>

              <div className="rise mt-8 flex items-center gap-2" style={{ animationDelay: "240ms" }}>
                <div className="flex -space-x-2.5">
                  {profiles.slice(0, 4).map((p) => (
                    <img key={p.id} src={p.imageUrl || FALLBACK} alt="" className="h-8 w-8 rounded-full object-cover shadow-e1 ring-2 ring-glass-bright" />
                  ))}
                </div>
                <p className="tt-sub">
                  {loading ? "Loading creators…" : `${profiles.length} ${profiles.length === 1 ? "creator" : "creators"} publishing on Astra`}
                </p>
              </div>
            </div>

            {/* 3D scene + floating glass cards in front of it */}
            <div data-anim="hero-media" className="relative sm:col-span-6 lg:col-span-6">
              {/* Mobile: the overlapping cluster is sized for a wide box — at
                  390px the cards collide and truncate. Show one card, in flow. */}
              <div className="rise mt-2 grid gap-2.5 md:hidden" style={{ animationDelay: "420ms" }}>
                <MiniProject />
                <MiniCredential />
              </div>

              {/* md+: the composed, parallaxed cluster over the WebGL scene */}
              <div className="relative hidden h-[420px] md:block lg:h-[500px]">
                <GlassScene className="absolute inset-0" />

                <Tilt max={9} className="absolute inset-0 select-none" innerClassName="h-full">
                  <div className="relative h-full">
                    <div className="depth-2 absolute left-[4%] top-[12%] w-[54%]">
                      <div className="rise" style={{ animationDelay: "420ms" }}><MiniProject /></div>
                    </div>
                    <div className="depth-3 absolute bottom-[10%] right-[2%] w-[50%]">
                      <div className="rise" style={{ animationDelay: "560ms" }}><MiniCredential /></div>
                    </div>
                  </div>
                </Tilt>
              </div>
            </div>
          </div>

          {/* Capability band, closing out the fold */}
          <div data-anim="hero-marquee" className="marquee shrink-0">
            <div data-anim="mq-track" className="marquee-track" aria-hidden="true">
              {[...marqueeWords, ...marqueeWords].map((w, i) => (
                <span key={i} className="flex shrink-0 items-center gap-8">
                  <span className="whitespace-nowrap text-[1.05rem] font-semibold tracking-tight text-ink/[0.14] sm:text-[1.3rem]">
                    {w}
                  </span>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-acc/40" />
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BENTO MESH — what you get ═════════════════════ */}
        <section id="what" className="wrap bay scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-lg">
              <p className="tt-mono">Everything in one place</p>
              <h2 data-anim="words" className="tt-h1 mt-2.5">
                Four sections that do the <span className="acc">explaining</span> for you.
              </h2>
            </div>
            <p className="tt-sub max-w-xs">
              Fill them in once from the dashboard. Every section is individually toggleable.
            </p>
          </div>

          {/* Uniform 3 x 3 tracks so the crosshair overlay lands on real grid lines. */}
          <div data-anim="mesh" className="mesh mesh-3 mesh-even relative mt-6">
            <MeshCrosshairs cols={3} rows={3} />

            {/* — Projects (2 wide) — */}
            <div className="cell-wide pad group flex flex-col pat-ticks">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="tt-mono inline-flex items-center gap-2">
                    <FolderOpen className="h-3.5 w-3.5 text-ink" strokeWidth={2} /> Projects
                  </p>
                  <p className="tt-h2 mt-2.5">Case studies, not link dumps</p>
                  <p className="tt-body mt-2 max-w-sm">
                    Rich text, image galleries, tech tags, live and repo links — plus dates that compute their own
                    duration.
                  </p>
                </div>
                <span className="expand">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </div>
              <Tilt max={4} className="mt-4 max-w-[19rem]">
                <MiniProject />
              </Tilt>
            </div>

            {/* — Stat — */}
            <div className="pad flex flex-col justify-between pat-dots">
              <p className="tt-mono">Sections</p>
              <div>
                <p className="tt-num">
                  <Counter value={4} />
                </p>
                <p className="tt-unit mt-1">per portfolio</p>
              </div>
              <div className="mt-4 grid gap-1.5">
                {["Projects", "Experience", "Education", "Certificates"].map((r) => (
                  <div key={r} className="glass-lite flex items-center gap-2 rounded-xs px-2.5 py-1.5">
                    <span className="pin shrink-0" />
                    <span className="truncate text-[0.78125rem] font-medium text-ink">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* — Experience — */}
            <div className="pad group flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <p className="tt-mono inline-flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5 text-ink" strokeWidth={2} /> Experience
                </p>
                <span className="expand">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </div>
              <p className="tt-h2 mt-2.5">A timeline kept current</p>
              <p className="tt-body mt-2">Roles, companies and ranges — open-ended dates handled properly.</p>
              <Tilt max={4} className="mt-4">
                <MiniTimeline />
              </Tilt>
            </div>

            {/* — Education — */}
            <div className="pad group flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <p className="tt-mono inline-flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-ink" strokeWidth={2} /> Education
                </p>
                <span className="expand">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </div>
              <p className="tt-h2 mt-2.5">Degrees with the detail</p>
              <p className="tt-body mt-2">Field, grade and the skills you actually came away with.</p>
              <div className="glass-well mt-4 grid gap-1.5 rounded-tile p-2">
                {[
                  { k: "Information Systems", v: "BSc" },
                  { k: "Graduated", v: "2023" },
                  { k: "Result", v: "Distinction" },
                ].map((r, i) => (
                  <div key={r.k} className="glass-lite flex items-center justify-between gap-3 rounded-xs px-2.5 py-1.5">
                    <span className="truncate text-[0.78125rem] font-medium text-ink">{r.k}</span>
                    <span className="flex shrink-0 items-center gap-1.5 font-mono text-[0.6875rem] text-muted-ink">
                      {r.v}
                      {i === 2 && <span className="pin" />}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* — Credentials — */}
            <div className="pad group flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <p className="tt-mono inline-flex items-center gap-2">
                  <Award className="h-3.5 w-3.5 text-ink" strokeWidth={2} /> Certificates
                </p>
                <span className="expand">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </div>
              <p className="tt-h2 mt-2.5">Shown, not claimed</p>
              <p className="tt-body mt-2">Attach the document itself, plus the issuer&apos;s verify link.</p>
              <Tilt max={4} className="mt-4">
                <MiniCredential />
              </Tilt>
            </div>

            {/* — Share (2 wide) — */}
            <div className="cell-wide pad flex flex-col justify-between pat-wedge">
              <div className="flex gap-4">
                <span className="mt-0.5 w-[3px] shrink-0 rounded-full bg-acc" />
                <div>
                  <p className="tt-mono">Distribution</p>
                  <p className="tt-h2 mt-2.5">One link, anywhere you need it</p>
                  <p className="tt-body mt-2 max-w-md">
                    A clean public URL for applications, DMs and email signatures. Update the content and the link
                    never changes.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { icon: Link2, label: "astra.app/you" },
                  { icon: Share2, label: "Copy & send" },
                  { icon: Globe, label: "Public by default" },
                  { icon: CheckCircle2, label: "Per-section privacy" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="chip">
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} /> {label}
                  </span>
                ))}
              </div>
            </div>

            {/* — Stat — */}
            <div className="pad flex flex-col justify-between pat-rings">
              <p className="tt-mono">Price</p>
              <div>
                <p className="tt-num">
                  $<Counter value={0} />
                </p>
                <p className="tt-unit mt-1">to publish, forever</p>
              </div>
              <SignedOut>
                <Link href="/sign-in" className="btn btn-acc mt-4 w-full">
                  Start free
                  <ArrowRight className="hov-arrow h-4 w-4" strokeWidth={2} />
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/manage" className="btn btn-acc mt-4 w-full">
                  Dashboard
                  <ArrowRight className="hov-arrow h-4 w-4" strokeWidth={2} />
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══════════════════════════════════ */}
        <section id="how" className="wrap bay scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="tt-mono">How it works</p>
              <h2 data-anim="words" className="tt-h1 mt-2.5">Three steps to a live portfolio.</h2>
            </div>
          </div>

          {/* One panel divided into three, rather than three floating cards. */}
          <div data-anim="mesh" className="mesh mesh-3 mesh-even relative mt-6">
            <MeshCrosshairs cols={3} rows={1} />
            {[
              { n: "01", t: "Sign in", d: "One click with your email. No setup, no template picking, no theme store." },
              { n: "02", t: "Fill your sections", d: "Add projects, roles, schools and certificates from a single dashboard." },
              { n: "03", t: "Share the link", d: "Live at a clean URL the moment you publish. Update it any time." },
            ].map((st) => (
              <div key={st.n} className="pad flex items-start gap-4">
                <span data-anim="step-n" className="tt-num shrink-0 text-[1.5rem] text-muted-ink">{st.n}</span>
                <div>
                  <p className="tt-h2">{st.t}</p>
                  <p className="tt-body mt-1.5">{st.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ DIRECTORY ═════════════════════════════════════ */}
        <section id="directory" className="wrap bay scroll-mt-24">
          <div className="glass pad reveal relative overflow-hidden">
            <span className="beam" />
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="tt-mono">Directory</p>
                <h2 data-anim="words" className="tt-h1 mt-2.5">Browse published portfolios</h2>
                <p className="tt-body mt-2 max-w-md">See what other people are shipping — every profile here is live and public.</p>
              </div>
              <div className="seg">
                <button onClick={() => setSort("recent")} className={`seg-btn ${sort === "recent" ? "is-on" : ""}`}>Recent</button>
                <button onClick={() => setSort("az")} className={`seg-btn ${sort === "az" ? "is-on" : ""}`}>A–Z</button>
              </div>
            </div>

            <hr className="rule my-6" />

            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-ink" strokeWidth={1.75} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or role"
                aria-label="Search profiles"
                className="field field-icon pr-24"
              />
              <span className="tt-mono pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 sm:block">
                {loading ? "" : `${filtered.length} / ${profiles.length}`}
              </span>
            </div>

            <div className="mt-4">
              {loading ? (
                <div className="bento">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="glass-lite shimmer h-[168px] rounded-tile sm:col-span-3 lg:col-span-4" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="glass-well pad-lg grid place-items-center text-center">
                  <span className="glass-bright mb-4 grid h-12 w-12 place-items-center rounded-tile">
                    <Users className="h-5 w-5 text-muted-ink" strokeWidth={1.75} />
                  </span>
                  <p className="tt-h3">No profiles found</p>
                  <p className="tt-sub mt-1">{query ? "Try a different search term." : "Be the first to publish on Astra."}</p>
                </div>
              ) : (
                <div data-anim="cards" className="bento">
                  {/* Real profiles always come first. Samples only pad out the
                      remainder of the grid, and never while searching. */}
                  {filtered.map((p, i) => (
                    <ProfileCard key={p.id} p={p} user={user} i={i} />
                  ))}
                  {!query &&
                    SAMPLES.slice(0, Math.max(0, 6 - filtered.length)).map((sm, i) => (
                      <SampleCard key={sm.role} s={sm} i={i} />
                    ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════ */}
        <section className="wrap pb-4">
          <div data-anim="cta" className="glass pad-lg relative overflow-hidden text-center">
            <div className="orb bottom-[-40%] left-1/2 h-[420px] w-[420px] -translate-x-1/2" />
            <span className="tt-mono inline-flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" strokeWidth={2} /> Free to publish</span>
            <h2 className="tt-h1 mx-auto mt-5 max-w-xl">
              Stop rebuilding your portfolio. <span className="acc">Publish it.</span>
            </h2>
            <p className="tt-lead mx-auto mt-5 max-w-md">Set it up once, keep it current in minutes, share one link forever.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <SignedOut>
                <Link href="/sign-in" className="btn btn-acc btn-lg">
                  Get started
                  <ArrowRight className="hov-arrow h-[18px] w-[18px]" strokeWidth={2} />
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/manage" className="btn btn-acc btn-lg">
                  Go to dashboard
                  <ArrowRight className="hov-arrow h-[18px] w-[18px]" strokeWidth={2} />
                </Link>
              </SignedIn>
              <a href="#directory" className="btn btn-glass btn-lg">See examples</a>
            </div>
          </div>
        </section>
      </main>

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <footer className="wrap pb-[var(--gutter)]">
        <div className="glass pad flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xs bg-ink text-stage"><AstraMark className="h-[17px] w-[17px]" /></span>
            <div>
              <p className="text-[0.9375rem] font-semibold tracking-tight text-ink">Astra Portfolio</p>
              <p className="tt-sub">© {new Date().getFullYear()} — All rights reserved</p>
            </div>
          </div>
          <a href="https://www.linkedin.com/in/tjandra-putra/" target="_blank" rel="noreferrer" className="btn btn-glass btn-sm">
            Developed by Tjandra
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
          </a>
        </div>
      </footer>
    </div>
  );
}
