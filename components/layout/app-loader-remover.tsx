"use client";

import { useEffect } from "react";

export function AppLoaderRemover() {
  useEffect(() => {
    const loader = document.getElementById("app-loader");
    if (!loader) return;
    loader.style.transition = "opacity 0.5s ease";
    loader.style.opacity = "0";
    const t = setTimeout(() => loader.remove(), 500);
    return () => clearTimeout(t);
  }, []);
  return null;
}
