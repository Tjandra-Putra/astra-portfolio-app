"use client";

import { ReactElement, useEffect, useState } from "react";

interface ProfileToastProps {
  profile: { imageUrl?: string; name?: string };
  defaultProfileImage: string;
  children: ReactElement;
}

/**
 * The "look who's curious" greeting.
 *
 * Previously a Tippy tooltip anchored outside the portrait, which put it over
 * the adjacent identity panel where that panel's `overflow` clipped it. It is
 * now a glass chip rendered inside the portrait frame itself: nothing to
 * collide with, nothing to clip, and it inherits the design system directly.
 *
 * Waits for the portrait to actually decode before greeting — appearing over a
 * blank frame is what made the old timing feel arbitrary.
 */
export default function ProfileToast({ profile, defaultProfileImage, children }: ProfileToastProps) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const src = profile?.imageUrl || defaultProfileImage;
    if (!src) return;

    let enter: number | undefined;
    let exit: number | undefined;

    const start = () => {
      enter = window.setTimeout(() => setShown(true), 700);
      exit = window.setTimeout(() => setShown(false), 8000);
    };

    const img = new window.Image();
    img.src = src;
    if (img.complete) start();
    else {
      img.onload = start;
      img.onerror = start;
    }

    return () => {
      if (enter) window.clearTimeout(enter);
      if (exit) window.clearTimeout(exit);
    };
  }, [profile, defaultProfileImage]);

  return (
    <>
      {children}

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-3 left-3 right-3 z-20 transition-all duration-700 ease-glass ${
          shown ? "translate-y-0 opacity-100 blur-0" : "translate-y-3 opacity-0 blur-[2px]"
        }`}
      >
        {/* Sits on a user-supplied photo, so it carries its own contrast rather
            than a glass tint — a translucent chip is unreadable over a bright
            image, exactly like the media controls. */}
        <span className="inline-flex max-w-full items-center gap-2 rounded-tile bg-[#0a0a0ce0] py-2 pl-2 pr-3.5 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.6)] ring-1 ring-white/15 backdrop-blur-md">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xs bg-acc text-[13px] leading-none">
            👋
          </span>
          <span className="truncate text-[0.8125rem] font-semibold tracking-tight text-white">
            Look who&apos;s curious — welcome
          </span>
        </span>
      </div>
    </>
  );
}
