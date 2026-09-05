import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { getProfileById, getProfileByUserId } from "@/lib/cache";
import { jsonCached } from "@/lib/http";

// The response depends on who is asking (a signed-in viewer gets their own
// profile), so this route must never be rendered at build time.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    // Auth stays in the handler. Nothing request-scoped may cross into a
    // cached reader, or one viewer's profile would be served to another.
    const user = await currentUser();

    let profile;

    if (user) {
      // If logged in, get their own profile
      try {
        // Two cached lookups rather than one uncached query: getProfileByUserId
        // resolves the id, then getProfileById returns the socialLinks-including
        // shape this response has always had (social-card.tsx reads it).
        const own = await getProfileByUserId(user.id);
        profile = own ? await getProfileById(own.id) : null;
      } catch (err) {
        console.error("[PROFILE_GET_ERROR:userId]", err);
        // You might want to still return the public profile fallback
      }
    }

    if (!profile) {
      // Fallback to public profile via ID
      try {
        profile = await getProfileById(context.params.id);
      } catch (err) {
        console.error("[PROFILE_GET_ERROR:public]", err);
      }
    }

    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    return jsonCached(profile, req);
  } catch (error) {
    console.error("[PROFILE_GET_ERROR:outer]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
