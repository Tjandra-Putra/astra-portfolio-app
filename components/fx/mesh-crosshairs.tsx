/**
 * Draws "+" marks where the bento grid lines cross.
 *
 * Positions are exact fractions of the panel, which only coincides with the
 * real grid lines when every track is equal — so the `.mesh` this overlays
 * must also carry `.mesh-even`, and the overlay is hidden at breakpoints
 * where the column count differs.
 *
 * Three families of mark:
 * Only true crossings get a mark. Edge T-junctions and panel corners are
 * available via `edges`/`corners` but default to off: nothing crosses there,
 * so a "+" reads as a stray floating glyph rather than a joint.
 */
export function MeshCrosshairs({
  cols,
  rows,
  edges = false,
  corners = false,
  inset = 21,
  className = "hidden lg:block",
}: {
  cols: number;
  rows: number;
  edges?: boolean;
  corners?: boolean;
  inset?: number;
  className?: string;
}) {
  type Mark = { left?: string | number; top?: string | number; right?: number; bottom?: number };
  const marks: Mark[] = [];

  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      marks.push({ left: `${(c / cols) * 100}%`, top: `${(r / rows) * 100}%` });
    }
  }

  if (edges) {
    for (let c = 1; c < cols; c++) {
      marks.push({ left: `${(c / cols) * 100}%`, top: inset });
      marks.push({ left: `${(c / cols) * 100}%`, bottom: inset });
    }
    for (let r = 1; r < rows; r++) {
      marks.push({ top: `${(r / rows) * 100}%`, left: inset });
      marks.push({ top: `${(r / rows) * 100}%`, right: inset });
    }
  }

  if (corners) {
    marks.push({ left: inset, top: inset });
    marks.push({ right: inset, top: inset });
    marks.push({ left: inset, bottom: inset });
    marks.push({ right: inset, bottom: inset });
  }

  return (
    // `mesh-overlay` keeps the `.mesh > *` cell-background rule off this layer.
    <div className={`mesh-overlay pointer-events-none absolute inset-0 z-[2] ${className}`} aria-hidden="true">
      {marks.map((m, i) => (
        <span
          key={i}
          className="crosshair"
          style={{
            ...m,
            // The class centres itself with negative margins; only axes
            // positioned by percentage need that, px-inset axes are exact.
            marginLeft: typeof m.left === "string" ? undefined : 0,
            marginTop: typeof m.top === "string" ? undefined : 0,
          }}
        />
      ))}
    </div>
  );
}
