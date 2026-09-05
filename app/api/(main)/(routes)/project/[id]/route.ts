import { NextRequest, NextResponse } from "next/server";
import { getProjectById } from "@/lib/cache";
import { jsonCached } from "@/lib/http";

// get single project base on project id and user id
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    // this is for public unauthenticated profile
    // A missing project keeps answering 200 with a `null` body, as before —
    // this route has never returned 404.
    const project = await getProjectById(context.params.id);

    return jsonCached(project, req);
  } catch (error) {
    console.error("[PROJECT_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
