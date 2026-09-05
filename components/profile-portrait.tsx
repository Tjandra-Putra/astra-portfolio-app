"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Portrait frame that adapts its fit to the actual image.
 *
 * A single hardcoded `object-cover object-top` works for tall headshots and
 * badly mangles landscape photos — it crops straight through the subject's
 * face. So the fit is decided once the image reports its intrinsic size:
 *
 *  - taller than the frame  → cover, anchored top (keeps the head in frame)
 *  - roughly frame-shaped   → cover, centred
 *  - much wider than frame  → contain, over a blurred copy of itself, so the
 *                             whole photo is visible and the letterboxing
 *                             reads as a deliberate treatment
 *
 * Defaults to cover so there is no layout shift before the image decodes.
 *
 * The caller owns positioning via `className` (default `absolute inset-0`).
 * The wrapper must NOT hardcode `relative`: Tailwind emits `.relative` after
 * `.absolute`, so a base `relative` silently beats a caller's `absolute` and
 * the box collapses to zero height around its absolutely-positioned images.
 */
export function ProfilePortrait({
  src,
  alt,
  className = "absolute inset-0",
  imgClassName = "",
}: {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<"cover-top" | "cover" | "contain">("cover-top");

  const onLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const box = host.current;
    if (!box || !img.naturalWidth || !img.naturalHeight || !box.clientHeight) return;

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const boxAspect = box.clientWidth / box.clientHeight;

    const ratio = imgAspect / boxAspect;

    // Symmetric. A portrait photo in a landscape frame is just as badly
    // mismatched as the reverse, and cover would crop away the subject —
    // the earlier one-sided check only caught images WIDER than the frame,
    // so tall headshots still had their faces cropped.
    if (ratio > 1.25 || ratio < 0.8) setFit("contain");
    else if (ratio < 0.95) setFit("cover-top");
    else setFit("cover");
  }, []);

  // The frame's height comes from the sibling text column, so it can change
  // after reflow — re-evaluate instead of trusting the first measurement.
  useEffect(() => {
    const box = host.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const img = box.querySelector<HTMLImageElement>('img:not([aria-hidden="true"])');
      if (img?.naturalWidth) onLoad({ currentTarget: img } as unknown as React.SyntheticEvent<HTMLImageElement>);
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, [onLoad]);

  return (
    <div ref={host} className={`overflow-hidden ${className}`}>
      {/* Blurred copy of the same photo behind everything. The feathered edges
          of the sharp layer fade into THIS rather than into flat panel grey,
          which is what makes the frame read as one continuous image. */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full scale-125 object-cover saturate-125 ${
          fit === "contain" ? "opacity-60 blur-2xl" : "opacity-45 blur-xl"
        }`}
      />
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        className={`absolute inset-0 h-full w-full ${
          fit === "contain"
            ? "object-contain img-feather"
            : fit === "cover-top"
              ? "object-cover object-top img-feather-soft"
              : "object-cover object-center img-feather-soft"
        } ${imgClassName}`}
      />
    </div>
  );
}
