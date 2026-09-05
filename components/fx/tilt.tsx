"use client";

import React, { useCallback, useRef } from "react";

/**
 * Mouse-tracked 3D tilt. Writes CSS custom properties instead of inline
 * transforms so the styling stays in globals.css (`.tilt-in`, `.sheen`),
 * and reads/writes are batched into one rAF per frame.
 */
export function Tilt({
  children,
  max = 7,
  className = "",
  innerClassName = "",
}: {
  children: React.ReactNode;
  max?: number;
  className?: string;
  innerClassName?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = host.current;
      if (!el) return;
      const { clientX, clientY } = e;
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const r = el.getBoundingClientRect();
        const px = (clientX - r.left) / r.width;
        const py = (clientY - r.top) / r.height;
        el.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
        el.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
      });
    },
    [max]
  );

  const onLeave = useCallback(() => {
    const el = host.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  return (
    <div ref={host} onMouseMove={onMove} onMouseLeave={onLeave} className={`tilt ${className}`}>
      <div className={`tilt-in ${innerClassName}`}>{children}</div>
    </div>
  );
}
