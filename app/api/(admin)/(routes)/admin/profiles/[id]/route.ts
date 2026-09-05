import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { revalidateProfile } from "@/lib/revalidate";

// edit profile role by user id
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedProfileData = await req.json();

    const updatedProfile = await db.profile.update({
      where: {
        id: context.params.id,
      },
      data: {
        role: updatedProfileData.role,
      },
    });

    revalidateProfile(updatedProfile.id);

    return new NextResponse(JSON.stringify(updatedProfile), { status: 200 });
  } catch (error) {
    console.error("[PROFILE_PUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// delete profile by user id
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.profile.delete({
      where: {
        id: context.params.id,
      },
    });

    // The deleted profile's own id, so every tag scoped to it is dropped along
    // with the directory listing.
    revalidateProfile(context.params.id);

    return new NextResponse(context.params.id, { status: 200 });
  } catch (error) {
    console.error("[PROFILE_DELETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
