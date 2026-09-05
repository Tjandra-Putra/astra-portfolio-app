import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { revalidateEducation } from "@/lib/revalidate";

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

// add education
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
        endDate: endDate || null,
        description,
        visible,
        skills,
      },
    });

    revalidateEducation(newEducation.profileId);

    return NextResponse.json(newEducation);
  } catch (error) {
    console.error("[EDUCATIONS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// delete education by id for this user profile
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the existing education
    const existingEducation = await db.education.findFirst({
      where: {
        id: context.params.id,
        profileId: profile.id,
      },
    });

    if (!existingEducation) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Delete the education
    await db.education.delete({
      where: {
        id: context.params.id,
      },
    });

    // profileId comes from the row read before the delete.
    revalidateEducation(existingEducation.profileId);

    return new NextResponse("Deleted", { status: 204 });
  } catch (error) {
    console.error("[EDUCATIONS_DELETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
