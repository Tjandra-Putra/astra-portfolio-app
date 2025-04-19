import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const user = await currentUser();

    let profile;

    if (user) {
      // If logged in, get their own profile
      try {
        profile = await db.profile.findFirst({
          where: { userId: user.id },
          include: { socialLinks: true },
        });
      } catch (err) {
        console.error("[PROFILE_GET_ERROR:userId]", err);
        // You might want to still return the public profile fallback
      }
    }

    if (!profile) {
      // Fallback to public profile via ID
      try {
        profile = await db.profile.findFirst({
          where: { id: context.params.id },
          include: { socialLinks: true },
        });
      } catch (err) {
        console.error("[PROFILE_GET_ERROR:public]", err);
      }
    }

    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE_GET_ERROR:outer]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
