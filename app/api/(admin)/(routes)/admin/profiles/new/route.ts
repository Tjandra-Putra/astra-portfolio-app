import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const randomUserId = `login_pending_user@${Math.random().toString(36).substring(7)}`;
    const name = email.split("@")[0];
    const domain = randomUserId;

    // check if email is already in use
    const existingProfile = await db.profile.findFirst({
      where: {
        email: email,
      },
    });

    if (existingProfile) {
      return new NextResponse("Email already in use", { status: 400 });
    }

    const newProfile = await db.profile.create({
      data: {
        userId: randomUserId,
        name: name,
        email: email,
        domain: domain,
        role: "MEMBER",
      },
    });

    // Check if the profile has existing social media links
    const existingSocialLinks = await db.userSocialLink.findMany({
      where: {
        profileId: newProfile.id,
      },
    });

    if (existingSocialLinks.length === 0) {
      //  create 4 social links
      const newSocialLinks = [
        {
          iconName: "",
          iconType: "",
          url: "",
        },
        {
          iconName: "",
          iconType: "",
          url: "",
        },
        {
          iconName: "",
          iconType: "",
          url: "",
        },
        {
          iconName: "",
          iconType: "",
          url: "",
        },
      ];

      await Promise.all(
        newSocialLinks.map(async (socialLink) => {
          await db.userSocialLink.create({
            data: {
              profileId: newProfile.id,
              iconName: socialLink.iconName,
              iconType: socialLink.iconType,
              url: socialLink.url,
            },
          });
        })
      );
    }

    return new NextResponse(JSON.stringify(newProfile), { status: 200 });
  } catch (error) {
    console.error("[PROJECTS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
