import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { revalidateProfile } from "@/lib/revalidate";

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

    /**
     * Reconcile social links: update, create AND delete.
     *
     * This previously only updated rows whose id already existed, so the
     * editor's "Add link" silently saved nothing and "Remove" left the link
     * live on the public page — the UI promised two actions the API could not
     * perform.
     */
    const submitted: any[] = Array.isArray(updatedProfileData.socialMedia) ? updatedProfileData.socialMedia : [];
    const keptIds = new Set(submitted.map((s) => s?.id).filter(Boolean));

    await Promise.all([
      // Rows the user removed from the form.
      ...existingSocialLinks
        .filter((link) => !keptIds.has(link.id))
        .map((link) => db.userSocialLink.delete({ where: { id: link.id } })),

      ...submitted.map((socialMedia: any) => {
        const { iconName, iconType } = splitPlatform(socialMedia?.platform || "");
        // A row with no url and no platform is an untouched blank — skip it
        // rather than persisting an empty link.
        if (!socialMedia?.url && !iconName) return null;

        const existing = socialMedia?.id
          ? existingSocialLinks.find((link) => link.id === socialMedia.id)
          : undefined;

        if (existing) {
          return db.userSocialLink.update({
            where: { id: existing.id },
            data: { url: socialMedia.url, iconName, iconType },
          });
        }

        return db.userSocialLink.create({
          data: { profileId: profile.id, url: socialMedia.url ?? "", iconName: iconName ?? "", iconType: iconType ?? "" },
        });
      }),
    ].filter(Boolean) as Promise<unknown>[]);

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

    // Covers both writes above: the social links are read back through the
    // profile reader, which hangs off the same profile-scoped tags.
    revalidateProfile(updatedProfile.id);

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("[PROFILE_PUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

function splitPlatform(platform: string) {
  const [iconName = "", iconType = ""] = (platform || "").split(",").map((part) => part.trim());
  return { iconName, iconType };
}
