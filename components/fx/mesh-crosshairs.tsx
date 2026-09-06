"use client";

import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

const px = (v: string) => parseFloat(v) || 0;

/**
 * Draws "+" marks where the bento grid's seams cross.
 *
 * Positions come from the grid's own RESOLVED track sizes
 * (`grid-template-columns` / `grid-template-rows` read back from computed
 * style), not from measuring cell rectangles and not from assuming even
 * fractions. Both of those were subtly wrong:
 *
 *  - even fractions forced the grid to carry equal row heights, which padded
 *    every short cell out to the tallest one;
 *  - cell rects drift, because a cell's right edge sits one gap-width away
 *    from the seam centre, and spanned cells contribute edges that are not
 *    seams at all.
 *
 * Reading the tracks gives the exact seam centre. A candidate is then dropped
 * if any single cell spans across it — otherwise a mark would float in the
 * middle of a two-column cell.
 */
export function MeshCrosshairs({ className = "hidden lg:block" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    const overlay = host.current;
    const mesh = overlay?.parentElement;
    if (!mesh) return;

    const measure = () => {
      const cs = getComputedStyle(mesh);
      if (!cs.gridTemplateColumns || cs.gridTemplateColumns === "none") return;

      const cols = cs.gridTemplateColumns.split(" ").map(px).filter((n) => n > 0);
      const rows = cs.gridTemplateRows.split(" ").map(px).filter((n) => n > 0);
      const gapX = px(cs.columnGap);
      const gapY = px(cs.rowGap);
      if (cols.length < 2 || rows.length < 2) {
        setPoints((p) => (p.length ? [] : p));
        return;
      }

      // Seam i sits after track i-1: sum of preceding tracks + the gaps between
      // them, plus half of this gap to land on its centre.
      const seams = (tracks: number[], gap: number) => {
        const out: number[] = [];
        let run = 0;
        for (let i = 0; i < tracks.length - 1; i++) {
          run += tracks[i];
          out.push(run + gap * i + gap / 2);
          }
        return out;
      };

      const xs = seams(cols, gapX);
      const ys = seams(rows, gapY);

      const box = mesh.getBoundingClientRect();
      const cells = (Array.from(mesh.children) as HTMLElement[]).filter(
        (c) => c !== overlay && !c.classList.contains("mesh-overlay")
      );
      const rects = cells.map((c) => {
        const r = c.getBoundingClientRect();
        return { l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top };
      });

      const next: Point[] = [];
      for (const y of ys) {
        for (const x of xs) {
          // Skip if a cell spans across this crossing (a wide or tall cell).
          const spanned = rects.some((q) => q.l < x - 1 && q.r > x + 1 && q.t < y - 1 && q.b > y + 1);
          if (!spanned) next.push({ x, y });
        }
      }

      setPoints((prev) =>
        prev.length === next.length && prev.every((p, i) => Math.abs(p.x - next[i].x) < 0.5 && Math.abs(p.y - next[i].y) < 0.5)
          ? prev
          : next
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(mesh);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={host}
      className={`mesh-overlay pointer-events-none absolute inset-0 z-[2] ${className}`}
      aria-hidden="true"
    >
      {points.map((p, i) => (
        <span key={i} className="crosshair" style={{ left: p.x, top: p.y }} />
      ))}
    </div>
  );
}
