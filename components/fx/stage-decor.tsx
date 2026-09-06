import type * as React from "react";

/**
 * Decorative technical illustration layer for the stage.
 *
 * Pure inline SVG on hairline tokens, so it costs one cheap paint, needs no
 * assets, and re-tints itself in dark mode. Sits behind content (z-index 0 in
 * a positioned parent) and is `aria-hidden` — it carries no information.
 *
 * Every element is drawn from the same drafting vocabulary as the UI: rings,
 * tick scales, plus lattices and corner brackets, echoing the bento crosshairs
 * so the ornament reads as part of the system rather than decoration bolted on.
 */
export function StageDecor({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden="true">
      {/* Concentric rings, anchored off the right edge */}
      <svg
        className="absolute -right-[10%] -top-[18%] hidden h-[min(58vw,620px)] w-[min(58vw,620px)] text-hairline-2 md:block"
        viewBox="0 0 400 400"
        fill="none"
      >
        {[60, 100, 140, 180].map((r) => (
          <circle key={r} cx="200" cy="200" r={r} stroke="currentColor" strokeWidth="0.6" />
        ))}
        <circle cx="200" cy="200" r="196" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 7" />
        <g className="origin-center motion-safe:animate-[decor-spin_64s_linear_infinite]">
          <circle cx="200" cy="200" r="158" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 14" />
        </g>
        <circle cx="200" cy="42" r="2.4" className="fill-acc" opacity="0.5" />
      </svg>

      {/* Measure scale down the left edge */}
      <svg className="absolute left-0 top-[18%] hidden h-[460px] w-9 text-hairline-2 sm:block" viewBox="0 0 36 460" fill="none">
        <line x1="0.5" y1="0" x2="0.5" y2="460" stroke="currentColor" strokeWidth="0.6" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="0.5"
            y1={i * 20 + 4}
            x2={i % 4 === 0 ? 17 : 8}
            y2={i * 20 + 4}
            stroke="currentColor"
            strokeWidth="0.6"
          />
        ))}
      </svg>

      {/* Plus lattice, bottom-left */}
      <svg className="absolute -left-4 bottom-[6%] hidden h-40 w-64 text-hairline-2 sm:block" viewBox="0 0 256 160" fill="none">
        {Array.from({ length: 5 }).flatMap((_, r) =>
          Array.from({ length: 8 }).map((__, c) => {
            const x = c * 32 + 16;
            const y = r * 32 + 16;
            return (
              <g key={`${r}-${c}`} stroke="currentColor" strokeWidth="0.7" opacity={1 - r * 0.16}>
                <line x1={x - 4} y1={y} x2={x + 4} y2={y} />
                <line x1={x} y1={y - 4} x2={x} y2={y + 4} />
              </g>
            );
          })
        )}
      </svg>

      {/* Corner brackets */}
      <svg className="absolute right-6 bottom-6 h-16 w-16 text-hairline-2" viewBox="0 0 64 64" fill="none">
        <path d="M64 40v24H40" stroke="currentColor" strokeWidth="0.8" />
        <path d="M64 20v6M44 64h6" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    </div>
  );
}
