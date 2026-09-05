/**
 * Deterministic pattern picker.
 *
 * Component patterns should vary across a grid, but `Math.random()` would
 * differ between the server and client render (hydration mismatch) and would
 * reshuffle on every re-render. Hashing a stable seed — an id, a title, an
 * index — gives the same scattered-looking assignment every time.
 */
const PATTERNS = ["pat-dots", "pat-grid", "pat-diag", "pat-rings", "pat-ticks", "pat-wedge"] as const;

export type PatternClass = (typeof PATTERNS)[number];

export function patternFor(seed: string | number, offset = 0): PatternClass {
  const str = String(seed);
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return PATTERNS[(((h >>> 0) + offset) % PATTERNS.length + PATTERNS.length) % PATTERNS.length];
}
