import { v4 as uuid } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCookie } from "@/lib/get-cookie";

import { db } from "@/lib/db";

// get user profile base on domain name (profile id)
export async function GET(req: NextRequest) {
  try {
    const domain = getCookie("domain");

    if (!domain) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projects = await db.project.findMany({
      where: { profileId: domain },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
