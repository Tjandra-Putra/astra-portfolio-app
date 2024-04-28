import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// get education by profile
export async function GET() {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const educations = await db.education.findMany({
      where: {
        profileId: profile.id,
      },
    });

    return NextResponse.json(educations);
  } catch (error) {
    console.error("[EDUCATIONS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// add certificate
export async function POST(req: NextRequest) {
  try {
    const { schoolName, degree, fieldOfStudy, grade, startDate, endDate, description, visible, skills } =
      await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // create a new education
    const newEducation = await db.education.create({
      data: {
        profileId: profile.id,
        schoolName,
        degree,
        fieldOfStudy,
        grade,
        startDate,
        endDate,
        description,
        visible,
        skills,
      },
    });

    return NextResponse.json(newEducation);
  } catch (error) {
    console.error("[EDUCATIONS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
