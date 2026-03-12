"use client";

import { useEffect } from "react";

export function AppLoaderRemover() {
  useEffect(() => {
    const loader = document.getElementById("app-loader");
    if (!loader) return;
    loader.style.transition = "opacity 0.5s ease";
    loader.style.opacity = "0";
    // Don't call loader.remove() — the element is in React's tree;
    // removing it directly from the DOM corrupts React's fiber state.
    // Hiding it via CSS is sufficient and safe.
    const t = setTimeout(() => {
      loader.style.visibility = "hidden";
      loader.style.pointerEvents = "none";
    }, 500);
    return () => clearTimeout(t);
  }, []);
  return null;
}
