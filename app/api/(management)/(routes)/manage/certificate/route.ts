import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// get certificates by profile
export async function GET() {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const certificates = await db.certificate.findMany({
      where: {
        profileId: profile.id,
      },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("[CERTIFICATES_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// add certificate
export async function POST(req: NextRequest) {
  try {
    const { title, certificateId, certificateImageUrl, certificateUrl, issueingOrganisation, issuedDate } =
      await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log(issuedDate);
    // create a new certificate
    const newCertificate = await db.certificate.create({
      data: {
        profileId: profile.id,
        title,
        certificateId,
        certificateImageUrl,
        certificateUrl,
        issueingOrganisation,
        issuedDate,
      },
    });

    return NextResponse.json(newCertificate);
  } catch (error) {
    console.error("[PROJECTS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
