"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Grows its content to fill the viewport as you scroll toward it, then lets it
 * scroll away into whatever follows.
 *
 * Reading a project goes: framed preview → scroll → the media reaches full
 * viewport height with an even margin all round → keep scrolling → the write-up
 * comes up beneath it.
 *
 * Deliberately NOT pinned. A pinned element becomes `position: fixed` for the
 * duration of the pin, and the sections after it scroll straight over the top —
 * the detail panels ended up overlaying the gallery. Growing in normal flow
 * keeps every section in document order, so overlap is impossible.
 *
 * Sizing notes:
 * - Height is driven through `--gal-h`, which the gallery slide consumes.
 *   Animating between `clamp(...)` and a viewport unit is not interpolatable,
 *   so both ends are resolved to pixels by function values on every refresh.
 * - The panel is taller than its slide (browser chrome bar, thumbnail strip,
 *   padding), so that difference is measured and subtracted — otherwise the
 *   panel overshoots the viewport by exactly the height of its own chrome.
 * - The page gutter is never touched, so the panel keeps an equal inset on all
 *   four sides.
 *
 * Fails open: under reduced motion, on short or narrow screens, or if anything
 * throws, no timeline is created and the gallery stays at its CSS `clamp()`
 * size — fully usable on its own.
 */
export function ExpandOnScroll({ children }: { children: React.ReactNode }) {
  const section = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionEl = section.current;
    const frameEl = frame.current;
    if (!sectionEl || !frameEl) return;

    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 640px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let ctx: gsap.Context | undefined;
    let settle = 0;

    const build = () => {
      ctx?.revert();
      if (!mq.matches || reduced.matches) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const slide = frameEl.querySelector<HTMLElement>("[data-gal-slide]") || frameEl;
        const figure = frameEl.querySelector<HTMLElement>("figure") || frameEl;

        const gutter = () =>
          parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--gutter")) || 0;
        const startH = () => slide.getBoundingClientRect().height;
        const chrome = () => Math.max(0, figure.getBoundingClientRect().height - startH());
        const endH = () => Math.round(window.innerHeight - gutter() * 2 - chrome());

        gsap.fromTo(
          frameEl,
          { "--gal-h": () => `${Math.round(startH())}px` },
          {
            "--gal-h": () => `${endH()}px`,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionEl,
              // Grows as the panel travels from just below the fold up to the
              // top of the viewport, reaching full size as it settles there.
              start: "top 85%",
              end: () => `top top+=${gutter()}`,
              scrub: 0.5,
              invalidateOnRefresh: true,
              onRefresh: (self) => {
                // Nothing to gain if the media is already near full height.
                if (endH() <= startH() + 40) self.disable();
              },
            },
          }
        );
      }, sectionEl);

      // Images settle after first paint; re-measure so both ends are real.
      settle = window.setTimeout(() => ScrollTrigger.refresh(), 800);
    };

    const onLoad = () => ScrollTrigger.refresh();

    build();
    mq.addEventListener("change", build);
    reduced.addEventListener("change", build);
    window.addEventListener("load", onLoad, { once: true });

    return () => {
      mq.removeEventListener("change", build);
      reduced.removeEventListener("change", build);
      window.removeEventListener("load", onLoad);
      window.clearTimeout(settle);
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={section} className="relative">
      <div ref={frame}>{children}</div>
    </div>
  );
}
