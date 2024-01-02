import { v4 as uuid } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";

// get user profile base on domain name (profile id)
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  let projects;

  try {
    // this is for public unauthenticated profile
    projects = await db.project.findMany({
      where: { profileId: context.params.id },
      orderBy: { createdAt: "desc" },
    });

    // this is for authenticated profile
    // if user is logged in, the user will see their own profile
    const user = await currentUser();
    if (user) {
      const profile = await db.profile.findFirst({
        where: { userId: user.id },
      });

      projects = await db.project.findMany({
        where: { profileId: profile?.id },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
