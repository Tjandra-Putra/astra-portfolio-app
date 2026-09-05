"use client";

/**
 * The id of the profile currently being viewed.
 *
 * `userInfo` in redux does double duty — it holds both "the signed-in user"
 * and "the profile being viewed" — so anything that clears it on sign-out also
 * destroys public browsing context. This keeps the viewed-profile id in its
 * own durable slot, independent of auth, so /about, /education and
 * /certificate survive a refresh (and a sign-out) instead of rendering blank.
 */
const KEY = "astra:viewed-profile";

export function rememberProfileId(id?: string | null) {
  if (!id || typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* private mode / quota — non-fatal */
  }
}

export function recallProfileId(): string {
  if (typeof localStorage === "undefined") return "";
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

/** redux value first, durable fallback second. */
export function resolveProfileId(fromRedux?: string | null): string {
  return fromRedux || recallProfileId();
}
