import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// get user profile base on project id
export async function GET(req: NextRequest, context: { params: { projectId: string } }) {
  try {
    const profile = await db.profile.findFirst({
      where: {
        projects: { some: { id: context.params.projectId } },
      },
    });

    return NextResponse.json(profile || { error: "No profile found for the provided project ID." }, {
      status: profile ? 200 : 404,
    });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
