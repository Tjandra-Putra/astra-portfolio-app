import { NextRequest, NextResponse } from "next/server";

import { getEducationByProfileId } from "@/lib/cache";
import { jsonCached } from "@/lib/http";

// get education by profile
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    // Every row is returned with `visible` intact. The `visible` filter lives in
    // app/(main)/(routes)/education/page.tsx and stays there — filtering here
    // would change the payload.
    const educations = await getEducationByProfileId(context.params.id);

    return jsonCached(educations, req);
  } catch (error) {
    console.error("[EDUCATIONS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
