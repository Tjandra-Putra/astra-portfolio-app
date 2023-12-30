import { v4 as uuid } from "uuid";
import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// get project by id for this user profile
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const project = await db.project.findFirst({
      where: {
        id: context.params.id,
        profileId: profile.id,
      },
    });

    if (!project) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECTS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
