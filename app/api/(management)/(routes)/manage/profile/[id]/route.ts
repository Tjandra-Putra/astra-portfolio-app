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

    // Check if the profile has existing social media links
    const existingSocialLinks = await db.userSocialLink.findMany({
      where: {
        profileId: profile.id,
      },
    });

    // update existing social media links
    if (existingSocialLinks.length > 0) {
      // loop through social media links
      for (const socialMedia of updatedProfileData.socialMedia) {
        // check if social media link exists
        const existingSocialLink = existingSocialLinks.find((link) => link.id === socialMedia.id);

        // if social media link exists, update it
        if (existingSocialLink) {
          await db.userSocialLink.update({
            where: {
              id: existingSocialLink.id,
            },
            data: {
              url: socialMedia.url,
              iconName: socialMedia.platform.split(",")[0].trim(),
              iconType: socialMedia.platform.split(",")[1].trim(),
            },
          });
        }
      }
    }

    const updatedProfile = await db.profile.update({
      where: {
        id: profile.id,
      },
      data: {
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
