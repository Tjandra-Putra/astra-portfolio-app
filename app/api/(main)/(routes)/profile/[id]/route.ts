import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";

import { db } from "@/lib/db";

// get user profile base on domain name
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    let profile;

    // this is for public unauthenticated profile
    profile = await db.profile.findFirst({
      where: {
        id: context.params.id,
      },
      include: {
        socialLinks: true,
      },
    });

    // this is for authenticated profile
    // if user is logged in, the user will see their own profile
    const user = await currentUser();
    if (user) {
      profile = await db.profile.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          socialLinks: true,
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
