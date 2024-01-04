import { currentProfile } from "@/lib/current-profile";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE_WITH_CLERK_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
