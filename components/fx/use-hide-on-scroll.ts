"use client";

import { useEffect, useState } from "react";

/**
 * The masthead is a set of floating pills rather than a solid bar, so content
 * scrolling underneath collides with it instead of being covered cleanly.
 * Hiding on scroll-down and revealing on scroll-up keeps the floating look
 * without the collision.
 *
 * Returns true while the header should be hidden.
 */
export function useHideOnScroll(threshold = 120) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const delta = y - last;
        // Ignore sub-pixel jitter and rubber-banding at the top.
        if (Math.abs(delta) > 4) {
          setHidden(y > threshold && delta > 0);
          last = y;
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [threshold]);

  return hidden;
}
