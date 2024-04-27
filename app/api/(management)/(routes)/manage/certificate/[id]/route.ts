import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// get certificate by id for this user profile
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const certificate = await db.certificate.findFirst({
      where: {
        id: context.params.id,
        profileId: profile.id,
      },
    });

    if (!certificate) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(certificate);
  } catch (error) {
    console.error("[PROJECTS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// update certificate by id for this user profile
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  console.log("======================= PUT ====================", context.params.id);

  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the existing certificate
    const existingCertificate = await db.certificate.findFirst({
      where: {
        id: context.params.id,
        profileId: profile.id,
      },
    });

    if (!existingCertificate) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Extract the updated certificate data from the request body
    const updatedCertificateData = await req.json();

    // Update the certificate with the new data
    const updatedCertificate = await db.certificate.update({
      where: {
        id: context.params.id,
      },
      data: updatedCertificateData,
    });

    return NextResponse.json(updatedCertificate);
  } catch (error) {
    console.error("[PROJECTS_PUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
