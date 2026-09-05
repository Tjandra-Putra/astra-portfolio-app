import { NextRequest, NextResponse } from "next/server";
import { getProjectsByProfileId } from "@/lib/cache";
import { jsonCached } from "@/lib/http";

/**
 * All projects belonging to one profile. The id in the URL IS the request.
 *
 * Two bugs previously lived here:
 *  1. A signed-in viewer's own profile id replaced the path id, so viewing
 *     another person's portfolio listed YOUR projects under THEIR name.
 *  2. A signed-in user with no profile row produced `profileId: undefined`,
 *     which made Prisma drop the WHERE clause entirely and return every
 *     project in the database to that viewer.
 *
 * Honouring the path id fixes both, and makes the response viewer-independent
 * and therefore properly cacheable.
 */
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const profileId = context.params.id;

    if (!profileId) {
      return jsonCached([], req);
    }

    const projects = await getProjectsByProfileId(profileId);
    return jsonCached(projects, req);
  } catch (error) {
    console.error("[PROJECTS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
