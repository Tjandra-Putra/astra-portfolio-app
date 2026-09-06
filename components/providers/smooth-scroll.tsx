"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Momentum scrolling driven off GSAP's ticker so Lenis and ScrollTrigger
 * share one clock — without this, scroll-linked animations drift behind
 * the smoothed scroll position. Disabled under prefers-reduced-motion so
 * native scrolling stays intact.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    (window as any).__lenis = lenis;

    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", update);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  /**
   * Reset to the top on navigation.
   *
   * Lenis manages the scroll position itself, so Next's built-in scroll
   * restoration does not apply and a route change kept the previous offset —
   * landing you mid-page on the new route.
   *
   * Skipped when the URL carries a hash, so in-page anchors (#what, #how,
   * #directory) still jump to their target instead of being yanked to the top.
   */
  useEffect(() => {
    if (window.location.hash) return;
    const lenis = (window as any).__lenis;
    if (lenis?.scrollTo) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  /**
   * In-page anchors go through Lenis.
   *
   * Native hash navigation sets scrollTop directly, which Lenis then snaps to —
   * so `#directory` teleported instead of gliding. Intercepting the click and
   * handing the target to Lenis keeps anchors on the same easing as every
   * other scroll. `scroll-mt-*` is respected via the scroll-margin-top offset.
   */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash || url.hash === "#") return;

      const target = document.querySelector<HTMLElement>(url.hash);
      if (!target) return;

      e.preventDefault();
      const offset = parseFloat(getComputedStyle(target).scrollMarginTop || "0") || 0;
      const lenis = (window as any).__lenis;

      if (lenis?.scrollTo) {
        lenis.scrollTo(target, { offset: -offset, duration: 1.15 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      history.replaceState(null, "", url.hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
