import { currentProfile } from "@/lib/current-profile";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Get all profiles
export async function GET(req: NextRequest) {
  try {
    const profiles = await db.profile.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("[PROFILE_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
