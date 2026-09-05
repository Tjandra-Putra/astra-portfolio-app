"use client";

import { useEffect } from "react";
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

  return null;
}
