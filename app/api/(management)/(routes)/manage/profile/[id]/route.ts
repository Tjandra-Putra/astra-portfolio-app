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

    // Batch update existing social media links
    if (existingSocialLinks.length > 0) {
      const updateSocialMediaPromises = updatedProfileData.socialMedia.map(async (socialMedia: any) => {
        const existingSocialLink = existingSocialLinks.find((link) => link.id === socialMedia.id);

        if (existingSocialLink) {
          const { iconName, iconType } = splitPlatform(socialMedia.platform);

          return db.userSocialLink.update({
            where: {
              id: existingSocialLink.id,
            },
            data: {
              url: socialMedia.url,
              iconName,
              iconType,
            },
          });
        }

        return null;
      });

      await Promise.all(updateSocialMediaPromises);
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

function splitPlatform(platform: string) {
  const [iconName, iconType] = platform.split(",").map((part) => part.trim());
  return { iconName, iconType };
}
