import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// get profile by user id
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// edit profile by user id
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedProfileData = await req.json();

    const updatedProfile = await db.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        // name: profile?.name,
        // workEmail: profile?.workEmail,
        // bio: profile?.bio,
        // about: profile?.about,
        // imageUrl: profile?.imageUrl,
        // resumeUrl: profile?.resumeUrl,
        // jobTitle: profile?.jobTitle,
        // socialMedia: profile?.socialMedia,

        name: updatedProfileData.name,
        workEmail: updatedProfileData.workEmail,
        bio: updatedProfileData.bio,
        about: updatedProfileData.about,
        imageUrl: updatedProfileData.imageUrl,
        resumeUrl: updatedProfileData.resumeUrl,
        jobTitle: updatedProfileData.jobTitle,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("[PROFILE_PUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
