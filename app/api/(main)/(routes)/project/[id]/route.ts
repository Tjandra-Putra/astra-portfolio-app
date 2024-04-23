import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// get single project base on project id and user id
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  let project;

  try {
    // this is for public unauthenticated profile
    project = await db.project.findFirst({
      where: { id: context.params.id },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECT_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
