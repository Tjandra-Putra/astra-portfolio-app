"use client";

import { ReactElement, useRef, useEffect } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import { useTheme } from "next-themes";

interface ProfileToastProps {
  profile: { imageUrl?: string; name?: string };
  defaultProfileImage: string;
  children: ReactElement;
}

export default function ProfileToast({ profile, defaultProfileImage, children }: ProfileToastProps) {
  const tippyInstance = useRef<any>(null);
  const { resolvedTheme } = useTheme();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  useEffect(() => {
    const img = new Image();
    img.src = profile?.imageUrl || defaultProfileImage;

    img.onload = () => {
      if (!tippyInstance.current) return;

      // Show after 0.5s
      setTimeout(() => {
        tippyInstance.current.show();
      }, 1000);

      // Hide after 5s
      setTimeout(() => {
        tippyInstance.current.hide();
      }, 5000);
    };
  }, [profile, defaultProfileImage]);

  return (
    <Tippy
      content={<span className="block  sm:max-w-[250px] text-center leading-snug">👋 Hey there, thank you for visiting my page!</span>}
      placement={isMobile ? "bottom" : "bottom"}
      trigger="manual"
      arrow={true}
      theme={resolvedTheme === "dark" ? "light" : "dark"}
      onCreate={(instance) => {
        tippyInstance.current = instance;
      }}
      popperOptions={{
        modifiers: [
          {
            name: "offset",
            options: {
              offset: isMobile ? [0, -25] : [0, 0], // 👈 move up 10px on mobile
            },
          },
        ],
      }}
    >
      {children}
    </Tippy>
  );
}
