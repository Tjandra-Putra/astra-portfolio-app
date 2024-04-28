import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// get education by id for this user profile
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const education = await db.education.findFirst({
      where: {
        id: context.params.id,
        profileId: profile.id,
      },
    });

    if (!education) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(education);
  } catch (error) {
    console.error("[PROJECTS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// update education by id for this user profile
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  console.log("======================= PUT ====================", context.params.id);

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

    // Extract the updated education data from the request body
    const updatedEducationData = await req.json();

    // Update the education with the new data
    const updatedEducation = await db.education.update({
      where: {
        id: context.params.id,
      },
      data: updatedEducationData,
    });

    return NextResponse.json(updatedEducation);
  } catch (error) {
    console.error("[PROJECTS_PUT_ERROR]", error);
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

    return new NextResponse(context.params.id, { status: 200 });
  } catch (error) {
    console.error("[PROJECTS_DELETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
