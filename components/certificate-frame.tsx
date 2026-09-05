"use client";

import React from "react";
import ImageGallery from "@/components/image-gallery";
import { Expand, FileText, ImageIcon } from "lucide-react";

/**
 * Fixed-size presentation for a credential document.
 *
 * Certificates arrive as either an image or a PDF, in portrait or landscape,
 * at any resolution. Rendering them at their intrinsic size (or at a `vh`
 * height) makes every card a different shape. Instead every document is
 * centred on a fixed-ratio recessed mount board and contained within it, so
 * the frame is always identical and the document keeps its own proportions —
 * portrait documents simply show more mount, the way a framed print does.
 *
 * Images open in the lightbox; PDFs open in a new tab, since they cannot be
 * shown in the lightbox. The embedded PDF is inert (`pointer-events-none`) so
 * it reads as a thumbnail and never swallows the page scroll.
 */
export function CertificateFrame({ url, title }: { url: string; title: string }) {
  const isPdf = url.toLowerCase().split("?")[0].endsWith(".pdf");

  /* The document underneath is white paper in BOTH themes, so these overlays
     deliberately use fixed colours instead of theme tokens — a translucent
     glass chip is invisible on white. The scrim normalises the backdrop so one
     light-on-dark treatment reads correctly either way. */
  const badge = (
    <span className="absolute right-3 top-3 z-20 inline-flex h-[25px] items-center gap-1.5 rounded-xs bg-[#0d0d0fcc] px-2.5 text-[0.75rem] font-semibold text-white backdrop-blur-sm">
      {isPdf ? <FileText className="h-3.5 w-3.5" strokeWidth={2} /> : <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} />}
      {isPdf ? "PDF" : "Image"}
    </span>
  );

  const overlay = (
    <span className="absolute inset-0 z-10 grid place-items-center bg-[#0d0d0f00] opacity-0 transition-[opacity,background-color] duration-300 ease-glass group-hover/doc:bg-[#0d0d0f80] group-hover/doc:opacity-100">
      <span className="inline-flex h-9 items-center gap-2 rounded-sm bg-white px-4 text-[0.8125rem] font-semibold text-[#0d0d0f] shadow-[0_6px_18px_-4px_rgba(0,0,0,0.45)]">
        <Expand className="h-4 w-4" strokeWidth={2} />
        {isPdf ? "Open PDF" : "View full size"}
      </span>
    </span>
  );

  /* The mount board — identical geometry for every credential. */
  const mount = (children: React.ReactNode) => (
    <div className="glass-well group/doc relative aspect-[4/3] w-full overflow-hidden rounded-tile p-3 sm:p-5">
      {badge}
      {overlay}
      <div className="relative h-full w-full transition-transform duration-500 ease-glass group-hover/doc:scale-[1.02]">
        {children}
      </div>
    </div>
  );

  if (isPdf) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${title} (PDF) in a new tab`}
        className="block cursor-pointer"
      >
        {mount(
          <span className="block h-full w-full overflow-hidden rounded-xs bg-white shadow-e2">
            <iframe
              // Hide the viewer chrome so it reads as a document, not an app.
              src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              title={title}
              tabIndex={-1}
              className="pointer-events-none h-full w-full border-0"
            />
          </span>
        )}
      </a>
    );
  }

  return (
    <ImageGallery images={[url]}>
      {mount(
        <img
          src={url}
          alt={title}
          loading="lazy"
          className="h-full w-full object-contain drop-shadow-[0_10px_24px_rgba(13,13,15,0.28)]"
        />
      )}
    </ImageGallery>
  );
}
