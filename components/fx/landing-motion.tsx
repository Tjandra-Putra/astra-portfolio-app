"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll choreography for the landing page.
 *
 * Targets `data-anim` hooks rather than classes, so it cannot collide with the
 * generic `.reveal` system in MotionLayer. Everything animates with
 * `gsap.from()` on elements that are already visible in CSS, which means a JS
 * failure, a slow bundle, or prefers-reduced-motion all degrade to plain
 * static content instead of hiding it — the failure mode `.reveal` has.
 *
 * Lenis is already driving ScrollTrigger off GSAP's ticker (see
 * providers/smooth-scroll), so scrubbed timelines stay locked to the smoothed
 * scroll position instead of lagging a frame behind it.
 */
export function LandingMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const q = <T extends Element = HTMLElement>(sel: string) =>
      Array.from(document.querySelectorAll<T>(sel));

    const ctx = gsap.context(() => {
      /* ── Headings: per-word masked rise ────────────────────── */
      // Splitting must preserve nested markup (the accent <span>), so walk the
      // child nodes instead of rewriting innerHTML.
      const splits: { el: HTMLElement; html: string }[] = [];

      const splitWords = (el: HTMLElement) => {
        splits.push({ el, html: el.innerHTML });
        const wrap = (text: string) =>
          text
            .split(/(\s+)/)
            .map((tok) => (/^\s+$/.test(tok) ? tok : tok ? `<span class="wm"><span class="wi">${tok}</span></span>` : ""))
            .join("");

        const walk = (node: Node) => {
          Array.from(node.childNodes).forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
              const t = child.textContent || "";
              if (!t.trim()) return;
              const span = document.createElement("span");
              span.innerHTML = wrap(t);
              child.replaceWith(...Array.from(span.childNodes));
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              walk(child);
            }
          });
        };
        walk(el);
      };

      q('[data-anim="words"]').forEach((el) => {
        splitWords(el);
        gsap.from(el.querySelectorAll(".wi"), {
          yPercent: 118,
          rotate: 2.5,
          duration: 0.95,
          ease: "expo.out",
          stagger: 0.045,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      /* ── Hero: depth on the way out ────────────────────────── */
      const hero = document.querySelector<HTMLElement>('[data-anim="hero"]');
      if (hero) {
        gsap
          .timeline({
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 },
          })
          .to('[data-anim="hero-copy"]', { yPercent: -14, opacity: 0.25, ease: "none" }, 0)
          // Media moves further: parallax reads as depth, not drift.
          .to('[data-anim="hero-media"]', { yPercent: -30, opacity: 0.35, ease: "none" }, 0)
          .to('[data-anim="hero-marquee"]', { yPercent: -6, opacity: 0.4, ease: "none" }, 0);
      }

      /* ── Background decor drifts slower than content ───────── */
      q('[data-anim="decor"]').forEach((el) => {
        gsap.to(el, {
          yPercent: 16,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: 1.1 },
        });
      });

      /* ── Bento cells: staggered rise, crosshairs last ──────── */
      q('[data-anim="mesh"]').forEach((mesh) => {
        const cells = Array.from(mesh.children).filter((c) => !c.classList.contains("mesh-overlay"));
        gsap.from(cells, {
          yPercent: 9,
          scale: 0.975,
          opacity: 0,
          transformOrigin: "50% 100%",
          duration: 0.8,
          ease: "expo.out",
          stagger: { each: 0.075, from: "start" },
          scrollTrigger: { trigger: mesh, start: "top 85%", once: true },
        });
        gsap.from(mesh.querySelectorAll(".crosshair"), {
          opacity: 0,
          scale: 0.4,
          duration: 0.5,
          ease: "back.out(2)",
          stagger: 0.05,
          delay: 0.35,
          scrollTrigger: { trigger: mesh, start: "top 85%", once: true },
        });
      });

      /* ── Step numbers ignite as they pass ──────────────────── */
      q('[data-anim="step-n"]').forEach((n) => {
        gsap.fromTo(
          n,
          { color: "var(--muted-ink)" },
          {
            color: "var(--acc-text)",
            ease: "none",
            scrollTrigger: { trigger: n, start: "top 78%", end: "top 42%", scrub: true },
          }
        );
      });

      /* ── Card grids: stagger in ────────────────────────────── */
      q('[data-anim="cards"]').forEach((grid) => {
        gsap.from(grid.children, {
          y: 18,
          opacity: 0,
          duration: 0.55,
          ease: "expo.out",
          stagger: 0.05,
          // Strip the inline transform when done: a leftover per-card `y`
          // offsets grid siblings against each other and reads as a broken,
          // misaligned row.
          clearProps: "transform",
          scrollTrigger: { trigger: grid, start: "top 88%", once: true },
        });
      });

      /* ── CTA settles up into place ─────────────────────────── */
      q('[data-anim="cta"]').forEach((el) => {
        gsap.from(el, {
          y: 40,
          scale: 0.97,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      /* ── Marquee: scroll velocity drives speed, direction, skew ── */
      const track = document.querySelector<HTMLElement>('[data-anim="mq-track"]');
      if (track) {
        track.classList.add("is-js");
        const loop = gsap.to(track, { xPercent: -50, repeat: -1, duration: 26, ease: "none" });
        let idle: number | undefined;

        const st = ScrollTrigger.create({
          onUpdate: (self) => {
            const v = self.getVelocity();
            const speed = gsap.utils.clamp(1, 7, Math.abs(v) / 260);
            loop.timeScale((v < 0 ? -1 : 1) * speed);
            gsap.to(track, {
              skewX: gsap.utils.clamp(-9, 9, v / -170),
              duration: 0.45,
              ease: "power3.out",
              overwrite: "auto",
            });

            // Ease back to the resting crawl once scrolling stops.
            if (idle) window.clearTimeout(idle);
            idle = window.setTimeout(() => {
              gsap.to(loop, { timeScale: 1, duration: 0.8, ease: "power2.out", overwrite: true });
              gsap.to(track, { skewX: 0, duration: 0.6, ease: "power3.out", overwrite: "auto" });
            }, 140);
          },
        });

        const enter = () => loop.pause();
        const leave = () => loop.resume();
        const host = track.parentElement;
        host?.addEventListener("mouseenter", enter);
        host?.addEventListener("mouseleave", leave);

        return () => {
          if (idle) window.clearTimeout(idle);
          st.kill();
          loop.kill();
          host?.removeEventListener("mouseenter", enter);
          host?.removeEventListener("mouseleave", leave);
          track.classList.remove("is-js");
          splits.forEach(({ el, html }) => (el.innerHTML = html));
        };
      }

      return () => splits.forEach(({ el, html }) => (el.innerHTML = html));
    });

    // Content arrives after the profile fetch resolves; re-measure once settled.
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 600);

    /**
     * Fail-open net. `gsap.from()` writes its start state (opacity: 0)
     * immediately, so anything whose ScrollTrigger never fires stays invisible.
     * ScrollTrigger is reliable, but a mis-measured layout after a late fetch
     * would hide real content — so sweep once and clear anything still hidden
     * that is now inside the viewport.
     */
    // Targets only elements actually carrying an inline opacity:0 — the exact
    // failure mode. The previous `[data-anim] *` selector matched essentially
    // the whole page on every tick, which is not something to run while the
    // user is scrolling.
    const net = window.setInterval(() => {
      document.querySelectorAll<HTMLElement>('[style*="opacity: 0"]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.height > 4 && r.top < window.innerHeight * 0.9) {
          gsap.set(el, { clearProps: "opacity,transform" });
        }
      });
    }, 2000);
    const stopNet = window.setTimeout(() => window.clearInterval(net), 12000);

    return () => {
      window.clearTimeout(settle);
      window.clearInterval(net);
      window.clearTimeout(stopNet);
      ctx.revert();
    };
  }, []);

  return null;
}
