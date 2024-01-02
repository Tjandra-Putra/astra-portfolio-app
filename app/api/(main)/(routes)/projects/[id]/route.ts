import { v4 as uuid } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// get user profile base on domain name (profile id)
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const projects = await db.project.findMany({
      where: { profileId: context.params.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
