import { NextRequest, NextResponse } from "next/server";
import { getProfileById } from "@/lib/cache";
import { jsonCached } from "@/lib/http";

/**
 * Public profile by id. The id in the URL IS the request.
 *
 * This previously overrode the path id with the signed-in viewer's own profile
 * whenever anyone was authenticated, so browsing someone else's portfolio
 * silently returned your own — the URL said one person, the page showed
 * another. "My own profile" already has its own endpoint (/api/profile/current,
 * used by the dashboard), so the override was redundant as well as wrong.
 *
 * With no request-scoped data left, the response is identical for every viewer,
 * so it is fully cacheable and no longer needs force-dynamic.
 */
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const profile = await getProfileById(context.params.id);

    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    return jsonCached(profile, req);
  } catch (error) {
    console.error("[PROFILE_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
