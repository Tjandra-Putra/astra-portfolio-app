import { NextResponse } from "next/server";

/**
 * JSON response with validator caching.
 *
 * Emits a weak ETag over the payload and answers `If-None-Match` with a bodiless
 * 304. Combined with the tagged server cache this means a warm repeat request
 * costs no database query and no response body.
 *
 * `private` because a profile response can differ per viewer (the projects
 * route returns the signed-in user's own rows) — a shared/CDN cache must not
 * reuse one viewer's body for another.
 */
export function jsonCached(data: unknown, req: Request, maxAge = 30, swr = 300) {
  const body = JSON.stringify(data);
  const etag = `W/"${fnv1a(body)}"`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ETag: etag,
    "Cache-Control": `private, max-age=${maxAge}, stale-while-revalidate=${swr}`,
  };

  if (req.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304, headers });
  }
  return new NextResponse(body, { status: 200, headers });
}

/** FNV-1a — small, dependency-free, and plenty for cache validation. */
function fnv1a(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36) + str.length.toString(36);
}
