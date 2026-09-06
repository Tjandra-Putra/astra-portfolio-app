"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

/**
 * Project media gallery.
 *
 * Built on Embla, which is headless — it supplies drag physics, snapping and
 * keyboard/accessibility plumbing but zero styling, so the frame, thumbnails
 * and lightbox are all our own glass components rather than a library's theme.
 * (The previous inline lightbox imposed its own box model and CSS, which is
 * why the media block could not be sized to the layout.)
 *
 * Media is presented inside a browser frame and CONTAINED, not cropped: these
 * are screenshots at arbitrary aspect ratios, so `object-cover` at a fixed
 * height sliced content out of the middle. Containing them on a mat means
 * nothing is ever cut off, and the chrome makes the letterboxing read as a
 * deliberate frame rather than a sizing accident.
 *
 * The lightbox is a separate fixed layer with its own carousel kept in sync.
 */
export function ProjectGallery({
  images,
  title,
  siteUrl,
}: {
  images: string[];
  title?: string;
  siteUrl?: string;
}) {
  const slides = Array.from(new Set(images.filter(Boolean)));
  const many = slides.length > 1;

  const [mainRef, main] = useEmblaCarousel({ loop: many, align: "center", duration: 26 });
  const [thumbRef, thumbs] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    align: "start",
  });
  const [selected, setSelected] = useState(0);

  const [open, setOpen] = useState(false);
  const [boxRef, box] = useEmblaCarousel({ loop: many, align: "center", duration: 22 });

  /* ── main <-> thumbs sync ── */
  const onSelect = useCallback(() => {
    if (!main) return;
    const i = main.selectedScrollSnap();
    setSelected(i);
    thumbs?.scrollTo(i);
  }, [main, thumbs]);

  useEffect(() => {
    if (!main) return;
    onSelect();
    main.on("select", onSelect).on("reInit", onSelect);
    return () => {
      main.off("select", onSelect).off("reInit", onSelect);
    };
  }, [main, onSelect]);

  /* ── lightbox opens on the slide you were looking at ── */
  useEffect(() => {
    if (open && box) box.scrollTo(selected, true);
  }, [open, box, selected]);

  useEffect(() => {
    if (!open || !box) return;
    const sync = () => setSelected(box.selectedScrollSnap());
    box.on("select", sync);
    return () => {
      box.off("select", sync);
    };
  }, [open, box]);

  /* ── keyboard: arrows navigate, escape closes ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const api = open ? box : main;
      if (!api) return;
      if (e.key === "Escape" && open) setOpen(false);
      if (e.key === "ArrowLeft") api.scrollPrev();
      if (e.key === "ArrowRight") api.scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, box, main]);

  // Lock the page behind the lightbox.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open && selected >= 0) main?.scrollTo(selected, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (slides.length === 0) return null;

  const counter = `${String(selected + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;

  // Frame label: the real host when we have a link, else the project name.
  let host = title || "preview";
  if (siteUrl) {
    try {
      host = new URL(siteUrl).host.replace(/^www\./, "");
    } catch {
      /* not a parseable URL — keep the fallback */
    }
  }

  return (
    <>
      <figure className="glass relative overflow-hidden rounded-panel p-2">
        {/* Stage, presented as a browser window */}
        <div className="glass-well relative overflow-hidden rounded-tile">
          {/* Chrome — sits outside the carousel so it stays put between slides */}
          <div className="flex items-center gap-3 px-3.5 py-3">
            <span className="flex shrink-0 gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            </span>
            <span className="glass-lite flex h-6 min-w-0 flex-1 items-center rounded-xs px-2.5">
              <span className="truncate font-mono text-[0.6875rem] text-muted-ink">{host}</span>
            </span>
            {many && (
              <span className="shrink-0 font-mono text-[0.6875rem] font-medium tracking-widest text-muted-ink">
                {counter}
              </span>
            )}
          </div>

          <div className="group/stage relative">
            <div ref={mainRef} className="overflow-hidden">
              <div className="flex touch-pan-y">
                {slides.map((src, i) => (
                  <div key={src + i} className="min-w-0 flex-[0_0_100%]">
                    {/* A scrollable viewport, not a contained thumbnail. These are
                        full-page website captures — often 1:3 or taller — so
                        containing them shrinks the UI to illegibility and
                        cropping them cuts content. Showing them at full width and
                        letting the frame scroll is how you actually read a
                        screenshot, and matches the browser-window framing.
                        `overscroll-contain` stops it from stealing page scroll;
                        `touch-pan-y` on the track keeps Embla's horizontal drag. */}
                    <div
                      data-gal-slide
                      className="scrollbar-slim h-[var(--gal-h,clamp(260px,52vh,540px))] overflow-y-auto overscroll-contain px-3 pb-3"
                    >
                      <div className="grid min-h-full place-items-center">
                        <img
                          src={src}
                          alt={title ? `${title} — image ${i + 1}` : `Image ${i + 1}`}
                          loading={i === 0 ? "eager" : "lazy"}
                          draggable={false}
                          className="block h-auto w-full select-none rounded-xs shadow-e2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expand — the scrim guarantees contrast over any image */}
            <button
              onClick={() => setOpen(true)}
              aria-label="View full size"
              className="absolute inset-0 z-10 grid place-items-center bg-[#0a0a0c00] opacity-0 transition-[opacity,background-color] duration-300 ease-glass hover:bg-[#0a0a0c59] hover:opacity-100 focus-visible:bg-[#0a0a0c59] focus-visible:opacity-100"
            >
              <span className="inline-flex h-9 items-center gap-2 rounded-sm bg-white px-4 text-[0.8125rem] font-semibold text-[#0a0a0c] shadow-[0_6px_18px_-4px_rgba(0,0,0,0.45)]">
                <Expand className="h-4 w-4" strokeWidth={2} />
                View full size
              </span>
            </button>

            {/* Arrows */}
            {many && (
              <>
                <button
                  onClick={() => main?.scrollPrev()}
                  aria-label="Previous image"
                  className="mediabtn absolute left-3 top-1/2 z-20 -translate-y-1/2"
                >
                  <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => main?.scrollNext()}
                  aria-label="Next image"
                  className="mediabtn absolute right-3 top-1/2 z-20 -translate-y-1/2"
                >
                  <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        {many && (
          <div ref={thumbRef} className="mt-2 overflow-hidden">
            <div className="flex gap-2">
              {slides.map((src, i) => (
                <button
                  key={"t" + src + i}
                  onClick={() => main?.scrollTo(i)}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={i === selected}
                  className={`relative min-w-0 flex-[0_0_4.25rem] overflow-hidden rounded-xs transition-opacity duration-300 sm:flex-[0_0_5.25rem] ${
                    i === selected ? "opacity-100" : "opacity-45 hover:opacity-80"
                  }`}
                >
                  <span className="relative block aspect-[16/10] w-full">
                    <img src={src} alt="" draggable={false} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  </span>
                  {i === selected && <span className="absolute inset-x-0 bottom-0 h-[3px] bg-acc" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </figure>

      {/* ── Lightbox ─────────────────────────────────────── */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-[999] flex flex-col bg-[#0a0a0cf2] backdrop-blur-glass"
        >
          <div className="relative z-20 flex items-center justify-between gap-3 p-4">
            <span className="font-mono text-[0.6875rem] font-medium tracking-widest text-white/70">
              {many ? counter : title || ""}
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close viewer"
              className="grid h-10 w-10 place-items-center rounded-sm bg-[#0a0a0ce6] text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-[#0a0a0c] hover:ring-white/45"
            >
              <X className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </button>
          </div>

          {/* Click the backdrop to dismiss; the image itself does not bubble. */}
          <div className="relative flex min-h-0 flex-1 items-center overflow-hidden" onClick={() => setOpen(false)}>
            <div ref={boxRef} className="w-full overflow-hidden">
              <div className="flex touch-pan-y items-center">
                {slides.map((src, i) => (
                  <div key={"l" + src + i} className="grid min-w-0 flex-[0_0_100%] place-items-center px-4">
                    {/* Sized against the viewport, not `max-h-full`: a percentage
                        max-height does not resolve against an indefinite flex/grid
                        area, so the image overflowed and got clipped. The subtracted
                        space is the header plus the thumbnail rail. */}
                    <img
                      src={src}
                      alt={title ? `${title} — image ${i + 1}` : `Image ${i + 1}`}
                      draggable={false}
                      onClick={(e) => e.stopPropagation()}
                      className={`h-auto w-auto max-w-full select-none rounded-tile object-contain shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] ${
                        many ? "max-h-[calc(100svh-13rem)]" : "max-h-[calc(100svh-7rem)]"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {many && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    box?.scrollPrev();
                  }}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-sm bg-[#0a0a0ce6] text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-[#0a0a0c] hover:ring-white/45"
                >
                  <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    box?.scrollNext();
                  }}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-sm bg-[#0a0a0ce6] text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-[#0a0a0c] hover:ring-white/45"
                >
                  <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </>
            )}
          </div>

          {/* Explicit navigation inside the viewer, so it does not depend on
              discovering the arrows or knowing the keyboard shortcuts. */}
          {many && (
            <div className="relative z-20 flex justify-center px-4 pb-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex max-w-full gap-2 overflow-x-auto rounded-sm bg-[#0a0a0ccc] p-2 ring-1 ring-white/15 backdrop-blur-sm scrollbar-slim">
                {slides.map((src, i) => (
                  <button
                    key={"lt" + src + i}
                    onClick={() => box?.scrollTo(i)}
                    aria-label={`Go to image ${i + 1}`}
                    aria-current={i === selected}
                    className={`relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-xs transition-all duration-300 ${
                      i === selected
                        ? "opacity-100 ring-2 ring-acc"
                        : "opacity-50 ring-1 ring-white/20 hover:opacity-85"
                    }`}
                  >
                    <img src={src} alt="" draggable={false} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
