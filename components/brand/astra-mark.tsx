/**
 * Astra brand mark — a four-point star ("astra"), drawn with concave sides so
 * it reads as a sparkle rather than a generic diamond. Uses `currentColor`, so
 * one component serves the ink tile, the accent tile and the favicon.
 */
export function AstraMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 1.6c.62 5.5 4.9 9.78 10.4 10.4-5.5.62-9.78 4.9-10.4 10.4-.62-5.5-4.9-9.78-10.4-10.4C7.1 11.38 11.38 7.1 12 1.6Z"
        fill="currentColor"
      />
      <circle cx="19.4" cy="4.6" r="1.5" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

/** The full lockup: mark in a tile plus the wordmark. */
export function AstraLogo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <>
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xs bg-ink text-stage transition-transform duration-500 ease-glass group-hover/brand:rotate-[90deg]">
        <AstraMark className="h-[15px] w-[15px]" />
      </span>
      {withWordmark && (
        <span className="hidden text-[15px] font-semibold tracking-tight text-ink sm:inline">Astra</span>
      )}
    </>
  );
}
