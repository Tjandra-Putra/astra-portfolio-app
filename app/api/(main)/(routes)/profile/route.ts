import { NextRequest, NextResponse } from "next/server";
import { getProfiles } from "@/lib/cache";
import { jsonCached } from "@/lib/http";

// Get all profiles
export async function GET(req: NextRequest) {
  try {
    // Same query as before (orderBy createdAt asc), now tagged `profiles`.
    const profiles = await getProfiles();

    return jsonCached(profiles, req);
  } catch (error) {
    console.error("[PROFILE_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
