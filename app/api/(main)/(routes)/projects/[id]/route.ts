import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { getProfileByUserId, getProjectsByProfileId } from "@/lib/cache";
import { jsonCached } from "@/lib/http";

// A signed-in viewer gets their own projects, so the response is per-viewer and
// must never be rendered at build time.
export const dynamic = "force-dynamic";

// retrieve all projects for a profile base on profile id
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    // Decide WHOSE projects to return before reading any, instead of querying
    // the URL param's projects and then throwing that result away.
    // currentUser() stays here in the handler: request-scoped data must not
    // enter a cached reader, or the cache key would ignore the viewer.
    const user = await currentUser();

    // this is for public unauthenticated profile
    let profileId: string | undefined = context.params.id;

    // this is for authenticated profile
    // if user is logged in, the user will see their own profile
    if (user) {
      const profile = await getProfileByUserId(user.id);
      profileId = profile?.id;
    }

    const projects = profileId
      ? await getProjectsByProfileId(profileId)
      : // Signed in but with no profile row. `where: { profileId: undefined }`
        // made Prisma drop the filter and return every project, so that is what
        // this branch still does. Left uncached deliberately — there is no
        // profile to tag it against, and it is a degenerate case.
        await db.project.findMany({ orderBy: { startDate: "desc" } });

    return jsonCached(projects, req);
  } catch (error) {
    console.error("[PROJECTS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
