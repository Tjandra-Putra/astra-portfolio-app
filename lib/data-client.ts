"use client";

/**
 * Client data layer: in-flight de-duplication + stale-while-revalidate cache.
 *
 * Two problems this solves in this app specifically:
 *
 *  1. Duplicate requests. `Projects` and `Experiences` both render on the
 *     profile page and both GET `/api/projects/:id`; `Collaborate`,
 *     `SocialCard` and the About page all GET `/api/profile/:id`. Without
 *     de-duplication that is four identical round-trips per page view.
 *
 *  2. Re-fetching on every navigation. Cached entries persist in
 *     sessionStorage, so moving between pages reads from memory.
 *
 * Freshness is not left to the TTL alone: `syncVersion` asks the server for a
 * cheap fingerprint of the profile's rows and drops the cached entries when it
 * changes, so an edit made in the dashboard shows up without a hard reload.
 */

type Entry = { at: number; data: unknown };

const mem = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

/**
 * Identity of the current viewer, folded into every cache key.
 *
 * `/api/profile/:id` and `/api/projects/:id` deliberately return the SIGNED-IN
 * viewer's own rows regardless of the id in the path, so a URL does not
 * identify a body. Without this, an entry written while signed in as one user
 * is later served to a signed-out visitor — or a different user — on the same
 * URL, because sessionStorage survives sign-in/sign-out within a tab.
 */
let viewer = "anon";

/** Call when auth state changes. Re-keys the cache and drops the old viewer's entries. */
export function setViewer(id: string | null | undefined) {
  const next = id || "anon";
  if (next === viewer) return;
  viewer = next;
  invalidate();
}

const keyFor = (url: string) => `${viewer}|${url}`;

/** Bumped on every invalidate so an in-flight response cannot write back stale data. */
let generation = 0;

const DEFAULT_TTL = 60_000;
const STORE_PREFIX = "astra:cache:";
const VERSION_KEY = "astra:version:";

function readStore(key: string): Entry | undefined {
  if (typeof sessionStorage === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(STORE_PREFIX + key);
    return raw ? (JSON.parse(raw) as Entry) : undefined;
  } catch {
    return undefined;
  }
}

function writeStore(key: string, entry: Entry) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(STORE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // Quota or private-mode failures are non-fatal; the memory cache still works.
  }
}

async function fetchJSON<T>(url: string, force = false): Promise<T> {
  // The API sends `private, max-age=30`, so without no-store a forced refetch
  // can be answered from the browser's own cache and never reach the server —
  // defeating the one path built specifically to defeat staleness.
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: force ? "no-store" : "default",
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as T;
}

/**
 * GET with caching. Returns cached data immediately when fresh; when stale it
 * returns the cached value and refreshes in the background.
 */
export async function getJSON<T>(url: string, opts: { ttl?: number; force?: boolean } = {}): Promise<T> {
  const ttl = opts.ttl ?? DEFAULT_TTL;
  const now = Date.now();

  const key = keyFor(url);

  if (!opts.force) {
    const hit = mem.get(key) ?? readStore(key);
    if (hit) {
      mem.set(key, hit);
      const age = now - hit.at;
      if (age < ttl) return hit.data as T;
      // Stale: serve it now, refresh behind the scenes.
      void revalidate<T>(url).catch(() => {});
      return hit.data as T;
    }
  }

  // Collapse concurrent callers onto one request.
  const existing = inflight.get(key);
  if (existing && !opts.force) return existing as Promise<T>;

  const issuedAt = generation;
  const p = fetchJSON<T>(url, opts.force)
    .then((data) => {
      // A response issued before an invalidate() must not repopulate the cache
      // — it would persist pre-write data past the very call meant to clear it.
      if (issuedAt === generation) {
        const entry = { at: Date.now(), data };
        mem.set(key, entry);
        writeStore(key, entry);
      }
      return data;
    })
    .finally(() => {
      if (inflight.get(key) === p) inflight.delete(key);
    });

  inflight.set(key, p);
  return p;
}

function revalidate<T>(url: string): Promise<T> {
  if (inflight.has(url)) return inflight.get(url) as Promise<T>;
  return getJSON<T>(url, { force: true });
}

/** Drop one URL, or every cached URL containing `match`. */
export function invalidate(match?: string) {
  generation++;
  if (!match) {
    mem.clear();
    inflight.clear();
    if (typeof sessionStorage !== "undefined") {
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith(STORE_PREFIX))
        .forEach((k) => sessionStorage.removeItem(k));
    }
    return;
  }
  Array.from(mem.keys())
    .filter((k) => k.includes(match))
    .forEach((k) => mem.delete(k));
  Array.from(inflight.keys())
    .filter((k) => k.includes(match))
    .forEach((k) => inflight.delete(k));
  if (typeof sessionStorage !== "undefined") {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(STORE_PREFIX) && k.includes(match))
      .forEach((k) => sessionStorage.removeItem(k));
  }
}

/**
 * Ask the server for the profile's data fingerprint and clear this profile's
 * cached entries if it moved. Cheap enough to call on every mount.
 */
export async function syncVersion(profileId: string): Promise<boolean> {
  if (!profileId) return false;
  try {
    const { version } = await fetchJSON<{ version: string }>(`/api/version/${profileId}`, true);
    const key = VERSION_KEY + profileId;
    const previous = typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;

    if (previous && previous !== version) {
      invalidate(profileId);
      // The directory list has no profile id in its URL, so a substring match
      // on profileId never reaches it.
      invalidate("/api/profile");
      if (typeof localStorage !== "undefined") localStorage.setItem(key, version);
      return true; // caller should refetch
    }
    if (!previous && typeof localStorage !== "undefined") localStorage.setItem(key, version);
    return false;
  } catch {
    return false; // never let a version check break a page
  }
}
