"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Mount once per page shell. Any element with `.reveal` fades/rises in as it
 * enters the viewport; `.progress` is scaled to scroll completion.
 *
 * Fails OPEN. `.reveal` starts at `opacity: 0`, so any gap in the observer
 * logic hides real content — which is far worse than a missed animation.
 * Three guarantees:
 *   1. anything already within (or above) the viewport at mount reveals at once
 *   2. threshold 0 — a single visible pixel is enough
 *   3. a timer reveals everything still hidden, whatever happened
 *
 * Uses IntersectionObserver rather than ScrollTrigger because content arrives
 * after fetches resolve, and a MutationObserver that both reads and writes the
 * DOM (or calls ScrollTrigger.refresh) feeds back into itself.
 */
export function MotionLayer() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealAll = () => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));

    if (reduced) {
      revealAll();
      return;
    }

    const seen = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0 }
    );

    // Read-only: queries and observes, never writes. Safe from an observer.
    const scan = () => {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // Already on screen (or scrolled past) — show it now, don't wait.
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-in");
          return;
        }
        io.observe(el);
      });
    };
    scan();

    // Watches for late-arriving content (fetches resolving). Disconnected once
    // the page has settled — leaving a whole-body subtree observer running for
    // the session means every DOM insertion schedules another full `.reveal`
    // scan while the user is scrolling. After this, the scroll handler's own
    // scan() still picks up anything new.
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    const stopObserving = window.setTimeout(() => mo.disconnect(), 10000);

    // Last-resort net: never leave content invisible.
    const failOpen = window.setTimeout(revealAll, 2500);

    let raf = 0;
    const bar = document.querySelector<HTMLElement>(".progress");
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (bar) {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
        }
        scan();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      mo.disconnect();
      window.clearTimeout(stopObserving);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(failOpen);
      if (pending) cancelAnimationFrame(pending);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
