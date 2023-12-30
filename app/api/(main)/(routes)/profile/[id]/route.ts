import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

// get user profile base on domain name
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const profile = await db.profile.findFirst({
      where: {
        domain: context.params.id,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
