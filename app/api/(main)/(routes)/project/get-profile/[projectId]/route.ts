import { NextRequest, NextResponse } from "next/server";
import { getProfiles, getProjectById } from "@/lib/cache";
import { jsonCached } from "@/lib/http";

// get user profile base on project id
export async function GET(req: NextRequest, context: { params: { projectId: string } }) {
  try {
    // There is no cached reader for "profile by project id", so this composes
    // two that already exist: the project carries its profileId, and the
    // directory list (cached, and already warm from the landing page) carries
    // the profile row. Deliberately NOT getProfileById — that one includes
    // `socialLinks`, which this response has never contained.
    const project = await getProjectById(context.params.projectId);
    const profile = project ? (await getProfiles()).find((p) => p.id === project.profileId) ?? null : null;

    if (!profile) {
      return NextResponse.json({ error: "No profile found for the provided project ID." }, { status: 404 });
    }

    return jsonCached(profile, req);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
