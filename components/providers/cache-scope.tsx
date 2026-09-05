"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { setViewer } from "@/lib/data-client";

/**
 * Keeps the client data cache scoped to the signed-in viewer.
 *
 * Two of the public API routes return the signed-in user's own rows regardless
 * of the id in the path, so cached bodies are viewer-dependent. sessionStorage
 * outlives a sign-in/sign-out within the same tab, so without re-keying on
 * auth change one account's data can be handed to the next.
 */
export function CacheScope() {
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    setViewer(userId);
  }, [userId, isLoaded]);

  return null;
}
