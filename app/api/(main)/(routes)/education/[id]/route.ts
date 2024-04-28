import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

// get education by profile
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const educations = await db.education.findMany({
      where: {
        profileId: context.params.id,
      },
    });

    return NextResponse.json(educations);
  } catch (error) {
    console.error("[EDUCATIONS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
