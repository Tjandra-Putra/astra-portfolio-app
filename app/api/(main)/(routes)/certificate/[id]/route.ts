import { NextRequest, NextResponse } from "next/server";

import { getCertificatesByProfileId } from "@/lib/cache";
import { jsonCached } from "@/lib/http";

// get certificates by profile
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    // Every row is returned with `visible` intact. The `visible` filter lives in
    // app/(main)/(routes)/certificate/page.tsx and stays there — filtering here
    // would change the payload.
    const certificates = await getCertificatesByProfileId(context.params.id);

    return jsonCached(certificates, req);
  } catch (error) {
    console.error("[CERTIFICATES_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
