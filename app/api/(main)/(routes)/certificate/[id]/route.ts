import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// get certificates by profile
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const certificates = await db.certificate.findMany({
      where: {
        profileId: context.params.id,
      },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("[CERTIFICATES_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
